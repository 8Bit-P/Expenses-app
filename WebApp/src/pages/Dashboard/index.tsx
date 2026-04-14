import TotalOutflow from "./components/TotalOutflow";
import ExpenseNarrative from "./components/ExpenseNarrative";
import RecentFlow from "./components/RecentFlow";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Title */}
      <div className="flex flex-col">
        <span className="text-sm font-label text-on-surface-variant tracking-wider uppercase">Overview</span>
        <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mt-1">Expenses</h1>
      </div>

      {/* Responsive Grid: Stacks on mobile, splits on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Column (Left side on desktop) */}
        <div className="lg:col-span-8 space-y-8">
          <TotalOutflow />
          <ExpenseNarrative />
          <RecentFlow />
        </div>

        {/* Secondary Column (Right side on desktop) */}
        <div className="lg:col-span-4 space-y-8">
          {/* We will drop your Donut Chart component here */}
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-headline font-bold text-on-surface mb-4">Spending by Category</h2>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl text-outline">
               Chart Placeholder
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}