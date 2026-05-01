import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: t("landing.faq.q1"), answer: t("landing.faq.a1") },
    { question: t("landing.faq.q2"), answer: t("landing.faq.a2") },
    { question: t("landing.faq.q3"), answer: t("landing.faq.a3") },
    { question: t("landing.faq.q4"), answer: t("landing.faq.a4") },
  ];

  return (
    <section className="py-24 px-6 border-t border-slate-800/60 bg-[#0F172A]">
      <div className="max-w-3xl mx-auto">
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

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-violet-500/30 bg-slate-900/80" : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <h3 className={`font-bold text-base transition-colors ${isOpen ? "text-white" : "text-slate-300"}`}>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-400" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-6 text-slate-400 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
