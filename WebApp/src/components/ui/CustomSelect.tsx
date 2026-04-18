import { useState, useRef, useEffect } from "react";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  options,
  onChange,
  className = "",
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

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
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 py-2.5 px-4 rounded-xl border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high transition-colors text-sm font-semibold text-on-surface group focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <span className="truncate">{selected.label}</span>
        <span
          className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={`
            absolute left-0 right-0 mt-2 z-[60]
            bg-surface-container-lowest border border-outline-variant/20
            rounded-xl shadow-2xl overflow-y-auto max-h-64
            animate-in fade-in zoom-in-95 duration-150
          `}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-left transition-colors ${
                  isSelected ? "bg-primary/10 text-primary" : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
