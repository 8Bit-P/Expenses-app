import { useState } from "react";
import { useExpenses } from "../../../../context/ExpensesContext";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import TransactionModal from "../TransactionModal";
import FlowHeader from "./FlowHeader";
import FlowSkeleton from "./FlowSkeleton";
import FlowRow from "./FlowRow";
import FlowPagination from "./FlowPagination";
import { toast } from "sonner";
import { formatRelativeDate } from "../../../../utils/dateFormatters";
import { formatCurrency } from "../../../../utils/currency";

import { useTranslation } from "react-i18next";

export default function CompactRecentFlow() {
  const { t } = useTranslation();
  const { transactions, loading, page, setPage, totalPages, totalCount, deleteTransaction, isMobile } = useExpenses();
  const { currency } = useUserPreferences();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openAddNew = () => {
    setSelectedTx(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tx: any) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      await deleteTransaction(id);
      toast.success(t("expenses.recentFlow.toast.removed"), {
        description: t("expenses.recentFlow.toast.removedDesc"),
      });
    } catch (e: any) {
      toast.error(t("expenses.recentFlow.toast.deleteFailed"), {
        description: e?.message ?? t("expenses.recentFlow.toast.deleteFailedDesc"),
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc: any, tx: any) => {
    const d = tx.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(tx);
    return acc;
  }, {});
  const dates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  // Compute daily totals
  const dailyTotals = (txs: any[]) => {
    let income = 0;
    let expense = 0;
    txs.forEach((tx: any) => {
      if (tx.type === "income") income += tx.amount;
      else expense += tx.amount;
    });
    return { income, expense, net: income - expense };
  };

  return (
    <>
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/10">
        <FlowHeader totalCount={totalCount} loading={loading} onAddNew={openAddNew} />

        <div>
          {loading && transactions.length === 0 ? (
            <FlowSkeleton />
          ) : transactions.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/30 gap-3">
              <span className="material-symbols-outlined text-5xl">history_toggle_off</span>
              <span className="text-xs font-bold uppercase tracking-widest">
                {t("expenses.recentFlow.noMovements")}
              </span>
            </div>
          ) : (
            dates.map((date, dateIdx) => {
              const txs = groupedTransactions[date];
              const totals = dailyTotals(txs);
              const isFirst = dateIdx === 0;

              return (
                <div key={date}>
                  {/* ── Day header with daily total ─────────────────────── */}
                  <div
                    className={`flex items-center justify-between px-5 md:px-6 py-3.5 bg-surface-container/40 ${
                      !isFirst ? "border-t border-outline-variant/8" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
                        {formatRelativeDate(date)}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/30 font-medium">
                        · {txs.length} {txs.length === 1 ? t("expenses.recentFlow.entry") : t("expenses.recentFlow.entries", { defaultValue: "entries" })}
                      </span>
                    </div>

                    {/* Daily summary */}
                    <div className="flex items-center gap-3">
                      {totals.income > 0 && (
                        <span className="text-[10px] font-bold text-emerald-400/70 tabular-nums">
                          +{formatCurrency(totals.income, currency.code)}
                        </span>
                      )}
                      {totals.expense > 0 && (
                        <span className="text-[10px] font-bold text-on-surface-variant/50 tabular-nums">
                          −{formatCurrency(totals.expense, currency.code)}
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-black tabular-nums px-2 py-0.5 rounded-md ${
                          totals.net >= 0
                            ? "text-emerald-400 bg-emerald-400/8"
                            : "text-red-400 bg-red-400/8"
                        }`}
                      >
                        {totals.net >= 0 ? "+" : "−"}
                        {formatCurrency(Math.abs(totals.net), currency.code)}
                      </span>
                    </div>
                  </div>

                  {/* ── Transaction rows ───────────────────────────────── */}
                  {txs.map((tx: any) => (
                    <FlowRow
                      key={tx.id}
                      tx={tx as any}
                      isDeleting={deletingId === tx.id}
                      isConfirming={confirmDeleteId === tx.id}
                      onEdit={() => handleEdit(tx)}
                      onDeleteClick={(e) => handleDeleteClick(tx.id, e)}
                      onDeleteConfirm={() => handleDeleteConfirm(tx.id)}
                      onCancelDelete={() => setConfirmDeleteId(null)}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>

        {!loading &&
          (isMobile
            ? page < totalPages && (
                <div className="p-4 border-t border-outline-variant/5">
                  <button
                    onClick={() => setPage(page + 1)}
                    className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl transition-all group"
                  >
                    <span>{t("expenses.recentFlow.loadMore")}</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-y-0.5 transition-transform">
                      expand_more
                    </span>
                  </button>
                </div>
              )
            : totalPages > 1 && <FlowPagination page={page} totalPages={totalPages} onPageChange={setPage} />)}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
      />
    </>
  );
}
