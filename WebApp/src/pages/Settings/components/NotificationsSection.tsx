import { useState } from "react";

export default function NotificationsSection() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [investmentAlerts, setInvestmentAlerts] = useState(false);

  return (
    <section className="col-span-12 lg:col-span-4 space-y-4">
      <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
        Notifications
      </h4>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-6 border border-outline-variant/10">
        {/* Email Alerts Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-on-surface text-sm">Email Alerts</p>
            <p className="text-xs text-on-surface-variant">Weekly reports & insights</p>
          </div>
          <button
            onClick={() => setEmailAlerts(!emailAlerts)}
            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${emailAlerts ? "bg-primary" : "bg-surface-container-highest"}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-surface-container-lowest absolute top-0.5 transition-transform duration-300 shadow-sm ${emailAlerts ? "translate-x-5.5" : "translate-x-0.5"}`}
            ></div>
          </button>
        </div>

        {/* Budget Alerts Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-on-surface text-sm">Budget Limits</p>
            <p className="text-xs text-on-surface-variant">Push when over 80% limit</p>
          </div>
          <button
            onClick={() => setBudgetAlerts(!budgetAlerts)}
            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${budgetAlerts ? "bg-primary" : "bg-surface-container-highest"}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-surface-container-lowest absolute top-0.5 transition-transform duration-300 shadow-sm ${budgetAlerts ? "translate-x-5.5" : "translate-x-0.5"}`}
            ></div>
          </button>
        </div>

        {/* Investment Alerts Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-on-surface text-sm">Investments</p>
            <p className="text-xs text-on-surface-variant">Market shift updates</p>
          </div>
          <button
            onClick={() => setInvestmentAlerts(!investmentAlerts)}
            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${investmentAlerts ? "bg-primary" : "bg-surface-container-highest"}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-surface-container-lowest absolute top-0.5 transition-transform duration-300 shadow-sm ${investmentAlerts ? "translate-x-5.5" : "translate-x-0.5"}`}
            ></div>
          </button>
        </div>
      </div>
    </section>
  );
}
