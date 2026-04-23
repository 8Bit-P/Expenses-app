import { useTransactions } from "../../../hooks/useTransactions";
import { formatCurrency } from "../../../utils/currency";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS } from "../../../constants/chartColors";
import { startOfMonth, endOfMonth } from "date-fns";

export default function SpendingCategories() {
  const { transactions } = useTransactions({
    startDate: startOfMonth(new Date()).toISOString().split("T")[0],
    endDate: endOfMonth(new Date()).toISOString().split("T")[0],
    type: "expense"
  });

  // Aggregate by category
  const categoryData = transactions.reduce((acc: any, tx) => {
    const name = tx.category?.name || "Other";
    if (!acc[name]) acc[name] = { name, value: 0 };
    acc[name].value += tx.amount;
    return acc;
  }, {});

  const data = Object.values(categoryData)
    .sort((a: any, b: any) => b.value - a.value) as any[];

  const top3 = data.slice(0, 3);
  const others = data.slice(3).reduce((sum, item) => sum + item.value, 0);
  
  const chartData = [...top3];
  if (others > 0) chartData.push({ name: "Others", value: others });

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5 h-full flex flex-col">
      <h2 className="text-lg font-black font-headline flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-secondary text-[20px]">pie_chart</span>
        Spending
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
        {data.length === 0 ? (
          <p className="text-xs font-medium text-on-surface-variant italic">No data this month.</p>
        ) : (
          <>
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full mt-6 space-y-3">
              {top3.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    ></div>
                    <span className="text-[11px] font-bold text-on-surface-variant">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-on-surface">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
