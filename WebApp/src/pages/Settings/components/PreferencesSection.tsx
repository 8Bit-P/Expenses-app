import { useState } from "react";
import {
  useUserPreferences,
  CURRENCIES,
  type Theme,
  type Currency,
  type DateFormat,
} from "../../../context/UserPreferencesContext";

const DATE_FORMATS: { value: DateFormat; label: string }[] = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (EU)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
];

function ThemeButton({ value, current, label, icon, onClick }: {
  value: Theme; current: Theme; label: string; icon: string; onClick: () => void;
}) {
  const active = value === current;
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
        active
          ? "bg-surface-container-lowest text-primary shadow-sm"
          : "text-on-surface-variant hover:text-on-surface"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </button>
  );
}

export default function PreferencesSection() {
  const {
    theme, setTheme,
    currency, setCurrency,
    dateFormat, setDateFormat,
    monthlyBudget, setMonthlyBudget,
    budgetLoading,
  } = useUserPreferences();

  const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? monthlyBudget.toString() : "");
  const [budgetSaving, setBudgetSaving] = useState(false);
  const [budgetSaved, setBudgetSaved] = useState(false);

  const handleBudgetSave = async () => {
    const parsed = parseFloat(budgetInput);
    const amount = isNaN(parsed) ? 0 : parsed;
    setBudgetSaving(true);
    await setMonthlyBudget(amount);
    setBudgetSaving(false);
    setBudgetSaved(true);
    setTimeout(() => setBudgetSaved(false), 2000);
  };

  return (
    <section className="col-span-12 lg:col-span-5 bg-primary-container/10 rounded-xl p-8 border border-primary-container/20 space-y-6">
      <h4 className="text-lg font-bold font-headline flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary">tune</span>
        General &amp; Financial
      </h4>

      <div className="space-y-4">
        {/* Visual Theme */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm space-y-3">
          <span className="font-semibold text-on-surface text-sm">Visual Theme</span>
          <div className="flex bg-surface-container rounded-lg p-1 gap-1">
            <ThemeButton value="light" current={theme} label="Light" icon="light_mode" onClick={() => setTheme("light")} />
            <ThemeButton value="dark" current={theme} label="Dark" icon="dark_mode" onClick={() => setTheme("dark")} />
            <ThemeButton value="system" current={theme} label="System" icon="contrast" onClick={() => setTheme("system")} />
          </div>
        </div>

        {/* Currency */}
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm">
          <div>
            <span className="font-semibold text-on-surface text-sm">Currency</span>
            <p className="text-xs text-on-surface-variant mt-0.5">Used across all amounts</p>
          </div>
          <select
            className="bg-transparent border-none text-primary font-bold focus:ring-0 cursor-pointer outline-none text-sm text-right"
            value={currency.code}
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Date Format */}
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm">
          <div>
            <span className="font-semibold text-on-surface text-sm">Date Format</span>
            <p className="text-xs text-on-surface-variant mt-0.5">How dates are displayed</p>
          </div>
          <select
            className="bg-transparent border-none text-primary font-bold focus:ring-0 cursor-pointer outline-none text-sm text-right"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value as DateFormat)}
          >
            {DATE_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Monthly Budget */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-on-surface text-sm">Monthly Budget</span>
              <p className="text-xs text-on-surface-variant mt-0.5">Global spend limit for the month</p>
            </div>
            {budgetLoading && (
              <span className="text-xs text-on-surface-variant/50 font-medium">Loading…</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">
                {currency.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="0.00"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full bg-surface-container rounded-lg pl-8 pr-3 py-2.5 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/40 border-none"
              />
            </div>
            <button
              onClick={handleBudgetSave}
              disabled={budgetSaving}
              className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                budgetSaved
                  ? "bg-secondary/20 text-secondary"
                  : "bg-primary/10 hover:bg-primary/20 text-primary"
              } disabled:opacity-50`}
            >
              {budgetSaving ? "Saving…" : budgetSaved ? "✓ Saved" : "Save"}
            </button>
          </div>
          {monthlyBudget > 0 && (
            <p className="text-xs text-on-surface-variant/60 font-medium">
              Current: {currency.symbol}{monthlyBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}/month
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
