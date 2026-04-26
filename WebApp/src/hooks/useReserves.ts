import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export interface Reserve {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  icon: string | null;
  current_amount: number;
  target_amount: number;
  status: "active" | "completed" | "archived";
  created_at: string;
}

export function useReserves() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const {
    data: reserves = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reserves", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reserves")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active") // Only fetch active reserves for the main dashboard
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Reserve[];
    },
    enabled: !!userId,
  });

  const fundReserve = useMutation({
    mutationFn: async ({
      reserveId,
      reserveName,
      amount,
      categoryId,
    }: {
      reserveId: string;
      reserveName: string;
      amount: number;
      categoryId: string;
    }) => {
      if (!userId) throw new Error("Authentication required");

      // STEP 1: Update Reserve Goal
      // We fetch current amount first to ensure we don't overwrite other updates (simulating the pseudo-SQL increment)
      const { data: currentReserve } = await supabase
        .from("reserves")
        .select("current_amount")
        .eq("id", reserveId)
        .single();

      const { error: updateError } = await supabase
        .from("reserves")
        .update({ current_amount: (currentReserve?.current_amount || 0) + amount })
        .eq("id", reserveId);

      if (updateError) throw updateError;

      // STEP 2: Insert Dummy Transaction
      const { error: txError } = await supabase.from("transactions").insert([
        {
          user_id: userId,
          amount: Math.abs(amount), // Saving as positive as per app convention
          type: "transfer", // Using 'transfer' to prevent goal funding from ruining expense charts
          category_id: categoryId,
          reserve_id: reserveId, // Link directly to the reserve
          description: `Funded Reserve: ${reserveName}`,
          date: new Date().toISOString().split("T")[0],
          needs_review: false,
        },
      ]);

      if (txError) throw txError;

      return { reserveId, amount };
    },
    onMutate: async ({ reserveId, amount }) => {
      // Optimistic UI Update
      await queryClient.cancelQueries({ queryKey: ["reserves", userId] });
      const previousReserves = queryClient.getQueryData<Reserve[]>(["reserves", userId]);

      if (previousReserves) {
        queryClient.setQueryData<Reserve[]>(
          ["reserves", userId],
          previousReserves.map((r) =>
            r.id === reserveId ? { ...r, current_amount: r.current_amount + amount } : r
          )
        );
      }

      return { previousReserves };
    },
    onError: (err, __, context) => {
      if (context?.previousReserves) {
        queryClient.setQueryData(["reserves", userId], context.previousReserves);
      }
      toast.error("Funding failed", { description: err.message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reserves", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      toast.success("Reserve funded!", {
        description: "The amount has been moved to your secure reserve.",
      });
    },
  });

  const createReserve = useMutation({
    mutationFn: async (newReserve: {
      name: string;
      target_amount: number;
      category_id: string;
      icon?: string;
    }) => {
      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("reserves")
        .insert([{ ...newReserve, user_id: userId, current_amount: 0, status: "active" }])
        .select()
        .single();

      if (error) throw error;
      return data as Reserve;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reserves", userId] });
      toast.success("Reserve created", {
        description: "Your new saving goal is ready to be funded.",
      });
    },
    onError: (err) => {
      toast.error("Failed to create reserve", { description: err.message });
    },
  });

  const deleteReserve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reserves").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reserves", userId] });
      toast.success("Reserve deleted");
    },
    onError: (err) => {
      toast.error("Delete failed", { description: err.message });
    },
  });

  const completeReserve = useMutation({
    mutationFn: async (reserve: Reserve) => {
      const { error } = await supabase
        .from("reserves")
        .update({ status: "completed" })
        .eq("id", reserve.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reserves", userId] });
      toast.success("Goal completed!", {
        description: "The reserve has been marked as completed.",
      });
    },
    onError: (err) => {
      toast.error("Update failed", { description: err.message });
    },
  });

  const releaseFunds = useMutation({
    mutationFn: async (reserve: Reserve) => {
      if (!userId) throw new Error("Authentication required");

      // 1. Fetch current amount
      const { data: currentReserve } = await supabase
        .from("reserves")
        .select("current_amount, name, category_id")
        .eq("id", reserve.id)
        .single();

      const amount = currentReserve?.current_amount || 0;

      if (amount <= 0) throw new Error("No funds to release");

      // 2. Insert POSITIVE transfer transaction
      const { error: txError } = await supabase.from("transactions").insert([
        {
          user_id: userId,
          amount: amount, // Positive for release
          type: "transfer",
          category_id: currentReserve?.category_id,
          reserve_id: reserve.id,
          description: `Released Funds: ${currentReserve?.name}`,
          date: new Date().toISOString().split("T")[0],
          needs_review: false,
        },
      ]);

      if (txError) throw txError;

      // 3. Update reserve status and reset amount
      const { error: updateError } = await supabase
        .from("reserves")
        .update({ current_amount: 0, status: "archived" })
        .eq("id", reserve.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reserves", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      toast.success("Funds released!", {
        description: "The amount has been returned to your main pool.",
      });
    },
    onError: (err) => {
      toast.error("Release failed", { description: err.message });
    },
  });

  return {
    reserves,
    isLoading,
    error,
    fundReserve,
    createReserve,
    deleteReserve,
    completeReserve,
    releaseFunds,
  };
}
