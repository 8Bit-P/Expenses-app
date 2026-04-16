import { useState } from 'react';
import TransactionModal from './TransactionModal';

export default function CompactRecentFlow() {
  // 1. State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const transactions = [
    { id: 1, name: "Walmart", date: "Nov 28th", amount: "13.87", type: "expense", category: "Clothing", emoji: "🛍️", account: "Credit Card" },
    { id: 2, name: "Gusto Pay", date: "Nov 30th", amount: "2800.00", type: "income", category: "Salary", emoji: "💼", account: "Checking" },
    { id: 3, name: "Starbucks", date: "Dec 1st", amount: "5.73", type: "expense", category: "Dining", emoji: "🍔", account: "Credit Card" },
    { id: 4, name: "Property Payment Rent", date: "Dec 4th", amount: "1984.00", type: "expense", category: "Housing", emoji: "🏡", account: "Checking" },
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
          <h4 className="text-lg font-bold font-headline text-on-surface">Recent Flow</h4>
          <button className="text-[10px] font-black text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest group">
            View Statement 
            <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              call_made
            </span>
          </button>
        </div>

        {/* List Container */}
        <div className="flex flex-col">
          {transactions.map((tx) => (
            // Added 30px to the end of the grid for the 3-dot menu
            <div 
              key={tx.id} 
              className="grid grid-cols-[90px_1fr_120px_100px_30px] gap-4 items-center py-2.5 group hover:bg-surface-container-low/50 transition-colors -mx-2 px-2 rounded-lg cursor-pointer relative"
            >
              <span className="text-[11px] text-on-surface-variant font-semibold">{tx.date}</span>

              <div className="flex items-center gap-4">
                <span className="text-[16px] filter grayscale-[0.2] group-hover:grayscale-0 transition-all">{tx.emoji}</span>
                <span className="font-bold text-sm text-on-surface tracking-tight truncate">{tx.name}</span>
              </div>

              <span className="text-[11px] font-medium text-on-surface-variant/40 text-right pr-4 truncate">
                {tx.category}
              </span>

              <span className={`font-bold text-sm text-right tabular-nums ${tx.type === 'income' ? 'text-secondary' : 'text-on-surface'}`}>
                {tx.type === 'income' ? `+$${tx.amount}` : `$${tx.amount}`}
              </span>
              
              {/* Actions Menu (3 dots) */}
              <button 
                onClick={(e) => handleEditClick(tx, e)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container opacity-0 group-hover:opacity-100 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
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