import { useState } from "react";
import TransactionModal from "./TransactionModal";
import { useExpenses } from "../../../context/ExpensesContext";
import { format } from "date-fns";

export default function CompactRecentFlow() {
  const {
    transactions,
    loading,
    page,
    setPage,
    totalPages,
    totalCount,
    deleteTransaction,
  } = useExpenses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const [y, m, d] = dateString.split("-").map(Number);
      return format(new Date(y, m - 1, d), "MMM d");
    } catch {
      return dateString;
    }
  };

  const pages = buildPageRange(page, totalPages);

  return (
    <>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
          <div>
            <h4 className="text-lg font-bold font-headline text-on-surface">Recent Flow</h4>
            {!loading && totalCount > 0 && (
              <p className="text-xs font-medium text-on-surface-variant mt-0.5">
                {totalCount.toLocaleString()} movement{totalCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <button
            onClick={() => { setSelectedTx(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="hidden xs:inline">New</span>
          </button>
        </div>

        {/* Table header — desktop only */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_80px] gap-4 px-6 py-2.5 border-b border-outline-variant/10">
          {["Date", "Description", "Category", "Amount", ""].map((h) => (
            <span key={h} className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">{h}</span>
          ))}
        </div>

        {/* List */}
        <div>
          {loading ? (
            // Skeleton rows
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/5 last:border-0 animate-pulse">
                  <div className="w-12 h-4 bg-surface-container rounded-lg hidden md:block shrink-0" />
                  <div className="w-10 h-10 bg-surface-container rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-4 bg-surface-container rounded-lg w-3/5" />
                    <div className="h-3 bg-surface-container rounded-lg w-2/5" />
                  </div>
                  <div className="w-16 h-4 bg-surface-container rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/30 gap-3">
              <span className="material-symbols-outlined text-5xl">history_toggle_off</span>
              <span className="text-xs font-bold uppercase tracking-widest">No movements found</span>
            </div>
          ) : (
            transactions.map((tx) => {
              const isDeleting = deletingId === tx.id;
              const isConfirming = confirmDeleteId === tx.id;

              return (
                <div
                  key={tx.id}
                  onClick={() => !isConfirming && handleEdit(tx)}
                  className={`group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_2fr_1fr_1fr_80px] gap-4 items-center px-6 py-4 border-b border-outline-variant/5 last:border-0 cursor-pointer transition-colors ${
                    isDeleting ? "opacity-40 pointer-events-none" : "hover:bg-surface-container-low/50"
                  } ${isConfirming ? "bg-error/5" : ""}`}
                >
                  {/* Date — desktop */}
                  <span className="hidden md:block text-[11px] text-on-surface-variant font-bold uppercase tracking-wider shrink-0">
                    {formatDate(tx.date)}
                  </span>

                  {/* Main info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform duration-200">
                      {tx.category?.emoji || "💰"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-on-surface truncate leading-snug">
                        {tx.description || tx.category?.name || "Untitled"}
                      </p>
                      {/* Mobile: date + category below name */}
                      <p className="md:hidden text-[11px] text-on-surface-variant/60 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>{formatDate(tx.date)}</span>
                        {tx.category?.name && (
                          <>
                            <span className="opacity-40">·</span>
                            <span className="font-semibold">{tx.category.emoji} {tx.category.name}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Category pill — desktop */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[10px] font-bold text-on-surface-variant/50 px-2 py-1 bg-surface-container rounded-lg uppercase tracking-tighter truncate max-w-full">
                      {tx.category?.emoji} {tx.category?.name || "—"}
                    </span>
                  </div>

                  {/* Amount */}
                  <span
                    className={`font-black text-base tabular-nums tracking-tight ${
                      tx.type === "income" ? "text-green-500" : "text-on-surface"
                    }`}
                  >
                    {tx.type === "income" ? "+" : ""}${tx.amount.toFixed(2)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    {isConfirming ? (
                      // Confirm delete inline
                      <>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] font-black text-on-surface-variant hover:text-on-surface uppercase tracking-wider px-2 py-1 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(tx.id)}
                          className="text-[10px] font-black text-error hover:bg-error/10 uppercase tracking-wider px-2 py-1 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(tx); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-on-surface hover:bg-surface-container opacity-0 group-hover:opacity-100 transition-all"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[17px]">edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(tx.id, e)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-outline-variant/10">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-25 disabled:cursor-not-allowed transition-all group"
            >
              <span className="material-symbols-outlined text-[15px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              Prev
            </button>

            <div className="flex items-center gap-1">
              {pages.map((p, i) =>
                p === "..." ? (
                  <span key={`el-${i}`} className="w-8 text-center text-[11px] text-on-surface-variant/30 select-none">
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                      p === page
                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-25 disabled:cursor-not-allowed transition-all group"
            >
              Next
              <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTx(null); }}
        transaction={selectedTx}
      />
    </>
  );
}

function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const add = (p: number) => { if (!pages.includes(p)) pages.push(p); };
  add(1);
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) add(p);
  if (current < total - 2) pages.push("...");
  add(total);
  return pages;
}
