import { useSearchParams } from "react-router-dom";
import { Filter, Calendar, CheckSquare, BarChart3, List } from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight">
          Search Results for <span className="text-primary">"{query}"</span>
        </h1>
        <p className="text-sm font-medium text-on-surface-variant mt-2 opacity-80">
          Showing intelligent matches across your entire financial vault.
        </p>
      </div>

      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Advanced Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-on-surface font-bold">
              <Filter size={18} className="text-primary" />
              <h3>Advanced Filters</h3>
            </div>

            <div className="space-y-6">
              {/* Date Range Placeholder */}
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Timeframe</h4>
                <button className="w-full flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:border-primary/50 transition-colors">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-on-surface-variant" />
                    Last 30 Days
                  </span>
                </button>
              </div>

              {/* Categories/Types Checkboxes */}
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-3">
                  {["Expenses", "Assets", "Subscriptions"].map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded border-2 border-outline-variant/50 group-hover:border-primary flex items-center justify-center transition-colors">
                        <CheckSquare size={14} className="text-transparent group-hover:text-primary/50" />
                      </div>
                      <span className="text-sm font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Column: Data Visualization */}
        <section className="lg:col-span-5 flex flex-col">
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 text-on-surface font-bold">
              <BarChart3 size={18} className="text-secondary" />
              <h3>Data Visualization</h3>
            </div>
            
            <div className="flex-1 border-2 border-dashed border-outline-variant/20 rounded-xl flex items-center justify-center bg-surface-container-lowest/50">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto text-on-surface-variant/30 mb-3" />
                <p className="text-sm font-semibold text-on-surface-variant">
                  Spending graphs and trends for "{query}"<br />will be rendered here.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Transaction / Item Results */}
        <section className="lg:col-span-4 flex flex-col">
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 text-on-surface font-bold">
              <List size={18} className="text-tertiary" />
              <h3>Matching Items</h3>
            </div>

            <div className="flex-1 space-y-3">
              {/* Dummy Result Items */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl flex items-center justify-between hover:bg-surface-container hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary font-bold text-xs">
                      #{i}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        Result item {i}
                      </p>
                      <p className="text-xs font-medium text-on-surface-variant">Matching "{query}"</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-on-surface">€0.00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
