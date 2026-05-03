import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useLedgerData } from "./hooks/useLedgerData";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { ALL_DOMAINS } from "./constants";
import type { TimeframeKey } from "./constants";
import type { DomainKey } from "./types";
import type { TransactionType } from "../../types/expenses";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SearchHeader } from "./components/SearchHeader";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { SummaryTrends } from "./components/SummaryTrends";
import { LedgerTable } from "./components/LedgerTable";

export default function SearchResults() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState(query);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [timeframe, setTimeframe] = useState<TimeframeKey>("this_month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [activeDomains, setActiveDomains] = useState<Set<DomainKey>>(new Set(ALL_DOMAINS));
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>([]);
  
  // ── Sort state ──────────────────────────────────────────────────────────────
  const [sortColumn, setSortColumn] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // ── User preferences ────────────────────────────────────────────────────────
  const { currency } = useUserPreferences();

  // ── Data hook ───────────────────────────────────────────────────────────────
  const { rows, loading, totalSpent, totalIncome, netFlow, chartData } = useLedgerData({
    query,
    timeframe,
    activeDomains,
    minAmount,
    maxAmount,
    selectedCategoryIds,
    selectedTypes,
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
    setTimeframe("this_month");
    setCustomStartDate("");
    setCustomEndDate("");
    setActiveDomains(new Set(ALL_DOMAINS));
    setMinAmount("");
    maxAmount && setMaxAmount("");
    setSelectedCategoryIds([]);
    setSelectedTypes([]);
    clearSearch();
  }, [clearSearch, maxAmount]);

  const handleMobileSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (mobileQuery.trim()) {
      params.set("q", mobileQuery.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  }, [mobileQuery, searchParams, setSearchParams]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      {/* Header */}
      <SearchHeader query={query} rowsCount={rows.length} clearSearch={clearSearch} />

      {/* ── Mobile-only: search bar ─────────────────────────────────────────── */}
      <form onSubmit={handleMobileSearch} className="flex items-center gap-2 mb-4 lg:hidden">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" />
          <input
            type="search"
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/30"
          />
          {mobileQuery && (
            <button
              type="button"
              onClick={() => { setMobileQuery(""); clearSearch(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="shrink-0 px-4 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl transition-all active:scale-95"
        >
          {t("search.placeholder").split(" ")[0]}
        </button>
      </form>

      {/* ── Mobile-only: Collapsible filter toggle ─────────────────────────── */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
            mobileFiltersOpen
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant"
          }`}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={15} />
            {t("search.advancedFilters")}
          </span>
          <span className={`transition-transform duration-200 ${mobileFiltersOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        {/* Collapsible filter panel */}
        <div className={`overflow-hidden transition-all duration-300 ${mobileFiltersOpen ? "max-h-[1200px] mt-3" : "max-h-0"}`}>
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-4">
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
              clearAllFilters={clearAllFilters}
              currencySymbol={currency.symbol}
            />
          </div>
        </div>
      </div>

      {/* ── 2-Column Grid Layout (desktop) / stacked (mobile) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Advanced Filters — desktop only */}
        <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent pr-2 space-y-6">
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
            clearAllFilters={clearAllFilters}
            currencySymbol={currency.symbol}
          />
        </aside>

        {/* Right Column: Content Stack */}
        <section className="lg:col-span-9 flex flex-col gap-6">
          {/* KPI Cards + Summary Chart */}
          <SummaryTrends
            totalSpent={totalSpent}
            totalIncome={totalIncome}
            netFlow={netFlow}
            currencyCode={currency.code}
            chartData={chartData}
          />

          {/* High-Density Data Table */}
          <LedgerTable
            rows={rows}
            loading={loading}
            currencyCode={currency.code}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </section>
      </div>
    </div>
  );
}
