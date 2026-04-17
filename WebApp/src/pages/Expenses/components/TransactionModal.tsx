import { useState, useEffect } from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any; // Pass null for "New", pass object for "Edit"
}

export default function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  // Local state to handle form switching
  const [type, setType] = useState<'expense' | 'income'>('expense');

  // When modal opens, populate it if we are editing
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
    } else {
      setType('expense'); // Default for new
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!transaction;

  return (
    // Overlay
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Window */}
      <div className="bg-surface-container-lowest/90 backdrop-blur-xl w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-extrabold text-on-surface tracking-tight font-headline">
              {isEditing ? 'Modify Transaction' : 'New Transaction'}
            </h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
            </button>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            {isEditing ? 'Update the details of your ledger entry.' : 'Record your financial movements with precision.'}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 space-y-6">
          
          {/* Type Toggle */}
          <div className="flex bg-surface-container-low p-1 rounded-xl gap-1">
            <button 
              onClick={() => setType('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                type === 'expense' 
                  ? 'bg-error-container text-error shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_circle_down</span>
              Expense
            </button>
            <button 
              onClick={() => setType('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                type === 'income' 
                  ? 'bg-secondary-container text-secondary shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_circle_up</span>
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="relative group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Amount</label>
            <div className="relative flex items-center">
              <span className="absolute left-6 text-2xl font-bold text-on-surface-variant">$</span>
              <input 
                className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-5 pl-12 pr-6 text-3xl font-black text-on-surface transition-all placeholder:text-on-surface-variant/30 outline-none" 
                type="text" 
                placeholder="0.00"
                defaultValue={transaction?.amount || ""}
              />
            </div>
          </div>

          {/* Description & Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Description</label>
              <input 
                className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3 px-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
                placeholder="e.g. Grocery Run" 
                type="text"
                defaultValue={transaction?.name || ""}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Category</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3 px-4 text-sm font-semibold text-on-surface outline-none cursor-pointer"
                  defaultValue={transaction?.category || "Dining"}
                >
                  <option>Housing</option>
                  <option>Dining</option>
                  <option>Clothing</option>
                  <option>Utilities</option>
                  <option>Salary</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all"
            >
              Cancel
            </button>
            <button className="flex-2 py-3 px-4 rounded-xl font-bold text-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
              {isEditing ? 'Save Changes' : 'Confirm Entry'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}