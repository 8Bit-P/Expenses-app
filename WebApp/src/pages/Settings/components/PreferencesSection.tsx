import { useEffect, useState } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { CURRENCIES, DATE_FORMATS } from "../../../constants/preferences";
import type { Theme, Currency, DateFormat } from "../../../types/preferences";

function ThemeButton({
  value,
  current,
  label,
  icon,
  onClick,
}: {
  value: Theme;
  current: Theme;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  const active = value === current;
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
        active ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </button>
  );
}

export default function PreferencesSection() {
  const { theme, setTheme, currency, setCurrency, dateFormat, monthlyBudget, updateFinancialSettings, budgetLoading } =
    useUserPreferences();

  const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? monthlyBudget.toString() : "");
  const [localCurrency, setLocalCurrency] = useState<Currency>(currency.code);
  const [localDateFormat, setLocalDateFormat] = useState<DateFormat>(dateFormat);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync local state when budget/currency/date changes from DB loading
  useEffect(() => {
    setBudgetInput(monthlyBudget > 0 ? monthlyBudget.toString() : "");
    setLocalCurrency(currency.code);
    setLocalDateFormat(dateFormat);
  }, [monthlyBudget, currency.code, dateFormat]);

  const handleSave = async () => {
    const parsed = parseFloat(budgetInput);
    const amount = isNaN(parsed) ? 0 : parsed;

    setIsSaving(true);
    try {
      await updateFinancialSettings({
        monthlyBudget: amount,
        currency: localCurrency,
        dateFormat: localDateFormat,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
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
          <div className="flex bg-surface-container rounded-lg mt-2 p-1 gap-1">
            <ThemeButton
              value="light"
              current={theme}
              label="Light"
              icon="light_mode"
              onClick={() => setTheme("light")}
            />
            <ThemeButton value="dark" current={theme} label="Dark" icon="dark_mode" onClick={() => setTheme("dark")} />
            <ThemeButton
              value="system"
              current={theme}
              label="System"
              icon="contrast"
              onClick={() => setTheme("system")}
            />
          </div>
        </div>

        {/* Currency */}
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm">
          <div>
            <span className="font-semibold text-on-surface text-sm">Currency</span>
            <p className="text-xs text-on-surface-variant mt-0.5">Used across all amounts</p>
          </div>
          <CustomSelect
            value={localCurrency}
            options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
            onChange={(code) => setLocalCurrency(code as Currency)}
          />
        </div>

        {/* Date Format */}
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm">
          <div>
            <span className="font-semibold text-on-surface text-sm">Date Format</span>
            <p className="text-xs text-on-surface-variant mt-0.5">How dates are displayed</p>
          </div>
          <CustomSelect
            value={localDateFormat}
            options={DATE_FORMATS.map((f) => ({ value: f.value, label: f.label }))}
            onChange={(f) => setLocalDateFormat(f as DateFormat)}
          />
        </div>

        {/* Monthly Budget */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-on-surface text-sm">Monthly Budget</span>
              <p className="text-xs text-on-surface-variant mt-0.5">Global spend limit for the month</p>
            </div>
            {budgetLoading && <span className="text-xs text-on-surface-variant/50 font-medium">Loading…</span>}
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
          </div>
          {monthlyBudget > 0 && (
            <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest mt-2 ml-1">
              Current active budget: {currency.symbol}
              {monthlyBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            isSaved 
              ? "bg-secondary/20 text-secondary border border-secondary/20" 
              : "bg-primary text-on-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          } disabled:opacity-50`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSaving ? "sync" : isSaved ? "check_circle" : "save"}
          </span>
          {isSaving ? "Saving Preferences…" : isSaved ? "Preferences Saved" : "Save All Changes"}
        </button>
      </div>
    </section>
  );
}
