import ExpensesHeader from "./components/ExpensesHeader";
import MetricsRow from "./components/Metrics";
import SpendingTrendChart from "./components/SpendingTrendChart";
import CategoryDonut from "./components/CategoryDonut";
import IncomeVsExpenseChart from "./components/IncomeVsExpenseChart";
import QuickInsights from "./components/QuickInsights";
import CompactRecentFlow from "./components/CompactRecentFlow";
import FilterDrawer from "./components/FilterDrawer";
import { ExpensesProvider } from "../../context/ExpensesContext";

export default function Expenses() {
  return (
    <ExpensesProvider>
      {/* FilterDrawer lives outside the main scroll so it overlays everything */}
      <FilterDrawer />

      {/* THE FIX: Added 'w-full' and 'overflow-x-hidden' to this wrapper */}
      <div className="space-y-6 animate-in fade-in duration-500 px-2 md:px-6 py-6 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Header + inline date presets */}
        <ExpensesHeader />

        {/* Headline metrics */}
        <MetricsRow />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Row 1: Spending Trend (8) + Category Donut (4) */}
          <div className="md:col-span-8">
            <SpendingTrendChart />
          </div>
          <div className="md:col-span-4">
            <CategoryDonut />
          </div>

          {/* Row 2: Income vs Expense (8) + Quick Insights (4) */}
          <div className="md:col-span-8">
            <IncomeVsExpenseChart />
          </div>
          <div className="md:col-span-4">
            <QuickInsights />
          </div>

          {/* Row 3: Transaction list (full width) */}
          <div className="md:col-span-12">
            <CompactRecentFlow />
          </div>
        </div>
      </div>
    </ExpensesProvider>
  );
}
