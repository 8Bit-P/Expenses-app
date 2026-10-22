import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function PricingSection() {
  const { t } = useTranslation();

  const free = {
    name: t("landing.pricing.starter.name"),
    price: t("landing.pricing.starter.price"),
    period: t("landing.pricing.starter.period"),
    desc: t("landing.pricing.starter.desc"),
    cta: t("landing.pricing.starter.cta"),
    ctaLink: "/auth?mode=signup",
    features: [
      t("landing.pricing.starter.f1"),
      t("landing.pricing.starter.f2"),
      t("landing.pricing.starter.f3"),
      t("landing.pricing.starter.f4"),
      t("landing.pricing.starter.f5"),
    ],
  };

  const pro = {
    name: t("landing.pricing.pro.name"),
    price: t("landing.pricing.pro.price"),
    period: t("landing.pricing.pro.period"),
    badge: t("landing.pricing.pro.badge"),
    desc: t("landing.pricing.pro.desc"),
    cta: t("landing.pricing.pro.cta"),
    ctaLink: "/auth?mode=signup",
    features: [
      t("landing.pricing.pro.f1"),
      t("landing.pricing.pro.f2"),
      t("landing.pricing.pro.f3"),
      t("landing.pricing.pro.f4"),
      t("landing.pricing.pro.f5"),
      t("landing.pricing.pro.f6"),
      t("landing.pricing.pro.f7"),
    ],
  };

  return (
    <section id="pricing" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-on-surface mb-10 md:mb-14"
        >
          <h2 className="lg:col-span-7 font-display font-normal text-[40px] md:text-[56px] leading-[0.95] tracking-[-0.01em] text-on-surface">
            {t("landing.pricing.title")}
          </h2>
          <p className="lg:col-span-5 lg:self-end text-base text-on-surface-variant leading-relaxed">
            {t("landing.pricing.subtitle")}
          </p>
        </motion.div>

        {/* Plans table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant border border-outline-variant"
        >
          {/* Free */}
          <div className="bg-surface-container-lowest p-7 md:p-8 flex flex-col">
            <p className="eyebrow">{free.name}</p>
            <div className="mt-5 pb-5 border-b border-outline-variant">
              <span className="text-5xl font-semibold tracking-tight tabular-nums text-on-surface">{free.price}</span>
              <p className="text-sm text-on-surface-variant mt-2">{free.period}</p>
            </div>
            <p className="text-sm text-on-surface-variant mt-5 mb-6">{free.desc}</p>
            <ul className="divide-y divide-outline-variant border-y border-outline-variant mb-8 flex-1">
              {free.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 py-2.5 text-sm text-on-surface">
                  <Check size={14} className="text-on-surface-variant shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={free.ctaLink}
              className="inline-flex items-center justify-center h-10 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low hover:border-outline transition-colors"
            >
              {free.cta}
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-surface-container-lowest p-7 md:p-8 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-on-surface">{pro.name}</p>
              <span className="inline-flex items-center h-5 px-1.5 rounded bg-accent text-on-accent text-[11px] font-medium">
                {pro.badge}
              </span>
            </div>
            <div className="mt-5 pb-5 border-b border-outline-variant">
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-tight tabular-nums text-on-surface">{pro.price}</span>
                <span className="text-base text-on-surface-variant">{pro.period}</span>
              </div>
              <p className="text-sm text-on-surface mt-2">{pro.desc}</p>
            </div>
            <p className="text-sm text-on-surface-variant mt-5 mb-6">{t("landing.pricing.plus")}</p>
            <ul className="divide-y divide-outline-variant border-y border-outline-variant mb-8 flex-1">
              {pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 py-2.5 text-sm text-on-surface">
                  <Check size={14} className="text-secondary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={pro.ctaLink}
              className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
            >
              {pro.cta}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
