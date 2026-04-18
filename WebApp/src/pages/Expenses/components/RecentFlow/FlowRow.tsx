import { formatTransactionDate } from "../../utils/dateFormatters";

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
          Cancel
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteConfirm();
          }}
          className="text-[10px] font-black text-error hover:bg-error/10 uppercase tracking-wider px-2 py-1 rounded-lg transition-colors"
        >
          Delete
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
        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-on-surface hover:bg-surface-container opacity-0 group-hover:opacity-100 transition-all"
        title="Edit"
      >
        <span className="material-symbols-outlined text-[17px]">edit</span>
      </button>
      <button
        onClick={onDeleteClick}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all"
        title="Delete"
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
  return (
    <div
      onClick={() => !isConfirming && onEdit()}
      className={`group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_2fr_1fr_1fr_80px] gap-2 md:gap-4 items-center px-4 md:px-6 py-2 border-b border-outline-variant/5 last:border-0 cursor-pointer transition-colors ${
        isDeleting ? "opacity-40 pointer-events-none" : "hover:bg-surface-container-low/50"
      } ${isConfirming ? "bg-error/5" : ""}`}
    >
      {/* Date — desktop only */}
      <span className="hidden md:block text-[11px] text-on-surface-variant font-bold uppercase tracking-wider shrink-0">
        {formatTransactionDate(tx.date)}
      </span>

      {/* Avatar + description */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-base shrink-0 group-hover:scale-110 transition-transform duration-200">
          {tx.category?.emoji || "💰"}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-on-surface truncate leading-snug">
            {tx.description || tx.category?.name || "Untitled"}
          </p>
          {/* Mobile subtitle: date · category */}
          <p className="md:hidden text-[11px] text-on-surface-variant/60 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{formatTransactionDate(tx.date)}</span>
            {tx.category?.name && (
              <>
                <span className="opacity-40">·</span>
                <span className="font-semibold">
                  {tx.category.emoji} {tx.category.name}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Category pill — desktop only */}
      <div className="hidden md:flex items-center">
        <span className="text-[10px] font-bold text-on-surface-variant/50 px-2 py-1 bg-surface-container rounded-lg uppercase tracking-tighter truncate max-w-full">
          {tx.category?.emoji} {tx.category?.name || "—"}
        </span>
      </div>

      {/* Amount */}
      <span
        className={`text-right md:text-left font-black text-sm tabular-nums tracking-tight ${tx.type === "income" ? "text-green-500" : "text-on-surface"}`}
      >
        {tx.type === "income" ? "+" : ""}${tx.amount.toFixed(2)}
      </span>

      {/* Actions */}
      <div className="hidden md:flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
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
