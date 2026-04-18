import { useUserPreferences } from "../../../context/UserPreferencesContext";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
}

function Toggle({ checked, onChange, color = "bg-primary" }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none shrink-0 ${
        checked ? color : "bg-surface-container-highest"
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
}

function NotifRow({ icon, title, subtitle, checked, onToggle, children }: NotifRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`material-symbols-outlined text-[18px] mt-0.5 ${checked ? "text-primary" : "text-on-surface-variant/50"}`}>
            {icon}
          </span>
          <div>
            <p className="font-bold text-on-surface text-sm">{title}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>
          </div>
        </div>
        <Toggle checked={checked} onToggle={() => {}} onChange={onToggle} />
      </div>
      {checked && children && (
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
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Warn at</span>
              <input
                type="number"
                min="1"
                max="100"
                value={notifications.budgetThresholdPct}
                onChange={(e) => setNotifications({ budgetThresholdPct: parseInt(e.target.value) || 80 })}
                className="w-16 bg-surface-container rounded-lg px-2 py-1 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/40 text-center"
              />
              <span className="text-xs text-on-surface-variant font-medium">% of budget</span>
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
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Alert for amounts over</span>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="1"
                  value={notifications.largeTransactionAmount}
                  onChange={(e) => setNotifications({ largeTransactionAmount: parseInt(e.target.value) || 200 })}
                  className="w-24 bg-surface-container rounded-lg pl-5 pr-2 py-1 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
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
          />
        </div>
      </div>
    </section>
  );
}
