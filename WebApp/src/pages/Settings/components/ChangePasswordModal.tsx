import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSecurity } from "../../../hooks/useSecurity";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils/cn";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { changePassword } = useSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error(t("settings.passwordModal.errors.tooShort"), {
        description: t("settings.passwordModal.errors.tooShortDesc"),
      });
      return;
    }

    if (newPassword === currentPassword) {
      toast.error(t("settings.passwordModal.errors.noChange"), {
        description: t("settings.passwordModal.errors.noChangeDesc"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("settings.passwordModal.errors.mismatch"), {
        description: t("settings.passwordModal.errors.mismatchDesc"),
      });
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });
      onClose();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Error handled by hook toasts
    }
  };

  const labelClass = "block text-xs font-medium text-on-surface-variant mb-1.5";
  const inputClass =
    "w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl border border-outline-variant relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-outline-variant">
              <h2 className="text-[15px] font-semibold text-on-surface">{t("settings.passwordModal.title")}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.cancel")}
                className="w-8 h-8 -mr-1.5 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-5 py-5 space-y-4">
                <div>
                  <label className={labelClass}>{t("settings.passwordModal.currentLabel")}</label>
                  <div className="relative">
                    <input
                      autoFocus
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={cn(inputClass, "pr-10")}
                      placeholder={t("settings.passwordModal.currentPlaceholder")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="h-px bg-outline-variant" />

                <div>
                  <label className={labelClass}>{t("settings.passwordModal.newLabel")}</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    placeholder={t("settings.passwordModal.newPlaceholder")}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>{t("settings.passwordModal.confirmLabel")}</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    placeholder={t("settings.passwordModal.confirmPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={changePassword.isPending}
                  className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={changePassword.isPending || !newPassword || !confirmPassword}
                  className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {changePassword.isPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      {t("settings.passwordModal.updating")}
                    </>
                  ) : (
                    t("settings.passwordModal.button")
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
