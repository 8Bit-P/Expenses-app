import { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  onAddAction?: () => void;
  addActionLabel?: string;
  size?: "sm" | "md";
}

export function CustomSelect<T extends string = string>({
  value,
  options,
  onChange,
  className = "",
  onAddAction,
  addActionLabel,
  size = "md",
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0] ?? { value: "", label: "" };

  const handleToggle = () => {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const distanceToBottom = window.innerHeight - rect.bottom;
      setDropUp(distanceToBottom < 320);
    }
    setOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-lg border bg-surface-container-lowest text-on-surface font-medium text-left transition-colors focus:outline-none focus-visible:outline-none",
          open ? "border-on-surface" : "border-outline-variant hover:border-outline",
          size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3 text-sm",
        )}
      >
        <span className="truncate">{selected.label}</span>
        <span
          className={cn(
            "material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-150",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 right-0 z-30 min-w-[10rem] overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg",
            dropUp ? "bottom-full mb-1" : "top-full mt-1",
          )}
        >
          <div className="overflow-y-auto max-h-64 py-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full h-9 flex items-center justify-between gap-3 px-3 text-left text-on-surface transition-colors hover:bg-surface-container-low",
                    size === "sm" ? "text-xs" : "text-sm",
                    isSelected ? "font-medium" : "font-normal",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-on-surface shrink-0">check</span>
                  )}
                </button>
              );
            })}

            {onAddAction && (
              <>
                <div className="h-px bg-outline-variant my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onAddAction();
                  }}
                  className={cn(
                    "w-full h-9 flex items-center gap-2 px-3 font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors",
                    size === "sm" ? "text-xs" : "text-sm",
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>{addActionLabel || "Add Item"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
