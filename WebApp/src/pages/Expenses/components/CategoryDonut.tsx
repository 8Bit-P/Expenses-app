import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useExpenses } from '../../../context/ExpensesContext';

const COLORS = ['#e53935', '#3949ab', '#8e24aa', '#fb8c00', '#43a047', '#00acc1', '#fdd835', '#546e7a'];

export default function CategoryDonut() {
  const { transactions, loading } = useExpenses();

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-[400px] flex items-center justify-center animate-pulse">
        <div className="w-40 h-40 rounded-full border-8 border-surface-container"></div>
      </div>
    );
  }

  // Aggregate spending by category
  const categoryMap: Record<string, { name: string; value: number }> = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const name = t.category?.name || 'Uncategorized';
      if (!categoryMap[name]) {
        categoryMap[name] = { name, value: 0 };
      }
      categoryMap[name].value += t.amount;
    });

  const data = Object.values(categoryMap)
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length]
    }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold font-headline text-on-surface">Spending by Category</h4>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3 min-h-75">
          <span className="material-symbols-outlined text-4xl">pie_chart_outline</span>
          <span className="text-xs font-bold uppercase tracking-widest">No data to display</span>
        </div>
      ) : (
        <>
          {/* Chart Area (Top) */}
          <div className="relative w-full shrink-0 min-w-0">
            <ResponsiveContainer width="100%" height={200} minWidth={1} minHeight={1} debounce={50}>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `$${value.toFixed(2)}`}
                  contentStyle={{ 
                    backgroundColor: 'var(--surface-container-lowest)', 
                    borderColor: 'var(--outline-variant)',
                    borderRadius: '8px',
                    color: 'var(--on-surface)',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Total Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-on-surface">
                {total >= 1000 ? `$${(total / 1000).toFixed(1)}k` : `$${total.toFixed(0)}`}
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Total</span>
            </div>
          </div>

          {/* Legend Area (Bottom) */}
          <div className="mt-4 space-y-3 flex-1 flex flex-col justify-start overflow-y-auto max-h-[150px] pr-1 scrollbar-thin">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between group">
                
                {/* Dot + Name */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm group-hover:scale-125 transition-transform" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {item.name}
                  </span>
                </div>
                
                {/* Formatted Value */}
                <span className="text-sm font-bold text-on-surface tabular-nums">
                  ${item.value.toFixed(2)}
                </span>
                
              </div>
            ))}
          </div>
        </>
      )}
      
    </div>
  );
}
