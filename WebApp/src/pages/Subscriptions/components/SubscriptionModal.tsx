import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { BillingCycle, Subscription } from "../../../types/expenses";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useCategories } from "../../../hooks/useCategories";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
}

export default function SubscriptionModal({ isOpen, onClose, subscription }: SubscriptionModalProps) {
  const { t } = useTranslation();
  const { addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const { categories } = useCategories();
  const { currency } = useUserPreferences();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [nextDate, setNextDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditing = !!subscription;

  // Sync state when editing subscription changes
  useEffect(() => {
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
      setCategoryId("");
    }
  }, [subscription, isOpen]);

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
    } catch (err: any) {
      toast.error(t("subscriptions.modal.toasts.processFailed"), {
        description: err.message || t("subscriptions.modal.toasts.saveError"),
      });
      setErrorMsg(err.message || t("subscriptions.modal.toasts.genericError"));
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
    } catch (err: any) {
      toast.error(t("subscriptions.modal.toasts.deleteFailed"), {
        description: err.message || t("subscriptions.modal.toasts.deleteError"),
      });
      setErrorMsg(err.message || t("subscriptions.modal.toasts.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isEditing ? "edit_square" : "add_circle"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">
                    {isEditing ? t("subscriptions.modal.titleManage") : t("subscriptions.modal.titleNew")}
                  </h2>
                  <p className="text-on-surface-variant text-sm font-medium">
                    {isEditing ? t("subscriptions.modal.descManage") : t("subscriptions.modal.descNew")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-error-container/50 border border-error/20 rounded-xl text-error text-xs font-bold leading-relaxed">
                    {errorMsg}
                  </div>
                )}

                {/* Service Name & Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                      {t("subscriptions.modal.nameLabel")}
                    </label>
                    <div className="relative">
                      <input
                        autoFocus
                        className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/50 outline-none"
                        placeholder={t("subscriptions.modal.namePlaceholder")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                      {t("subscriptions.modal.categoryLabel")}
                    </label>
                    <CustomSelect
                      value={categoryId}
                      options={[
                        ...(categoryId === "" ? [{ value: "", label: t("subscriptions.modal.categoryPlaceholder") }] : []),
                        ...categories.map((cat) => ({ value: cat.id, label: `${cat.emoji} ${cat.name}` })),
                      ]}
                      onChange={setCategoryId}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Amount & Billing Cycle Row */}
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                      {t("subscriptions.modal.amountLabel")}
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-lg font-bold text-on-surface-variant">{currency.symbol}</span>
                      <input
                        className="w-full bg-surface-container border-none rounded-xl py-3.5 pl-10 pr-4 text-lg font-black text-on-surface focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30 outline-none"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                      {t("subscriptions.modal.cycleLabel")}
                    </label>
                    <div className="flex bg-surface-container-low p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setBillingCycle("monthly")}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${billingCycle === "monthly" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                      >
                        {t("subscriptions.modal.cycles.monthly")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle("yearly")}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${billingCycle === "yearly" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                      >
                        {t("subscriptions.modal.cycles.yearly")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Date */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {t("subscriptions.modal.dateLabel")}
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      type="date"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 mt-2 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all"
                    disabled={isSubmitting}
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !amount || !categoryId}
                    className="flex-2 py-3 px-4 rounded-xl font-bold text-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting 
                      ? t("subscriptions.modal.actions.processing") 
                      : isEditing 
                        ? t("subscriptions.modal.actions.save") 
                        : t("subscriptions.modal.actions.confirm")}
                  </button>
                </div>

                {/* Delete Option (Centered below primary actions) */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="w-full py-2 mt-2 text-error font-bold hover:text-error/80 text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    {t("subscriptions.modal.deleteButton")}
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
