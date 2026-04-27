import { Lock, BarChart2, ShieldCheck } from "lucide-react";

import { useTranslation } from "react-i18next";

export default function TrustBanner() {
  const { t } = useTranslation();
  return (
    <div className="w-full border-y border-slate-800/60 bg-slate-900/30 py-5">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
        {[
          { icon: <ShieldCheck size={15} />, text: t("landing.trust.noAds") },
          { icon: <Lock size={15} />, text: t("landing.trust.encryption") },
          { icon: <BarChart2 size={15} />, text: t("landing.trust.dataOwnership") },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold tracking-widest uppercase">
            <span className="text-violet-500/70">{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
