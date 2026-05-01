import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function VaultLogoSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="70" height="70" rx="16" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
      <line x1="66" y1="50" x2="76" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800/60 pt-16 pb-12 px-6 bg-[#0c1324]/50">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-10">
        {/* Brand Section */}
        <div className="flex flex-col items-center gap-4 max-w-sm">
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="text-violet-400">
              <VaultLogoSVG />
            </span>
            <span className="font-black text-2xl tracking-tight">Vault</span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t("landing.footer.slogan")}
          </p>
        </div>

        {/* Minimal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-12 gap-y-6">
          <Link to="/privacy" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-violet-400 transition-colors">
            {t("legal.privacy.title")}
          </Link>
          <Link to="/terms" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-violet-400 transition-colors">
            {t("legal.terms.title")}
          </Link>
          <a href="mailto:hello@vault.app" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-violet-400 transition-colors">
            {t("landing.footer.contact")}
          </a>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-3">
          <div className="h-5 px-2.5 rounded-full border border-violet-500/20 bg-violet-500/5 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t("landing.footer.networkSecure")}</span>
          </div>
          <div className="h-5 px-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[10px] text-emerald-500">verified_user</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t("landing.footer.privacyBadge")}</span>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="w-full border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} Vault App. {t("common.allRightsReserved", { defaultValue: "All rights reserved." })}
          </p>
          <p className="text-slate-700 text-[9px] font-black uppercase tracking-widest">
            {t("landing.footer.badges")}
          </p>
        </div>
      </div>
    </footer>
  );
}
