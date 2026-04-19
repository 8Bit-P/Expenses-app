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
  const language = "English (US)";

  // The Magic Fallback: Generates a unique avatar based on their email
  const fallbackAvatar = `https://api.dicebear.com/7.x/micah/svg?seed=${userEmail}&backgroundColor=transparent`;
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
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-8 shadow-sm h-full">
        <div className="flex items-start justify-between mb-8">
          {/* Avatar & Info Container */}
          <div className="flex items-center gap-6">
            {/* Avatar Wrapper */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-surface-container overflow-hidden border border-outline-variant/20 relative">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className={`w-full h-full object-cover ${isUploading ? "opacity-50 blur-sm" : ""}`}
                />
              </div>

              {/* Edit Avatar Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-surface-container-lowest"
              >
                {isUploading ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                )}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-on-surface font-headline tracking-tight">{userName}</h2>
              <p className="text-on-surface-variant font-medium text-sm">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-1">
              Name
            </span>
            <span className="font-bold text-on-surface text-sm">{userName}</span>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-1">
              Language
            </span>
            <span className="font-bold text-on-surface text-sm">{language}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
