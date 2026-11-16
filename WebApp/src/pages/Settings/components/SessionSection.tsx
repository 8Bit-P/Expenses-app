import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";

export default function SessionSection() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <SettingsGroup title={t("settings.session.title")} description={t("settings.session.signoutDesc")}>
      <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">devices</span>
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{t("settings.session.currentDevice")}</p>
              <p className="text-xs text-secondary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {t("settings.session.activeNow")}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            {t("settings.session.signoutButton")}
          </button>
        </div>
      </Panel>
    </SettingsGroup>
  );
}
