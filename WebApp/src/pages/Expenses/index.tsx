import CategoryDonut from "./components/CategoryDonut";
import CompactRecentFlow from "./components/CompactRecentFlow";
import ExpensesHeader from "./components/ExpensesHeader";
import MetricsRow from "./components/MetricsRow";
import FilterPanel from "./components/FilterPanel";

export default function Expenses() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header with the Date Badge & Global Filters */}
      <ExpensesHeader />

      {/* 2. Top Metrics (Total Spend, Top Category, Subscriptions) */}
      <MetricsRow />

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Spending by Category (Donut) */}
        <div className="lg:col-span-7">
          <CategoryDonut />
        </div>

        {/* Right Column: Filter Panel */}
        <div className="lg:col-span-5">
          <FilterPanel />
        </div>

        {/* Full Width Bottom: Compact Recent Flow */}
        <div className="lg:col-span-12">
          <CompactRecentFlow />
        </div>

      </div>
    </div>
  );
}