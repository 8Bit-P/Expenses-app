import { useEffect, useState } from "react";
import AuthTabs from "./components/AuthTabs";
import AuthForm from "./components/AuthForm";
import SocialLogins from "./components/SocialLogin";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import VaultIcon from "../../components/ui/VaultIcon";

import { useTranslation } from "react-i18next";

export default function Auth() {
  const { t } = useTranslation();
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isSignUp, setIsSignUp] = useState(mode === "signup");

  useEffect(() => {
    // If we have a session and we aren't still "loading" the check
    if (session && !loading) {
      navigate("/expenses", { replace: true });
    }
  }, [session, loading, navigate]);

  // While the AuthContext is checking the token, show nothing or a spinner
  // to prevent the login form from "flickering" for a split second
  if (loading) return null;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] bg-background text-on-surface">
      {/* Brand panel (desktop) */}
      <aside className="hidden lg:flex flex-col justify-between bg-rail text-on-rail p-12 xl:p-16">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <span className="w-10 h-10 rounded-lg bg-accent text-on-accent flex items-center justify-center">
            <VaultIcon className="text-on-accent" width="26" height="26" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Vault</span>
        </Link>

        <div className="max-w-md">
          <p className="font-display font-normal text-[56px] xl:text-[64px] leading-[0.95] tracking-[-0.01em]">
            {t("landing.hero.headlinePrefix")} {t("landing.hero.headlineSuffix")}
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-on-rail-variant">{t("landing.hero.subheadline")}</p>
        </div>

        <ul className="grid grid-cols-3 border-t border-rail-border pt-5 gap-4">
          {[t("landing.hero.statEncryption"), t("landing.hero.statAnalytics"), t("landing.hero.statAds")].map((label, i) => (
            <li key={label} className="text-xs text-on-rail-variant leading-snug">
              <span className="block font-mono text-[11px] text-on-rail mb-1.5">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Form column */}
      <div className="flex flex-col min-h-screen px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 h-9 px-2.5 -ml-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">arrow_back</span>
            <span className="hidden sm:inline">{t("legal.backToHome")}</span>
          </Link>

          {/* Compact brand (mobile) */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-accent text-on-accent flex items-center justify-center">
              <VaultIcon className="text-on-accent" width="20" height="20" />
            </span>
            <span className="text-base font-semibold tracking-tight">Vault</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="font-display font-normal text-[36px] sm:text-[40px] leading-[1.02] tracking-[-0.01em] text-on-surface mb-8">
              {isSignUp ? t("auth.signUpDesc") : t("auth.loginDesc")}
            </h1>

            <AuthTabs isSignUp={isSignUp} setIsSignUp={setIsSignUp} />

            <AuthForm isSignUp={isSignUp} />

            {/* Divider */}
            <div className="w-full flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs text-on-surface-variant">{t("auth.or")}</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <SocialLogins />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-on-surface-variant">
          <Link to="/terms" className="hover:text-on-surface transition-colors">
            {t("auth.terms")}
          </Link>
          <span className="text-outline">·</span>
          <Link to="/privacy" className="hover:text-on-surface transition-colors">
            {t("auth.privacy")}
          </Link>
        </div>
      </div>
    </div>
  );
}
