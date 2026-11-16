import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAccounts } from "../../../hooks/useAccounts";
import VaultConfirmationModal from "../../../components/ui/VaultConfirmationModal";
import type { AccountWithBalance } from "../../../types/accounts";

const PRESET_COLORS = [
  "#6366f1", // indigo (default)
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#64748b", // slate
];

const PRESET_ICONS = ["🏦", "💳", "💵", "💰", "🏧", "🪙", "💹", "🏠", "✈️", "🎯"];

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: AccountWithBalance | null; // if provided → edit mode
}

export default function AccountModal({ isOpen, onClose, account }: AccountModalProps) {
  const { t } = useTranslation();
  const { createAccount, updateAccount, deleteAccount } = useAccounts();

  const isEditing = !!account;

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🏦");
  const [color, setColor] = useState("#6366f1");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (account) {
        // Reset form fields whenever the modal opens (intentional sync from props).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(account.name);
        setIcon(account.icon || "🏦");
        setColor(account.color || "#6366f1");
      } else {
        setName("");
        setIcon("🏦");
        setColor("#6366f1");
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, account]);

  const isSaving = createAccount.isPending || updateAccount.isPending;
  const isDeleting = deleteAccount.isPending;
  const canSave = name.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    if (isEditing && account) {
      await updateAccount.mutateAsync({ id: account.id, updates: { name: name.trim(), icon, color } });
    } else {
      await createAccount.mutateAsync({ name: name.trim(), icon, color });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!account) return;
    await deleteAccount.mutateAsync(account.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant max-h-[90dvh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4 pl-5 pr-3 py-3.5 border-b border-outline-variant shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${color}1f`, boxShadow: `inset 0 0 0 1px ${color}40` }}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-on-surface leading-5 truncate">
                      {isEditing ? t("accounts.modal.edit.title") : t("accounts.modal.create.title")}
                    </h2>
                    <p className="text-xs text-on-surface-variant truncate">
                      {isEditing ? t("accounts.modal.edit.subtitle") : t("accounts.modal.create.subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t("common.cancel")}
                  className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5 space-y-5 overflow-y-auto">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">
                    {t("accounts.nameLabel")}
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("accounts.namePlaceholder")}
                    className="w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                </div>

                {/* Icon Picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">
                    {t("accounts.iconLabel")}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_ICONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setIcon(emoji)}
                        aria-pressed={icon === emoji}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border transition-colors ${
                          icon === emoji
                            ? "border-on-surface bg-surface-container"
                            : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">
                    {t("accounts.colorLabel")}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        aria-pressed={color === c}
                        aria-label={c}
                        className={`w-7 h-7 rounded-full transition-shadow flex items-center justify-center ${
                          color === c
                            ? "ring-2 ring-on-surface ring-offset-2 ring-offset-surface-container-lowest"
                            : "hover:ring-1 hover:ring-outline hover:ring-offset-2 hover:ring-offset-surface-container-lowest"
                        }`}
                        style={{ background: c }}
                      >
                        {color === c && (
                          <span className="material-symbols-outlined text-white text-[14px]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 px-5 py-4 border-t border-outline-variant shrink-0">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSaving || isDeleting}
                    aria-label={t("common.delete")}
                    title={t("common.delete")}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-error hover:border-error/30 hover:bg-error/10 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving || isDeleting}
                    className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  >
                    {t("common.cancel")}
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || isDeleting || !canSave}
                    className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
                  >
                    {isSaving
                      ? isEditing
                        ? t("accounts.modal.edit.saving")
                        : t("accounts.modal.create.saving")
                      : isEditing
                        ? t("accounts.modal.edit.save")
                        : t("accounts.modal.create.save")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <VaultConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t("accounts.deleteConfirm.title")}
        description={t("accounts.deleteConfirm.description")}
        confirmLabel={t("accounts.deleteConfirm.confirm")}
        cancelLabel={t("accounts.deleteConfirm.cancel")}
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
