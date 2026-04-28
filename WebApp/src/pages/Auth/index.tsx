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
      navigate("/home", { replace: true });
    }
  }, [session, loading, navigate]);

  // While the AuthContext is checking the token, show nothing or a spinner
  // to prevent the login form from "flickering" for a split second
  if (loading) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden animate-in fade-in duration-500">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-5%] left-1/4 w-[400px] h-[400px] rounded-full bg-tertiary/8 blur-[100px]" />

      <div className="relative w-full max-w-[420px] flex flex-col items-center z-10">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Icon with glowing ring */}
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl scale-110" />
            <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-surface-container-lowest border border-primary/20 shadow-lg shadow-primary/10 transition-transform hover:scale-105 duration-300">
              <VaultIcon className="text-primary" width="36" height="36" />
            </div>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Vault</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1.5">
            {isSignUp ? t("auth.signUpDesc") : t("auth.loginDesc")}
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant/15 rounded-3xl p-8 shadow-2xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Modular Components */}
          <AuthTabs isSignUp={isSignUp} setIsSignUp={setIsSignUp} />

          <AuthForm isSignUp={isSignUp} />

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-outline-variant/15" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">
              {t("auth.or")}
            </span>
            <div className="flex-1 h-px bg-outline-variant/15" />
          </div>

          <SocialLogins />
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-3 text-[11px] font-semibold text-on-surface-variant/50">
          <Link to="/terms" className="hover:text-on-surface transition-colors">
            {t("auth.terms")}
          </Link>
          <span className="text-on-surface-variant/20">•</span>
          <Link to="/privacy" className="hover:text-on-surface transition-colors">
            {t("auth.privacy")}
          </Link>
        </div>
      </div>
    </div>
  );
}
