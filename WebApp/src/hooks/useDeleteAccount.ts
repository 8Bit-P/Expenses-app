import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { signOut } = useAuth(); // Assuming your auth context exposes signOut

  return useMutation({
    mutationFn: async () => {
      // secure Postgres function we just created
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw new Error(error.message);

      return true;
    },
    onSuccess: async () => {
      // Clear all TanStack Query cache so no ghost data remains
      queryClient.clear();

      // Sign the user out locally to clear their session tokens
      await signOut();

      // Force a hard reload to clear any remaining React state and kick them back to the login screen
      window.location.replace("/auth");
    },
  });
}
