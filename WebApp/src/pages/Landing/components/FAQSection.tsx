import { motion } from "framer-motion";

import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("landing.faq.q1"),
      answer: t("landing.faq.a1"),
    },
    {
      question: t("landing.faq.q2"),
      answer: t("landing.faq.a2"),
    },
    {
      question: t("landing.faq.q3"),
      answer: t("landing.faq.a3"),
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-slate-800/60 bg-[#0F172A]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-4">
            {t("landing.faq.title")}
          </h2>
          <p className="text-slate-400 text-lg">
            {t("landing.faq.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-1">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-200 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
