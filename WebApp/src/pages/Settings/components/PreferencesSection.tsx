import { useState } from "react";

export default function PreferencesSection() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <section className="col-span-12 lg:col-span-5 bg-primary-container/10 rounded-xl p-8 border border-primary-container/20 space-y-6">
      <h4 className="text-lg font-bold font-headline flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary">tune</span>
        App Preferences
      </h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm">
          <span className="font-semibold text-on-surface text-sm">Visual Theme</span>
          <div className="flex bg-surface-container rounded-lg p-1">
            <button onClick={() => setTheme('light')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${theme === 'light' ? 'bg-surface-container-lowest text-primary' : 'text-on-surface-variant'}`}>Light</button>
            <button onClick={() => setTheme('dark')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${theme === 'dark' ? 'bg-surface-container-lowest text-primary' : 'text-on-surface-variant'}`}>Dark</button>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm">
          <span className="font-semibold text-on-surface text-sm">Currency</span>
          <select className="bg-transparent border-none text-primary font-bold focus:ring-0 cursor-pointer outline-none text-sm text-right">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>
      </div>
    </section>
  );
}