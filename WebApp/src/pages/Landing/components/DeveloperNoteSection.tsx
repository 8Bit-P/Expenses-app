import { motion } from "framer-motion";
import { Terminal, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DeveloperNoteSection() {
  const { t } = useTranslation();

  return (
    <section id="support" className="py-24 px-6 bg-[#0F172A]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-xl"
        >
          <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
            <Terminal className="text-violet-400" size={24} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-6">
            {t("support.title")}
          </h2>
          
          <div className="space-y-4 text-slate-400 text-base md:text-lg leading-relaxed text-left max-w-xl mx-auto mb-10">
            <p>
              {t("support.p1")}
            </p>
            <p>
              {t("support.p2")}
            </p>
          </div>

          <a
            href="https://buy.stripe.com/aFaeVcdAq6Qec814Fa48000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide border border-slate-700 text-slate-300 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
          >
            <Zap size={18} className="text-amber-400" />
            {t("support.cta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
