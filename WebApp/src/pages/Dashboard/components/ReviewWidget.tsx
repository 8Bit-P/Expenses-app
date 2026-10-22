import { useState } from "react";
import { usePendingTransactions } from "../../../hooks/usePendingTransactions";
import { useCategories } from "../../../hooks/useCategories";
import { formatCurrency } from "../../../utils/currency";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { format } from "date-fns";
import { Check, Inbox, Loader2, Tag, ChevronDown, Trash2, CheckCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useTranslation } from "react-i18next";

export default function ReviewWidget() {
  const { t } = useTranslation();
  const { transactions, loading, updateTransaction, deleteTransaction } = usePendingTransactions();
  const { categories } = useCategories();
  const { currency } = useUserPreferences();
  
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());
  const [discardingIds, setDiscardingIds] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [editedDescriptions, setEditedDescriptions] = useState<Record<string, string>>({});

  if (loading) return null;
  if (transactions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative overflow-hidden bg-surface-container-lowest border border-outline-variant rounded-2xl pl-5 pr-4 py-3 flex items-center gap-2.5"
      >
        <span className="absolute inset-y-0 left-0 w-[3px] bg-secondary" aria-hidden />
        <CheckCircle size={16} className="text-secondary shrink-0" />
        <span className="text-sm text-on-surface-variant">{t("dashboard.reviewWidget.emptyState")}</span>
      </motion.div>
    );
  }

  const handleApprove = async (id: string) => {
    const tx = transactions.find(t => t.id === id);
    const categoryId = selectedCategories[id] || tx?.category_id;
    const description = editedDescriptions[id] ?? tx?.description;
    
    if (!categoryId) {
      toast.error(t("dashboard.reviewWidget.toast.selectCategory"));
      return;
    }

    setApprovingIds(prev => new Set(prev).add(id));
    try {
      await updateTransaction({
        id,
        updates: {
          category_id: categoryId,
          description: description || tx?.description,
          needs_review: false
        }
      });
      toast.success(t("dashboard.reviewWidget.toast.approved"));
    } catch {
      toast.error(t("dashboard.reviewWidget.toast.approvedError"));
    } finally {
      setApprovingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDiscard = async (id: string) => {
    setDiscardingIds(prev => new Set(prev).add(id));
    try {
      await deleteTransaction(id);
      toast.success(t("dashboard.reviewWidget.toast.discarded"));
    } catch {
      toast.error(t("dashboard.reviewWidget.toast.discardedError"));
    } finally {
      setDiscardingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden"
    >
      {/* Attention marker */}
      <span className="absolute inset-y-0 left-0 w-[3px] bg-amber-500 z-10" aria-hidden />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pl-5 pr-4 h-12 border-b border-outline-variant">
        <div className="flex items-center gap-2 min-w-0">
          <Inbox size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-sm font-semibold text-on-surface truncate">
            {t("dashboard.reviewWidget.title", { count: transactions.length })}
          </h2>
          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded text-[11px] font-medium tabular-nums bg-amber-500/15 text-amber-700 dark:text-amber-300 shrink-0">
            {transactions.length}
          </span>
          <div className="group relative flex items-center justify-center shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-outline hover:text-on-surface transition-colors cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-60 px-2.5 py-2 bg-surface-container-lowest text-on-surface text-xs leading-snug rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none z-50 text-left border border-outline-variant">
              {t("dashboard.reviewWidget.tooltip")}
            </div>
          </div>
        </div>
        <p className="eyebrow hidden sm:block shrink-0">{t("dashboard.reviewWidget.subtitle")}</p>
      </div>

      <div className="divide-y divide-outline-variant max-h-[320px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => {
            const isBusy = approvingIds.has(tx.id) || discardingIds.has(tx.id);
            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 pl-5 pr-4 py-2.5 hover:bg-surface-container-low transition-colors"
              >
                {/* Date, description, amount */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 text-center shrink-0 leading-none">
                    <p className="text-[11px] font-medium text-on-surface-variant uppercase mb-1">
                      {format(new Date(tx.date), "MMM")}
                    </p>
                    <p className="text-sm font-medium text-on-surface tabular-nums">
                      {format(new Date(tx.date), "dd")}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={editedDescriptions[tx.id] ?? tx.description ?? ""}
                      placeholder={t("dashboard.reviewWidget.placeholder")}
                      onChange={(e) => setEditedDescriptions(prev => ({ ...prev, [tx.id]: e.target.value }))}
                      className="w-full h-7 -ml-1.5 px-1.5 bg-transparent border border-transparent rounded-md text-sm font-medium text-on-surface placeholder:text-outline hover:border-outline-variant focus:border-on-surface focus:bg-surface-container-lowest focus:ring-0 focus:outline-none transition-colors"
                    />
                    <p className="text-[11px] text-on-surface-variant leading-4">
                      {t("dashboard.reviewWidget.pendingVerification")}
                    </p>
                  </div>

                  <p className={`text-sm font-medium tabular-nums shrink-0 text-right ${tx.type === 'income' ? 'text-secondary' : 'text-on-surface'}`}>
                    {tx.type === "income" ? "+" : "−"}
                    {formatCurrency(Math.abs(tx.amount), currency.code)}
                  </p>
                </div>

                {/* Category + actions */}
                <div className="flex items-center gap-1.5 shrink-0 md:pl-0 pl-12">
                  <div className="relative flex-1 md:flex-none md:w-44 min-w-0">
                    <select
                      value={selectedCategories[tx.id] || tx.category_id || ""}
                      onChange={(e) => setSelectedCategories(prev => ({ ...prev, [tx.id]: e.target.value }))}
                      className="appearance-none w-full h-8 bg-surface-container-lowest border border-outline-variant rounded-md pl-7 pr-7 py-0 text-xs font-medium text-on-surface focus:outline-none focus:ring-0 focus:border-on-surface hover:border-outline cursor-pointer transition-colors"
                    >
                      <option value="" disabled>{t("dashboard.reviewWidget.selectCategory")}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                    <Tag size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDiscard(tx.id)}
                    disabled={isBusy}
                    title={t("dashboard.reviewWidget.discard")}
                    aria-label={t("dashboard.reviewWidget.discard")}
                    className="w-8 h-8 rounded-md text-on-surface-variant hover:text-error hover:bg-error/10 flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    {discardingIds.has(tx.id) ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(tx.id)}
                    disabled={isBusy}
                    title={t("dashboard.reviewWidget.approve")}
                    aria-label={t("dashboard.reviewWidget.approve")}
                    className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 transition"
                  >
                    {approvingIds.has(tx.id) ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Check size={16} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
