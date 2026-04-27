import { useState, useEffect } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { useReserves } from "../../../hooks/useReserves";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { toast } from "sonner";
import { X, Shield } from "lucide-react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

interface CreateReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useTranslation } from "react-i18next";

export default function CreateReserveModal({ isOpen, onClose }: CreateReserveModalProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { createReserve } = useReserves();
  const { currency } = useUserPreferences();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [icon, setIcon] = useState("💰");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setTargetAmount("");
      setCategoryId(categories[0]?.id || "");
      setIcon("💰");
      setShowEmojiPicker(false);
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !categoryId) {
      toast.error(t("dashboard.reserves.toast.missingFields"), { 
        description: t("dashboard.reserves.toast.missingFieldsDesc") 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReserve.mutateAsync({
        name,
        target_amount: parseFloat(targetAmount),
        category_id: categoryId,
        icon,
      });
      onClose();
    } catch (err: any) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="px-6 py-6 border-b border-outline-variant/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black text-on-surface tracking-tight font-headline">
              {t("dashboard.reserves.newReserve")}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
              {t("dashboard.reserves.reserveName")}
            </label>
            <input
              autoFocus
              className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3 px-4 text-sm font-semibold text-on-surface outline-none"
              placeholder={t("dashboard.reserves.reserveNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                {t("dashboard.reserves.targetAmount")} ({currency.symbol})
              </label>
              <input
                type="number"
                className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3 px-4 text-sm font-semibold text-on-surface outline-none"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-center relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                {t("dashboard.reserves.icon")}
              </label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full bg-surface-container border border-outline-variant/10 hover:border-primary/50 rounded-xl py-2.5 text-center text-2xl outline-none transition-all"
              >
                {icon}
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-[110%] right-0 z-[110] shadow-2xl rounded-xl animate-in fade-in zoom-in-95 border border-outline-variant/20">
                  <EmojiPicker
                    emojiStyle={EmojiStyle.NATIVE}
                    onEmojiClick={(e) => {
                      setIcon(e.emoji);
                      setShowEmojiPicker(false);
                    }}
                    skinTonesDisabled
                    theme={"dark" as any}
                    width={300}
                    height={350}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
              {t("dashboard.reserves.fundingCategory")}
            </label>
            <CustomSelect
              value={categoryId}
              options={categories.map(cat => ({ value: cat.id, label: `${cat.emoji} ${cat.name}` }))}
              onChange={setCategoryId}
              className="w-full bg-surface-container border-none rounded-xl py-1 text-sm font-semibold"
            />
            <p className="text-[9px] text-on-surface-variant/60 font-medium px-1 italic">
              {t("dashboard.reserves.fundingDesc")}
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              {t("dashboard.reserves.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name || !targetAmount}
              className="flex-[2] py-3.5 px-4 rounded-xl font-bold text-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSubmitting ? t("dashboard.reserves.creating") : t("dashboard.reserves.initializeGoal")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
