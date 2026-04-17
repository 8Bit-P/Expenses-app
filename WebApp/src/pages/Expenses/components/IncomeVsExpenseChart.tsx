import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function IncomeVsExpenseChart() {
  const data = [
    { month: 'Jun', income: 4200, expense: 3800 },
    { month: 'Jul', income: 4200, expense: 3100 },
    { month: 'Aug', income: 4500, expense: 3400 },
    { month: 'Sep', income: 4500, expense: 4100 },
    { month: 'Oct', income: 4500, expense: 2900 },
    { month: 'Nov', income: 4800, expense: 3200 },
  ];

  return (
    // Removed h-full and flex-col, letting it size naturally based on content
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-lg font-bold font-headline text-on-surface">Income vs. Expense</h4>
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">6-month historical view</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-secondary"></div>
            <span className="text-on-surface">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
            <span className="text-on-surface-variant">Expense</span>
          </div>
        </div>
      </div>

      {/* Chart Area - Hardcoded height forces Recharts to render properly */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-outline-variant/20" />
            
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'currentColor' }} 
              className="text-on-surface-variant/60 font-semibold"
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'currentColor' }} 
              className="text-on-surface-variant/60 font-semibold"
              tickFormatter={(value) => `$${value}`}
            />
            
            <Tooltip 
              cursor={{ fill: 'var(--surface-container-low)', opacity: 0.4 }}
              contentStyle={{ 
                backgroundColor: 'var(--surface-container-lowest)', 
                borderColor: 'var(--outline-variant)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: 'var(--on-surface)',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            />
            
            <Bar dataKey="income" fill="#006c49" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expense" fill="#3525cd" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}