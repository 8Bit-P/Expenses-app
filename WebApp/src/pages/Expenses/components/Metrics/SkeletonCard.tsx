export function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest p-4 md:p-5 min-h-[150px] space-y-3">
      <div className="h-3 w-1/2 animate-pulse bg-surface-container rounded-lg" />
      <div className="h-7 w-2/3 animate-pulse bg-surface-container rounded-lg" />
      <div className="h-1.5 w-full animate-pulse bg-surface-container rounded-lg mt-8" />
    </div>
  );
}
