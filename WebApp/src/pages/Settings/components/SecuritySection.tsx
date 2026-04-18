import { useState } from "react";

export default function SecuritySection() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <section className="col-span-12 lg:col-span-4 space-y-4">
      <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-on-surface-variant">shield</span>
        Account & Security
      </h4>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden divide-y divide-outline-variant/10 border border-outline-variant/10">
        {/* Change Password */}
        <button className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low transition-colors group">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              password
            </span>
            <div>
              <p className="font-bold text-on-surface text-sm">Change Password</p>
              <p className="text-xs text-on-surface-variant">Updated 3 months ago</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </button>

        {/* 2FA Toggle */}
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant">verified_user</span>
            <div>
              <p className="font-bold text-on-surface text-sm">Two-Factor Auth (2FA)</p>
              <p className={`text-xs font-bold ${twoFactorEnabled ? "text-secondary" : "text-on-surface-variant"}`}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${twoFactorEnabled ? "bg-secondary" : "bg-surface-container-highest"}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-surface-container-lowest absolute top-0.5 transition-transform duration-300 shadow-sm ${twoFactorEnabled ? "translate-x-5.5" : "translate-x-0.5"}`}
            ></div>
          </button>
        </div>

        {/* Privacy */}
        <button className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low transition-colors group">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              visibility_off
            </span>
            <p className="font-bold text-on-surface text-sm">Privacy Settings</p>
          </div>
          <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
