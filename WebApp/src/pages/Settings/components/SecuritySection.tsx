import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChangePasswordModal from "./ChangePasswordModal";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";

export default function SecuritySection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <SettingsGroup title={t("settings.securitySection.title")}>
      <Panel flush bodyClassName="divide-y divide-outline-variant">
        {/* Change Password */}
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors first:rounded-t-2xl"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">password</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-on-surface">{t("settings.securitySection.changePassword")}</p>
              <p className="text-xs text-on-surface-variant">{t("settings.securitySection.changePasswordDesc")}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-outline">chevron_right</span>
        </button>

        {/* Privacy */}
        <button
          onClick={() => navigate("/privacy")}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors last:rounded-b-2xl"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">visibility_off</span>
            <p className="text-sm font-medium text-on-surface">{t("settings.securitySection.privacySettings")}</p>
          </div>
          <span className="material-symbols-outlined text-[20px] text-outline">chevron_right</span>
        </button>
      </Panel>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </SettingsGroup>
  );
}
