import { useTranslation } from "react-i18next";

interface AuthTabsProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

export default function AuthTabs({ isSignUp, setIsSignUp }: AuthTabsProps) {
  const { t } = useTranslation();

  const itemCls = (active: boolean) =>
    `flex-1 h-9 rounded-md text-sm font-medium transition-colors ${
      active
        ? "bg-surface-container-lowest text-on-surface shadow-sm"
        : "text-on-surface-variant hover:text-on-surface"
    }`;

  return (
    <div className="flex w-full p-0.5 rounded-lg bg-surface-container border border-outline-variant mb-6" role="tablist">
      <button type="button" role="tab" aria-selected={!isSignUp} onClick={() => setIsSignUp(false)} className={itemCls(!isSignUp)}>
        {t("auth.signIn")}
      </button>
      <button type="button" role="tab" aria-selected={isSignUp} onClick={() => setIsSignUp(true)} className={itemCls(isSignUp)}>
        {t("auth.createAccount")}
      </button>
    </div>
  );
}
