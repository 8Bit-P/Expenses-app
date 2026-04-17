import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CategoryDonut() {
  const data = [
    { name: 'Housing & Utils', value: 2100, color: '#e53935' }, // Red
    { name: 'Dining & Lifestyle', value: 1450, color: '#3949ab' }, // Indigo
    { name: 'Transport', value: 822.40, color: '#8e24aa' }, // Purple
    { name: 'Miscellaneous', value: 450, color: '#64748b' }, // Gray
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold font-headline text-on-surface">Spending by Category</h4>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>

      {/* Chart Area (Top) */}
      <div className="relative w-full h-50 shrink-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
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
              formatter={(value: number) => `$${value.toFixed(2)}`}
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
          <span className="text-xl font-black text-on-surface">${(total / 1000).toFixed(1)}k</span>
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Total</span>
        </div>
      </div>

      {/* Legend Area (Bottom - No longer squished!) */}
      <div className="mt-4 space-y-3 flex-1 flex flex-col justify-end">
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
      
    </div>
  );
}