import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", investments: 4000, liquidity: 2400 },
  { name: "Mar", investments: 4500, liquidity: 2100 },
  { name: "May", investments: 5200, liquidity: 2800 },
  { name: "Jul", investments: 5800, liquidity: 2600 },
  { name: "Sep", investments: 6500, liquidity: 3200 },
  { name: "Nov", investments: 7100, liquidity: 3800 },
];

export default function WealthEvolution() {
  return (
    <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-bold font-headline mb-1">Wealth Evolution</h2>
          <p className="text-on-surface-variant text-sm">Portfolio growth trajectory over 12 months</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs font-medium">Investments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <span className="text-xs font-medium">Liquidity</span>
          </div>
        </div>
      </div>

      <div className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3525cd" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3525cd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
            <Tooltip
              contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Area type="monotone" dataKey="liquidity" stackId="1" stroke="#cbd5e1" fill="#cbd5e1" />
            <Area type="monotone" dataKey="investments" stackId="1" stroke="#3525cd" fill="url(#colorInv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
