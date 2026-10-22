import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Panel from "../../../components/ui/Panel";
import { CHART, AXIS_TICK } from "../../../constants/chartColors";

const data = [
  { name: "Oct", income: 12000, expense: 4000 },
  { name: "Nov", income: 12450, expense: 4210 },
  { name: "Dec", income: 13000, expense: 5100 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs min-w-[160px]">
        <p className="eyebrow mb-1.5">{label} Flow</p>
        <div className="flex justify-between items-center gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="w-2 h-2 rounded-sm bg-secondary" />
            Income
          </span>
          <span className="font-medium tabular-nums text-secondary">+${payload[0].value.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="w-2 h-2 rounded-sm bg-error" />
            Expense
          </span>
          <span className="font-medium tabular-nums text-error">-${payload[1].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function CashFlow() {
  return (
    <Panel title="Cash Flow" subtitle="Income vs Expenses" icon="swap_vert" className="lg:col-span-4">
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0} debounce={50}>
          <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barGap={3}>
            <CartesianGrid vertical={false} stroke={CHART.grid} strokeDasharray="0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={8} tick={AXIS_TICK} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART.cursor }} />
            <Bar dataKey="income" fill={CHART.income} radius={[3, 3, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expense" fill={CHART.expense} radius={[3, 3, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
