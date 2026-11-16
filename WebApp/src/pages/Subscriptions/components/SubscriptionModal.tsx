import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { BillingCycle, Subscription } from "../../../types/expenses";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useCategories } from "../../../hooks/useCategories";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { cn } from "../../../utils/cn";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
}

export default function SubscriptionModal({ isOpen, onClose, subscription }: SubscriptionModalProps) {
  const { t } = useTranslation();
  const { addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const { categories, addCategory } = useCategories();
  const { currency } = useUserPreferences();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [nextDate, setNextDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("📦");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isEditing = !!subscription;

  // Sync state when editing subscription changes
  useEffect(() => {
    if (isOpen) {
      if (subscription) {
        setName(subscription.name);
        setAmount(subscription.amount.toString());
        setBillingCycle(subscription.billing_cycle);
        setNextDate(subscription.next_billing_date);
        setCategoryId(subscription.category_id || "");
      } else {
        // Reset for new subscription
        setName("");
        setAmount("");
        setBillingCycle("monthly");
        setNextDate(new Date().toISOString().split("T")[0]);
        // Category will be set by the other effect if empty
        setCategoryId("");
      }
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setNewCategoryEmoji("📦");
      setCategoryError(null);
      setShowEmojiPicker(false);
    }
  }, [subscription, isOpen]);

  // Set default category only if it's empty and we have categories available
  useEffect(() => {
    if (isOpen && !subscription && !categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [isOpen, subscription, categoryId, categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount || !nextDate || !categoryId) {
      setErrorMsg(t("subscriptions.modal.toasts.missingFields"));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (isEditing && subscription) {
        await updateSubscription.mutateAsync({
          id: subscription.id,
          updates: {
            name,
            amount: parseFloat(amount),
            billing_cycle: billingCycle,
            next_billing_date: nextDate,
            category_id: categoryId,
          },
        });
      } else {
        await addSubscription.mutateAsync({
          name,
          amount: parseFloat(amount),
          billing_cycle: billingCycle,
          next_billing_date: nextDate,
          category_id: categoryId,
          status: "active",
        });
      }

      toast.success(isEditing ? t("subscriptions.modal.toasts.updated") : t("subscriptions.modal.toasts.added"), {
        description: t("subscriptions.modal.toasts.syncSuccess", { name }),
      });

      onClose();
    } catch (err) {
      toast.error(t("subscriptions.modal.toasts.processFailed"), {
        description: (err as Error).message || t("subscriptions.modal.toasts.saveError"),
      });
      setErrorMsg((err as Error).message || t("subscriptions.modal.toasts.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!subscription || !window.confirm(t("subscriptions.modal.confirmDelete", { name: subscription.name }))) return;

    setIsSubmitting(true);
    try {
      await deleteSubscription.mutateAsync(subscription.id);
      toast.success(t("subscriptions.modal.toasts.removed"), {
        description: t("subscriptions.modal.toasts.removedDesc", { name: subscription.name }),
      });
      onClose();
    } catch (err) {
      toast.error(t("subscriptions.modal.toasts.deleteFailed"), {
        description: (err as Error).message || t("subscriptions.modal.toasts.deleteError"),
      });
      setErrorMsg((err as Error).message || t("subscriptions.modal.toasts.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  const labelClass = "block text-xs font-medium text-on-surface-variant mb-1.5";
  const inputClass =
    "w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors";

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
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-visible border border-outline-variant"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-outline-variant">
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-on-surface">
                  {isEditing ? t("subscriptions.modal.titleManage") : t("subscriptions.modal.titleNew")}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isEditing ? t("subscriptions.modal.descManage") : t("subscriptions.modal.descNew")}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.cancel")}
                className="w-8 h-8 -mr-1.5 -mt-1 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-5 py-5 space-y-4">
                {errorMsg && (
                  <div className="flex items-start gap-2 px-3 py-2.5 bg-error/10 border border-error/20 rounded-lg text-error text-[13px]">
                    <span className="material-symbols-outlined text-[16px] mt-px">error</span>
                    {errorMsg}
                  </div>
                )}

                {/* Service Name & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t("subscriptions.modal.nameLabel")}</label>
                    <input
                      autoFocus
                      className={inputClass}
                      placeholder={t("subscriptions.modal.namePlaceholder")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>{t("subscriptions.modal.categoryLabel")}</label>
                    {isCreatingCategory ? (
                      <div className="space-y-2 relative z-50">
                        <div className="relative flex items-center h-10 bg-surface-container-lowest border border-outline-variant focus-within:border-on-surface rounded-lg pl-1 transition-colors">
                          <div className="relative flex items-center">
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-surface-container rounded-md transition-colors select-none"
                            >
                              {newCategoryEmoji}
                            </button>

                            {showEmojiPicker && (
                              <div className="absolute top-[115%] left-0 z-[60] shadow-xl rounded-lg border border-outline-variant">
                                <EmojiPicker
                                  emojiStyle={EmojiStyle.NATIVE}
                                  onEmojiClick={(e) => {
                                    setNewCategoryEmoji(e.emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  skinTonesDisabled
                                  theme={Theme.DARK}
                                  width={280}
                                  height={350}
                                />
                              </div>
                            )}
                          </div>
                          <div className="w-px h-5 bg-outline-variant mx-1" />
                          <input
                            type="text"
                            className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-on-surface placeholder:text-outline px-2"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder={t("expenses.transactionModal.createCategory.placeholder")}
                            autoFocus
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingCategory(false);
                              setNewCategoryName("");
                              setCategoryError(null);
                            }}
                            className="flex-1 h-8 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                          >
                            {t("common.cancel") || "Cancel"}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!newCategoryName) {
                                setCategoryError(t("expenses.transactionModal.createCategory.error.nameRequired"));
                                return;
                              }
                              setCategoryError(null);
                              try {
                                const newCat = await addCategory({ name: newCategoryName, emoji: newCategoryEmoji });
                                toast.success(t("expenses.transactionModal.createCategory.toast.success"), {
                                  description: t("expenses.transactionModal.createCategory.toast.successDesc", {
                                    emoji: newCategoryEmoji,
                                    name: newCategoryName,
                                  }),
                                });
                                setCategoryId(newCat.id);
                                setIsCreatingCategory(false);
                                setNewCategoryName("");
                                setNewCategoryEmoji("📦");
                              } catch (e) {
                                toast.error(t("expenses.transactionModal.createCategory.toast.error"), {
                                  description:
                                    (e as Error).message || t("expenses.transactionModal.createCategory.toast.errorDefault"),
                                });
                                setCategoryError(
                                  (e as Error).message || t("expenses.transactionModal.createCategory.toast.errorDefault"),
                                );
                              }
                            }}
                            disabled={isSubmitting}
                            className="flex-1 h-8 rounded-lg bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                          </button>
                        </div>
                        {categoryError && (
                          <p className="text-xs text-error flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            {categoryError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <CustomSelect
                        value={categoryId}
                        options={[
                          ...(categoryId === "" ? [{ value: "", label: t("subscriptions.modal.categoryPlaceholder") }] : []),
                          ...categories.map((cat) => ({ value: cat.id, label: `${cat.emoji} ${cat.name}` })),
                        ]}
                        onChange={setCategoryId}
                        className="w-full relative z-40"
                        onAddAction={() => setIsCreatingCategory(true)}
                        addActionLabel={t("expenses.transactionModal.createCategory.title")}
                      />
                    )}
                  </div>
                </div>

                {/* Amount & Billing Cycle Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className={labelClass}>{t("subscriptions.modal.amountLabel")}</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-sm text-on-surface-variant pointer-events-none">
                        {currency.symbol}
                      </span>
                      <input
                        className={cn(inputClass, "pl-8 font-medium tabular-nums")}
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{t("subscriptions.modal.cycleLabel")}</label>
                    <div className="flex w-full p-0.5 rounded-lg bg-surface-container border border-outline-variant">
                      {(["monthly", "yearly"] as const).map((cycle) => (
                        <button
                          key={cycle}
                          type="button"
                          onClick={() => setBillingCycle(cycle)}
                          className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors ${
                            billingCycle === cycle
                              ? "bg-surface-container-lowest text-on-surface shadow-sm"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          {cycle === "monthly"
                            ? t("subscriptions.modal.cycles.monthly")
                            : t("subscriptions.modal.cycles.yearly")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Date */}
                <div>
                  <label className={labelClass}>{t("subscriptions.modal.dateLabel")}</label>
                  <input
                    className={inputClass}
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    type="date"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 px-5 py-4 border-t border-outline-variant">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="h-9 px-3 -ml-1 rounded-lg text-error text-sm font-medium hover:bg-error/10 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    {t("subscriptions.modal.deleteButton")}
                  </button>
                )}
                <div className="flex gap-2 sm:ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
                    disabled={isSubmitting}
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !amount || !categoryId}
                    className="flex-1 sm:flex-none h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isSubmitting
                      ? t("subscriptions.modal.actions.processing")
                      : isEditing
                        ? t("subscriptions.modal.actions.save")
                        : t("subscriptions.modal.actions.confirm")}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
