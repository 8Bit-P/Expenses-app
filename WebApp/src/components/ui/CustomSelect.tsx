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
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between gap-2 border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high transition-colors font-semibold text-on-surface group focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          size === "sm" ? "py-2 px-3 rounded-lg text-xs" : "py-2.5 px-4 rounded-xl text-sm"
        }`}
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
            absolute left-0 right-0 z-30
            bg-surface-container-lowest border border-outline-variant/20
            shadow-2xl overflow-hidden
            animate-in fade-in zoom-in-95 duration-150
            ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}
            ${size === "sm" ? "rounded-md" : "rounded-xl"}
          `}
        >
          <div className="overflow-y-auto max-h-64">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 text-left transition-colors font-semibold ${
                    size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
                  } ${isSelected ? "bg-primary/10 text-primary" : "text-on-surface hover:bg-surface-container-low"}`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check</span>
                  )}
                </button>
              );
            })}

            {onAddAction && (
              <>
                <div className="h-px bg-outline-variant/10 my-0.5 mx-2" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onAddAction();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-primary hover:bg-surface-container transition-colors"
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
