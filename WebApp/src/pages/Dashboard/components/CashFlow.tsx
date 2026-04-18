import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Oct", income: 12000, expense: 4000 },
  { name: "Nov", income: 12450, expense: 4210 },
  { name: "Dec", income: 13000, expense: 5100 },
];

export default function CashFlow() {
  return (
    <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-lg shadow-sm flex flex-col">
      <h2 className="text-xl font-bold font-headline mb-1">Monthly Cash Flow</h2>
      <p className="text-on-surface-variant text-sm mb-8">Income vs Expenses</p>

      <div className="w-full text-[10px] font-bold text-slate-400">
        <ResponsiveContainer width="100%" height={250} minWidth={1} minHeight={1} debounce={50}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Bar dataKey="income" fill="#006c49" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="expense" fill="#ba1a1a" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
