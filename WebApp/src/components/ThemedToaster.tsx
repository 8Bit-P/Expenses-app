import { Toaster } from "sonner";
import { useUserPreferences } from "../context/UserPreferencesContext";

export function ThemedToaster() {
  const { resolvedTheme } = useUserPreferences();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme}
      toastOptions={{
        classNames: {
          toast:
            "group relative overflow-hidden !bg-surface-container-lowest/95 backdrop-blur-xl !border border-outline-variant/20 text-on-surface rounded-[20px] shadow-2xl shadow-black/10 font-medium tracking-tight !p-4 flex items-start gap-3 transition-all duration-300",
          success: "!border-emerald-500/30 !bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          error: "!border-error/30 !bg-error/10 text-error",
          info: "!border-primary/30 !bg-primary/10 text-primary",
          warning: "!border-orange-500/30 !bg-orange-500/10 text-orange-600 dark:text-orange-400",
          title: "text-[13px] font-black uppercase tracking-widest text-on-surface leading-none",
          description: "text-[11px] font-semibold text-on-surface-variant/70 mt-1.5 leading-relaxed",
          actionButton:
            "bg-primary text-on-primary font-black uppercase tracking-widest text-[10px] rounded-xl px-4 py-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20",
          icon: "text-lg shrink-0 mt-0.5",
        },
      }}
    />
  );
}
