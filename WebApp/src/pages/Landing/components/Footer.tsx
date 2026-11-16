import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VaultIcon from "../../../components/ui/VaultIcon";

export default function Footer() {
  const { t } = useTranslation();

  const linkCls = "text-sm text-on-surface-variant hover:text-on-surface transition-colors";

  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest px-6 pt-14 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 text-on-surface w-fit">
              <VaultIcon className="text-on-surface" width="24" height="24" />
              <span className="font-semibold text-lg tracking-tight">Vault</span>
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">{t("landing.footer.slogan")}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded border border-outline-variant text-[11px] font-medium text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {t("landing.footer.networkSecure")}
              </span>
              <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded border border-outline-variant text-[11px] font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-[13px] text-secondary">verified_user</span>
                {t("landing.footer.privacyBadge")}
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="md:col-span-6 md:justify-self-end flex flex-col gap-3">
            <Link to="/privacy" className={linkCls}>
              {t("legal.privacy.title")}
            </Link>
            <Link to="/terms" className={linkCls}>
              {t("legal.terms.title")}
            </Link>
            <a href="mailto:hello@vault.app" className={linkCls}>
              {t("landing.footer.contact")}
            </a>
          </nav>
        </div>

        {/* Copyright bar */}
        <div className="mt-12 pt-6 border-t border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-2">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} Vault App. {t("common.allRightsReserved", { defaultValue: "All rights reserved." })}
          </p>
          <p className="font-mono text-[11px] text-outline">{t("landing.footer.badges")}</p>
        </div>
      </div>
    </footer>
  );
}
