interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  className = "",
}: NumberStepperProps) {
  const decrement = () => {
    const next = value - step;
    if (min === undefined || next >= min) onChange(next);
  };

  const increment = () => {
    const next = value + step;
    if (max === undefined || next <= max) onChange(next);
  };

  const canDecrement = min === undefined || value - step >= min;
  const canIncrement = max === undefined || value + step <= max;

  return (
    <div
      className={`inline-flex items-center gap-0 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/15 ${className}`}
    >
      {/* Decrement */}
      <button
        onClick={decrement}
        disabled={!canDecrement}
        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors disabled:opacity-30"
      >
        <span className="material-symbols-outlined text-[16px]">remove</span>
      </button>

      {/* Value display */}
      <div className="flex items-center gap-0.5 px-2 min-w-12 justify-center">
        {prefix && <span className="text-xs font-bold text-on-surface-variant">{prefix}</span>}
        <span className="text-sm font-black text-on-surface tabular-nums">{value}</span>
        {suffix && <span className="text-xs font-bold text-on-surface-variant">{suffix}</span>}
      </div>

      {/* Increment */}
      <button
        onClick={increment}
        disabled={!canIncrement}
        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors disabled:opacity-30"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
      </button>
    </div>
  );
}
