import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function AuthForm({ isSignUp }: { isSignUp: boolean }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignUp) {
      if (!fullName.trim()) {
        setError(t("auth.errorName"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("auth.errorMismatch"));
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        if (signUpError) throw signUpError;
        setMessage(t("auth.successSignUp"));
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        navigate("/home");
      }
    } catch (err: any) {
      setError(err.message || t("auth.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      {/* Alerts */}
      {error && (
        <div className="w-full p-3 rounded-lg bg-error-container/50 border border-error/20 text-error text-xs font-semibold text-center animate-in slide-in-from-top-2">
          {error}
        </div>
      )}
      {message && (
        <div className="w-full p-3 rounded-lg bg-secondary-container/50 border border-secondary/20 text-secondary text-xs font-semibold text-center animate-in slide-in-from-top-2">
          {message}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-3">
        {isSignUp && (
          <div className="animate-in slide-in-from-top-2 fade-in duration-300">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("auth.fullName")}
              className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all"
              required={isSignUp}
            />
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("auth.email")}
          className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all"
          required
        />

        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password")}
            className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 inset-y-0 w-12 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">{showPassword ? "lock_open" : "lock"}</span>
          </button>
        </div>

        {isSignUp && (
          <div className="relative flex items-center animate-in slide-in-from-top-2 fade-in duration-300">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("auth.confirmPassword")}
              className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all"
              required={isSignUp}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-primary hover:bg-primary/90 text-on-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center mt-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin"></div>
        ) : (
          t("auth.continue")
        )}
      </button>
    </form>
  );
}
