import { motion } from "framer-motion";
import { Terminal, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DeveloperNoteSection() {
  const { t } = useTranslation();

  return (
    <section id="support" className="py-20 md:py-28 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-4 border-t border-on-surface"
      >
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-on-surface-variant">§ 03</span>
            <Terminal size={14} strokeWidth={1.75} className="text-on-surface-variant" />
          </p>
          <h2 className="mt-4 font-display font-normal text-[36px] md:text-[48px] leading-[0.98] tracking-[-0.01em] text-on-surface">
            {t("support.title")}
          </h2>
        </div>

        <div className="lg:col-span-7 lg:pt-10">
          <div className="space-y-4 text-on-surface text-base md:text-[17px] leading-relaxed max-w-prose">
            <p>{t("support.p1")}</p>
            <p>{t("support.p2")}</p>
          </div>

          <a
            href="https://buy.stripe.com/aFaeVcdAq6Qec814Fa48000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low hover:border-outline transition-colors"
          >
            <Zap size={16} strokeWidth={1.75} className="text-on-surface-variant" />
            {t("support.cta")}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
