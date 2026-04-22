interface FlowHeaderProps {
  totalCount: number;
  loading: boolean;
  onAddNew: () => void;
}

export default function FlowHeader({ totalCount, loading, onAddNew }: FlowHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 md:py-4 border-b border-outline-variant/10">
      <div className="">
        <h4 className="text-lg font-bold font-headline text-on-surface">Recent Flow</h4>
        {!loading && totalCount > 0 && (
          <p className="text-xs font-medium text-on-surface-variant mt-1">
            {totalCount.toLocaleString()} movement{totalCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Add entry — subtle inline action */}
      <button
        onClick={onAddNew}
        className="group flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
      >
        <span className="w-5 h-5 rounded-md bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-primary text-[14px]">add</span>
        </span>
        <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
          Entry
        </span>
      </button>
    </div>
  );
}
