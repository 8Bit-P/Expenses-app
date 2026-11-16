import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { NumberStepper } from "../../../components/ui/NumberStepper";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";
import { cn } from "../../../utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
  disabled?: boolean;
}

function Toggle({ checked, onChange, color = "bg-primary", disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className={cn(
        "w-9 h-5 rounded-full relative transition-colors shrink-0",
        checked ? color : "bg-surface-container-highest",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}

interface NotifRowProps {
  icon: string;
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

function NotifRow({ icon, title, subtitle, checked, onToggle, children, disabled = false }: NotifRowProps) {
  const { t } = useTranslation();
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="material-symbols-outlined text-[20px] mt-px text-on-surface-variant">{icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn("text-sm font-medium", disabled ? "text-on-surface-variant" : "text-on-surface")}>
                {title}
              </p>
              {disabled && (
                <span className="inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium bg-surface-container text-on-surface-variant border border-outline-variant">
                  {t("settings.notifications.soon")}
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="pt-0.5">
          <Toggle checked={checked} onChange={onToggle} disabled={disabled} />
        </div>
      </div>
      {!disabled && checked && children && <div className="ml-8 mt-3">{children}</div>}
    </div>
  );
}

export default function NotificationsSection() {
  const { t } = useTranslation();
  const { notifications, setNotifications, currency } = useUserPreferences();

  return (
    <SettingsGroup title={t("settings.notifications.title")}>
      <Panel flush bodyClassName="divide-y divide-outline-variant">
        {/* Budget Threshold Alerts */}
        <NotifRow
          icon="savings"
          title={t("settings.notifications.budgetAlerts.title")}
          subtitle={t("settings.notifications.budgetAlerts.desc")}
          checked={notifications.budgetThresholdAlerts}
          onToggle={() => setNotifications({ budgetThresholdAlerts: !notifications.budgetThresholdAlerts })}
          disabled
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">{t("settings.notifications.budgetAlerts.warnAt")}</span>
            <NumberStepper
              value={notifications.budgetThresholdPct}
              onChange={(v) => setNotifications({ budgetThresholdPct: v })}
              min={10}
              max={100}
              step={5}
              suffix="%"
            />
            <span className="text-xs text-on-surface-variant">{t("settings.notifications.budgetAlerts.ofBudget")}</span>
          </div>
        </NotifRow>

        {/* Large Transaction Radar */}
        <NotifRow
          icon="radar"
          title={t("settings.notifications.largeTransaction.title")}
          subtitle={t("settings.notifications.largeTransaction.desc")}
          checked={notifications.largeTransactionRadar}
          onToggle={() => setNotifications({ largeTransactionRadar: !notifications.largeTransactionRadar })}
          disabled
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">
              {t("settings.notifications.largeTransaction.alertAbove")}
            </span>
            <NumberStepper
              value={notifications.largeTransactionAmount}
              onChange={(v) => setNotifications({ largeTransactionAmount: v })}
              min={10}
              step={10}
              prefix={currency.symbol}
            />
          </div>
        </NotifRow>

        {/* Weekly Financial Digest */}
        <NotifRow
          icon="calendar_month"
          title={t("settings.notifications.weeklyDigest.title")}
          subtitle={t("settings.notifications.weeklyDigest.desc")}
          checked={notifications.weeklyDigest}
          onToggle={() => setNotifications({ weeklyDigest: !notifications.weeklyDigest })}
          disabled
        />

        {/* Tracking Reminder */}
        <NotifRow
          icon="edit_notifications"
          title={t("settings.notifications.trackingReminder.title")}
          subtitle={t("settings.notifications.trackingReminder.desc")}
          checked={notifications.trackingReminder}
          onToggle={() => setNotifications({ trackingReminder: !notifications.trackingReminder })}
          disabled
        />

        {/* Subscription Renewals */}
        <NotifRow
          icon="autorenew"
          title={t("settings.notifications.subscriptionRenewals.title")}
          subtitle={t("settings.notifications.subscriptionRenewals.desc")}
          checked={notifications.subscriptionRenewals}
          onToggle={() => setNotifications({ subscriptionRenewals: !notifications.subscriptionRenewals })}
          disabled
        />
      </Panel>
    </SettingsGroup>
  );
}
