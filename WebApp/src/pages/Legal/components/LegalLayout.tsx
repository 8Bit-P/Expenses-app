import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import VaultIcon from "../../../components/ui/VaultIcon";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 h-9 px-2.5 -ml-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t("legal.backToHome")}</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-on-surface">
            <VaultIcon className="text-on-surface" width="22" height="22" />
            <span className="font-semibold tracking-tight">Vault</span>
          </Link>
        </div>
      </header>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-prose mx-auto px-6 py-16 md:py-24"
      >
        {children}
      </motion.article>
    </div>
  );
}
