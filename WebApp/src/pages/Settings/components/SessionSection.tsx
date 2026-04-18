import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function SessionSection() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth"); // Kick them back to the login screen
  };

  return (
    <section className="col-span-12 lg:col-span-4 space-y-4">
      <h4 className="text-lg font-bold font-headline px-2 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-on-surface-variant">devices</span>
        Session Access
      </h4>

      <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 h-[calc(100%-2.5rem)] flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-container/30 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">smartphone</span>
          </div>
          <div>
            <p className="font-bold text-on-surface text-sm">Current Device</p>
            <p className="text-xs text-secondary font-bold">Active Now</p>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Ensure your vault remains secure by signing out when you are finished on shared devices.
        </p>

        <button
          onClick={handleLogout}
          className="w-full mt-auto py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface font-bold shadow-sm hover:shadow-md hover:text-error transition-all flex items-center justify-center gap-2 group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            logout
          </span>
          Sign Out
        </button>
      </div>
    </section>
  );
}
