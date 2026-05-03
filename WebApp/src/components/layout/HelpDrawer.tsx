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

  if (!isOpen) return null;

  const shortcuts = [
    { key: "1", label: t("sidebar.home"), icon: <LayoutGrid size={13} className="text-primary" /> },
    { key: "2", label: t("sidebar.expenses"), icon: <TrendingUp size={13} className="text-rose-400" /> },
    { key: "3", label: t("sidebar.assets"), icon: <Landmark size={13} className="text-emerald-400" /> },
    { key: "4", label: t("sidebar.recurring"), icon: <RefreshCw size={13} className="text-sky-400" /> },
    { key: "⌘K", label: t("helpDrawer.globalSearch"), icon: <Search size={13} className="text-violet-400" /> },
    { key: "N", label: t("helpDrawer.newTransaction"), icon: <Plus size={13} className="text-amber-400" /> },
  ];

  const concepts = [
    {
      id: "reserves",
      title: t("helpDrawer.reservesTitle"),
      desc: t("helpDrawer.reservesDesc"),
      icon: <Vault size={15} className="text-primary shrink-0" />,
    },
    {
      id: "review",
      title: t("helpDrawer.reviewTitle"),
      desc: t("helpDrawer.reviewDesc"),
      icon: <Inbox size={15} className="text-amber-400 shrink-0" />,
    },
    {
      id: "investments",
      title: t("helpDrawer.investmentsTitle"),
      desc: t("helpDrawer.investmentsDesc"),
      icon: <Landmark size={15} className="text-emerald-400 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] flex justify-end"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        {/* Drawer panel */}
        <div
          className="w-full sm:w-[540px] bg-surface-container-lowest h-full shadow-2xl flex flex-col"
          style={{
            animation: "slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
            borderLeft: "1px solid rgba(var(--color-outline-variant), 0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── Branded Header ────────────────────────────────── */}
          <div className="relative overflow-hidden px-6 pt-6 pb-5 border-b border-outline-variant/10">
            {/* Decorative glow blob */}
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
            />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary/20 flex items-center justify-center shadow-sm">
                  <VaultIcon className="text-primary" width="22" height="22" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-on-surface tracking-tight font-headline leading-none">
                    {t("helpDrawer.title")}
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1 opacity-60">
                    {t("helpDrawer.shortcutsTitle")} & {t("helpDrawer.conceptsTitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ─── Scrollable body ───────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7 scrollbar-thin scrollbar-thumb-outline-variant/20 scrollbar-track-transparent">

            {/* Shortcuts */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-4 rounded-full bg-primary" />
                <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  {t("helpDrawer.shortcutsTitle")}
                </h3>
              </div>
              <div className="space-y-2">
                {shortcuts.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/10 hover:border-outline-variant/25 hover:bg-surface-container transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-surface-container-high/80 flex items-center justify-center">
                        {s.icon}
                      </div>
                      <span className="text-sm font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                        {s.label}
                      </span>
                    </div>
                    <kbd className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 bg-surface-container-high border border-outline-variant/30 rounded-lg font-mono text-[11px] font-bold text-on-surface shadow-inner tracking-tight">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-outline-variant/10" />

            {/* Core Concepts */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-4 rounded-full bg-amber-400" />
                <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={11} />
                  {t("helpDrawer.conceptsTitle")}
                </h3>
              </div>
              <div className="space-y-2">
                {concepts.map((c) => (
                  <div
                    key={c.id}
                    ref={c.id === initialSection ? focusRef : undefined}
                    className={`bg-surface-container-low/70 rounded-xl border overflow-hidden transition-all ${
                      c.id === initialSection
                        ? "border-primary/30 shadow-sm shadow-primary/10"
                        : "border-outline-variant/10 hover:border-outline-variant/25"
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(c.id)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-surface-container/60 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {c.icon}
                        <span className="text-sm font-bold text-on-surface">{c.title}</span>
                      </div>
                      <ChevronDown
                        size={15}
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
                      <p className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ─── Footer ────────────────────────────────────────── */}
          <div className="px-6 py-4 border-t border-outline-variant/10 bg-surface-container/30">
            <p className="text-[10px] text-on-surface-variant/50 text-center font-medium tracking-wide">
              Vault — Your Private Financial OS
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
