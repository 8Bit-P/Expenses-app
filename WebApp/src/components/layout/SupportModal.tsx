import { useTranslation } from "react-i18next";
import { X, Heart, Zap } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 border-b border-outline-variant/5 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5 fill-primary" />
            <h2 className="text-lg font-black text-on-surface tracking-tight font-headline">
              {t("support.title")}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {t("support.p1")}
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {t("support.p2")}
          </p>

          <div className="pt-6 flex flex-col gap-3">
            <a
              href="https://buy.stripe.com/aFaeVcdAq6Qec814Fa48000"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Zap size={16} className="text-amber-400" />
              {t("support.cta")}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-all rounded-xl"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
