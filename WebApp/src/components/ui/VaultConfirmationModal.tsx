import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface VaultConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export default function VaultConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: VaultConfirmationModalProps) {
  const themes = {
    danger: {
      text: "text-error",
      btn: "bg-error text-white",
      icon: <AlertTriangle className="w-[18px] h-[18px]" />,
    },
    warning: {
      text: "text-amber-600",
      btn: "bg-amber-600 text-white",
      icon: <AlertTriangle className="w-[18px] h-[18px]" />,
    },
    success: {
      text: "text-secondary",
      btn: "bg-secondary text-on-secondary",
      icon: <CheckCircle2 className="w-[18px] h-[18px]" />,
    },
    info: {
      text: "text-tertiary",
      btn: "bg-primary text-on-primary",
      icon: <Info className="w-[18px] h-[18px]" />,
    },
  };

  const theme = themes[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
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
            className="relative bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl border border-outline-variant overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pl-5 pr-3 h-14 border-b border-outline-variant">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={cn("shrink-0", theme.text)}>{theme.icon}</span>
                <h2 className="text-[15px] font-semibold text-on-surface truncate">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                aria-label={cancelLabel}
                className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-50"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
              <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "h-9 px-4 rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60",
                  theme.btn,
                )}
              >
                {isLoading && (
                  <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                )}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
