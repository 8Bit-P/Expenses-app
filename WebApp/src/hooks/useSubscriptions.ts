import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Subscription } from "../types/expenses";

export function useSubscriptions() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  // 1. Fetch all subscriptions for the user
  const {
    data: subscriptions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("next_billing_date", { ascending: true });

      if (error) throw new Error(error.message);
      return data as Subscription[];
    },
    enabled: !!userId,
  });

  // 2. Mutation for adding a new subscription
  const addSubscription = useMutation({
    mutationFn: async (newSubscription: Partial<Subscription>) => {
      if (!userId) throw new Error("User must be logged in to add a subscription");
      
      const { data, error } = await supabase
        .from("subscriptions")
        .insert([{ ...newSubscription, user_id: userId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", userId] });
    },
  });

  // 3. Mutation for updating a subscription (e.g., mark as paid, change amount)
  const updateSubscription = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Subscription> }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", userId] });
    },
  });

  const deleteSubscription = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subscriptions").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", userId] });
    },
  });

  return {
    subscriptions,
    loading: isLoading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
