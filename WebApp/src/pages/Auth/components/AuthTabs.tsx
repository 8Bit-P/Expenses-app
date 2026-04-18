interface AuthTabsProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

export default function AuthTabs({ isSignUp, setIsSignUp }: AuthTabsProps) {
  return (
    <div className="flex w-full bg-surface-container-low p-1 rounded-xl mb-6">
      <button
        type="button"
        onClick={() => setIsSignUp(false)}
        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
          !isSignUp
            ? "bg-surface-container-lowest text-on-surface shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => setIsSignUp(true)}
        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
          isSignUp
            ? "bg-surface-container-lowest text-on-surface shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Create Account
      </button>
    </div>
  );
}
