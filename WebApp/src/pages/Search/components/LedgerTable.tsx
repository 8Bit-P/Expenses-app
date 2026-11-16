import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, TrendingUp, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { formatTransactionDate } from "../../../utils/dateFormatters";
import { formatCurrency } from "../../../utils/currency";
import type { LedgerRow } from "../types";
import { buildPageRange } from "../../Expenses/utils/pagination";
import { useIsMobile } from "../../../hooks/useIsMobile";
import TransactionModal from "../../Expenses/components/TransactionModal";
import { cn } from "../../../utils/cn";

interface LedgerTableProps {
  rows: LedgerRow[];
  loading: boolean;
  currencyCode: string;
  sortColumn: "date" | "amount";
  setSortColumn: (col: "date" | "amount") => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (dir: "asc" | "desc") => void;
}

// ── Source badge config ───────────────────────────────────────────────────────
function SourceBadge({ row }: { row: LedgerRow }) {
  const isIncome = row.domain === "Transactions" && row.raw?.type === "income";

  const config = isIncome
    ? { label: "INC", cls: "bg-secondary/10 text-secondary", icon: <TrendingUp size={10} /> }
    : row.domain === "Transactions"
      ? { label: "TXN", cls: "bg-surface-container text-on-surface-variant", icon: null }
      : row.domain === "Assets"
        ? { label: "AST", cls: "bg-tertiary/10 text-tertiary", icon: null }
        : { label: "REC", cls: "border border-outline-variant text-on-surface-variant", icon: null };

  return (
    <span
      className={`inline-flex items-center gap-1 h-5 px-1.5 rounded font-mono text-[11px] font-medium ${config.cls}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function CategoryTile({ emoji }: { emoji?: string | null }) {
  return (
    <span className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-sm shrink-0">
      {emoji || "📁"}
    </span>
  );
}

function Amount({ value, currencyCode }: { value: number; currencyCode: string }) {
  return (
    <span className={`font-medium tabular-nums whitespace-nowrap ${value >= 0 ? "text-secondary" : "text-on-surface"}`}>
      {value >= 0 ? "+" : "−"}
      {formatCurrency(Math.abs(value), currencyCode)}
    </span>
  );
}

const PAGE_SIZE = 20;

export function LedgerTable({
  rows,
  loading,
  currencyCode,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
}: LedgerTableProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<LedgerRow["raw"]>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset page when filters change
  const [prevRows, setPrevRows] = useState(rows);
  if (rows !== prevRows) {
    setPrevRows(rows);
    setPage(1);
  }

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  // Mobile uses "Load More" (shows all items up to current page), desktop uses traditional pagination
  const visibleRows = isMobile
    ? rows.slice(0, page * PAGE_SIZE)
    : rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageRange = buildPageRange(page, totalPages);

  const toggleSort = (col: "date" | "amount") => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection("desc"); // Default to desc when switching
    }
  };

  const openRow = (row: LedgerRow) => {
    if (row.domain === "Transactions") {
      setSelectedTx(row.raw);
      setIsModalOpen(true);
    }
  };

  const sortIcon = (col: "date" | "amount") =>
    sortColumn === col ? (
      sortDirection === "asc" ? (
        <ChevronUp size={13} className="text-on-surface" />
      ) : (
        <ChevronDown size={13} className="text-on-surface" />
      )
    ) : (
      <ChevronDown size={13} className="opacity-0 group-hover:opacity-60 transition-opacity" />
    );

  const ariaSort = (col: "date" | "amount") =>
    sortColumn === col ? (sortDirection === "asc" ? "ascending" : "descending") : undefined;

  const thBase = "eyebrow h-10 px-4 font-medium border-b border-outline-variant whitespace-nowrap";

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col min-w-0 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-5 h-14 border-b border-outline-variant shrink-0">
        <h2 className="text-[15px] font-semibold text-on-surface">{t("search.ledger.title")}</h2>
        <span className="text-xs text-on-surface-variant tabular-nums">
          {t("search.ledger.recordsCount", { count: rows.length, suffix: rows.length !== 1 ? "s" : "" })}
        </span>
      </header>

      <div className="flex-1 min-w-0 overflow-x-auto">
        {loading ? (
          <div className="divide-y divide-outline-variant" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 h-12 px-5">
                <div className="h-3 w-16 animate-pulse bg-surface-container rounded" />
                <div className="h-7 w-7 animate-pulse bg-surface-container rounded-md" />
                <div className="h-3 flex-1 animate-pulse bg-surface-container rounded" />
                <div className="h-3 w-20 animate-pulse bg-surface-container rounded" />
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-14 px-6 text-center">
            <Search size={20} className="text-outline mb-1" />
            <p className="text-sm font-medium text-on-surface">{t("search.ledger.noEntries")}</p>
            <p className="text-xs text-on-surface-variant">{t("search.ledger.noEntriesDesc")}</p>
          </div>
        ) : isMobile ? (
          /* ── Mobile: compact rows ─────────────────────────────────────────── */
          <ul className="divide-y divide-outline-variant">
            {visibleRows.map((row) => {
              const clickable = row.domain === "Transactions";
              return (
                <li key={`${row.domain}-${row.id}`}>
                  <div
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={() => openRow(row)}
                    onKeyDown={(e) => {
                      if (clickable && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        openRow(row);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 min-h-14 transition-colors ${
                      clickable ? "cursor-pointer active:bg-surface-container-low" : "cursor-default"
                    }`}
                  >
                    <CategoryTile emoji={row.emoji} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{row.description}</p>
                      <p className="text-xs text-on-surface-variant truncate tabular-nums mt-0.5">
                        {formatTransactionDate(row.date)} · {row.categoryName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm">
                        <Amount value={row.amount} currencyCode={currencyCode} />
                      </span>
                      <SourceBadge row={row} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          /* ── Desktop: table ───────────────────────────────────────────────── */
          <table className="w-full min-w-[720px] text-left border-collapse table-fixed">
            <thead className="sticky top-0 z-10 bg-surface-container-low">
              <tr>
                <th className={cn(thBase, "w-32 p-0")} aria-sort={ariaSort("date")}>
                  <button
                    type="button"
                    onClick={() => toggleSort("date")}
                    className="group eyebrow w-full h-10 px-4 flex items-center gap-1 hover:text-on-surface transition-colors"
                  >
                    {t("search.ledger.columns.date")}
                    {sortIcon("date")}
                  </button>
                </th>
                <th className={`${thBase} w-44`}>{t("search.ledger.columns.category")}</th>
                <th className={thBase}>{t("search.ledger.columns.description")}</th>
                <th className={`${thBase} w-24 text-center`}>{t("search.ledger.columns.source")}</th>
                <th className={cn(thBase, "w-40 p-0")} aria-sort={ariaSort("amount")}>
                  <button
                    type="button"
                    onClick={() => toggleSort("amount")}
                    className="group eyebrow w-full h-10 px-4 flex items-center justify-end gap-1 hover:text-on-surface transition-colors"
                  >
                    {t("search.ledger.columns.amount")}
                    {sortIcon("amount")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-[13px]">
              {visibleRows.map((row) => (
                <tr
                  key={`${row.domain}-${row.id}`}
                  onClick={() => openRow(row)}
                  className={`h-12 hover:bg-surface-container-low transition-colors ${
                    row.domain === "Transactions" ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <td className="px-4 text-on-surface-variant whitespace-nowrap tabular-nums">
                    {formatTransactionDate(row.date)}
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <CategoryTile emoji={row.emoji} />
                      <span className="text-on-surface-variant truncate">{row.categoryName}</span>
                    </div>
                  </td>
                  <td className="px-4 font-medium text-on-surface truncate">{row.description}</td>
                  <td className="px-4 text-center">
                    <SourceBadge row={row} />
                  </td>
                  <td className="px-4 text-right">
                    <Amount value={row.amount} currencyCode={currencyCode} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading &&
        rows.length > 0 &&
        (isMobile
          ? page < totalPages && (
              <div className="p-3 border-t border-outline-variant shrink-0">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full h-10 flex items-center justify-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
                >
                  {t("search.ledger.pagination.loadMore")}
                  <ChevronDown size={15} className="text-on-surface-variant" />
                </button>
              </div>
            )
          : totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 px-4 h-14 border-t border-outline-variant shrink-0">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={14} />
                  {t("search.ledger.pagination.prev")}
                </button>

                <div className="flex items-center gap-1">
                  {pageRange.map((p, i) =>
                    p === "..." ? (
                      <span key={`el-${i}`} className="w-8 text-center text-xs text-outline select-none">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        aria-current={p === page ? "page" : undefined}
                        className={`min-w-8 h-8 px-1 rounded-md text-xs font-medium tabular-nums transition-colors ${
                          p === page
                            ? "bg-primary text-on-primary"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
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
                  className="flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  {t("search.ledger.pagination.next")}
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
      />
    </section>
  );
}
