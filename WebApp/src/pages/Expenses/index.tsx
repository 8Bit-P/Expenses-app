import ExpensesHeader from "./components/ExpensesHeader";
import MetricsRow from "./components/MetricsRow";
import SpendingTrendChart from "./components/SpendingTrendChart";
import CategoryDonut from "./components/CategoryDonut";
import IncomeVsExpenseChart from "./components/IncomeVsExpenseChart";
import FilterPanel from "./components/FilterPanel";
import CompactRecentFlow from "./components/CompactRecentFlow";
import { ExpensesProvider } from "../../context/ExpensesContext";

export default function Expenses() {
  return (
    <ExpensesProvider>
      <div className="space-y-6 animate-in fade-in duration-500 px-4 md:px-6 py-6 max-w-7xl mx-auto">

        <ExpensesHeader />
        <MetricsRow />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Top Row: Trend (8) + Donut (4) */}
          <div className="md:col-span-8">
            <SpendingTrendChart />
          </div>
          <div className="md:col-span-4">
            <CategoryDonut />
          </div>

          {/* Middle Row: Bar Chart (8) + Filter Panel (4) */}
          <div className="md:col-span-8">
            <IncomeVsExpenseChart />
          </div>
          <div className="md:col-span-4">
            <FilterPanel />
          </div>

          {/* Bottom Row: Table (full) */}
          <div className="md:col-span-12">
            <CompactRecentFlow />
          </div>

        </div>
      </div>
    </ExpensesProvider>
  );
}
