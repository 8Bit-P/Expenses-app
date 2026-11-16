import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useLedgerData } from "./hooks/useLedgerData";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { ALL_DOMAINS } from "./constants";
import type { TimeframeKey } from "./constants";
import type { DomainKey } from "./types";
import type { TransactionType } from "../../types/expenses";
import { SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SearchHeader } from "./components/SearchHeader";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { SummaryTrends } from "./components/SummaryTrends";
import { LedgerTable } from "./components/LedgerTable";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { AccountsBreakdown } from "./components/AccountsBreakdown";

export default function SearchResults() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState(query);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [timeframe, setTimeframe] = useState<TimeframeKey>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [activeDomains, setActiveDomains] = useState<Set<DomainKey>>(new Set(["Transactions"]));
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // ── Sort state ──────────────────────────────────────────────────────────────
  const [sortColumn, setSortColumn] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // ── User preferences ────────────────────────────────────────────────────────
  const { currency } = useUserPreferences();

  // ── Data hook ───────────────────────────────────────────────────────────────
  const { rows, loading, totalSpent, totalIncome, netFlow, chartData, categoryBreakdown } = useLedgerData({
    query,
    timeframe,
    activeDomains,
    minAmount,
    maxAmount,
    selectedCategoryIds,
    selectedTypes,
    selectedAccountIds,
    sortColumn,
    sortDirection,
    customStartDate: customStartDate || undefined,
    customEndDate: customEndDate || undefined,
  });

  // ── Toggle domain ───────────────────────────────────────────────────────────
  const toggleDomain = useCallback((domain: DomainKey) => {
    setActiveDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) {
        if (next.size > 1) next.delete(domain);
      } else {
        next.add(domain);
      }
      return next;
    });
  }, []);

  // ── Clear actions ───────────────────────────────────────────────────────────
  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setTimeframe("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setActiveDomains(new Set(ALL_DOMAINS));
    setMinAmount("");
    if (maxAmount) setMaxAmount("");
    setSelectedCategoryIds([]);
    setSelectedTypes([]);
    setSelectedAccountIds([]);
    clearSearch();
  }, [clearSearch, maxAmount]);

  const handleMobileSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams);
      if (mobileQuery.trim()) {
        params.set("q", mobileQuery.trim());
      } else {
        params.delete("q");
      }
      setSearchParams(params);
    },
    [mobileQuery, searchParams, setSearchParams],
  );

  const filters = (
    <AdvancedFilters
      timeframe={timeframe}
      setTimeframe={setTimeframe}
      customStartDate={customStartDate}
      setCustomStartDate={setCustomStartDate}
      customEndDate={customEndDate}
      setCustomEndDate={setCustomEndDate}
      activeDomains={activeDomains}
      toggleDomain={toggleDomain}
      minAmount={minAmount}
      setMinAmount={setMinAmount}
      maxAmount={maxAmount}
      setMaxAmount={setMaxAmount}
      selectedCategoryIds={selectedCategoryIds}
      setSelectedCategoryIds={setSelectedCategoryIds}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      selectedAccountIds={selectedAccountIds}
      setSelectedAccountIds={setSelectedAccountIds}
      clearAllFilters={clearAllFilters}
      currencySymbol={currency.symbol}
    />
  );

  return (
    <div className="w-full space-y-6">
      <SearchHeader query={query} rowsCount={rows.length} clearSearch={clearSearch} />

      {/* ── Mobile-only: search bar + collapsible filters ───────────────────── */}
      <div className="space-y-3 lg:hidden">
        <form onSubmit={handleMobileSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
            <input
              type="search"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest pl-9 pr-9 text-sm text-on-surface placeholder:text-outline outline-none focus:border-on-surface focus:ring-0"
            />
            {mobileQuery && (
              <button
                type="button"
                onClick={() => {
                  setMobileQuery("");
                  clearSearch();
                }}
                aria-label={t("search.clearSearch")}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="shrink-0 h-10 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
          >
            {t("search.placeholder").split(" ")[0]}
          </button>
        </form>

        <button
          onClick={() => setMobileFiltersOpen((o) => !o)}
          aria-expanded={mobileFiltersOpen}
          className={`w-full h-10 flex items-center justify-between px-3.5 rounded-lg border bg-surface-container-lowest text-sm font-medium transition-colors ${
            mobileFiltersOpen
              ? "border-on-surface text-on-surface"
              : "border-outline-variant text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-on-surface-variant" />
            {t("search.advancedFilters")}
          </span>
          <ChevronDown
            size={16}
            className={`text-on-surface-variant transition-transform duration-200 ${mobileFiltersOpen ? "rotate-180" : ""}`}
          />
        </button>

        {mobileFiltersOpen && filters}
      </div>

      {/* ── Filters rail (desktop) + content stack ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl">
          {filters}
        </aside>

        <section className="lg:col-span-9 flex flex-col gap-5 min-w-0">
          <SummaryTrends
            totalSpent={totalSpent}
            totalIncome={totalIncome}
            netFlow={netFlow}
            currencyCode={currency.code}
            chartData={chartData}
          />

          <LedgerTable
            rows={rows}
            loading={loading}
            currencyCode={currency.code}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />

          <CategoryBreakdown data={categoryBreakdown} currencyCode={currency.code} totalSpent={totalSpent} />
          <AccountsBreakdown currencyCode={currency.code} />
        </section>
      </div>
    </div>
  );
}

