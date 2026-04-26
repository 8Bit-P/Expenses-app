export default function SocialLogins() {
  const buttonClass =
    "relative w-full flex items-center justify-center gap-2.5 py-3 bg-surface-container border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface/40 cursor-not-allowed transition-all";

  return (
    <div className="w-full space-y-3">
      <button disabled className={buttonClass}>
        <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
        <span className="absolute right-3 text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-wider">Soon</span>
      </button>

      <button disabled className={buttonClass}>
        <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.58-.06 2.94.48 3.86 1.43-3.2 1.65-2.62 5.76.62 6.84-1.02 2.37-2.15 3.75-3.14 4.69zM12.03 7.25C11.97 4.14 14.54 1.4 17.5 1c.21 3.25-2.8 5.92-5.47 6.25z" />
        </svg>
        Continue with Apple
        <span className="absolute right-3 text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-wider">Soon</span>
      </button>
    </div>
  );
}
