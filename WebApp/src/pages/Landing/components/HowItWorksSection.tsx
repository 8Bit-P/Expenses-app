import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: "receipt_long",
    title: "Log Every Movement",
    desc: "Record income, expenses, and internal transfers. Mark uncertain entries for the Action Center review inbox.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    step: "02",
    icon: "donut_large",
    title: "Analyze & Categorize",
    desc: "Instantly see spending by category with our donut chart. Use smart filters to drill into any timeframe or domain.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    step: "03",
    icon: "savings",
    title: "Fund Your Goals",
    desc: "Create Capital Reserves for any saving goal. Use Quick Fund to allocate money while keeping your ledger accurate.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    step: "04",
    icon: "auto_graph",
    title: "Track Your Wealth",
    desc: "Log investment snapshots and watch your Net Worth evolve over time. Every asset class, in one private view.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-28 px-6 border-t border-slate-800/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 text-xs font-black uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            Your finances.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Finally under control.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Four simple steps from chaos to clarity. No banks required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-blue-500/20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Icon circle */}
              <div className={`relative w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-5 z-10 shadow-lg`}>
                <span className={`material-symbols-outlined text-[22px] ${step.color}`}>{step.icon}</span>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 text-[9px] font-black text-slate-500 flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-base font-black text-white mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
