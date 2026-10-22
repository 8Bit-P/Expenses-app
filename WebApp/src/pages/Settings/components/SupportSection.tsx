import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";

export default function SupportSection() {
  const { t } = useTranslation();

  return (
    <SettingsGroup title={t("support.title")} description={t("support.subtitle")}>
      <Panel>
        <div className="space-y-3">
          <p className="text-sm text-on-surface-variant leading-relaxed">{t("support.p1")}</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">{t("support.p2")}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-outline-variant flex justify-end">
          <a
            href="https://buy.stripe.com/aFaeVcdAq6Qec814Fa48000"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Heart size={15} />
            {t("support.cta")}
          </a>
        </div>
      </Panel>
    </SettingsGroup>
  );
}
