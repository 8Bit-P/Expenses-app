import { useState } from "react";
import TransactionModal from "./TransactionModal";
import { useExpenses } from "../../../context/ExpensesContext";
import { format } from "date-fns";

export default function CompactRecentFlow() {
  const { transactions, loading } = useExpenses();
  
  // 1. State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Handler to open modal in "Edit" mode
  const handleEditClick = (tx: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click if you have one
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM do");
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold font-headline text-on-surface">
            Recent Flow
          </h4>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] font-black text-primary hover:text-primary-container transition-colors flex items-center gap-1 uppercase tracking-widest group"
            >
              Add New
              <span className="material-symbols-outlined scale-[0.7]">add</span>
            </button>
            <button className="text-[10px] font-black text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest group">
              View Statement
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 scale-[0.7] origin-center">
                call_made
              </span>
            </button>
          </div>
        </div>

        {/* List Container */}
        <div className="flex flex-col -mx-2 px-2">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3">
              <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
              <span className="text-xs font-bold uppercase tracking-widest">Synchronizing Ledger...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3">
              <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
              <span className="text-xs font-bold uppercase tracking-widest">No movements found</span>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                onClick={(e) => handleEditClick(tx, e)}
                className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[100px_1fr_120px_100px_40px] gap-3 sm:gap-4 items-center py-4 sm:py-3.5 group hover:bg-surface-container-low/60 transition-all rounded-2xl cursor-pointer relative border-b border-outline-variant/10 last:border-0"
              >
                {/* Date - Hidden on mobile, shown on SM+ */}
                <span className="hidden sm:block text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                  {formatDate(tx.date)}
                </span>

                {/* Transaction Main Info */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface-container flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {tx.category?.emoji || "💰"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm sm:text-base text-on-surface tracking-tight truncate leading-tight">
                      {tx.description || tx.category?.name || "Untitled"}
                    </span>
                    {/* Category & Date - Mobile Only variant */}
                    <div className="flex items-center gap-2 sm:hidden mt-0.5">
                      <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded">
                        {tx.category?.name}
                      </span>
                      <span className="text-[10px] font-medium text-on-surface-variant/60">
                        • {formatDate(tx.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category - Desktop Only */}
                <div className="hidden sm:flex items-center justify-end">
                  <span className="text-[11px] font-bold text-on-surface-variant/40 px-2 py-1 bg-surface-container-low rounded-md truncate uppercase tracking-tighter">
                    {tx.category?.name}
                  </span>
                </div>

                {/* Amount */}
                <div className="flex flex-col items-end">
                  <span
                    className={`font-black text-sm sm:text-base tabular-nums tracking-tight ${
                      tx.type === "income" ? "text-secondary" : "text-on-surface"
                    }`}
                  >
                    {tx.type === "income" ? `+$${tx.amount.toFixed(2)}` : `$${tx.amount.toFixed(2)}`}
                  </span>
                </div>

                {/* Actions Menu (3 dots) - Hidden on smallest mobile if space is tight, but we'll keep it for editing */}
                <div className="flex justify-end pr-1">
                  <button
                    onClick={(e) => handleEditClick(tx, e)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container sm:opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      more_vert
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination / Load More */}
        {transactions.length > 0 && !loading && (
          <div className="pt-4 mt-2 border-t border-outline-variant/10 flex justify-center">
            <button className="text-[11px] font-bold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-surface-container-low">
              Load More Movements
            </button>
          </div>
        )}
      </div>

      {/* The Modal Component */}
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


