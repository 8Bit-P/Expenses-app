import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

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
  if (!isOpen) return null;

  const themes = {
    danger: {
      bg: "bg-error/10",
      border: "border-error/20",
      text: "text-error",
      btn: "bg-error text-on-error",
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    warning: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-500",
      btn: "bg-amber-500 text-white",
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-500",
      btn: "bg-emerald-500 text-white",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    info: {
      bg: "bg-primary/10",
      border: "border-primary/20",
      text: "text-primary",
      btn: "bg-primary text-white",
      icon: <Info className="w-6 h-6" />,
    },
  };

  const theme = themes[variant];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-sm rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} ${theme.border} border flex items-center justify-center mb-5 shadow-sm`}>
            {theme.icon}
          </div>
          
          <h2 className="text-xl font-black text-on-surface tracking-tight font-headline mb-2">
            {title}
          </h2>
          
          <p className="text-sm font-medium text-on-surface-variant/70 leading-relaxed mb-8">
            {description}
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-black/5 flex items-center justify-center gap-2 ${theme.btn} hover:opacity-90 disabled:opacity-50`}
            >
              {isLoading && (
                <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
