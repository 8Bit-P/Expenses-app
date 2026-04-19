import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { signOut } = useAuth(); // Assuming your auth context exposes signOut

  return useMutation({
    mutationFn: async () => {
      // 1. Call the secure Postgres function we just created
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw new Error(error.message);

      return true;
    },
    onSuccess: async () => {
      // 2. Clear all TanStack Query cache so no ghost data remains
      queryClient.clear();

      // 3. Sign the user out locally to clear their session tokens
      await signOut();

      // 4. Force a hard reload to clear any remaining React state
      // and kick them back to the login screen
      window.location.replace("/auth");
    },
  });
}
