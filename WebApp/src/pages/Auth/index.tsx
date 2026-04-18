import { useEffect, useState } from "react";
import AuthTabs from "./components/AuthTabs";
import AuthForm from "./components/AuthForm";
import SocialLogins from "./components/SocialLogin";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // If we have a session and we aren't still "loading" the check
    if (session && !loading) {
      navigate("/", { replace: true });
    }
  }, [session, loading, navigate]);

  // While the AuthContext is checking the token, show nothing or a spinner
  // to prevent the login form from "flickering" for a split second
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-85 flex flex-col items-center">
        {/* Logo */}
        <div className="w-12 h-12 bg-on-surface text-surface rounded-xl flex items-center justify-center mb-6 shadow-md">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance
          </span>
        </div>

        <h1 className="text-2xl font-headline font-semibold text-on-surface mb-8 tracking-tight">Personal Vault</h1>

        {/* Modular Components */}
        <AuthTabs isSignUp={isSignUp} setIsSignUp={setIsSignUp} />

        <AuthForm isSignUp={isSignUp} />

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-outline-variant/30"></div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-outline-variant/30"></div>
        </div>

        <SocialLogins />

        {/* Footer */}
        <div className="mt-10 flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant">
          <a href="#" className="hover:text-on-surface transition-colors">
            Terms of Service
          </a>
          <span>|</span>
          <a href="#" className="hover:text-on-surface transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
