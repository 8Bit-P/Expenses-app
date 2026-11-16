import { cn } from "../../../../utils/cn";

interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/** A single cell of the KPI strip (the strip itself draws the hairline separators). */
export function CardWrapper({ children, className = "" }: CardWrapperProps) {
  return (
    <div className={cn("bg-surface-container-lowest p-4 md:p-5 flex flex-col min-w-0 min-h-[150px]", className)}>
      {children}
    </div>
  );
}

export function CardLabel({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="eyebrow truncate">{label}</span>
      <span className="material-symbols-outlined text-[16px] text-outline shrink-0">{icon}</span>
    </div>
  );
}
