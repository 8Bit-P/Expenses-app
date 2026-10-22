import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { CURRENCIES, DATE_FORMATS } from "../../../constants/preferences";
import type { Theme, Currency, DateFormat, Language } from "../../../types/preferences";
import { toast } from "sonner";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";
import { cn } from "../../../utils/cn";

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
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-colors",
        active ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface",
      )}
    >
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
      {label}
    </button>
  );
}

function PrefRow({
  label,
  description,
  control,
  children,
}: {
  label: string;
  description?: string;
  control?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-on-surface">{label}</p>
          {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
        </div>
        {control && <div className="shrink-0 sm:min-w-[200px] flex sm:justify-end">{control}</div>}
      </div>
      {children}
    </div>
  );
}

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
        language: localLanguage as Language,
      });
      toast.success(t("common.success"), {
        description: t("settings.preferences.syncDescription"),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      toast.error(t("common.error"), {
        description: (error as Error).message || t("settings.preferences.uploadError"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsGroup title={t("settings.preferences.title")}>
      <Panel flush>
        <div className="divide-y divide-outline-variant">
        {/* Language */}
        <PrefRow
          label={t("settings.preferences.language")}
          description={t("settings.preferences.languageDesc")}
          control={
            <CustomSelect
              value={localLanguage}
              options={[
                { value: "en", label: "English (US)" },
                { value: "es", label: "Español" },
              ]}
              onChange={(l) => setLocalLanguage(l as Language)}
              className="w-full sm:w-auto"
            />
          }
        />

        {/* Visual Theme */}
        <PrefRow
          label={t("settings.preferences.theme")}
          control={
            <div className="flex w-full sm:w-auto p-0.5 rounded-lg bg-surface-container border border-outline-variant">
              <ThemeButton
                value="light"
                current={theme}
                label={t("settings.preferences.themes.light")}
                icon="light_mode"
                onClick={() => setTheme("light")}
              />
              <ThemeButton
                value="dark"
                current={theme}
                label={t("settings.preferences.themes.dark")}
                icon="dark_mode"
                onClick={() => setTheme("dark")}
              />
              <ThemeButton
                value="system"
                current={theme}
                label={t("settings.preferences.themes.system")}
                icon="contrast"
                onClick={() => setTheme("system")}
              />
            </div>
          }
        />

        {/* Currency */}
        <PrefRow
          label={t("settings.preferences.currency")}
          description={t("settings.preferences.currencyDesc")}
          control={
            <CustomSelect
              value={localCurrency}
              options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
              onChange={(code) => setLocalCurrency(code as Currency)}
              className="w-full sm:w-auto"
            />
          }
        />

        {/* Date Format */}
        <PrefRow
          label={t("settings.preferences.dateFormat")}
          description={t("settings.preferences.dateFormatDesc")}
          control={
            <CustomSelect
              value={localDateFormat}
              options={DATE_FORMATS.map((f) => ({ value: f.value, label: f.label }))}
              onChange={(f) => setLocalDateFormat(f as DateFormat)}
              className="w-full sm:w-auto"
            />
          }
        />

        {/* Monthly Budget */}
        <PrefRow
          label={t("settings.preferences.monthlyBudget")}
          description={t("settings.preferences.budgetDesc")}
          control={
            <div className="relative w-full sm:w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant pointer-events-none">
                {currency.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="0.00"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest pl-8 pr-3 text-sm font-medium tabular-nums text-right text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors"
              />
            </div>
          }
        >
          {budgetLoading && (
            <p className="text-xs text-on-surface-variant mt-2 sm:text-right">{t("settings.preferences.loading")}</p>
          )}
          {monthlyBudget > 0 && (
            <p className="text-xs text-on-surface-variant mt-2 sm:text-right">
              {t("settings.preferences.activeBudget", {
                symbol: currency.symbol,
                amount: monthlyBudget.toLocaleString(undefined, { minimumFractionDigits: 2 }),
              })}
            </p>
          )}
        </PrefRow>
        </div>

        {/* Save bar: fixed above the bottom navigation on mobile, inline footer on desktop */}
        <div className="fixed bottom-[100px] left-0 w-full px-4 z-40 flex gap-2 md:static md:bottom-auto md:w-auto md:z-auto md:justify-end md:px-5 md:py-3.5 md:bg-surface-container-low md:rounded-b-2xl md:border-t md:border-outline-variant">
          <button
            onClick={() => {
              setBudgetInput(monthlyBudget > 0 ? monthlyBudget.toString() : "");
              setLocalCurrency(currency.code);
              setLocalDateFormat(dateFormat);
              setLocalLanguage(language);
            }}
            className={cn(
              "flex-1 md:flex-none h-10 md:h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition",
              !isDirty ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
            disabled={!isDirty || isSaving}
          >
            {t("common.reset")}
          </button>

          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={cn(
              "flex-[2] md:flex-none h-10 md:h-9 px-4 rounded-lg text-sm font-medium transition inline-flex items-center justify-center gap-1.5",
              isSaving
                ? "bg-primary text-on-primary opacity-60 cursor-wait"
                : isSaved
                  ? "bg-secondary text-on-secondary"
                  : isDirty
                    ? "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] shadow-lg md:shadow-none"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant cursor-not-allowed",
            )}
          >
            <span className={cn("material-symbols-outlined text-[18px]", isSaving && "animate-spin")}>
              {isSaving ? "sync" : isSaved ? "check_circle" : isDirty ? "save" : "check"}
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
      </Panel>
    </SettingsGroup>
  );
}
