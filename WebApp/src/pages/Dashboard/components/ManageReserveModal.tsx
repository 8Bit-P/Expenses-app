import { X, Unlock, Trash2, Trophy, Shield } from "lucide-react";
import { useReserves, type Reserve } from "../../../hooks/useReserves";
import { useState } from "react";
import VaultConfirmationModal from "../../../components/ui/VaultConfirmationModal";

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

  if (!isOpen || !reserve) return null;

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
    } catch (err) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-sm rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="px-6 py-6 border-b border-outline-variant/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black text-on-surface tracking-tight font-headline">
              {t("dashboard.reserves.manageGoal")}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl mb-2">
            <div className="text-2xl">{reserve.icon}</div>
            <div>
              <p className="text-sm font-black text-on-surface leading-none mb-1">{reserve.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                {t("dashboard.reserves.currentStatus", { status: t("dashboard.reserves.active") })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setConfirmAction("complete")}
            disabled={isActionLoading}
            className="flex items-center gap-4 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-400 leading-none mb-1">
                {t("dashboard.reserves.actions.markCompleted.label")}
              </p>
              <p className="text-[10px] font-medium text-emerald-400/60 leading-tight">
                {t("dashboard.reserves.actions.markCompleted.desc")}
              </p>
            </div>
          </button>

          <button
            onClick={() => setConfirmAction("release")}
            disabled={isActionLoading || reserve.current_amount <= 0}
            className="flex items-center gap-4 p-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-all group text-left disabled:opacity-50 disabled:grayscale"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-amber-400 leading-none mb-1">
                {t("dashboard.reserves.actions.releaseFunds.label")}
              </p>
              <p className="text-[10px] font-medium text-amber-400/60 leading-tight">
                {t("dashboard.reserves.actions.releaseFunds.desc")}
              </p>
            </div>
          </button>

          <button
            onClick={() => setConfirmAction("delete")}
            disabled={isActionLoading}
            className="flex items-center gap-4 p-4 bg-error/10 hover:bg-error/20 border border-error/20 rounded-xl transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-error flex items-center justify-center text-white shadow-lg shadow-error/20 group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-error leading-none mb-1">
                {t("dashboard.reserves.actions.deleteReserve.label")}
              </p>
              <p className="text-[10px] font-medium text-error/60 leading-tight">
                {t("dashboard.reserves.actions.deleteReserve.desc")}
              </p>
            </div>
          </button>
        </div>

        <div className="px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            {t("dashboard.reserves.cancel")}
          </button>
        </div>
      </div>

      <VaultConfirmationModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeAction}
        isLoading={isActionLoading}
        {...(confirmProps || { title: "", description: "" })}
      />
    </div>
  );
}
