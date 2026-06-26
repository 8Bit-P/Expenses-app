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
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
              onClick={onClose}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/20 ring-1 ring-black/5 max-h-[90dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colored top bar */}
              <div className="h-1.5 w-full" style={{ background: color }} />

              {/* Header */}
              <div className="px-7 pt-6 pb-4 border-b border-outline-variant/8">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner"
                      style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}
                    >
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-on-surface tracking-tight font-headline">
                        {isEditing ? t("accounts.modal.edit.title") : t("accounts.modal.create.title")}
                      </h2>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {isEditing ? t("accounts.modal.edit.subtitle") : t("accounts.modal.create.subtitle")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-7 space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {t("accounts.nameLabel")}
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("accounts.namePlaceholder")}
                    className="w-full bg-surface-container border border-outline-variant/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl py-3 px-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                </div>

                {/* Icon Picker */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {t("accounts.iconLabel")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_ICONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setIcon(emoji)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all border ${
                          icon === emoji
                            ? "border-2 shadow-md scale-110"
                            : "border-outline-variant/20 bg-surface-container hover:bg-surface-container-high hover:scale-105"
                        }`}
                        style={icon === emoji ? { borderColor: color, background: `${color}18` } : {}}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {t("accounts.colorLabel")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                          color === c ? "scale-125 ring-2 ring-offset-2 ring-offset-surface-container-lowest" : "hover:scale-110"
                        }`}
                        style={{ background: c, ringColor: c } as React.CSSProperties}
                      >
                        {color === c && (
                          <span className="material-symbols-outlined text-white text-[14px] font-black">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-7 pb-6 flex items-center gap-3">
                <button
                  onClick={onClose}
                  disabled={isSaving || isDeleting}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  {t("common.cancel")}
                </button>

                {isEditing && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSaving || isDeleting}
                    className="w-11 h-11 flex items-center justify-center rounded-xl text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all border border-outline-variant/10"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                )}

                <button
                  onClick={handleSave}
                  disabled={isSaving || isDeleting || !canSave}
                  className="flex-[2] py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:shadow-none"
                  style={{ background: color }}
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
