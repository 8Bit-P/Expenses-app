import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      step: "01",
      icon: "receipt_long",
      title: t("landing.howItWorks.steps.s1.title"),
      desc: t("landing.howItWorks.steps.s1.desc"),
    },
    {
      step: "02",
      icon: "donut_large",
      title: t("landing.howItWorks.steps.s2.title"),
      desc: t("landing.howItWorks.steps.s2.desc"),
    },
    {
      step: "03",
      icon: "savings",
      title: t("landing.howItWorks.steps.s3.title"),
      desc: t("landing.howItWorks.steps.s3.desc"),
    },
    {
      step: "04",
      icon: "auto_graph",
      title: t("landing.howItWorks.steps.s4.title"),
      desc: t("landing.howItWorks.steps.s4.desc"),
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-surface-container-low border-y border-outline-variant">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-on-surface mb-10 md:mb-14"
        >
          <div className="lg:col-span-8">
            <p className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-on-surface-variant">§ 02</span>
              <span className="eyebrow">{t("landing.howItWorks.badge")}</span>
            </p>
            <h2 className="mt-4 font-display font-normal text-[40px] md:text-[56px] leading-[0.95] tracking-[-0.01em] text-on-surface">
              {t("landing.howItWorks.title")}{" "}
              <span className="text-on-surface-variant">{t("landing.howItWorks.title_accent")}</span>
            </h2>
          </div>
          <p className="lg:col-span-4 lg:self-end text-base text-on-surface-variant leading-relaxed">
            {t("landing.howItWorks.subtitle")}
          </p>
        </motion.div>

        <motion.ol
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant border border-outline-variant"
        >
          {steps.map((step) => (
            <li key={step.step} className="bg-surface-container-lowest p-6 md:p-7 flex flex-col min-h-[260px]">
              <div className="flex items-start justify-between pb-5 border-b border-outline-variant">
                <span className="font-mono text-[40px] leading-none tracking-tight text-on-surface">{step.step}</span>
                <span className="material-symbols-outlined text-[20px] text-outline">{step.icon}</span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-on-surface">{step.title}</h3>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
