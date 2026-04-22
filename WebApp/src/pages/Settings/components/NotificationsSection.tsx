import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { NumberStepper } from "../../../components/ui/NumberStepper";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
  disabled?: boolean;
}

function Toggle({ checked, onChange, color = "bg-primary", disabled = false }: ToggleProps) {
  return (
    <button
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className={`w-11 h-6 rounded-full relative transition-all focus:outline-none shrink-0 ${
        disabled ? "bg-surface-container opacity-40 cursor-not-allowed" : checked ? color : "bg-surface-container-highest cursor-pointer"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-surface-container-lowest absolute top-0.5 transition-transform duration-300 shadow-sm ${
          checked ? "translate-x-5.5" : "translate-x-0.5"
        }`}
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
  return (
    <div className={`space-y-2 ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`material-symbols-outlined text-[18px] mt-0.5 ${checked && !disabled ? "text-primary" : "text-on-surface-variant/50"}`}>
            {icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-on-surface text-sm">{title}</p>
              {disabled && (
                <span className="text-[8px] font-black uppercase tracking-widest bg-surface-container px-1.5 py-0.5 rounded-md text-on-surface-variant/70 border border-outline-variant/10">
                  Soon
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>
          </div>
        </div>
        <Toggle checked={checked} onChange={onToggle} disabled={disabled} />
      </div>
      {!disabled && checked && children && (
        <div className="ml-9 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function NotificationsSection() {
  const { notifications, setNotifications, currency } = useUserPreferences();

  return (
    <section className="col-span-12 lg:col-span-4 space-y-4">
      <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
        Notifications
      </h4>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 divide-y divide-outline-variant/10">
        {/* Budget Threshold Alerts */}
        <div className="p-5">
          <NotifRow
            icon="savings"
            title="Budget Threshold Alerts"
            subtitle="Warn me when I approach my monthly budget"
            checked={notifications.budgetThresholdAlerts}
            onToggle={() => setNotifications({ budgetThresholdAlerts: !notifications.budgetThresholdAlerts })}
            disabled
          >
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-on-surface-variant font-medium">Warn at</span>
              <NumberStepper
                value={notifications.budgetThresholdPct}
                onChange={(v) => setNotifications({ budgetThresholdPct: v })}
                min={10}
                max={100}
                step={5}
                suffix="%"
              />
              <span className="text-xs text-on-surface-variant font-medium">of budget</span>
            </div>
          </NotifRow>
        </div>

        {/* Large Transaction Radar */}
        <div className="p-5">
          <NotifRow
            icon="radar"
            title="Large Transaction Radar"
            subtitle="Alert me for any single expense over a threshold"
            checked={notifications.largeTransactionRadar}
            onToggle={() => setNotifications({ largeTransactionRadar: !notifications.largeTransactionRadar })}
            disabled
          >
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-on-surface-variant font-medium">Alert above</span>
              <NumberStepper
                value={notifications.largeTransactionAmount}
                onChange={(v) => setNotifications({ largeTransactionAmount: v })}
                min={10}
                step={10}
                prefix={currency.symbol}
              />
            </div>
          </NotifRow>
        </div>

        {/* Weekly Financial Digest */}
        <div className="p-5">
          <NotifRow
            icon="calendar_month"
            title="Weekly Financial Digest"
            subtitle="A quick spending summary every Sunday"
            checked={notifications.weeklyDigest}
            onToggle={() => setNotifications({ weeklyDigest: !notifications.weeklyDigest })}
            disabled
          />
        </div>

        {/* Tracking Reminder */}
        <div className="p-5">
          <NotifRow
            icon="edit_notifications"
            title="Tracking Reminder"
            subtitle="Remind me to log expenses if inactive for 3 days"
            checked={notifications.trackingReminder}
            onToggle={() => setNotifications({ trackingReminder: !notifications.trackingReminder })}
            disabled
          />
        </div>

        {/* Subscription Renewals */}
        <div className="p-5">
          <NotifRow
            icon="autorenew"
            title="Subscription Renewals"
            subtitle="Remind me 3 days before a recurring charge"
            checked={notifications.subscriptionRenewals}
            onToggle={() => setNotifications({ subscriptionRenewals: !notifications.subscriptionRenewals })}
            disabled
          />
        </div>
      </div>
    </section>
  );
}
