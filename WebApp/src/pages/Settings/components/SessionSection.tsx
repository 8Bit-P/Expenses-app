import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";

export default function SessionSection() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <section className="col-span-12 lg:col-span-4 space-y-4">
      <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-on-surface-variant">devices</span>
        {t("settings.session.title")}
      </h4>

      <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 h-[calc(100%-2.5rem)] flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-container/30 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">smartphone</span>
          </div>
          <div>
            <p className="font-bold text-on-surface text-sm">{t("settings.session.currentDevice")}</p>
            <p className="text-xs text-secondary font-bold">{t("settings.session.activeNow")}</p>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          {t("settings.session.signoutDesc")}
        </p>

        <button
          onClick={() => signOut()}
          className="w-full mt-auto py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface font-bold shadow-sm hover:shadow-md hover:text-error transition-all flex items-center justify-center gap-2 group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            logout
          </span>
          {t("settings.session.signoutButton")}
        </button>
      </div>
    </section>
  );
}
