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
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-error/20 ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mb-6 ring-8 ring-error/5">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
              
              <h2 className="text-xl font-black font-headline text-on-surface mb-2">{title}</h2>
              
              <p className="text-sm font-medium text-on-surface-variant/80 mb-6">
                {message}{" "}
                {itemName && (
                  <span className="font-black text-on-surface block mt-1">"{itemName}"</span>
                )}
              </p>

              <div className="w-full space-y-3">
                <button
                  disabled={isExecuting}
                  onClick={onConfirm}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm bg-error text-on-error hover:bg-error/90 active:scale-[0.98] transition-all shadow-lg shadow-error/20 disabled:opacity-50 disabled:shadow-none"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isExecuting ? 'animate-spin' : ''}`}>
                    {isExecuting ? 'autorenew' : 'delete'}
                  </span>
                  {isExecuting ? 'Deleting...' : 'Yes, Delete it'}
                </button>
                <button
                  disabled={isExecuting}
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel, Keep it
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

