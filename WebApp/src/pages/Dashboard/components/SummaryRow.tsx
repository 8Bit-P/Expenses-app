export default function SummaryRow() {
  const metrics = [
    {
      title: "Net Worth",
      amount: "$842,500.00",
      change: "+2.4%",
      changeType: "positive",
      icon: "account_balance_wallet",
      bg: "bg-primary-fixed",
      text: "text-primary",
    },
    {
      title: "Monthly Income",
      amount: "$12,450.00",
      change: "+12%",
      changeType: "positive",
      icon: "trending_up",
      bg: "bg-secondary-fixed",
      text: "text-secondary",
    },
    {
      title: "Monthly Expenses",
      amount: "$4,210.00",
      change: "-5.2%",
      changeType: "negative",
      icon: "shopping_cart",
      bg: "bg-error-container",
      text: "text-error",
    },
    {
      title: "Total Invested",
      amount: "$512,000.00",
      change: "+8.1%",
      changeType: "positive",
      icon: "auto_graph",
      bg: "bg-tertiary-fixed",
      text: "text-tertiary",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-surface-container-lowest p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-full ${metric.bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${metric.text}`}>{metric.icon}</span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                metric.changeType === "positive"
                  ? "text-secondary bg-secondary-container"
                  : "text-error bg-error-container"
              }`}
            >
              {metric.change}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">{metric.title}</p>
          <h3 className="text-2xl font-extrabold font-headline tracking-tight">{metric.amount}</h3>
        </div>
      ))}
    </section>
  );
}
