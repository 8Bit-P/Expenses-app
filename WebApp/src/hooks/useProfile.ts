import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Profile } from "../types/profile";
import { toast } from "sonner";

export function useProfile() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data as Profile;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!userId) throw new Error("User not authenticated");

      const email = session?.user?.email;
      if (!email) throw new Error("User email not found");

      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: userId, email, ...updates })
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
    onError: (error: any) => {
      toast.error("Profile error", {
        description: error.message || "Failed to synchronize profile data.",
      });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile,
  };
}
