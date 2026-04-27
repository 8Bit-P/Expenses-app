import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
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
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            {t("landing.pricing.title")}
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            {t("landing.pricing.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col"
          >
            <p className="text-slate-400 text-sm font-semibold mb-1">{free.name}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-white">{free.price}</span>
            </div>
            <p className="text-slate-500 text-sm mb-2">{free.period}</p>
            <p className="text-slate-400 text-sm mb-8">{free.desc}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {free.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-slate-400 text-sm">
                  <Check size={14} className="text-slate-600 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={free.ctaLink}
              className="block text-center py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold rounded-2xl transition-all duration-200"
            >
              {free.cta}
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-slate-900/80 border border-violet-500/50 rounded-3xl p-8 flex flex-col shadow-2xl shadow-violet-950/50"
            style={{ boxShadow: "0 0 60px -10px rgba(124, 58, 237, 0.3)" }}
          >
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full shadow-lg">
              <Zap size={10} />
              {pro.badge}
            </div>

            <p className="text-violet-400 text-sm font-semibold mb-1">{pro.name}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-white">{pro.price}</span>
              <span className="text-slate-400 mb-2 text-lg font-semibold">{pro.period}</span>
            </div>
            <p className="text-violet-300/70 text-sm mb-2 font-medium">{pro.desc}</p>
            <p className="text-slate-400 text-sm mb-8">{t("landing.pricing.plus")}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <Check size={14} className="text-violet-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={pro.ctaLink}
              className="block text-center py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-violet-900/50"
            >
              {pro.cta}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
