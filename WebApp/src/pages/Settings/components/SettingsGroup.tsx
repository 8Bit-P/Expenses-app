import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

interface SettingsGroupProps {
  title: ReactNode;
  description?: ReactNode;
  /** Optional element rendered under the description in the left column */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}

/**
 * Classic settings row: title + description on the left, controls on the right (stacked on mobile).
 */
export default function SettingsGroup({
  title,
  description,
  aside,
  children,
  className,
  titleClassName,
}: SettingsGroupProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 md:gap-10 py-8 first:pt-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className={cn("text-[15px] font-semibold text-on-surface", titleClassName)}>{title}</h2>
        {description && (
          <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed max-w-xs">{description}</p>
        )}
        {aside}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
