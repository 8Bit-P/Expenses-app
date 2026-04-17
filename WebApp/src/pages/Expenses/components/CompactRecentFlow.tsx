import { useState } from "react";
import TransactionModal from "./TransactionModal";

export default function CompactRecentFlow() {
  // 1. State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const transactions = [
    {
      id: 1,
      name: "Walmart",
      date: "Nov 28th",
      amount: "13.87",
      type: "expense",
      category: "Clothing",
      emoji: "🛍️",
      account: "Credit Card",
    },
    {
      id: 2,
      name: "Gusto Pay",
      date: "Nov 30th",
      amount: "2800.00",
      type: "income",
      category: "Salary",
      emoji: "💼",
      account: "Checking",
    },
    {
      id: 3,
      name: "Starbucks",
      date: "Dec 1st",
      amount: "5.73",
      type: "expense",
      category: "Dining",
      emoji: "🍔",
      account: "Credit Card",
    },
    {
      id: 4,
      name: "Property Payment Rent",
      date: "Dec 4th",
      amount: "1984.00",
      type: "expense",
      category: "Housing",
      emoji: "🏡",
      account: "Checking",
    },
  ];

  // Handler to open modal in "Edit" mode
  const handleEditClick = (tx: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click if you have one
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold font-headline text-on-surface">
            Recent Flow
          </h4>
          <button className="text-[10px] font-black text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest group">
            View Statement
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 scale-[0.7] origin-center">
              call_made
            </span>
          </button>
        </div>

        {/* List Container */}
        <div className="flex flex-col -mx-2 px-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={(e) => handleEditClick(tx, e)}
              className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[100px_1fr_120px_100px_40px] gap-3 sm:gap-4 items-center py-4 sm:py-3.5 group hover:bg-surface-container-low/60 transition-all rounded-2xl cursor-pointer relative border-b border-outline-variant/10 last:border-0"
            >
              {/* Date - Hidden on mobile, shown on SM+ */}
              <span className="hidden sm:block text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                {tx.date}
              </span>

              {/* Transaction Main Info */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface-container flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {tx.emoji}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm sm:text-base text-on-surface tracking-tight truncate leading-tight">
                    {tx.name}
                  </span>
                  {/* Category & Date - Mobile Only variant */}
                  <div className="flex items-center gap-2 sm:hidden mt-0.5">
                    <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded">
                      {tx.category}
                    </span>
                    <span className="text-[10px] font-medium text-on-surface-variant/60">
                      • {tx.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category - Desktop Only */}
              <div className="hidden sm:flex items-center justify-end">
                <span className="text-[11px] font-bold text-on-surface-variant/40 px-2 py-1 bg-surface-container-low rounded-md truncate uppercase tracking-tighter">
                  {tx.category}
                </span>
              </div>

              {/* Amount */}
              <div className="flex flex-col items-end">
                <span
                  className={`font-black text-sm sm:text-base tabular-nums tracking-tight ${
                    tx.type === "income" ? "text-secondary" : "text-on-surface"
                  }`}
                >
                  {tx.type === "income" ? `+$${tx.amount}` : `$${tx.amount}`}
                </span>
                <span className="sm:hidden text-[10px] font-bold text-on-surface-variant/40 uppercase">
                  {tx.account}
                </span>
              </div>

              {/* Actions Menu (3 dots) - Hidden on smallest mobile if space is tight, but we'll keep it for editing */}
              <div className="flex justify-end pr-1">
                <button
                  onClick={(e) => handleEditClick(tx, e)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container sm:opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    more_vert
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination / Load More */}
        <div className="pt-4 mt-2 border-t border-outline-variant/10 flex justify-center">
          <button className="text-[11px] font-bold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-surface-container-low">
            Load More Movements
          </button>
        </div>
      </div>

      {/* The Modal Component */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
      />
    </>
  );
}
