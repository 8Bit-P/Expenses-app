import { useEffect, useState } from "react";
import AuthTabs from "./components/AuthTabs";
import AuthForm from "./components/AuthForm";
import SocialLogins from "./components/SocialLogin";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import VaultIcon from "../../components/ui/VaultIcon";

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
      <div className="w-full max-w-95 flex flex-col items-center">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-500">
            <VaultIcon className="text-primary" width="64" height="64" />
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Vault</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1 opacity-80">
            {isSignUp ? "Secure your wealth" : "Welcome back"}
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Modular Components */}
          <AuthTabs isSignUp={isSignUp} setIsSignUp={setIsSignUp} />

          <AuthForm isSignUp={isSignUp} />

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-outline-variant/10"></div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">Or</span>
            <div className="flex-1 h-px bg-outline-variant/10"></div>
          </div>

          <SocialLogins />
        </div>

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
