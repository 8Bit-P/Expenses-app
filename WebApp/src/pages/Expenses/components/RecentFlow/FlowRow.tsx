import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../../utils/currency";
import { CATEGORY_COLORS } from "../../../../constants/chartColors";
import { useTranslation } from "react-i18next";

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
          className="text-[10px] font-black text-on-surface-variant hover:text-on-surface uppercase tracking-wider px-2 py-1 rounded-lg transition-colors"
        >
          {t("expenses.recentFlow.actions.cancel")}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteConfirm();
          }}
          className="text-[10px] font-black text-error hover:bg-error/10 uppercase tracking-wider px-2 py-1 rounded-lg transition-colors"
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
        className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
        title={t("expenses.recentFlow.actions.edit")}
      >
        <span className="material-symbols-outlined text-[15px]">edit</span>
      </button>
      <button
        onClick={onDeleteClick}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all"
        title={t("expenses.recentFlow.actions.delete")}
      >
        <span className="material-symbols-outlined text-[15px]">delete</span>
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

  return (
    <div
      onClick={() => !isConfirming && onEdit()}
      className={`group flex items-center gap-4 px-5 md:px-6 py-4 cursor-pointer transition-all duration-150 ${
        isDeleting ? "opacity-30 pointer-events-none scale-[0.98]" : "hover:bg-surface-container-low/60"
      } ${isConfirming ? "bg-error/5 border-l-2 border-error" : "border-l-2 border-transparent"}`}
    >
      {/* Emoji avatar */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: `${catColor}15` }}
      >
        {tx.category?.emoji || "💰"}
      </div>

      {/* Description + category */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-on-surface leading-tight flex items-center gap-1.5">
          <span className="truncate">
            {tx.description?.replace(/\(Auto-renew\)/gi, "").trim() || tx.category?.name || t("common.untitled")}
          </span>
          {tx.description?.toLowerCase().includes("(auto-renew)") && (
            <span className="material-symbols-outlined text-[11px] text-tertiary/50 shrink-0" title={t("common.subscription")}>
              sync
            </span>
          )}
        </h4>
        <p className="text-xs text-on-surface-variant/50 font-medium mt-1 truncate">
          {tx.category?.emoji && <span className="mr-1">{tx.category.emoji}</span>}
          {tx.category?.name || "—"}
        </p>
      </div>

      {/* Amount */}
      <div className="shrink-0 text-right">
        <span
          className={`text-sm font-black tabular-nums tracking-tight ${
            tx.type === "income"
              ? "text-emerald-400"
              : "text-on-surface"
          }`}
        >
          {tx.type === "income" ? "+" : "−"}
          {formatCurrency(tx.amount, currency.code)}
        </span>
      </div>

      {/* Actions — desktop */}
      <div className="hidden md:flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
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
