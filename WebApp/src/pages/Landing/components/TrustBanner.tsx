import { Lock, BarChart2, ShieldCheck, Database } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrustBanner() {
  const { t } = useTranslation();
  const items = [
    { icon: <ShieldCheck size={16} strokeWidth={1.75} />, text: t("landing.trust.noAds") },
    { icon: <Lock size={16} strokeWidth={1.75} />, text: t("landing.trust.encryption") },
    { icon: <Database size={16} strokeWidth={1.75} />, text: t("landing.trust.dataOwnership") },
    { icon: <BarChart2 size={16} strokeWidth={1.75} />, text: t("landing.trust.forecasting") },
  ];
  return (
    <div className="w-full border-y border-outline-variant bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant xl:border-x xl:border-outline-variant">
        {items.map(({ icon, text }, i) => (
          <div key={text} className="flex items-start gap-3 px-6 py-5 bg-surface-container-lowest">
            <span className="font-mono text-[11px] text-outline pt-0.5">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-on-surface-variant pt-px">{icon}</span>
            <span className="text-sm text-on-surface leading-snug">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
