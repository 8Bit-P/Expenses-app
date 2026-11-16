import { X, Unlock, Trash2, Trophy, Shield, ChevronRight } from "lucide-react";
import { useReserves, type Reserve } from "../../../hooks/useReserves";
import { useState } from "react";
import VaultConfirmationModal from "../../../components/ui/VaultConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";

interface ManageReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserve: Reserve | null;
}

import { useTranslation } from "react-i18next";

export default function ManageReserveModal({ isOpen, onClose, reserve }: ManageReserveModalProps) {
  const { t } = useTranslation();
  const { completeReserve, releaseFunds, deleteReserve } = useReserves();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"complete" | "release" | "delete" | null>(null);

  const executeAction = async () => {
    if (!confirmAction || !reserve) return;
    setIsActionLoading(true);
    try {
      if (confirmAction === "complete") {
        await completeReserve.mutateAsync(reserve);
      } else if (confirmAction === "release") {
        await releaseFunds.mutateAsync(reserve);
      } else {
        await deleteReserve.mutateAsync(reserve.id);
      }
      onClose();
    } catch {
      // Errors handled by hook toasts
    } finally {
      setIsActionLoading(false);
      setConfirmAction(null);
    }
  };

  const getConfirmProps = () => {
    switch (confirmAction) {
      case "delete":
        return {
          title: t("dashboard.reserves.confirm.delete.title"),
          description: t("dashboard.reserves.confirm.delete.desc"),
          confirmLabel: t("dashboard.reserves.confirm.delete.confirm"),
          variant: "danger" as const,
        };
      case "release":
        return {
          title: t("dashboard.reserves.confirm.release.title"),
          description: t("dashboard.reserves.confirm.release.desc"),
          confirmLabel: t("dashboard.reserves.confirm.release.confirm"),
          variant: "warning" as const,
        };
      case "complete":
        return {
          title: t("dashboard.reserves.confirm.complete.title"),
          description: t("dashboard.reserves.confirm.complete.desc"),
          confirmLabel: t("dashboard.reserves.confirm.complete.confirm"),
          variant: "success" as const,
        };
      default:
        return null;
    }
  };

  const confirmProps = getConfirmProps();

  const actionRowClass =
    "w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed";

  return (
    <AnimatePresence>
      {isOpen && reserve && (
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
            className="relative bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl border border-outline-variant overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pl-5 pr-3 h-14 border-b border-outline-variant">
              <div className="flex items-center gap-2.5 min-w-0">
                <Shield className="w-[18px] h-[18px] text-on-surface-variant shrink-0" />
                <h2 className="text-[15px] font-semibold text-on-surface truncate">
                  {t("dashboard.reserves.manageGoal")}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("dashboard.reserves.cancel")}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Reserve summary */}
            <div className="flex items-center gap-3 px-5 py-4 bg-surface-container-low border-b border-outline-variant">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-lg shrink-0">
                {reserve.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{reserve.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {t("dashboard.reserves.currentStatus", { status: t("dashboard.reserves.active") })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="divide-y divide-outline-variant">
              <button
                type="button"
                onClick={() => setConfirmAction("complete")}
                disabled={isActionLoading}
                className={actionRowClass}
              >
                <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Trophy className="w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-on-surface">
                    {t("dashboard.reserves.actions.markCompleted.label")}
                  </p>
                  <p className="text-xs text-on-surface-variant leading-snug">
                    {t("dashboard.reserves.actions.markCompleted.desc")}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-outline shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setConfirmAction("release")}
                disabled={isActionLoading || reserve.current_amount <= 0}
                className={actionRowClass}
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Unlock className="w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-on-surface">
                    {t("dashboard.reserves.actions.releaseFunds.label")}
                  </p>
                  <p className="text-xs text-on-surface-variant leading-snug">
                    {t("dashboard.reserves.actions.releaseFunds.desc")}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-outline shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setConfirmAction("delete")}
                disabled={isActionLoading}
                className={actionRowClass}
              >
                <div className="w-9 h-9 rounded-lg bg-error/10 text-error flex items-center justify-center shrink-0">
                  <Trash2 className="w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-error">
                    {t("dashboard.reserves.actions.deleteReserve.label")}
                  </p>
                  <p className="text-xs text-on-surface-variant leading-snug">
                    {t("dashboard.reserves.actions.deleteReserve.desc")}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-outline shrink-0" />
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                {t("dashboard.reserves.cancel")}
              </button>
            </div>
          </motion.div>

          <VaultConfirmationModal
            isOpen={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            onConfirm={executeAction}
            isLoading={isActionLoading}
            {...(confirmProps || { title: "", description: "" })}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
