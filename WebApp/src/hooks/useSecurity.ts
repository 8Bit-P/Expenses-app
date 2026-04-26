import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export function useSecurity() {
  const changePassword = useMutation({
    mutationFn: async ({ newPassword, currentPassword }: { newPassword: string; currentPassword: string }) => {
      // Get the current user's email
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        throw new Error("Could not verify active user session.");
      }

      // Verify the 'currentPassword' is actually correct
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      // If this throws an error, they typed the wrong current password!
      if (verifyError) {
        throw new Error("Incorrect current password.");
      }

      // Now that we proved they know the old password, update it
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      return true;
    },
    onSuccess: () => {
      toast.success("Security Updated", {
        description: "Your vault access credentials have been successfully modified.",
      });
    },
    onError: (err: any) => {
      toast.error("Update Failed", {
        description: err.message || "Could not update password. Please check your current password.",
      });
    },
  });

  return {
    changePassword,
  };
}
