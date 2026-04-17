import ExpensesHeader from "./components/ExpensesHeader";
import MetricsRow from "./components/MetricsRow";
import SpendingTrendChart from "./components/SpendingTrendChart";
import CategoryDonut from "./components/CategoryDonut";
import IncomeVsExpenseChart from "./components/IncomeVsExpenseChart";
import FilterPanel from "./components/FilterPanel";
import CompactRecentFlow from "./components/CompactRecentFlow";

export default function Expenses() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-4 md:px-8 py-6 max-w-7xl mx-auto">
      
      <ExpensesHeader />
      <MetricsRow />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Top Row: Trend (8) + Donut (4) */}
        <div className="lg:col-span-8">
          <SpendingTrendChart /> 
        </div>
        <div className="lg:col-span-4">
          <CategoryDonut />
        </div>

        {/* Middle Row: Bar Chart (8) + Filter Panel (4) */}
        <div className="lg:col-span-8">
          <IncomeVsExpenseChart />
        </div>
        <div className="lg:col-span-4 h-full">
          {/* Brought your filter panel back right here! */}
          <FilterPanel />
        </div>

        {/* Bottom Row: Table (12) */}
        <div className="lg:col-span-12">
          <CompactRecentFlow />
        </div>

      </div>
    </div>
  );
}