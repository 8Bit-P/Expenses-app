import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { differenceInDays, parseISO } from "date-fns";

export default function ActionCenter() {
  const { subscriptions } = useSubscriptions();

  // Logic for dynamic alerts
  const alerts = [];

  // 1. Subscription Renewal Alert
  const soonRenewal = subscriptions.find(s => {
    const days = differenceInDays(parseISO(s.next_billing_date), new Date());
    return days >= 0 && days <= 3;
  });

  if (soonRenewal) {
    const days = differenceInDays(parseISO(soonRenewal.next_billing_date), new Date());
    alerts.push({
      id: "sub-renewal",
      title: "Upcoming Renewal",
      message: `Subscription '${soonRenewal.name}' renews in ${days === 0 ? "today" : days === 1 ? "tomorrow" : `${days} days`}.`,
      icon: "event_repeat",
      color: "border-error",
      accent: "text-error"
    });
  }

  // 2. Placeholder for "Unusual Spending" or "Budget Alert"
  alerts.push({
    id: "unusual-spend",
    title: "Insight",
    message: "Unusual spending in 'Dining' +15% vs last month. Check your filters.",
    icon: "insights",
    color: "border-primary",
    accent: "text-primary"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant/70">
          Priority Alerts
        </h3>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`bg-primary/5 p-4 rounded-2xl border-l-4 ${alert.color} flex gap-4 items-start transition-all hover:bg-primary/10 cursor-pointer`}
          >
            <div className={`w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-sm ${alert.accent}`}>
              <span className="material-symbols-outlined text-[20px]">{alert.icon}</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-on-surface uppercase tracking-wider mb-1">{alert.title}</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                {alert.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
