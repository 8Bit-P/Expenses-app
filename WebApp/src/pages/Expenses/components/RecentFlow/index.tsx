import { useState } from "react";
import { useExpenses } from "../../../../context/ExpensesContext";
import TransactionModal from "../TransactionModal";
import FlowHeader from "./FlowHeader";
import FlowTableHeader from "./FlowTableHeader";
import FlowSkeleton from "./FlowSkeleton";
import FlowRow from "./FlowRow";
import FlowPagination from "./FlowPagination";
import { toast } from "sonner";
import { formatRelativeDate } from "../../../../utils/dateFormatters";

export default function CompactRecentFlow() {
  const { 
    transactions, 
    loading, 
    page, 
    setPage, 
    totalPages, 
    totalCount, 
    deleteTransaction,
    isMobile 
  } = useExpenses();

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
      toast.success("Transaction removed", {
        description: "The ledger entry has been purged from your vault.",
      });
    } catch (e: any) {
      toast.error("Delete failed", {
        description: e?.message ?? "Could not remove the entry.",
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

  return (
    <>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <FlowHeader totalCount={totalCount} loading={loading} onAddNew={openAddNew} />
        {!isMobile && <FlowTableHeader />}

        <div>
          {loading && transactions.length === 0 ? (
            <FlowSkeleton />
          ) : transactions.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/30 gap-3">
              <span className="material-symbols-outlined text-5xl">history_toggle_off</span>
              <span className="text-xs font-bold uppercase tracking-widest">No movements found</span>
            </div>
          ) : (
            dates.map((date) => (
              <div key={date}>
                <div className="px-4 md:px-6 py-2 bg-surface-container-low/30 border-b border-outline-variant/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                    {formatRelativeDate(date)}
                  </span>
                </div>
                {groupedTransactions[date].map((tx: any) => (
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
            ))
          )}
        </div>

        {!loading && (
          isMobile ? (
            page < totalPages && (
              <div className="p-4 border-t border-outline-variant/5">
                <button
                  onClick={() => setPage(page + 1)}
                  className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl transition-all group"
                >
                  <span>Load More Movements</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-y-0.5 transition-transform">expand_more</span>
                </button>
              </div>
            )
          ) : (
            totalPages > 1 && <FlowPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )
        )}
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
