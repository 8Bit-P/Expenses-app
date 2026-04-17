import { useExpenses } from "../../../context/ExpensesContext";
import { useCategories } from "../../../hooks/useCategories";
import type { TransactionType } from "../../../types/expenses";

export default function FilterPanel() {
  const { filters, setFilters } = useExpenses();
  const { categories } = useCategories();

  const handleTypeChange = (type: TransactionType | undefined) => {
    setFilters({ ...filters, type });
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters({ ...filters, categoryId: categoryId === 'all' ? undefined : categoryId });
  };

  return (
    <div className="bg-surface-container-low/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/10 space-y-8">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Filter Narrative</h4>
        <button 
          onClick={() => setFilters({})}
          className="text-secondary text-[11px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          Reset
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Transaction Type Filter */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest ml-1">Flow Type</label>
          <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest/50 p-1 rounded-xl">
            <button 
              onClick={() => handleTypeChange(undefined)}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all ${!filters.type ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
            >
              All
            </button>
            <button 
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all ${filters.type === 'income' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
            >
              Income
            </button>
            <button 
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all ${filters.type === 'expense' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest ml-1">Category Focus</label>
          <div className="relative">
            <select 
              value={filters.categoryId || 'all'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4 cursor-pointer outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60 text-[18px]">expand_more</span>
          </div>
        </div>
        
        {/* Amount Range */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest ml-1">Search Keywords</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search memo..." 
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 py-3 px-4 outline-none placeholder:text-on-surface-variant/30" 
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/30 text-[18px]">search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
