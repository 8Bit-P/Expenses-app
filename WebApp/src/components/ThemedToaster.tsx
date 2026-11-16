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
            "group !bg-surface-container-lowest !border !border-outline-variant !border-l-[3px] !border-l-outline !text-on-surface !rounded-lg !shadow-xl !p-3.5 flex items-start gap-3 font-body",
          success: "!border-l-secondary [&_[data-icon]]:!text-secondary",
          error: "!border-l-error [&_[data-icon]]:!text-error",
          info: "!border-l-tertiary [&_[data-icon]]:!text-tertiary",
          warning: "!border-l-amber-500 [&_[data-icon]]:!text-amber-500",
          title: "!text-[13px] !font-semibold !text-on-surface !leading-snug",
          description: "!text-xs !text-on-surface-variant mt-0.5 leading-relaxed",
          actionButton:
            "!bg-primary !text-on-primary !font-medium !text-xs !rounded-md !px-3 !h-7 hover:opacity-90 active:scale-95 transition",
          icon: "shrink-0 mt-0.5",
        },
      }}
    />
  );
}