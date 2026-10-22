import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Tag, ChevronDown, Check, CalendarRange, X, Landmark } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import type { TimeframeKey } from "../constants";
import { ALL_DOMAINS, TIMEFRAME_OPTIONS } from "../constants";
import type { DomainKey } from "../types";
import type { TransactionType } from "../../../types/expenses";
import { useCategories } from "../../../hooks/useCategories";
import { useAccounts } from "../../../hooks/useAccounts";

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
  selectedAccountIds: string[];
  setSelectedAccountIds: (val: string[] | ((prev: string[]) => string[])) => void;
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
  selectedAccountIds,
  setSelectedAccountIds,
  clearAllFilters,
  currencySymbol,
}: AdvancedFiltersProps) {
  const { t } = useTranslation();
  const [timeframeOpen, setTimeframeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { categories } = useCategories();
  const { accounts } = useAccounts();

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

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      return [...prev, id];
    });
  };

  const activeCategoryLabel = selectedCategoryIds.length > 0
    ? t("search.selectedCount", { count: selectedCategoryIds.length })
    : t("search.allCategories");

  const inputBase =
    "w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface tabular-nums placeholder:text-outline focus:outline-none focus:border-on-surface focus:ring-0";

  const triggerClass = (open: boolean) =>
    `w-full h-10 flex items-center justify-between gap-2 rounded-lg border bg-surface-container-lowest px-3 text-sm text-on-surface transition-colors ${
      open ? "border-on-surface" : "border-outline-variant hover:border-outline"
    }`;

  const menuClass =
    "mt-1.5 py-1 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden max-h-64 overflow-y-auto";

  const optionClass = (active: boolean) =>
    `w-full min-h-9 text-left px-3 py-1.5 text-sm transition-colors flex items-center justify-between gap-2 ${
      active ? "bg-surface-container-low text-on-surface font-medium" : "text-on-surface hover:bg-surface-container-low"
    }`;

  const chevron = (open: boolean) => (
    <ChevronDown
      size={15}
      className={`shrink-0 text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
    />
  );

  return (
    <Panel
      title={t("search.advancedFilters")}
      flush
      className="h-fit"
      bodyClassName="border-t border-outline-variant divide-y divide-outline-variant"
    >
      {/* Timeframe */}
      <FilterSection label={t("search.timeframe")}>
        <button
          type="button"
          onClick={() => setTimeframeOpen(!timeframeOpen)}
          aria-expanded={timeframeOpen}
          className={triggerClass(timeframeOpen)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Calendar size={15} className="shrink-0 text-on-surface-variant" />
            <span className="truncate">{activeTimeframeLabel}</span>
          </span>
          {chevron(timeframeOpen)}
        </button>
        {timeframeOpen && (
          <div className={menuClass}>
            {TIMEFRAME_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setTimeframe(opt.key);
                  setTimeframeOpen(false);
                }}
                className={optionClass(timeframe === opt.key)}
              >
                <span className="flex items-center gap-2">
                  {opt.key === "custom" && <CalendarRange size={14} className="text-on-surface-variant" />}
                  {t(`search.timeframes.${opt.key}`)}
                </span>
                {timeframe === opt.key && <Check size={14} className="shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* Custom date pickers (only shown when custom is selected) */}
        {timeframe === "custom" && (
          <div className="mt-3 space-y-2">
            <label className="block">
              <span className="eyebrow block mb-1">{t("search.from")}</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className={`${inputBase} px-3`}
              />
            </label>
            <label className="block">
              <span className="eyebrow block mb-1">{t("search.to")}</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className={`${inputBase} px-3`}
              />
            </label>
          </div>
        )}
      </FilterSection>

      {/* Amount Range */}
      <FilterSection label={t("search.amountRange")}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <span className="absolute inset-y-0 left-3 flex items-center text-outline text-xs pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="number"
              placeholder={t("search.min")}
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className={`${inputBase} pl-7 pr-2`}
            />
          </div>
          <span className="text-outline text-sm">–</span>
          <div className="relative flex-1 min-w-0">
            <span className="absolute inset-y-0 left-3 flex items-center text-outline text-xs pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="number"
              placeholder={t("search.max")}
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className={`${inputBase} pl-7 pr-2`}
            />
          </div>
        </div>
      </FilterSection>

      {/* Transaction Types */}
      <FilterSection label={t("search.transactionType")}>
        <div className="space-y-0.5">
          {(["income", "expense"] as TransactionType[]).map((type) => (
            <CheckRow
              key={type}
              checked={selectedTypes.includes(type)}
              label={t(`search.transactionTypes.${type}`)}
              onToggle={() => toggleType(type)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Domain Checkboxes */}
      <FilterSection label={t("search.domains")}>
        <div className="space-y-0.5">
          {ALL_DOMAINS.map((domain) => (
            <CheckRow
              key={domain}
              checked={activeDomains.has(domain)}
              label={t(`search.domainNames.${domain}`, { defaultValue: domain })}
              onToggle={() => toggleDomain(domain)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection label={t("search.category")}>
        <button
          type="button"
          onClick={() => setCategoryOpen(!categoryOpen)}
          aria-expanded={categoryOpen}
          className={triggerClass(categoryOpen)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Tag size={15} className="shrink-0 text-on-surface-variant" />
            <span className="truncate">{activeCategoryLabel}</span>
          </span>
          {chevron(categoryOpen)}
        </button>
        {categoryOpen && (
          <div className={menuClass}>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryIds([]);
                setCategoryOpen(false);
              }}
              className={optionClass(selectedCategoryIds.length === 0)}
            >
              {t("search.allCategories")}
              {selectedCategoryIds.length === 0 && <Check size={14} className="shrink-0" />}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  toggleCategory(cat.id);
                }}
                className={optionClass(selectedCategoryIds.includes(cat.id))}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{cat.emoji || "📁"}</span>
                  <span className="truncate">{cat.name}</span>
                </span>
                {selectedCategoryIds.includes(cat.id) && <Check size={14} className="shrink-0" />}
              </button>
            ))}
          </div>
        )}
        {/* Selected category chips */}
        {selectedCategoryIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {selectedCategoryIds.map((id) => {
              const cat = categories.find((c) => c.id === id);
              if (!cat) return null;
              return (
                <Chip key={id} onRemove={() => toggleCategory(id)}>
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.name}</span>
                </Chip>
              );
            })}
          </div>
        )}
      </FilterSection>

      {/* Account Filter — only shown when user has accounts */}
      {accounts.length > 0 && (
        <FilterSection label={t("accounts.filter.label", { defaultValue: "Account" })}>
          <button
            type="button"
            onClick={() => setAccountOpen(!accountOpen)}
            aria-expanded={accountOpen}
            className={triggerClass(accountOpen)}
          >
            <span className="flex items-center gap-2 min-w-0">
              <Landmark size={15} className="shrink-0 text-on-surface-variant" />
              <span className="truncate">
                {selectedAccountIds.length > 0
                  ? t("accounts.filter.selected", {
                      count: selectedAccountIds.length,
                      defaultValue: `${selectedAccountIds.length} selected`,
                    })
                  : t("accounts.filter.all", { defaultValue: "All Accounts" })}
              </span>
            </span>
            {chevron(accountOpen)}
          </button>
          {accountOpen && (
            <div className={menuClass}>
              <button
                type="button"
                onClick={() => {
                  setSelectedAccountIds([]);
                  setAccountOpen(false);
                }}
                className={optionClass(selectedAccountIds.length === 0)}
              >
                {t("accounts.filter.all", { defaultValue: "All Accounts" })}
                {selectedAccountIds.length === 0 && <Check size={14} className="shrink-0" />}
              </button>
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => toggleAccount(acc.id)}
                  className={optionClass(selectedAccountIds.includes(acc.id))}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: acc.color }} />
                    <span className="truncate">
                      {acc.icon || "🏦"} {acc.name}
                    </span>
                  </span>
                  {selectedAccountIds.includes(acc.id) && <Check size={14} className="shrink-0" />}
                </button>
              ))}
            </div>
          )}
          {/* Selected account chips */}
          {selectedAccountIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {selectedAccountIds.map((id) => {
                const acc = accounts.find((a) => a.id === id);
                if (!acc) return null;
                return (
                  <Chip key={id} onRemove={() => toggleAccount(id)}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: acc.color }} />
                    <span className="truncate">{acc.name}</span>
                  </Chip>
                );
              })}
            </div>
          )}
        </FilterSection>
      )}

      {/* Clear Filters */}
      <div className="px-5 py-4">
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
        >
          {t("search.clearFilters")}
        </button>
      </div>
    </Panel>
  );
}

function FilterSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="px-5 py-4">
      <p className="eyebrow mb-2">{label}</p>
      {children}
    </div>
  );
}

function CheckRow({ checked, label, onToggle }: { checked: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="group w-[calc(100%+0.75rem)] h-9 flex items-center gap-2.5 -mx-1.5 px-1.5 rounded-md text-left hover:bg-surface-container-low transition-colors"
    >
      <span
        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
          checked ? "border-primary bg-primary" : "border-outline group-hover:border-on-surface"
        }`}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-on-primary" />}
      </span>
      <span className={`text-sm ${checked ? "text-on-surface font-medium" : "text-on-surface-variant"}`}>{label}</span>
    </button>
  );
}

function Chip({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 h-6 pl-2 pr-0.5 max-w-full rounded-md bg-surface-container border border-outline-variant text-on-surface text-[11px] font-medium">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="w-5 h-5 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
      >
        <X size={12} />
      </button>
    </span>
  );
}

