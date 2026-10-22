import { useTranslation } from "react-i18next";
import LegalLayout from "./components/LegalLayout";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <LegalLayout>
      <p className="eyebrow mb-4">{t("legal.privacy.subtitle")}</p>
      <h1 className="font-display font-normal text-[44px] md:text-[60px] leading-[0.95] tracking-[-0.01em] text-on-surface pb-8 mb-10 border-b border-on-surface">
        {t("legal.privacy.title")}
      </h1>

      <div className="space-y-6 text-[17px] leading-[1.75] text-on-surface">
        <p>{t("legal.privacy.p1")}</p>
        <p>{t("legal.privacy.p2")}</p>
        <p>{t("legal.privacy.p3")}</p>

        <section className="mt-12 pt-8 border-t border-outline-variant">
          <h2 className="text-[15px] font-semibold text-on-surface mb-2">{t("legal.privacy.contactTitle")}</h2>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            {t("legal.privacy.contactDesc")}{" "}
            <a
              href="mailto:privacy@vault.app"
              className="text-on-surface underline decoration-outline underline-offset-4 hover:decoration-on-surface"
            >
              privacy@vault.app
            </a>
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
