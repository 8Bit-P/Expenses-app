import { Plus, Vault } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WelcomeEmptyStateProps {
  onAddManual: () => void;
}

export default function WelcomeEmptyState({ onAddManual }: WelcomeEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest border border-outline-variant/10 rounded-3xl shadow-sm text-center px-4 mt-8">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Vault className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-black font-headline text-on-surface mb-3 tracking-tight">
        {t("dashboard.emptyState.title")}
      </h2>
      <p className="text-on-surface-variant font-medium max-w-md mx-auto mb-10 text-sm">
        {t("dashboard.emptyState.subtitle")}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onAddManual}
          className="w-full sm:w-auto px-6 py-3.5 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} strokeWidth={2.5} />
          {t("dashboard.emptyState.addManual")}
        </button>
      </div>
    </div>
  );
}
