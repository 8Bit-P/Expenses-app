import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface PageHeaderProps {
  title: ReactNode;
  /** Small uppercase line above the title (e.g. today's date or section) */
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Editorial page title: serif display heading, optional eyebrow, description and actions.
 */
export default function PageHeader({ title, eyebrow, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-outline-variant",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h1 className="font-display text-[40px] md:text-[48px] leading-[1] tracking-[-0.01em] text-on-surface">
          {title}
        </h1>
        {description && <p className="text-sm text-on-surface-variant mt-2 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
