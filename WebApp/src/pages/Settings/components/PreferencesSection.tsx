import { useEffect, useState } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { CURRENCIES, DATE_FORMATS } from "../../../constants/preferences";
import type { Theme, Currency, DateFormat, Language } from "../../../types/preferences";
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

import { useTranslation } from "react-i18next";

export default function PreferencesSection() {
  const { t } = useTranslation();
  const { 
    theme, 
    setTheme, 
    language,
    currency, 
    dateFormat, 
    monthlyBudget, 
    updateFinancialSettings, 
    budgetLoading 
  } = useUserPreferences();

  const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? monthlyBudget.toString() : "");
  const [localCurrency, setLocalCurrency] = useState<Currency>(currency.code);
  const [localDateFormat, setLocalDateFormat] = useState<DateFormat>(dateFormat);
  const [localLanguage, setLocalLanguage] = useState(language);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isDirty =
    budgetInput !== (monthlyBudget > 0 ? monthlyBudget.toString() : "") ||
    localCurrency !== currency.code ||
    localDateFormat !== dateFormat ||
    localLanguage !== language;

  // Sync local state when budget/currency/date/language changes from DB loading
  useEffect(() => {
    setBudgetInput(monthlyBudget > 0 ? monthlyBudget.toString() : "");
    setLocalCurrency(currency.code);
    setLocalDateFormat(dateFormat);
    setLocalLanguage(language);
  }, [monthlyBudget, currency.code, dateFormat, language]);

  const handleSave = async () => {
    const parsed = parseFloat(budgetInput);
    const amount = isNaN(parsed) ? 0 : parsed;

    setIsSaving(true);
    try {
      await updateFinancialSettings({
        monthlyBudget: amount,
        currency: localCurrency,
        dateFormat: localDateFormat,
        language: localLanguage as any,
      });
      toast.success(t("common.success"), {
        description: t("settings.preferences.syncDescription"),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error: any) {
      toast.error(t("common.error"), {
        description: error.message || t("settings.preferences.uploadError"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
      <h4 className="text-lg font-bold font-headline flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary">tune</span>
        {t("settings.preferences.title")}
      </h4>

      <div className="space-y-4">
        {/* Language */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/5">
          <div>
            <span className="font-semibold text-on-surface text-sm">{t("settings.preferences.language")}</span>
            <p className="text-xs text-on-surface-variant mt-0.5">{t("settings.preferences.languageDesc")}</p>
          </div>
          <CustomSelect
            value={localLanguage}
            options={[
              { value: "en", label: "English (US)" },
              { value: "es", label: "Español" },
            ]}
            onChange={(l) => setLocalLanguage(l as Language)}
          />
        </div>

        {/* Visual Theme */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm space-y-3">
          <span className="font-semibold text-on-surface text-sm">{t("settings.preferences.theme")}</span>
          <div className="flex bg-surface-container rounded-lg mt-2 p-1 gap-1">
            <ThemeButton
              value="light"
              current={theme}
              label={t("settings.preferences.themes.light")}
              icon="light_mode"
              onClick={() => setTheme("light")}
            />
            <ThemeButton value="dark" current={theme} label={t("settings.preferences.themes.dark")} icon="dark_mode" onClick={() => setTheme("dark")} />
            <ThemeButton
              value="system"
              current={theme}
              label={t("settings.preferences.themes.system")}
              icon="contrast"
              onClick={() => setTheme("system")}
            />
          </div>
        </div>

        {/* Currency */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/5">
          <div>
            <span className="font-semibold text-on-surface text-sm">{t("settings.preferences.currency")}</span>
            <p className="text-xs text-on-surface-variant mt-0.5">{t("settings.preferences.currencyDesc")}</p>
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
            <span className="font-semibold text-on-surface text-sm">{t("settings.preferences.dateFormat")}</span>
            <p className="text-xs text-on-surface-variant mt-0.5">{t("settings.preferences.dateFormatDesc")}</p>
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
              <span className="font-semibold text-on-surface text-sm">{t("settings.preferences.monthlyBudget")}</span>
              <p className="text-xs text-on-surface-variant mt-0.5">{t("settings.preferences.budgetDesc")}</p>
            </div>
            {budgetLoading && <span className="text-xs text-on-surface-variant/50 font-medium">{t("settings.preferences.loading")}</span>}
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
              {t("settings.preferences.activeBudget", { symbol: currency.symbol, amount: monthlyBudget.toLocaleString(undefined, { minimumFractionDigits: 2 }) })}
            </p>
          )}
        </div>
      </div>

      {/* Sticky Save FAB on Mobile - Elevated to clear the bottom navigation bar */}
      <div className="fixed bottom-[100px] left-0 w-full px-4 md:static md:bottom-auto md:px-0 z-40 md:flex md:items-center md:justify-end gap-3 transition-all duration-500 ease-out animate-in slide-in-from-bottom-4">
          <button
            onClick={() => {
              setBudgetInput(monthlyBudget > 0 ? monthlyBudget.toString() : "");
              setLocalCurrency(currency.code);
              setLocalDateFormat(dateFormat);
              setLocalLanguage(language);
            }}
            className={`flex-1 md:flex-none px-6 py-4 md:py-3 rounded-2xl md:rounded-xl text-sm md:text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-all ${!isDirty ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            disabled={!isDirty || isSaving}
          >
            {t("common.reset")}
          </button>
          
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`flex-[2] md:flex-none px-8 py-4 md:py-3 rounded-2xl md:rounded-xl text-sm md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl md:shadow-xl ${
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
            {isSaving 
              ? t("common.syncing") 
              : isSaved 
              ? t("common.updated") 
              : isDirty 
              ? t("common.save") 
              : t("common.noChanges")}
          </button>
        </div>
    </section>
  );
}
