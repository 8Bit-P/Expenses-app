import { useState } from "react";
import ProfileSection from "./components/ProfileSection";
import CategoriesSection from "./components/CategoriesSection";
import PreferencesSection from "./components/PreferencesSection";
import SessionSection from "./components/SessionSection";
import DangerZone from "./components/DangerZone";
import DeleteAccountModal from "./components/DeleteAccountModal";
import NotificationsSection from "./components/NotificationsSection";
import SecuritySection from "./components/SecuritySection";

export default function Settings() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto w-full px-2 md:px-0 pb-40 animate-in fade-in duration-500">
      <div className="mt-6 mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight font-headline text-on-surface">Settings</h2>
        <p className="text-on-surface-variant mt-2 font-medium">Manage your ethereal vault and guardian preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Primary Settings Column */}
        <div className="flex flex-col gap-8">
          <ProfileSection />
          <PreferencesSection />
          <CategoriesSection />
        </div>

        {/* Secondary/Utility Settings Column */}
        <div className="flex flex-col gap-8">
          <SecuritySection />
          <NotificationsSection />
          <SessionSection />
        </div>
      </div>

      <DangerZone onDeleteClick={() => setIsDeleteModalOpen(true)} />

      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
}
