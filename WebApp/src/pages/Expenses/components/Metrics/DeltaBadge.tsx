export function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct > 0;
  const tone = up ? "bg-error/10 text-error" : "bg-secondary/10 text-secondary";
  const arrow = up ? "↑" : "↓";
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={`inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium tabular-nums ${tone}`}>
        {arrow} {Math.abs(pct).toFixed(0)}%
      </span>
      <span className="text-xs text-on-surface-variant">vs prev.</span>
    </span>
  );
}
