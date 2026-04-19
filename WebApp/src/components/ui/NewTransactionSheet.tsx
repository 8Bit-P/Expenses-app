import { useState } from "react";
import TransactionModal from "../../pages/Expenses/components/TransactionModal";
import SubscriptionModal from "../../pages/Subscriptions/components/SubscriptionModal";
import { TRANSACTION_KINDS, type TransactionKind } from "../../constants/transactions";

interface NewTransactionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewTransactionSheet({ isOpen, onClose }: NewTransactionSheetProps) {
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  if (!isOpen && !expenseOpen && !subOpen) return null;

  const handleKindSelect = (kind: TransactionKind) => {
    if (kind === "expense") {
      setExpenseOpen(true);
    } else if (kind === "subscription") {
      setSubOpen(true);
    }
  };

  const handleExpenseClose = () => {
    setExpenseOpen(false);
    onClose();
  };

  const handleSubClose = () => {
    setSubOpen(false);
    onClose();
  };

  return (
    <>
      {/* Type Picker Overlay */}
      {isOpen && !expenseOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={onClose}
        >
          {/* Sheet panel */}
          <div
            className="relative w-full sm:max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden"
            style={{ animation: "ntSheetIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-8 h-1 rounded-full bg-outline-variant/40" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-on-surface tracking-tight font-headline">New Transaction</h2>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  What type would you like to record?
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
              </button>
            </div>

            {/* Kind options */}
            <div className="px-4 pb-6 space-y-2.5">
              {TRANSACTION_KINDS.map(({ kind, icon, label, description, available, gradient, iconBg, iconColor }) => (
                <button
                  key={kind}
                  onClick={() => handleKindSelect(kind)}
                  disabled={!available}
                  className={`group w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left
                    ${
                      available
                        ? `bg-gradient-to-r ${gradient} border-outline-variant/20 hover:border-outline-variant/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer`
                        : "border-outline-variant/10 bg-surface-container/40 cursor-not-allowed opacity-60"
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 ${available ? "group-hover:scale-110" : ""}`}
                  >
                    <span className={`material-symbols-outlined text-[24px] ${iconColor}`}>{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface flex items-center gap-2">
                      {label}
                      {!available && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20">
                          Soon
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">{description}</p>
                  </div>
                  {available && (
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-[18px] shrink-0 transition-all duration-200 group-hover:text-on-surface-variant group-hover:translate-x-0.5">
                      chevron_right
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      <TransactionModal isOpen={expenseOpen} onClose={handleExpenseClose} />

      {/* Subscription Modal */}
      <SubscriptionModal isOpen={subOpen} onClose={handleSubClose} />

      <style>{`
        @keyframes ntSheetIn {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 640px) {
          @keyframes ntSheetIn {
            from { transform: scale(0.95) translateY(8px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
        }
      `}</style>
    </>
  );
}
