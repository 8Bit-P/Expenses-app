import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useLedgerData } from "./hooks/useLedgerData";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { ALL_DOMAINS } from "./constants";
import type { TimeframeKey } from "./constants";
import type { DomainKey } from "./types";

import { SearchHeader } from "./components/SearchHeader";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { SummaryTrends } from "./components/SummaryTrends";
import { LedgerTable } from "./components/LedgerTable";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // ── Filter state ────────────────────────────────────────────────────────────
  const [timeframe, setTimeframe] = useState<TimeframeKey>("this_month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [activeDomains, setActiveDomains] = useState<Set<DomainKey>>(new Set(ALL_DOMAINS));
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "">("");

  // ── User preferences ────────────────────────────────────────────────────────
  const { currency } = useUserPreferences();

  // ── Data hook ───────────────────────────────────────────────────────────────
  const { rows, loading, totalSpent, totalIncome, netFlow, chartData } = useLedgerData({
    query,
    timeframe,
    activeDomains,
    minAmount,
    maxAmount,
    selectedCategoryId,
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
    setSelectedCategoryId("");
    clearSearch();
  }, [clearSearch, maxAmount]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      {/* Header */}
      <SearchHeader query={query} rowsCount={rows.length} clearSearch={clearSearch} />

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Advanced Filters */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 h-fit space-y-6">
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
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
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
          <LedgerTable rows={rows} loading={loading} currencyCode={currency.code} />
        </section>
      </div>
    </div>
  );
}
