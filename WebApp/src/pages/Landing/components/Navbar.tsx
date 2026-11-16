import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VaultIcon from "../../../components/ui/VaultIcon";

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? "bg-background border-outline-variant" : "bg-background/0 border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-on-surface">
          <VaultIcon className="text-on-surface" width="26" height="26" />
          <span className="font-semibold text-lg tracking-tight">Vault</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/auth?mode=signin"
            className="inline-flex items-center h-9 px-3.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            {t("landing.navbar.signIn")}
          </Link>
          <Link
            to="/auth?mode=signup"
            className="inline-flex items-center h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
          >
            {t("landing.navbar.getStarted")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
