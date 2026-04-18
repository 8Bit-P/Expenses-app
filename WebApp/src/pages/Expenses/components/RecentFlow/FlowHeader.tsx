interface FlowHeaderProps {
  totalCount: number;
  loading: boolean;
  onAddNew: () => void;
}

export default function FlowHeader({ totalCount, loading, onAddNew }: FlowHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-outline-variant/10">
      <div>
        <h4 className="text-lg font-bold font-headline text-on-surface">Recent Flow</h4>
        {!loading && totalCount > 0 && (
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">
            {totalCount.toLocaleString()} movement{totalCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <button
        onClick={onAddNew}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        <span className="hidden xs:inline">New</span>
      </button>
    </div>
  );
}
