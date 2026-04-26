import { useState } from "react";
import { X, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useSecurity } from "../../../hooks/useSecurity";

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { changePassword } = useSecurity();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long."
      });
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("No change detected", {
        description: "The new password must be different from the current one."
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords mismatch", {
        description: "The confirmation password does not match."
      });
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword
      });
      onClose();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // Error handled by hook toasts
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-sm rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 border-b border-outline-variant/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black text-on-surface tracking-tight font-headline">Change Password</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Current Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                <Lock size={18} />
              </div>
              <input
                autoFocus
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3.5 pl-12 pr-12 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all"
                placeholder="Current Credentials"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-outline-variant/10 my-2" />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">New Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3.5 pl-12 pr-12 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all"
                placeholder="New Credentials"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Confirm New Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3.5 pl-12 pr-12 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={changePassword.isPending || !newPassword || !confirmPassword}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {changePassword.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Secure Account"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={changePassword.isPending}
              className="w-full py-3 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-all rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
