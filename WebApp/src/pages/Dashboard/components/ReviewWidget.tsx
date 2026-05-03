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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400 mb-8"
      >
        <CheckCircle size={20} />
        <span className="text-sm font-bold">{t("dashboard.reviewWidget.emptyState")}</span>
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
    } catch (err) {
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
    } catch (err) {
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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-lowest rounded-2xl border-2 border-primary/20 shadow-lg shadow-primary/5 overflow-hidden relative"
    >
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-pulse" />

      <div className="p-5 border-b border-outline-variant/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Inbox size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black font-headline text-on-surface">
                {t("dashboard.reviewWidget.title", { count: transactions.length })}
              </h2>
              <div className="group relative flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-on-surface-variant/30 hover:text-primary transition-colors cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-surface-container-highest text-on-surface text-[10px] font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 text-center border border-outline-variant/10">
                  {t("dashboard.reviewWidget.tooltip")}
                </div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest">
              {t("dashboard.reviewWidget.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-outline-variant/5 max-h-[320px] overflow-y-auto relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, x: 100, height: 0 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-4 hover:bg-surface-container-low/50 transition-colors group gap-4 lg:gap-8"
            >
              {/* Left Group: Date & Description */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="text-center min-w-[40px] shrink-0">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase leading-none mb-1">
                    {format(new Date(tx.date), "MMM")}
                  </p>
                  <p className="text-sm font-black text-on-surface leading-none">
                    {format(new Date(tx.date), "dd")}
                  </p>
                </div>

                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={editedDescriptions[tx.id] ?? tx.description ?? ""}
                    placeholder={t("dashboard.reviewWidget.placeholder")}
                    onChange={(e) => setEditedDescriptions(prev => ({ ...prev, [tx.id]: e.target.value }))}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 focus:outline-none hover:bg-surface-container-low/80 rounded px-1 -ml-1 transition-colors"
                  />
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">
                    {t("dashboard.reviewWidget.pendingVerification")}
                  </p>
                </div>
              </div>

              {/* Right Group: Amount, Category, Actions */}
              <div className="flex items-center gap-3 lg:gap-6 shrink-0 w-full lg:w-auto justify-between lg:justify-end">
                <p className={`text-xs font-black tabular-nums shrink-0 min-w-[80px] text-right ${tx.type === 'income' ? 'text-emerald-500' : 'text-on-surface'}`}>
                  {tx.type === "income" ? "+" : "−"}
                  {formatCurrency(Math.abs(tx.amount), currency.code)}
                </p>

                <div className="flex items-center gap-2 flex-1 lg:flex-none justify-end">
                  <div className="relative flex-1 lg:flex-none max-w-[140px]">
                    <select
                      value={selectedCategories[tx.id] || tx.category_id || ""}
                      onChange={(e) => setSelectedCategories(prev => ({ ...prev, [tx.id]: e.target.value }))}
                      className="appearance-none w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-8 pr-8 py-2 text-[11px] font-bold text-on-surface-variant focus:outline-none focus:border-primary/50 cursor-pointer transition-all hover:border-outline-variant"
                    >
                      <option value="" disabled>{t("dashboard.reviewWidget.selectCategory")}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                    <Tag size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDiscard(tx.id)}
                      disabled={discardingIds.has(tx.id) || approvingIds.has(tx.id)}
                      title={t("dashboard.reviewWidget.discard")}
                      className="w-9 h-9 rounded-xl text-on-surface-variant/40 hover:text-error hover:bg-error/10 flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
                    >
                      {discardingIds.has(tx.id) ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>

                    <button
                      onClick={() => handleApprove(tx.id)}
                      disabled={approvingIds.has(tx.id) || discardingIds.has(tx.id)}
                      title={t("dashboard.reviewWidget.approve")}
                      className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                    >
                      {approvingIds.has(tx.id) ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={18} strokeWidth={3} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
