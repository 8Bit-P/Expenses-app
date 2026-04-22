const COLUMNS = ["Description", "Category", "Amount", ""];

export default function FlowTableHeader() {
  return (
    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-4 md:px-6 py-1.5 border-b border-outline-variant/10">
      {COLUMNS.map((h) => (
        <span key={h} className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
          {h}
        </span>
      ))}
    </div>
  );
}
