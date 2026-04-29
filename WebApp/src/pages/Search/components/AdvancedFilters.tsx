import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, Calendar, Tag, ChevronDown, Check, CalendarRange, X } from "lucide-react";
import type { TimeframeKey } from "../constants";
import { ALL_DOMAINS, TIMEFRAME_OPTIONS } from "../constants";
import type { DomainKey } from "../types";
import type { TransactionType } from "../../../types/expenses";
import { useCategories } from "../../../hooks/useCategories";

interface AdvancedFiltersProps {
  timeframe: TimeframeKey;
  setTimeframe: (val: TimeframeKey) => void;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
  activeDomains: Set<DomainKey>;
  toggleDomain: (domain: DomainKey) => void;
  minAmount: string;
  setMinAmount: (val: string) => void;
  maxAmount: string;
  setMaxAmount: (val: string) => void;
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (val: string[] | ((prev: string[]) => string[])) => void;
  selectedTypes: TransactionType[];
  setSelectedTypes: (val: TransactionType[] | ((prev: TransactionType[]) => TransactionType[])) => void;
  clearAllFilters: () => void;
  currencySymbol: string;
}

export function AdvancedFilters({
  timeframe,
  setTimeframe,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  activeDomains,
  toggleDomain,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  selectedCategoryIds,
  setSelectedCategoryIds,
  selectedTypes,
  setSelectedTypes,
  clearAllFilters,
  currencySymbol,
}: AdvancedFiltersProps) {
  const { t } = useTranslation();
  const [timeframeOpen, setTimeframeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const { categories } = useCategories();

  const activeTimeframeLabel = t(`search.timeframes.${timeframe}`, {
    defaultValue: TIMEFRAME_OPTIONS.find((o) => o.key === timeframe)?.label ?? t("search.timeframes.this_month"),
  });

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      return [...prev, id];
    });
  };

  const toggleType = (type: TransactionType) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      return [...prev, type];
    });
  };

  const activeCategoryLabel = selectedCategoryIds.length > 0
    ? t("search.selectedCount", { count: selectedCategoryIds.length })
    : t("search.allCategories");

  const inputBase =
    "w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-2 text-sm text-on-surface focus:outline-none focus:border-primary/50";

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex flex-col h-fit overflow-visible">
      <div className="flex items-center gap-2 mb-6 text-on-surface font-bold">
        <Filter size={18} className="text-primary" />
        <h3>{t("search.advancedFilters")}</h3>
      </div>

      <div className="space-y-6 flex-1">
        {/* Timeframe */}
        <div>
          <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            {t("search.timeframe")}
          </h4>
          <div className="relative w-full">
            <button
              onClick={() => setTimeframeOpen(!timeframeOpen)}
              className="w-full flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:border-primary/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-on-surface-variant" />
                {activeTimeframeLabel}
              </span>
              <ChevronDown
                size={14}
                className={`text-on-surface-variant transition-transform ${timeframeOpen ? "rotate-180" : ""}`}
              />
            </button>
            {timeframeOpen && (
              <div className="mt-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent">
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setTimeframe(opt.key);
                      setTimeframeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                      timeframe === opt.key
                        ? "text-primary bg-primary-container/20"
                        : "text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {opt.key === "custom" && <CalendarRange size={14} className="text-on-surface-variant" />}
                      {t(`search.timeframes.${opt.key}`)}
                    </span>
                    {timeframe === opt.key && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom date pickers (only shown when custom is selected) */}
          {timeframe === "custom" && (
            <div className="mt-3 space-y-2">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                  {t("search.from")}
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className={`${inputBase} px-3`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                  {t("search.to")}
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className={`${inputBase} px-3`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Amount Range */}
        <div>
          <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            {t("search.amountRange")}
          </h4>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-on-surface-variant/50 text-xs">
                {currencySymbol}
              </span>
              <input
                type="number"
                placeholder={t("search.min")}
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className={`${inputBase} pl-6 pr-2`}
              />
            </div>
            <span className="text-on-surface-variant/50">–</span>
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-on-surface-variant/50 text-xs">
                {currencySymbol}
              </span>
              <input
                type="number"
                placeholder={t("search.max")}
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className={`${inputBase} pl-6 pr-2`}
              />
            </div>
          </div>
        </div>

        {/* Transaction Types */}
        <div>
          <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-3">
            {t("search.transactionType")}
          </h4>
          <div className="space-y-3">
            {(["income", "expense", "transfer"] as TransactionType[]).map((type) => {
              const isActive = selectedTypes.includes(type);
              return (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleType(type);
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      isActive
                        ? "border-primary bg-primary"
                        : "border-outline-variant/50 group-hover:border-primary"
                    }`}
                  >
                    {isActive && <Check size={10} className="text-on-primary" />}
                  </div>
                  <span
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? "text-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    {t(`search.transactionTypes.${type}`)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Domain Checkboxes */}
        <div>

          <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-3">
            {t("search.domains")}
          </h4>
          <div className="space-y-3">
            {ALL_DOMAINS.map((domain) => {
              const isActive = activeDomains.has(domain);
              return (
                <label
                  key={domain}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDomain(domain);
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      isActive
                        ? "border-primary bg-primary"
                        : "border-outline-variant/50 group-hover:border-primary"
                    }`}
                  >
                    {isActive && <Check size={10} className="text-on-primary" />}
                  </div>
                  <span
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? "text-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    {t(`search.domainNames.${domain}`, { defaultValue: domain })}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Category */}
        <div>
          <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            {t("search.category")}
          </h4>
          <div className="relative w-full">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:border-primary/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-on-surface-variant">
                <Tag size={16} />
                {activeCategoryLabel}
              </span>
              <ChevronDown
                size={14}
                className={`text-on-surface-variant transition-transform ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>
            {categoryOpen && (
              <div className="mt-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent">
                <button
                  onClick={() => {
                    setSelectedCategoryIds([]);
                    setCategoryOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                    selectedCategoryIds.length === 0
                      ? "text-primary bg-primary-container/20"
                      : "text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {t("search.allCategories")}
                  {selectedCategoryIds.length === 0 && <Check size={14} />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      toggleCategory(cat.id);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                      selectedCategoryIds.includes(cat.id)
                        ? "text-primary bg-primary-container/20"
                        : "text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji || "📁"}</span>
                      {cat.name}
                    </span>
                    {selectedCategoryIds.includes(cat.id) && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Selected Categories Pills */}
          {selectedCategoryIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCategoryIds.map((id) => {
                const cat = categories.find((c) => c.id === id);
                if (!cat) return null;
                return (
                  <div
                    key={id}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[11px] font-bold"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                    <button
                      onClick={() => toggleCategory(id)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      <div className="pt-6 mt-6 border-t border-outline-variant/10">
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        >
          {t("search.clearFilters")}
        </button>
      </div>
    </div>
  );
}
