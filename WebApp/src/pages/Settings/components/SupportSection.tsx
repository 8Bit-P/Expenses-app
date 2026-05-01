import { useTranslation } from "react-i18next";
import { Heart, Zap } from "lucide-react";

export default function SupportSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 text-primary">
        <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary/20 flex items-center justify-center">
          <Heart size={20} className="fill-primary" />
        </div>
        <div>
          <h4 className="text-lg font-bold font-headline text-on-surface">{t("support.title")}</h4>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">{t("support.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {t("support.p1")}
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {t("support.p2")}
        </p>

        <div className="pt-2">
          <a
            href="https://buy.stripe.com/aFaeVcdAq6Qec814Fa48000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap size={16} className="text-amber-400" />
            {t("support.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
