import { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useProfile } from "../../../hooks/useProfile";
import { toast } from "sonner";

export default function ProfileSection() {
  const { session } = useAuth();
  const { profile, updateProfile } = useProfile();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userEmail = session?.user?.email || "";
  const userName = profile?.full_name || "Unknown User";

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

      toast.success("Avatar updated", {
        description: "Your vault profile has been secured.",
      });
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Could not update profile picture.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="col-span-12 lg:col-span-7">
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Avatar Container with Overlapping Edit */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-surface-container overflow-hidden border border-outline-variant/20">
              <img
                src={avatarSrc}
                alt="Profile"
                className={`w-full h-full object-cover ${isUploading ? "opacity-50 blur-sm" : ""}`}
              />
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all border-2 border-surface-container-lowest"
            >
              <span className="material-symbols-outlined text-[14px]">{isUploading ? "sync" : "edit"}</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-black text-on-surface font-headline tracking-tight truncate">{userName}</h2>
            <p className="text-on-surface-variant font-medium text-sm truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
