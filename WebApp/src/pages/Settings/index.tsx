import { useState } from "react";
import ProfileSection from "./components/ProfileSection";
import CategoriesSection from "./components/CategoriesSection";
import PreferencesSection from "./components/PreferencesSection";
import SessionSection from "./components/SessionSection";
import AccountDeletion, { ExportData } from "./components/DangerZone";
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

      <div className="flex flex-col gap-8 sm:gap-12">
        {/* Main Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Primary Settings Column */}
          <div className="flex flex-col gap-8">
            <ProfileSection />
            <PreferencesSection />
          </div>

          {/* Secondary/Utility Settings Column */}
          <div className="flex flex-col gap-8">
            <SecuritySection />
            <SessionSection />
            <NotificationsSection />
          </div>
        </div>

        {/* Data & Organization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Ledger Organization */}
          <div className="h-full">
            <CategoriesSection />
          </div>

          {/* Right Column: Data Utility & Privacy */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <ExportData />
            <AccountDeletion onDeleteClick={() => setIsDeleteModalOpen(true)} />
          </div>
        </div>
      </div>

      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
}
