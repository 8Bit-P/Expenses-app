import { useTranslation } from "react-i18next";
import LegalLayout from "./components/LegalLayout";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <LegalLayout>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
        {t("legal.terms.title")}
      </h1>
      <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-10">
        {t("legal.terms.subtitle")}
      </p>

      <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
        <p>{t("legal.terms.p1")}</p>
        <p>{t("legal.terms.p2")}</p>
        <p>{t("legal.terms.p3")}</p>

        <section className="mt-12 pt-12 border-t border-white/5">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-sm">Agreement</h2>
          <p className="text-sm">
            By accessing or using Vault, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
