import { useTranslation } from "react-i18next";

interface AuthTabsProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

export default function AuthTabs({ isSignUp, setIsSignUp }: AuthTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full bg-surface-container-low p-1 rounded-xl mb-6 gap-1">
      <button
        type="button"
        onClick={() => setIsSignUp(false)}
        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
          !isSignUp
            ? "bg-primary text-on-primary shadow-md shadow-primary/30"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
        }`}
      >
        {t("auth.signIn")}
      </button>
      <button
        type="button"
        onClick={() => setIsSignUp(true)}
        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
          isSignUp
            ? "bg-primary text-on-primary shadow-md shadow-primary/30"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
        }`}
      >
        {t("auth.createAccount")}
      </button>
    </div>
  );
}
