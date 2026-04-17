export default function FilterPanel() {
  return (
    <div className="bg-surface-container-low/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/10 space-y-8">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Filter Narrative</h4>
        <button className="text-secondary text-[11px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity">Reset</button>
      </div>
      
      <div className="space-y-6">
        {/* Transaction Type Filter */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest ml-1">Flow Type</label>
          <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest/50 p-1 rounded-xl">
            <button className="bg-primary text-white py-2.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all">All</button>
            <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container py-2.5 rounded-lg text-xs font-bold transition-all">Income</button>
            <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container py-2.5 rounded-lg text-xs font-bold transition-all">Expense</button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest ml-1">Category Focus</label>
          <div className="relative">
            <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4 cursor-pointer outline-none">
              <option>All Categories</option>
              <option>Housing & Utilities</option>
              <option>Dining & Lifestyle</option>
              <option>Transport</option>
              <option>Salary & Wages</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60 text-[18px]">expand_more</span>
          </div>
        </div>
        
        {/* Amount Range */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest ml-1">Amount Range</label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Min $" 
              className="w-full bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 py-3 px-4 outline-none placeholder:text-on-surface-variant/30" 
            />
            <div className="h-0.5 w-4 bg-outline-variant/30 rounded-full"></div>
            <input 
              type="text" 
              placeholder="Max $" 
              className="w-full bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 py-3 px-4 outline-none placeholder:text-on-surface-variant/30" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}