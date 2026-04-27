import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySection() {
  const { t } = useTranslation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <section className="col-span-12 lg:col-span-4 space-y-4">
      <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-on-surface-variant">shield</span>
        {t("settings.securitySection.title")}
      </h4>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden divide-y divide-outline-variant/10 border border-outline-variant/10">
        {/* Change Password */}
        <button 
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              password
            </span>
            <div>
              <p className="font-bold text-on-surface text-sm">{t("settings.securitySection.changePassword")}</p>
              <p className="text-xs text-on-surface-variant">{t("settings.securitySection.changePasswordDesc")}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </button>


        {/* Privacy */}
        <button className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low transition-colors group">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              visibility_off
            </span>
            <p className="font-bold text-on-surface text-sm">{t("settings.securitySection.privacySettings")}</p>
          </div>
          <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </button>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </section>
  );
}
