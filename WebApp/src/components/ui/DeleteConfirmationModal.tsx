import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const { t } = useTranslation();

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
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pl-5 pr-3 h-14 border-b border-outline-variant">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] text-error shrink-0">warning</span>
                <h2 className="text-[15px] font-semibold text-on-surface truncate">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                aria-label={t("common.cancel")}
                className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-4">
              <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>

              <div className="px-3.5 py-3 bg-surface-container-low rounded-lg border border-outline-variant">
                <span className="eyebrow block mb-0.5">{t("common.targetAsset")}</span>
                <span className="text-sm font-medium text-on-surface break-words">{itemName}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {t("common.keepAsset")}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="h-9 px-4 rounded-lg bg-error text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("common.purging")}
                  </>
                ) : (
                  t("common.permanentlyDelete")
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
