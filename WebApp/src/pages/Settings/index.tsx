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
    <div className="px-6 lg:px-12 py-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight font-headline text-on-surface">Settings</h2>
        <p className="text-on-surface-variant mt-2 font-medium">Manage your ethereal vault and guardian preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Profile and Categories Stacked */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
          <ProfileSection />
          <CategoriesSection />
        </div>

        {/* RIGHT COLUMN: General & Financial */}
        <div className="col-span-1 lg:col-span-5 h-full">
          <PreferencesSection />
        </div>

        <div className="col-span-1 lg:col-span-4 h-full">
          <SecuritySection />
        </div>
        <div className="col-span-1 lg:col-span-4 h-full">
          <NotificationsSection />
        </div>
        <div className="col-span-1 lg:col-span-4 h-full">
          <SessionSection />
        </div>
      </div>

      <DangerZone onDeleteClick={() => setIsDeleteModalOpen(true)} />

      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
}
