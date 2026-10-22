import { motion, AnimatePresence } from "framer-motion";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isExecuting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isExecuting?: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden"
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
                disabled={isExecuting}
                aria-label="Close"
                className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {message}{" "}
                {itemName && <span className="font-medium text-on-surface block mt-1.5">"{itemName}"</span>}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-outline-variant">
              <button
                type="button"
                disabled={isExecuting}
                onClick={onClose}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel, Keep it
              </button>
              <button
                type="button"
                disabled={isExecuting}
                onClick={onConfirm}
                className="h-9 px-4 rounded-lg bg-error text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <span className={`material-symbols-outlined text-[18px] ${isExecuting ? "animate-spin" : ""}`}>
                  {isExecuting ? "autorenew" : "delete"}
                </span>
                {isExecuting ? "Deleting..." : "Yes, Delete it"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
