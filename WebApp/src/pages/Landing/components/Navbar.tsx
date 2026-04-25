import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function VaultLogoSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="70" height="70" rx="16" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
      <line x1="66" y1="50" x2="76" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-white group">
          <span className="text-violet-400 group-hover:text-violet-300 transition-colors">
            <VaultLogoSVG />
          </span>
          <span className="font-black text-xl tracking-wider">Vault</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="px-5 py-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-full transition-all duration-200 shadow-lg shadow-violet-900/50"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
