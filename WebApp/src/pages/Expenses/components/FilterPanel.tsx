export default function FilterPanel() {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Filter Narrative</h4>
        <button className="text-primary text-xs font-bold hover:underline">Reset</button>
      </div>
      
      <div className="space-y-5">
        {/* Transaction Type Filter */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant block mb-2">Flow Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-primary text-white py-2 rounded-lg text-xs font-bold shadow-sm">All</button>
            <button className="bg-surface-container-lowest text-on-surface hover:bg-white py-2 rounded-lg text-xs font-bold transition-colors">Income</button>
            <button className="bg-surface-container-lowest text-on-surface hover:bg-white py-2 rounded-lg text-xs font-bold transition-colors">Expense</button>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant block mb-2">Category Focus</label>
          <select className="w-full bg-surface-container-lowest border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all py-3 cursor-pointer">
            <option>All Categories</option>
            <option>Housing & Utilities</option>
            <option>Dining & Lifestyle</option>
            <option>Transport</option>
            <option>Salary & Wages</option>
          </select>
        </div>
        
        {/* Amount Range (Simple visual representation) */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant block mb-2">Amount Range</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min $" className="w-full bg-surface-container-lowest border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 py-2" />
            <span className="text-outline-variant font-bold">-</span>
            <input type="number" placeholder="Max $" className="w-full bg-surface-container-lowest border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 py-2" />
          </div>
        </div>
      </div>
    </div>
  );
}