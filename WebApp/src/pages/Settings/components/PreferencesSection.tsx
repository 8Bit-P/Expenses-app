import { useEffect, useState } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { CURRENCIES, DATE_FORMATS } from "../../../constants/preferences";
import type { Theme, Currency, DateFormat } from "../../../types/preferences";
import { toast } from "sonner";

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
  const { theme, setTheme, currency, dateFormat, monthlyBudget, updateFinancialSettings, budgetLoading } =
    useUserPreferences();

  const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? monthlyBudget.toString() : "");
  const [localCurrency, setLocalCurrency] = useState<Currency>(currency.code);
  const [localDateFormat, setLocalDateFormat] = useState<DateFormat>(dateFormat);
  const [localLanguage, setLocalLanguage] = useState("en");

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isDirty =
    budgetInput !== (monthlyBudget > 0 ? monthlyBudget.toString() : "") ||
    localCurrency !== currency.code ||
    localDateFormat !== dateFormat ||
    localLanguage !== "en";

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
      toast.success("Preferences updated", {
        description: "Your financial vault settings are now synchronized.",
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error: any) {
      toast.error("Save failed", {
        description: error.message || "Could not update your preferences.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
      <h4 className="text-lg font-bold font-headline flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary">tune</span>
        General &amp; Financial
      </h4>

      <div className="space-y-4">
        {/* Language */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/5">
          <div>
            <span className="font-semibold text-on-surface text-sm">Language</span>
            <p className="text-xs text-on-surface-variant mt-0.5">Interface display language</p>
          </div>
          <CustomSelect
            value={localLanguage}
            options={[
              { value: "en", label: "English (US)" },
              { value: "es", label: "Español" },
              { value: "fr", label: "Français" },
            ]}
            onChange={(l) => setLocalLanguage(l as string)}
          />
        </div>

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
        <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/5">
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
        <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/5">
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
        <div className="p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/5 space-y-3">
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

      {/* Sticky Save FAB on Mobile */}
      <div className="fixed bottom-[84px] left-0 w-full px-4 md:static md:bottom-auto md:px-0 z-40 md:flex md:justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`w-full md:w-auto px-8 py-4 md:py-3 rounded-2xl md:rounded-xl text-sm md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl md:shadow-xl ${
            isSaving
              ? "bg-primary/50 text-on-primary/50 cursor-wait"
              : isSaved
              ? "bg-secondary text-on-secondary shadow-secondary/20"
              : isDirty
              ? "bg-primary text-on-primary shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              : "bg-surface-container text-on-surface-variant/50 cursor-not-allowed opacity-80"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] md:text-[18px]">
            {isSaving ? "sync" : isSaved ? "check_circle" : isDirty ? "save_as" : "check"}
          </span>
          {isSaving ? "Syncing..." : isSaved ? "Updated" : isDirty ? "Save All Changes" : "No Changes"}
        </button>
      </div>
    </section>
  );
}
