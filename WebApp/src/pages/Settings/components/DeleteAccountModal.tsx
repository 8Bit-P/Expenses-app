import { useTranslation } from "react-i18next";
import { useDeleteAccount } from "../../../hooks/useDeleteAccount";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleDelete = () => {
    deleteAccount();
  };

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
            className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-outline-variant">
              <h3 className="text-[15px] font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-error">warning</span>
                {t("settings.danger.modal.title")}
              </h3>
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                aria-label={t("common.cancel")}
                className="w-8 h-8 -mr-1.5 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-sm text-on-surface-variant leading-relaxed">{t("settings.danger.modal.desc")}</p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-outline-variant">
              <button
                onClick={onClose}
                disabled={isPending}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="h-9 px-4 rounded-lg bg-error text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("settings.danger.modal.deleting")}
                  </>
                ) : (
                  t("settings.danger.modal.confirm")
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
