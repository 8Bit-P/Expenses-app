import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useProfile } from "../../../hooks/useProfile";
import { toast } from "sonner";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";

export default function ProfileSection() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { profile, updateProfile } = useProfile();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userEmail = session?.user?.email || "";
  const userName = profile?.full_name || t("settings.profile.unknownUser");

  // The Magic Fallback: Generates a unique avatar based on their email
  const fallbackAvatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${userEmail}&backgroundColor=transparent`;
  const avatarSrc = profile?.avatar_url || fallbackAvatar;

  // Handle Avatar Upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file || !session?.user?.id) return;

      const fileExt = file.name.split(".").pop();
      const filePath = `${session.user.id}/avatar-${Math.random()}.${fileExt}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // 3. Update Profile Database
      await updateProfile.mutateAsync({ avatar_url: publicUrl });

      toast.success(t("settings.profile.avatarUpdated"), {
        description: t("settings.profile.avatarSuccess"),
      });
    } catch (error) {
      toast.error(t("settings.profile.uploadFailed"), {
        description: (error as Error).message || t("settings.profile.uploadError"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SettingsGroup title={t("settings.profile.title")}>
      <Panel>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
              <img
                src={avatarSrc}
                alt={t("settings.profile.title")}
                className={`w-full h-full object-cover transition-opacity ${isUploading ? "opacity-40" : ""}`}
              />
            </div>
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-on-surface animate-spin">progress_activity</span>
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-on-surface truncate">{userName}</p>
            <p className="text-[13px] text-on-surface-variant truncate">{userEmail}</p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label={t("settings.profile.title")}
            className="w-10 h-10 shrink-0 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors inline-flex items-center justify-center disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">{isUploading ? "sync" : "photo_camera"}</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
      </Panel>
    </SettingsGroup>
  );
}
