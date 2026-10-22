import { useState } from "react";
import { useExpenses } from "../../../../context/ExpensesContext";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import TransactionModal from "../TransactionModal";
import FlowHeader from "./FlowHeader";
import FlowTableHeader from "./FlowTableHeader";
import FlowSkeleton from "./FlowSkeleton";
import FlowRow from "./FlowRow";
import FlowPagination from "./FlowPagination";
import { toast } from "sonner";
import { formatRelativeDate } from "../../../../utils/dateFormatters";
import { formatCurrency } from "../../../../utils/currency";
import Panel from "../../../../components/ui/Panel";
import { cn } from "../../../../utils/cn";
import { FLOW_GRID_COLS } from "../../constants";

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

  const isEmpty = !loading && transactions.length === 0;

  return (
    <>
      <Panel flush className="overflow-hidden">
        <FlowHeader totalCount={totalCount} loading={loading} onAddNew={openAddNew} />

        {!isEmpty && <FlowTableHeader />}

        {loading && transactions.length === 0 ? (
          <FlowSkeleton />
        ) : transactions.length === 0 ? (
          <div className="py-16 px-5 flex flex-col items-center justify-center text-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-outline">receipt_long</span>
            <p className="text-sm font-medium text-on-surface">{t("expenses.recentFlow.noMovements")}</p>
            <button
              onClick={openAddNew}
              className="mt-2 h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium inline-flex items-center gap-1.5 hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {t("expenses.recentFlow.entry")}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {dates.map((date) => {
              const txs = groupedTransactions[date];
              const totals = dailyTotals(txs);

              return (
                <div key={date} className="divide-y divide-outline-variant">
                  {/* ── Day header with daily totals ─────────────────────── */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-3 px-5 h-9 bg-surface-container-low/60",
                      FLOW_GRID_COLS,
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 min-w-0 md:col-span-2">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-xs font-medium text-on-surface truncate">{formatRelativeDate(date)}</span>
                        <span className="text-xs text-on-surface-variant whitespace-nowrap tabular-nums">
                          · {txs.length}{" "}
                          {txs.length === 1
                            ? t("expenses.recentFlow.entry")
                            : t("expenses.recentFlow.entries", { defaultValue: "entries" })}
                        </span>
                      </div>

                      {totals.income > 0 && totals.expense > 0 && (
                        <div className="hidden sm:flex items-center gap-3 text-xs tabular-nums">
                          <span className="text-secondary">+{formatCurrency(totals.income, currency.code)}</span>
                          <span className="text-on-surface-variant">
                            −{formatCurrency(totals.expense, currency.code)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Daily net — sits in the amount column */}
                    <div className="shrink-0 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium tabular-nums",
                          totals.net >= 0 ? "bg-secondary/10 text-secondary" : "bg-error/10 text-error",
                        )}
                      >
                        {totals.net >= 0 ? "+" : "−"}
                        {formatCurrency(Math.abs(totals.net), currency.code)}
                      </span>
                    </div>
                    <div className="hidden md:block" />
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
            })}
          </div>
        )}

        {!loading &&
          (isMobile
            ? page < totalPages && (
                <div className="p-4 border-t border-outline-variant">
                  <button
                    onClick={() => setPage(page + 1)}
                    className="w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium inline-flex items-center justify-center gap-1.5 hover:bg-surface-container-low transition-colors"
                  >
                    {t("expenses.recentFlow.loadMore")}
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>
                </div>
              )
            : totalPages > 1 && <FlowPagination page={page} totalPages={totalPages} onPageChange={setPage} />)}
      </Panel>

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
