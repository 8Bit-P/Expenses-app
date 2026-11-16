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
        aria-label={t("layout.notifications.title")}
        className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
          isOpen
            ? "bg-surface-container text-on-surface"
            : "hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>

        {hasNotifications && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-background"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="px-4 h-12 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-sm font-semibold text-on-surface">{t("layout.notifications.title")}</h3>
              <span className="inline-flex items-center h-5 px-1.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                Beta
              </span>
            </div>

            {/* Content Area */}
            <div className="max-h-[400px] overflow-y-auto">
              <div className="flex flex-col items-center justify-center py-10 px-8 text-center">
                <span className="material-symbols-outlined text-[28px] text-outline mb-3">notifications_off</span>
                <h4 className="text-sm font-medium text-on-surface mb-1">{t("layout.notifications.emptyTitle")}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {t("layout.notifications.emptyDesc")}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-outline-variant flex justify-end">
              <button
                disabled
                className="h-8 px-3 rounded-md text-xs font-medium text-on-surface-variant opacity-50 cursor-not-allowed"
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
