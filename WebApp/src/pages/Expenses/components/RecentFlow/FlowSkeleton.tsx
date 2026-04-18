export default function FlowSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 md:px-6 py-2.5 border-b border-outline-variant/5 last:border-0 animate-pulse">
          <div className="w-12 h-4 bg-surface-container rounded-lg hidden md:block shrink-0" />
          <div className="w-9 h-9 bg-surface-container rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-4 bg-surface-container rounded-lg w-3/5" />
            <div className="h-3 bg-surface-container rounded-lg w-2/5" />
          </div>
          <div className="w-16 h-4 bg-surface-container rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
