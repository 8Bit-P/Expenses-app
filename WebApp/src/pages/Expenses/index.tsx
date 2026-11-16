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

      <div className="space-y-6 w-full min-w-0">
        <ExpensesHeader />

        <MetricsRow />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 min-w-0">
            <SpendingTrendChart />
          </div>
          <div className="lg:col-span-4 min-w-0">
            <CategoryDonut />
          </div>

          <div className="lg:col-span-8 min-w-0">
            <IncomeVsExpenseChart />
          </div>
          <div className="lg:col-span-4 min-w-0">
            <QuickInsights />
          </div>
        </div>

        <CompactRecentFlow />
      </div>
    </ExpensesProvider>
  );
}
