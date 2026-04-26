import { Link } from "react-router-dom";

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
  return (
    <footer className="border-t border-slate-800/60 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-violet-500/70"><VaultLogoSVG /></span>
          <span className="font-black text-base tracking-wider text-slate-300">Vault</span>
          <span className="text-slate-600 text-sm ml-2">© {new Date().getFullYear()}</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {[
            { label: "Terms of Service", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Contact", href: "mailto:hello@vault.app" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors font-medium"
            >
              {label}
            </a>
          ))}
          <Link
            to="/auth?mode=signin"
            className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Sign In →
          </Link>
        </div>
      </div>
    </footer>
  );
}
