export default function RecentFlow() {
  const transactions = [
    { id: 1, name: "Apple Store", time: "Yesterday • 14:20", amount: "-$1,299.00", icon: "shopping_bag", type: "expense" },
    { id: 2, name: "The Alchemist Bar", time: "Yesterday • 21:05", amount: "-$84.20", icon: "restaurant", type: "expense" },
    { id: 3, name: "Lumina Corp Salary", time: "2 days ago • 09:00", amount: "+$5,400.00", icon: "work", type: "income" },
  ];

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-headline font-bold text-on-surface">Recent Flow</h2>
        <button className="text-sm font-bold text-primary hover:underline">See All</button>
      </div>
      
      <div className="bg-surface-container-low rounded-lg p-2 space-y-1">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-md group hover:bg-surface transition-colors duration-300 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                tx.type === 'expense' ? 'bg-error-container/20 text-error' : 'bg-secondary-container/20 text-secondary'
              }`}>
                <span className="material-symbols-outlined">{tx.icon}</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">{tx.name}</p>
                <p className="text-xs text-on-surface-variant">{tx.time}</p>
              </div>
            </div>
            <span className={`font-headline font-bold ${tx.type === 'expense' ? 'text-error' : 'text-secondary'}`}>
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}