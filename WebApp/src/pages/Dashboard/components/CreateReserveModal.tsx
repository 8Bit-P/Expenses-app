import { useState, useEffect } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { useReserves } from "../../../hooks/useReserves";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { toast } from "sonner";
import { X, Shield } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useTranslation } from "react-i18next";

const inputClass =
  "w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors";

export default function CreateReserveModal({ isOpen, onClose }: CreateReserveModalProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { createReserve } = useReserves();
  const { currency, resolvedTheme } = useUserPreferences();

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
    } catch {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
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
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pl-5 pr-3 h-14 border-b border-outline-variant">
              <div className="flex items-center gap-2.5 min-w-0">
                <Shield className="w-[18px] h-[18px] text-on-surface-variant shrink-0" />
                <h2 className="text-[15px] font-semibold text-on-surface truncate">
                  {t("dashboard.reserves.newReserve")}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("dashboard.reserves.cancel")}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              {/* Body */}
              <div className="px-5 py-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">
                    {t("dashboard.reserves.reserveName")}
                  </label>
                  <input
                    autoFocus
                    className={inputClass}
                    placeholder={t("dashboard.reserves.reserveNamePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <label className="block text-xs font-medium text-on-surface-variant">
                      {t("dashboard.reserves.targetAmount")} ({currency.symbol})
                    </label>
                    <input
                      type="number"
                      className={`${inputClass} tabular-nums`}
                      placeholder="0.00"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="block text-xs font-medium text-on-surface-variant">
                      {t("dashboard.reserves.icon")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      aria-expanded={showEmojiPicker}
                      className={`w-16 h-10 rounded-lg border bg-surface-container-lowest flex items-center justify-center text-xl outline-none transition-colors ${
                        showEmojiPicker ? "border-on-surface" : "border-outline-variant hover:border-outline"
                      }`}
                    >
                      {icon}
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-1 right-0 z-[110] shadow-lg rounded-lg overflow-hidden border border-outline-variant">
                        <EmojiPicker
                          emojiStyle={EmojiStyle.NATIVE}
                          onEmojiClick={(e) => {
                            setIcon(e.emoji);
                            setShowEmojiPicker(false);
                          }}
                          skinTonesDisabled
                          theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                          width={300}
                          height={350}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">
                    {t("dashboard.reserves.fundingCategory")}
                  </label>
                  <CustomSelect
                    value={categoryId}
                    options={categories.map(cat => ({ value: cat.id, label: `${cat.emoji} ${cat.name}` }))}
                    onChange={setCategoryId}
                    className="w-full"
                  />
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {t("dashboard.reserves.fundingDesc")}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
                >
                  {t("dashboard.reserves.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !targetAmount}
                  className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
                >
                  {isSubmitting ? t("dashboard.reserves.creating") : t("dashboard.reserves.initializeGoal")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
