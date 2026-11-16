import { useState } from "react";
import { useTranslation } from "react-i18next";
import TransactionModal from "../../pages/Expenses/components/TransactionModal";
import SubscriptionModal from "../../pages/Subscriptions/components/SubscriptionModal";
import LogSnapshotModal from "../../pages/Investments/components/LogSnapshotModal";
import { TRANSACTION_KINDS, type TransactionKind } from "../../constants/transactions";
import { useInvestments } from "../../hooks/useInvestments";

interface NewTransactionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewTransactionSheet({ isOpen, onClose }: NewTransactionSheetProps) {
  const { t } = useTranslation();
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  
  const { assets } = useInvestments();

  if (!isOpen && !expenseOpen && !subOpen && !snapshotOpen) return null;

  const handleKindSelect = (kind: TransactionKind) => {
    if (kind === "expense") {
      setExpenseOpen(true);
    } else if (kind === "subscription") {
      setSubOpen(true);
    } else if (kind === "investment") {
      setSnapshotOpen(true);
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

  const handleSnapshotClose = () => {
    setSnapshotOpen(false);
    onClose();
  };

  return (
    <>
      {/* Type Picker Overlay */}
      {isOpen && !expenseOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
          onClick={onClose}
        >
          {/* Sheet panel */}
          <div
            className="relative w-full sm:max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl border border-outline-variant shadow-2xl overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
            style={{ animation: "ntSheetIn 0.2s cubic-bezier(0.2,0.8,0.2,1) both" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-2.5 sm:hidden">
              <div className="w-9 h-1 rounded-full bg-outline-variant" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-4 border-b border-outline-variant">
              <div>
                <h2 className="text-base font-semibold text-on-surface">{t("newTransaction.title")}</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">{t("newTransaction.subtitle")}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 -mr-1.5 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Kind options */}
            <div className="divide-y divide-outline-variant">
              {TRANSACTION_KINDS.map(({ kind, icon, available, iconBg, iconColor }) => (
                <button
                  key={kind}
                  onClick={() => handleKindSelect(kind)}
                  disabled={!available}
                  className={`group w-full flex items-center gap-3.5 px-5 py-4 text-left transition-colors ${
                    available ? "hover:bg-surface-container-low" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-[22px] ${iconColor}`}>{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-on-surface flex items-center gap-2">
                      {t(`newTransaction.${kind}.label`)}
                      {!available && (
                        <span className="inline-flex items-center h-5 px-1.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                          {t("newTransaction.soon")}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{t(`newTransaction.${kind}.desc`)}</p>
                  </div>
                  {available && (
                    <span className="material-symbols-outlined text-outline text-[18px] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-on-surface">
                      arrow_forward
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

      {/* Investment Snapshot Modal */}
      <LogSnapshotModal isOpen={snapshotOpen} onClose={handleSnapshotClose} assets={assets} />

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
