import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
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
    <section className="pb-20 md:pb-28 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-4 border-t border-on-surface">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5"
        >
          <span className="font-mono text-[11px] text-on-surface-variant">§ 04</span>
          <h2 className="mt-4 font-display font-normal text-[36px] md:text-[48px] leading-[0.98] tracking-[-0.01em] text-on-surface">
            {t("landing.faq.title")}
          </h2>
          <p className="mt-4 text-base text-on-surface-variant leading-relaxed max-w-sm">{t("landing.faq.subtitle")}</p>
        </motion.div>

        <div className="lg:col-span-7 lg:pt-10">
          <div className="border-y border-outline-variant divide-y divide-outline-variant">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start gap-4 py-5 text-left group"
                  >
                    <span className="w-5 font-mono text-[11px] text-on-surface-variant pt-1 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="flex-1 text-base font-medium text-on-surface group-hover:text-on-surface-variant transition-colors">
                      {faq.question}
                    </h3>
                    <Plus
                      size={18}
                      strokeWidth={1.75}
                      className={`mt-0.5 shrink-0 text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pl-9 pr-8 pb-6 text-sm text-on-surface-variant leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
