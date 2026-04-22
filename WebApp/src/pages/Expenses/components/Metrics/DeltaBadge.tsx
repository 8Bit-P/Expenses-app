export function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct > 0;
  const color = up ? "text-red-400" : "text-green-500";
  const arrow = up ? "↑" : "↓";
  return (
    <span className={`text-xs font-black ${color} flex items-center gap-0.5`}>
      {arrow} {Math.abs(pct).toFixed(0)}%
      <span className="ml-1 text-on-surface-variant/40 font-medium text-[14px]">vs prev.</span>
    </span>
  );
}
