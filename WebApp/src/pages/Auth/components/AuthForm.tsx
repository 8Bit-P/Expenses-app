import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

const inputCls =
  "w-full h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline outline-none focus:border-on-surface focus:ring-0 transition-colors";

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

        navigate("/expenses");
      }
    } catch (err: unknown) {
      setError((err instanceof Error && err.message) || t("auth.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      {/* Alerts */}
      {error && (
        <div role="alert" className="w-full px-3 py-2.5 rounded-lg bg-error/10 border border-error/20 text-error text-[13px] font-medium animate-in fade-in">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="w-full px-3 py-2.5 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-[13px] font-medium animate-in fade-in">
          {message}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-2.5">
        {isSignUp && (
          <div className="animate-in fade-in duration-300">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("auth.fullName")}
              aria-label={t("auth.fullName")}
              autoComplete="name"
              className={inputCls}
              required={isSignUp}
            />
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("auth.email")}
          aria-label={t("auth.email")}
          autoComplete="email"
          className={inputCls}
          required
        />

        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password")}
            aria-label={t("auth.password")}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className={`${inputCls} pr-11`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 inset-y-1 w-9 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">{showPassword ? "lock_open" : "lock"}</span>
          </button>
        </div>

        {isSignUp && (
          <div className="relative flex items-center animate-in fade-in duration-300">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("auth.confirmPassword")}
              aria-label={t("auth.confirmPassword")}
              autoComplete="new-password"
              className={`${inputCls} pr-11`}
              required={isSignUp}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-accent text-on-accent text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></div>
        ) : (
          t("auth.continue")
        )}
      </button>
    </form>
  );
}
