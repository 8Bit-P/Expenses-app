import { Plus, Vault } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WelcomeEmptyStateProps {
  onAddManual: () => void;
}

export default function WelcomeEmptyState({ onAddManual }: WelcomeEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] border border-outline-variant rounded-2xl overflow-hidden bg-surface-container-lowest">
      <div className="bg-rail text-on-rail p-8 md:p-10 flex flex-col justify-between gap-10 min-h-[220px]">
        <span className="w-11 h-11 rounded-xl bg-accent text-on-accent flex items-center justify-center">
          <Vault className="w-6 h-6" strokeWidth={1.75} />
        </span>
        <p className="font-display text-[34px] leading-[1.05]">{t("dashboard.emptyState.title")}</p>
      </div>
      <div className="p-8 md:p-10 flex flex-col justify-center">
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mb-6">
          {t("dashboard.emptyState.subtitle")}
        </p>
        <div>
          <button
            onClick={onAddManual}
            className="h-10 px-4 bg-accent text-on-accent text-sm font-semibold rounded-lg hover:brightness-95 active:scale-[0.98] transition inline-flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={2.25} />
            {t("dashboard.emptyState.addManual")}
          </button>
        </div>
      </div>
    </div>
  );
}
