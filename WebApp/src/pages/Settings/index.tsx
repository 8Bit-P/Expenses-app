import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileSection from "./components/ProfileSection";
import CategoriesSection from "./components/CategoriesSection";
import PreferencesSection from "./components/PreferencesSection";
import SessionSection from "./components/SessionSection";
import AccountDeletion, { ExportData } from "./components/DangerZone";
import DeleteAccountModal from "./components/DeleteAccountModal";
import NotificationsSection from "./components/NotificationsSection";
import SecuritySection from "./components/SecuritySection";
import SupportSection from "./components/SupportSection";
import PageHeader from "../../components/ui/PageHeader";

export default function Settings() {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="w-full pb-40 md:pb-16">
      <PageHeader title={t("settings.title")} description={t("settings.subtitle")} />

      <div className="divide-y divide-outline-variant">
        <ProfileSection />
        <PreferencesSection />
        <NotificationsSection />
        <CategoriesSection />
        <SecuritySection />
        <SessionSection />
        <ExportData />
        <SupportSection />
        <AccountDeletion onDeleteClick={() => setIsDeleteModalOpen(true)} />
      </div>

      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
}
