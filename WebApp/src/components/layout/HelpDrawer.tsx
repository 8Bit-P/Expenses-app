import { useTranslation } from "react-i18next";
import {
  X,
  Search,
  Plus,
  LayoutGrid,
  TrendingUp,
  RefreshCw,
  BookOpen,
  Vault,
  ChevronDown,
  Inbox,
  Landmark,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import VaultIcon from "../ui/VaultIcon";
import { motion, AnimatePresence } from "framer-motion";

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
}

export default function HelpDrawer({ isOpen, onClose, initialSection }: HelpDrawerProps) {
  const { t } = useTranslation();
  const [openAccordion, setOpenAccordion] = useState<string | null>(initialSection ?? null);
  const focusRef = useRef<HTMLDivElement>(null);

  // When the drawer opens with a specific section, scroll to it after animation
  useEffect(() => {
    if (initialSection && focusRef.current) {
      const timer = setTimeout(() => {
        focusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 380); // wait for slide-in animation to finish
      return () => clearTimeout(timer);
    }
  }, [initialSection]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const iconCls = "text-on-surface-variant";
  const shortcuts = [
    { key: "1", label: t("sidebar.home"), icon: <LayoutGrid size={14} className={iconCls} /> },
    { key: "2", label: t("sidebar.expenses"), icon: <TrendingUp size={14} className={iconCls} /> },
    { key: "3", label: t("sidebar.assets"), icon: <Landmark size={14} className={iconCls} /> },
    { key: "4", label: t("sidebar.recurring"), icon: <RefreshCw size={14} className={iconCls} /> },
    { key: "⌘K", label: t("helpDrawer.globalSearch"), icon: <Search size={14} className={iconCls} /> },
    { key: "N", label: t("helpDrawer.newTransaction"), icon: <Plus size={14} className={iconCls} /> },
  ];

  const concepts = [
    {
      id: "accounts",
      title: t("helpDrawer.accountsTitle"),
      desc: t("helpDrawer.accountsDesc"),
      icon: <Vault size={16} className="text-on-surface-variant shrink-0" />,
    },
    {
      id: "review",
      title: t("helpDrawer.reviewTitle"),
      desc: t("helpDrawer.reviewDesc"),
      icon: <Inbox size={16} className="text-on-surface-variant shrink-0" />,
    },
    {
      id: "investments",
      title: t("helpDrawer.investmentsTitle"),
      desc: t("helpDrawer.investmentsDesc"),
      icon: <Landmark size={16} className="text-on-surface-variant shrink-0" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.2, 0.8, 0.2, 1], duration: 0.28 }}
            className="relative w-full sm:w-[480px] bg-surface-container-lowest h-full shadow-2xl flex flex-col border-l border-outline-variant"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 h-16 shrink-0 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rail flex items-center justify-center">
                  <VaultIcon className="text-accent" width="20" height="20" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-on-surface leading-tight">{t("helpDrawer.title")}</h2>
                  <p className="text-xs text-on-surface-variant">
                    {t("helpDrawer.shortcutsTitle")} & {t("helpDrawer.conceptsTitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 -mr-1.5 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
              {/* Shortcuts */}
              <section>
                <h3 className="eyebrow mb-3">{t("helpDrawer.shortcutsTitle")}</h3>
                <div className="rounded-xl border border-outline-variant divide-y divide-outline-variant overflow-hidden">
                  {shortcuts.map((s) => (
                    <div key={s.label} className="flex items-center justify-between h-11 px-3.5">
                      <div className="flex items-center gap-3">
                        {s.icon}
                        <span className="text-sm text-on-surface">{s.label}</span>
                      </div>
                      <kbd className="inline-flex items-center justify-center min-w-7 h-6 px-1.5 rounded-md border border-outline-variant border-b-2 bg-surface-container-low font-mono text-[11px] font-medium text-on-surface">
                        {s.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </section>

              {/* Core Concepts */}
              <section>
                <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                  <BookOpen size={12} />
                  {t("helpDrawer.conceptsTitle")}
                </h3>
                <div className="rounded-xl border border-outline-variant divide-y divide-outline-variant overflow-hidden">
                  {concepts.map((c) => (
                    <div
                      key={c.id}
                      ref={c.id === initialSection ? focusRef : undefined}
                      className={c.id === initialSection ? "bg-primary-container/20" : undefined}
                    >
                      <button
                        onClick={() => toggleAccordion(c.id)}
                        aria-expanded={openAccordion === c.id}
                        className="w-full flex items-center justify-between h-12 px-3.5 text-left hover:bg-surface-container-low transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {c.icon}
                          <span className="text-sm font-medium text-on-surface">{c.title}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-on-surface-variant transition-transform duration-200 ${
                            openAccordion === c.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openAccordion === c.id ? "max-h-40" : "max-h-0"
                        }`}
                      >
                        <p className="px-3.5 pl-10 pb-4 text-[13px] text-on-surface-variant leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-outline-variant">
              <p className="text-[11px] text-on-surface-variant text-center">Vault — Your Private Financial OS</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
