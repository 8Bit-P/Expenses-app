import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Logic for showing the notification badge (currently disabled)
  const hasNotifications = false;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 active:scale-95 cursor-pointer ${
          isOpen
            ? "bg-primary/10 text-primary"
            : "hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined">notifications</span>
        
        {/* Red dot badge with a subtle ping animation - only show if there are active notifications */}
        {hasNotifications && (
          <>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error z-10"></span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error animate-ping opacity-75"></span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-on-surface">{t("layout.notifications.title")}</h3>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase">
                Beta
              </span>
            </div>

            {/* Content Area */}
            <div className="max-h-[400px] overflow-y-auto">
              <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-on-surface-variant/20">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                    notifications_off
                  </span>
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-1">{t("layout.notifications.emptyTitle")}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {t("layout.notifications.emptyDesc")}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/10">
              <button
                disabled
                className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 cursor-not-allowed"
              >
                {t("layout.notifications.clearAll")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
