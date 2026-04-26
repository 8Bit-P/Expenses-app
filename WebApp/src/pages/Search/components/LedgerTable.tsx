import { useState, useEffect } from "react";
import { List, Loader2, Search, TrendingUp, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { formatTransactionDate } from "../../../utils/dateFormatters";
import { formatCurrency } from "../../../utils/currency";
import type { LedgerRow } from "../types";
import { buildPageRange } from "../../Expenses/utils/pagination";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface LedgerTableProps {
  rows: LedgerRow[];
  loading: boolean;
  currencyCode: string;
}

// ── Source badge config ───────────────────────────────────────────────────────
function SourceBadge({ domain, amount }: { domain: LedgerRow["domain"]; amount: number }) {
  const isIncome = domain === "Transactions" && amount > 0;

  const config = isIncome
    ? { label: "INC", bg: "bg-emerald-500/10", text: "text-emerald-400", icon: <TrendingUp size={9} /> }
    : domain === "Transactions"
    ? { label: "TXN", bg: "bg-red-500/10", text: "text-red-400", icon: null }
    : domain === "Assets"
    ? { label: "AST", bg: "bg-violet-500/10", text: "text-violet-400", icon: null }
    : { label: "REC", bg: "bg-blue-500/10", text: "text-blue-400", icon: null };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${config.bg} ${config.text}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

const PAGE_SIZE = 20;

export function LedgerTable({ rows, loading, currencyCode }: LedgerTableProps) {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [rows]);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  // Mobile uses "Load More" (shows all items up to current page), desktop uses traditional pagination
  const visibleRows = isMobile
    ? rows.slice(0, page * PAGE_SIZE)
    : rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-0">
      <div className="flex items-center justify-between p-5 border-b border-outline-variant/10 bg-surface-container-lowest/50 shrink-0">
        <div className="flex items-center gap-2 text-on-surface font-bold">
          <List size={16} className="text-tertiary" />
          <h3 className="text-sm">Ledger Entries</h3>
        </div>
        <span className="text-xs font-semibold text-on-surface-variant tabular-nums">
          {rows.length} record{rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant/60">
            <Search size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-bold">No entries found</p>
            <p className="text-xs mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-lowest/80 text-[10px] uppercase tracking-widest text-on-surface-variant font-black sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-5 py-3 font-semibold border-b border-outline-variant/10 w-24">
                  Date
                </th>
                <th className="px-5 py-3 font-semibold border-b border-outline-variant/10 w-36">
                  Category
                </th>
                <th className="px-5 py-3 font-semibold border-b border-outline-variant/10">
                  Description
                </th>
                <th className="px-5 py-3 font-semibold border-b border-outline-variant/10 w-20 text-center">
                  Source
                </th>
                <th className="px-5 py-3 font-semibold border-b border-outline-variant/10 text-right w-36">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5 text-sm">
              {visibleRows.map((row) => (
                <tr
                  key={`${row.domain}-${row.id}`}
                  className="hover:bg-surface-container transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-3.5 text-on-surface-variant font-medium text-xs whitespace-nowrap tabular-nums">
                    {formatTransactionDate(row.date)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary-container/30 flex items-center justify-center text-sm shrink-0">
                        {row.emoji || "📁"}
                      </div>
                      <span className="font-semibold text-on-surface-variant text-xs truncate">
                        {row.categoryName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-on-surface truncate max-w-xs">
                    {row.description}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <SourceBadge domain={row.domain} amount={row.amount} />
                  </td>
                  <td
                    className={`px-5 py-3.5 text-right font-black whitespace-nowrap tabular-nums ${
                      row.amount >= 0 ? "text-emerald-400" : "text-on-surface"
                    }`}
                  >
                    {row.amount >= 0 ? "+" : "−"}
                    {formatCurrency(Math.abs(row.amount), currencyCode)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && rows.length > 0 && (
        isMobile ? (
          page < totalPages && (
            <div className="p-4 border-t border-outline-variant/10 shrink-0">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl transition-all group"
              >
                <span>Load More</span>
                <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )
        ) : (
          totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10 bg-surface-container-lowest/50 shrink-0">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-25 disabled:cursor-not-allowed transition-all group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Prev
              </button>

              <div className="flex items-center gap-1">
                {pageRange.map((p, i) =>
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
                  ),
                )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-25 disabled:cursor-not-allowed transition-all group"
              >
                Next
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )
        )
      )}
    </div>
  );
}
