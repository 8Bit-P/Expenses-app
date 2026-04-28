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

const footerLinks = [
  {
    group: "Product",
    links: [
      { label: "Dashboard", href: "#" },
      { label: "Expenses", href: "#" },
      { label: "Assets", href: "#" },
      { label: "Subscriptions", href: "#" },
    ],
  },
  {
    group: "Security",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Data Ownership", href: "#" },
      { label: "Encryption", href: "#" },
    ],
  },
  {
    group: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@vault.app" },
      { label: "Open Source", href: "#" },
    ],
  },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800/60 pt-16 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white mb-4">
              <span className="text-violet-400">
                <VaultLogoSVG />
              </span>
              <span className="font-black text-lg tracking-wider">Vault</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              The privacy-first financial command center. Your wealth, your data, always yours.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="h-6 px-3 rounded-full border border-violet-500/30 bg-violet-500/10 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">Live</span>
              </div>
              <span className="text-[10px] text-slate-600 font-medium">No data sold, ever.</span>
            </div>
          </div>

          {/* Link groups */}
          {footerLinks.map(({ group, links }) => (
            <div key={group}>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">{group}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors font-medium"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs font-medium">
            © {new Date().getFullYear()} Vault. Built with privacy at its core.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/auth?mode=signin"
              className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors"
            >
              {t("landing.navbar.signIn")} →
            </Link>
            <Link
              to="/auth?mode=signup"
              className="px-4 py-1.5 text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-full transition-all duration-200"
            >
              {t("landing.navbar.getStarted")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
