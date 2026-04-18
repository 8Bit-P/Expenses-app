import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../../hooks/useTransactions';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subMonths } from 'date-fns';
import { useMemo } from 'react';

export default function SpendingTrendChart() {
  const now = new Date();
  
  // Current Month Range
  const currentStart = startOfMonth(now);
  const currentEnd = endOfMonth(now);
  
  // Last Month Range
  const lastStart = startOfMonth(subMonths(now, 1));
  const lastEnd = endOfMonth(subMonths(now, 1));

  // We fetch all transactions for both months (approx 60 days)
  const { transactions, loading } = useTransactions({
    startDate: format(lastStart, 'yyyy-MM-dd'),
    endDate: format(currentEnd, 'yyyy-MM-dd'),
    pageSize: 1000,
  });

  const chartData = useMemo(() => {
    if (loading || transactions.length === 0) return [];

    const days = eachDayOfInterval({ start: currentStart, end: currentEnd });
    let cumulativeCurrent = 0;
    let cumulativePrevious = 0;

    return days.map((day, index) => {
      const dayOfMonth = index + 1;
      
      // Calculate spend for THIS month on this day
      const currentDaySpend = transactions
        .filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
        .reduce((sum, t) => sum + t.amount, 0);
      
      cumulativeCurrent += currentDaySpend;

      // Calculate spend for LAST month on the corresponding day
      const prevDay = new Date(lastStart);
      prevDay.setDate(dayOfMonth);
      
      let prevDaySpend = 0;
      if (prevDay <= lastEnd) {
        prevDaySpend = transactions
          .filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM-dd') === format(prevDay, 'yyyy-MM-dd'))
          .reduce((sum, t) => sum + t.amount, 0);
      }
      
      cumulativePrevious += prevDaySpend;

      return {
        day: format(day, 'do'),
        current: day <= now ? cumulativeCurrent : null, // Don't show future trend
        previous: cumulativePrevious,
      };
    });
  }, [transactions, loading]);

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-100 flex items-center justify-center animate-pulse">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/40">Calculating Trends...</span>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col">
      
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
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
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
              tick={{ fontSize: 9, fill: 'currentColor' }} 
              className="text-on-surface-variant/60 font-semibold"
              dy={10}
              interval={4} // Show every 5th day to avoid clutter
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
              formatter={(value: any) => [`$${value?.toFixed(2)}`, '']}
            />
            
            <Area 
              type="monotone" 
              dataKey="previous" 
              stroke="#c7c4d8" 
              strokeWidth={2}
              fill="none" 
              connectNulls
            />
            
            <Area 
              type="monotone" 
              dataKey="current" 
              stroke="#3525cd" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCurrent)" 
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
