import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SpendingTrendChart() {
  // Dummy data comparing this month's cumulative spend vs last month
  const data = [
    { day: '1st', current: 45, previous: 60 },
    { day: '5th', current: 150, previous: 140 },
    { day: '10th', current: 320, previous: 280 },
    { day: '15th', current: 480, previous: 450 },
    { day: '20th', current: 610, previous: 650 },
    { day: '25th', current: 800, previous: 820 },
    { day: '30th', current: 950, previous: 1100 },
  ];

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-full flex flex-col">
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-bold font-headline text-on-surface">Spending Trend</h4>
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">Cumulative spend vs. last month</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <span className="text-on-surface">This Month</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
            <span className="text-on-surface-variant">Last Month</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full h-62.5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              {/* Gradient for Current Month */}
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3525cd" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3525cd" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-outline-variant/20" />
            
            <XAxis 
              dataKey="day" 
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
              contentStyle={{ 
                backgroundColor: 'var(--surface-container-lowest)', 
                borderColor: 'var(--outline-variant)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: 'var(--on-surface)',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
              itemStyle={{ color: 'var(--on-surface)' }}
            />
            
            {/* Last Month (Gray/Outline line) */}
            <Area 
              type="monotone" 
              dataKey="previous" 
              stroke="#c7c4d8" 
              strokeWidth={2}
              fill="none" 
            />
            
            {/* This Month (Primary color with gradient) */}
            <Area 
              type="monotone" 
              dataKey="current" 
              stroke="#3525cd" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCurrent)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}