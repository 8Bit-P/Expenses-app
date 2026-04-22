import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Oct", income: 12000, expense: 4000 },
  { name: "Nov", income: 12450, expense: 4210 },
  { name: "Dec", income: 13000, expense: 5100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-outline-variant/20 font-body min-w-[160px]">
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3 border-b border-outline-variant/10 pb-2">
          {label} Flow
        </p>
        <div className="flex justify-between items-center gap-4 mb-2">
          <span className="text-xs font-bold text-on-surface-variant">Income</span>
          <span className="text-sm font-black text-secondary">+${payload[0].value.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-xs font-bold text-on-surface-variant">Expense</span>
          <span className="text-sm font-black text-error">-${payload[1].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function CashFlow() {
  return (
    <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-black font-headline text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">swap_vert</span>
          Cash Flow
        </h2>
        <p className="text-xs font-bold text-on-surface-variant mt-1">Income vs Expenses</p>
      </div>

      <div className="w-full text-[10px] font-bold text-slate-400 flex-1">
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={4}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={{ fill: "#777587", fontWeight: 800 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <Bar dataKey="income" fill="#006c49" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#ba1a1a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
