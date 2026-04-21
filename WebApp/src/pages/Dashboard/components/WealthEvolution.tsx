import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", investments: 4000, liquidity: 2400 },
  { name: "Mar", investments: 4500, liquidity: 2100 },
  { name: "May", investments: 5200, liquidity: 2800 },
  { name: "Jul", investments: 5800, liquidity: 2600 },
  { name: "Sep", investments: 6500, liquidity: 3200 },
  { name: "Nov", investments: 7100, liquidity: 3800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-outline-variant/20 font-body min-w-[160px]">
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3 border-b border-outline-variant/10 pb-2">
          {label} Evolution
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-4 mb-1">
            <span className="text-xs font-bold text-on-surface-variant capitalize">{entry.name}</span>
            <span className="text-sm font-black text-on-surface">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function WealthEvolution() {
  return (
    <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-black font-headline text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">monitoring</span>
            Wealth Evolution
          </h2>
          <p className="text-xs font-bold text-on-surface-variant mt-1">Portfolio trajectory over 12 months</p>
        </div>
        <div className="flex gap-4 p-2 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <span className="text-xs font-bold text-on-surface">Investments</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <span className="text-xs font-bold text-on-surface">Liquidity</span>
          </div>
        </div>
      </div>

      <div className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3525cd" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3525cd" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLiq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={{ fill: "#777587", fontWeight: 800 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#777587", fontWeight: 800 }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(53, 37, 205, 0.2)", strokeWidth: 2, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="liquidity"
              stackId="1"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#colorLiq)"
            />
            <Area
              type="monotone"
              dataKey="investments"
              stackId="1"
              stroke="#3525cd"
              strokeWidth={2}
              fill="url(#colorInv)"
              activeDot={{ r: 6, fill: "#3525cd", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
