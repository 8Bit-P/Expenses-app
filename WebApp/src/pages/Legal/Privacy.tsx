import { useTranslation } from "react-i18next";
import LegalLayout from "./components/LegalLayout";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <LegalLayout>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
        {t("legal.privacy.title")}
      </h1>
      <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-10">
        {t("legal.privacy.subtitle")}
      </p>

      <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
        <p>{t("legal.privacy.p1")}</p>
        <p>{t("legal.privacy.p2")}</p>
        <p>{t("legal.privacy.p3")}</p>

        <section className="mt-12 pt-12 border-t border-white/5">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-sm">Contact Us</h2>
          <p className="text-sm">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@vault.app" className="text-violet-400 hover:underline">
              privacy@vault.app
            </a>
          </p>
        </section> section 
      </div>
    </LegalLayout>
  );
}
