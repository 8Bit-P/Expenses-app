import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Simulated DB Data
const data = [
  {
    name: "Housing & Utilities",
    value: 2100,
    color: "#ba1a1a",
    bgClass: "bg-error",
  },
  {
    name: "Dining & Lifestyle",
    value: 1450,
    color: "#3525cd",
    bgClass: "bg-primary",
  },
  { name: "Transport", value: 822.4, color: "#5c00ca", bgClass: "bg-tertiary" },
  {
    name: "Miscellaneous",
    value: 450,
    color: "#c7c4d8",
    bgClass: "bg-outline-variant",
  },
];

export default function CategoryDonut() {
  // Automatically calculate the total for the center label
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm relative overflow-hidden h-full">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-xl font-bold font-headline">
          Spending by Category
        </h4>
        <button className="hover:bg-surface-container-low p-1 rounded-full transition-colors">
          <span className="material-symbols-outlined text-outline-variant">
            more_horiz
          </span>
        </button>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-12">
        {/* Recharts Donut */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65} // Slightly thinner for a more modern look
                outerRadius={85}
                paddingAngle={5} // More separation looks cleaner with deep colors
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>

              <Tooltip
                cursor={false}
                // Use 'any' to satisfy TS, and add a fallback to 0 if undefined
                formatter={(value: any) => {
                  const formattedValue = Number(value || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  );
                  return [`$${formattedValue}`, "Amount"];
                }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "1rem",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                }}
                itemStyle={{
                  color: "#191c1e",
                  fontSize: "12px",
                  fontWeight: "bold",
                  fontFamily: "Manrope",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute flex flex-col items-center pointer-events-none">
            <span className="text-2xl font-black">
              ${(total / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Total
            </span>
          </div>
        </div>

        {/* Dynamic Legend */}
        <div className="flex-1 w-full space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.bgClass}`}></div>
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-bold">
                ${item.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
