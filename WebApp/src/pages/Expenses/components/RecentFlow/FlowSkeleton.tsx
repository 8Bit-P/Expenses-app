import { cn } from "../../../../utils/cn";
import { FLOW_GRID_COLS } from "../../constants";

export default function FlowSkeleton() {
  return (
    <div className="divide-y divide-outline-variant">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cn("flex items-center gap-3 px-5 py-2.5 md:py-0 md:h-12", FLOW_GRID_COLS)}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 animate-pulse bg-surface-container rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="h-3.5 animate-pulse bg-surface-container rounded-lg w-3/5" />
              <div className="h-3 animate-pulse bg-surface-container rounded-lg w-2/5 md:hidden" />
            </div>
          </div>
          <div className="hidden md:block h-3.5 animate-pulse bg-surface-container rounded-lg w-24" />
          <div className="w-16 h-3.5 animate-pulse bg-surface-container rounded-lg shrink-0 md:justify-self-end" />
          <div className="hidden md:block" />
        </div>
      ))}
    </div>
  );
}
