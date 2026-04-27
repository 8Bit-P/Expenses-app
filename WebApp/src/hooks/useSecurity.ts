import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import i18n from "../i18n/config";

export function useSecurity() {
  const changePassword = useMutation({
    mutationFn: async ({ newPassword, currentPassword }: { newPassword: string; currentPassword: string }) => {
      // Get the current user's email
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        throw new Error(i18n.t("settings.passwordModal.errors.verifySession"));
      }

      // Verify the 'currentPassword' is actually correct
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      // If this throws an error, they typed the wrong current password!
      if (verifyError) {
        throw new Error(i18n.t("settings.passwordModal.errors.incorrectCurrent"));
      }

      // Now that we proved they know the old password, update it
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      return true;
    },
    onSuccess: () => {
      toast.success(i18n.t("settings.passwordModal.success.title"), {
        description: i18n.t("settings.passwordModal.success.desc"),
      });
    },
    onError: (err: any) => {
      toast.error(i18n.t("settings.passwordModal.errors.updateFailed"), {
        description: err.message || i18n.t("settings.passwordModal.errors.updateError"),
      });
    },
  });

  return {
    changePassword,
  };
}
