import { Lock, BarChart2, ShieldCheck, Database } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrustBanner() {
  const { t } = useTranslation();
  const items = [
    { icon: <ShieldCheck size={14} />, text: t("landing.trust.noAds") },
    { icon: <Lock size={14} />, text: t("landing.trust.encryption") },
    { icon: <Database size={14} />, text: t("landing.trust.dataOwnership") },
    { icon: <BarChart2 size={14} />, text: "Predictive forecasting built-in" },
  ];
  return (
    <div className="w-full border-y border-slate-800/60 bg-slate-900/30 py-4 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {items.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold tracking-widest uppercase whitespace-nowrap">
              <span className="text-violet-500/70">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
