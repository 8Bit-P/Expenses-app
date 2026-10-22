import Panel from "../../../components/ui/Panel";

export default function SavingsGoals() {
  return (
    <Panel
      title="Savings Goals"
      icon="flag"
      flush
      actions={
        <button className="h-8 px-2.5 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
          View All
        </button>
      }
    >
      <ul className="divide-y divide-outline-variant border-t border-outline-variant">
        {/* Placeholder Goal 1 */}
        <li className="px-5 py-3.5 hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-lg shrink-0">
              🎌
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-on-surface truncate">Japan Trip</p>
                <span className="text-sm font-medium tabular-nums text-on-surface">40%</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 mt-0.5">
                <p className="text-xs text-on-surface-variant tabular-nums">Target: €10,000</p>
                <p className="text-xs text-on-surface-variant tabular-nums">€4,000 Saved</p>
              </div>
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary rounded-full w-[40%]" />
              </div>
            </div>
          </div>
        </li>

        {/* Placeholder Goal 2 */}
        <li className="px-5 py-3.5 hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-lg shrink-0">
              🏠
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-on-surface truncate">House Deposit</p>
                <span className="text-sm font-medium tabular-nums text-on-surface">15%</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 mt-0.5">
                <p className="text-xs text-on-surface-variant tabular-nums">Target: €50,000</p>
                <p className="text-xs text-on-surface-variant tabular-nums">€7,500 Saved</p>
              </div>
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-2">
                <div className="h-full bg-secondary rounded-full w-[15%]" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </Panel>
  );
}
