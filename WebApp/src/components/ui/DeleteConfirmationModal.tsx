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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 ring-1 ring-black/5 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Danger Icon Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4 border border-error/20 shadow-sm">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
            </div>
            <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight">{title}</h2>
            <p className="text-on-surface-variant text-sm font-medium mt-2 leading-relaxed">{description}</p>
          </div>

          {/* Item Highlight */}
          <div className="mb-8 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-1">
              Target Asset
            </span>
            <span className="text-base font-black text-on-surface">{itemName}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full py-4 bg-error text-on-error rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin"></div>
                  Purging from Vault...
                </>
              ) : (
                "Permanently Delete"
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full py-3 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-all rounded-xl"
            >
              Keep Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
