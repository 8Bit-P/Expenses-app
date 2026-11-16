import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../../utils/currency";
import { CATEGORY_COLORS } from "../../../../constants/chartColors";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../utils/cn";
import { FLOW_GRID_COLS } from "../../constants";

// Helper to get a stable color for a category name
const getCategoryColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  description?: string;
  category?: { id: string; name: string; emoji?: string | null } | null;
}

interface FlowRowActionsProps {
  isConfirming: boolean;
  onEdit: () => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onDeleteConfirm: () => void;
  onCancelDelete: () => void;
}

function FlowRowActions({ isConfirming, onEdit, onDeleteClick, onDeleteConfirm, onCancelDelete }: FlowRowActionsProps) {
  const { t } = useTranslation();

  if (isConfirming) {
    return (
      <>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancelDelete();
          }}
          className="h-7 px-2 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        >
          {t("expenses.recentFlow.actions.cancel")}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteConfirm();
          }}
          className="h-7 px-2 rounded-md text-xs font-medium bg-error text-white hover:opacity-90 transition"
        >
          {t("expenses.recentFlow.actions.confirmDelete")}
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
        title={t("expenses.recentFlow.actions.edit")}
      >
        <span className="material-symbols-outlined text-[17px]">edit</span>
      </button>
      <button
        onClick={onDeleteClick}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
        title={t("expenses.recentFlow.actions.delete")}
      >
        <span className="material-symbols-outlined text-[17px]">delete</span>
      </button>
    </>
  );
}

interface FlowRowProps {
  tx: Transaction;
  isDeleting: boolean;
  isConfirming: boolean;
  onEdit: () => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onDeleteConfirm: () => void;
  onCancelDelete: () => void;
}

export default function FlowRow({
  tx,
  isDeleting,
  isConfirming,
  onEdit,
  onDeleteClick,
  onDeleteConfirm,
  onCancelDelete,
}: FlowRowProps) {
  const { t } = useTranslation();
  const { currency } = useUserPreferences();
  const catColor = getCategoryColor(tx.category?.name || "Uncategorized");
  const isSubscription = tx.description?.toLowerCase().includes("(auto-renew)");

  return (
    <div
      onClick={() => !isConfirming && onEdit()}
      className={cn(
        "group flex items-center gap-3 px-5 py-2.5 md:py-0 md:h-12 cursor-pointer transition-colors",
        FLOW_GRID_COLS,
        isDeleting ? "opacity-40 pointer-events-none" : "hover:bg-surface-container-low",
        isConfirming && "bg-error/5 shadow-[inset_2px_0_0_var(--error)]",
      )}
    >
      {/* Description (+ category on mobile) */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-base shrink-0 select-none">
          {tx.category?.emoji || "💰"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-on-surface leading-tight flex items-center gap-1.5">
            <span className="truncate">
              {tx.description?.replace(/\(Auto-renew\)/gi, "").trim() || tx.category?.name || t("common.untitled")}
            </span>
            {isSubscription && (
              <span
                className="material-symbols-outlined text-[14px] text-tertiary shrink-0"
                title={t("common.subscription")}
              >
                sync
              </span>
            )}
          </p>
          <p className="md:hidden text-xs text-on-surface-variant mt-0.5 truncate">{tx.category?.name || "—"}</p>
        </div>
      </div>

      {/* Category — desktop column */}
      <div className="hidden md:flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: catColor }} />
        <span className="text-[13px] text-on-surface-variant truncate">{tx.category?.name || "—"}</span>
      </div>

      {/* Amount */}
      <div className="shrink-0 text-right">
        <span
          className={cn(
            "text-sm font-medium tabular-nums whitespace-nowrap",
            tx.type === "income" ? "text-secondary" : "text-on-surface",
          )}
        >
          {tx.type === "income" ? "+" : "−"}
          {formatCurrency(tx.amount, currency.code)}
        </span>
      </div>

      {/* Actions — desktop */}
      <div className="hidden md:flex items-center justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
        <FlowRowActions
          isConfirming={isConfirming}
          onEdit={onEdit}
          onDeleteClick={onDeleteClick}
          onDeleteConfirm={onDeleteConfirm}
          onCancelDelete={onCancelDelete}
        />
      </div>
    </div>
  );
}
