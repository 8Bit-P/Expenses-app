import type { AssetWithSnapshots, AssetType } from "../../../types/investments";

interface AllocationDonutProps {
  assets: AssetWithSnapshots[];
  stealthMode: boolean;
}

const TYPE_CONFIG: Record<AssetType, { label: string; colorClass: string; hex: string }> = {
  fund: { label: "Index Funds", colorClass: "bg-primary", hex: "#3525cd" },
  crypto: { label: "Crypto", colorClass: "bg-tertiary", hex: "#5c00ca" },
  stock: { label: "Stocks", colorClass: "bg-secondary", hex: "#006c49" },
  real_estate: { label: "Real Estate", colorClass: "bg-[#0f0069]", hex: "#0f0069" }, // on-primary-fixed
  cash: { label: "Cash", colorClass: "bg-slate-300", hex: "#cbd5e1" },
  other: { label: "Other", colorClass: "bg-outline", hex: "#777587" },
};

export default function AllocationDonut({ assets, stealthMode }: AllocationDonutProps) {
  // 1. Calculate values per type
  const typeValues: Record<string, number> = {};
  let overallTotal = 0;

  assets.forEach((asset) => {
    const latest = asset.asset_snapshots[0];
    if (latest) {
      const val = Number(latest.total_value);
      typeValues[asset.type] = (typeValues[asset.type] || 0) + val;
      overallTotal += val;
    }
  });

  // 2. Compute percentages and prepare render array
  const allocations = Object.entries(typeValues)
    .filter(([_, val]) => val > 0)
    .map(([type, val]) => {
      const percentage = overallTotal > 0 ? (val / overallTotal) * 100 : 0;
      return {
        type: type as AssetType,
        value: val,
        percentage,
        config: TYPE_CONFIG[type as AssetType] || TYPE_CONFIG.other,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // 3. Generate conic gradient string for smooth dynamic donut
  let currentAngle = 0;
  const gradientStops = allocations.map((alloc) => {
    const startObj = currentAngle;
    currentAngle += alloc.percentage;
    return `${alloc.config.hex} ${startObj}% ${currentAngle}%`;
  });
  const backgroundStyle = { background: `conic-gradient(${gradientStops.join(", ")})` };

  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 h-full flex flex-col justify-between">
      <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface-variant mb-6">
        Portfolio Allocation
      </h3>

      {allocations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-on-surface-variant/50">
          No allocation data yet
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-8">
          {/* Decorative Donut Representation */}
          <div className="flex justify-center relative w-full pt-4">
            <div 
              className="w-48 h-48 rounded-full relative flex items-center justify-center transition-all duration-500" 
              style={backgroundStyle}
            >
              {/* Inner cutout to make it a donut */}
              <div className="w-36 h-36 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center shadow-inner z-10">
                <span className="text-[10px] font-black tracking-widest text-on-surface-variant">DIVERSIFIED</span>
                <span className="text-xl font-headline font-black text-on-surface mt-1">
                  {stealthMode ? "**" : allocations.length} Classes
                </span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3">
            {allocations.map((alloc) => (
              <div key={alloc.type} className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${alloc.config.colorClass} shadow-sm group-hover:scale-125 transition-transform`}></div>
                  <span className="font-bold text-on-surface text-sm">{alloc.config.label}</span>
                </div>
                <span className="font-black text-sm text-on-surface">
                  {stealthMode ? "**%" : `${alloc.percentage.toFixed(1)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
