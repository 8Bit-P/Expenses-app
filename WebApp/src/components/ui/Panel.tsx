import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface PanelProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Material Symbols icon name shown before the title */
  icon?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Removes body padding (useful for tables / edge-to-edge lists) */
  flush?: boolean;
}

/**
 * Standard content container: white sheet, hairline border, optional header row.
 */
export default function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  bodyClassName,
  flush = false,
}: PanelProps) {
  const hasHeader = title || actions;

  return (
    <section
      className={cn(
        "bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col min-w-0",
        className,
      )}
    >
      {hasHeader && (
        <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2 text-[15px] font-semibold text-on-surface leading-6">
                {icon && (
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{icon}</span>
                )}
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={cn(flush ? "" : hasHeader ? "px-5 pb-5" : "p-5", "flex-1 min-w-0", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}
