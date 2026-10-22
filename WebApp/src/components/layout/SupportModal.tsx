import { useTranslation } from "react-i18next";
import { X, Heart, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 h-14 border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-error fill-error" />
                <h2 className="text-base font-semibold text-on-surface">{t("support.title")}</h2>
              </div>
              <button
                onClick={onClose}
                aria-label={t("common.cancel")}
                className="w-8 h-8 -mr-1.5 flex items-center justify-center hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-on-surface-variant text-sm leading-relaxed">{t("support.p1")}</p>
              <p className="text-on-surface-variant text-sm leading-relaxed">{t("support.p2")}</p>
            </div>

            <div className="px-5 py-4 border-t border-outline-variant bg-surface-container-low flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container transition-colors"
              >
                {t("common.cancel")}
              </button>
              <a
                href="https://buy.stripe.com/aFaeVcdAq6Qec814Fa48000"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="h-9 px-4 bg-accent text-on-accent rounded-lg font-semibold text-sm hover:brightness-95 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
              >
                <Zap size={15} />
                {t("support.cta")}
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
