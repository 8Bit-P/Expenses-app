import { useState } from "react";
import { useExpenses } from "../../../../context/ExpensesContext";
import TransactionModal from "../TransactionModal";
import FlowHeader from "./FlowHeader";
import FlowTableHeader from "./FlowTableHeader";
import FlowSkeleton from "./FlowSkeleton";
import FlowRow from "./FlowRow";
import FlowPagination from "./FlowPagination";

export default function CompactRecentFlow() {
  const { transactions, loading, page, setPage, totalPages, totalCount, deleteTransaction } = useExpenses();

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
      console.log("Attempting to delete transaction...", id);
      await deleteTransaction(id);
      console.log("Delete success!");
    } catch (e: any) {
      console.error("Delete failed:", e);
      alert(`Delete failed: ${e?.message ?? "Unknown error"}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <FlowHeader totalCount={totalCount} loading={loading} onAddNew={openAddNew} />
        <FlowTableHeader />

        <div>
          {loading ? (
            <FlowSkeleton />
          ) : transactions.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/30 gap-3">
              <span className="material-symbols-outlined text-5xl">history_toggle_off</span>
              <span className="text-xs font-bold uppercase tracking-widest">No movements found</span>
            </div>
          ) : (
            transactions.map((tx) => (
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
            ))
          )}
        </div>

        {!loading && totalPages > 1 && <FlowPagination page={page} totalPages={totalPages} onPageChange={setPage} />}
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
