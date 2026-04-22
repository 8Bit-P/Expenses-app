import { CardWrapper } from "./CardWrapper";

export function TopCategoryCard({
  category,
  percent,
  formattedAmount,
}: {
  category: { name: string; emoji: string | null; amount: number } | null;
  percent: number;
  formattedAmount: string;
}) {
  return (
    <CardWrapper>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">pie_chart</span>
        </div>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Top Category</span>
      </div>
      {category ? (
        <>
          <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight flex items-center gap-2 truncate">
            {category.emoji && <span>{category.emoji}</span>}
            <span className="truncate">{category.name}</span>
          </h2>
          <p className="text-xs font-bold text-on-surface-variant mt-2 ml-1 flex items-center gap-1">
            {formattedAmount} <span className="opacity-40">·</span> {percent.toFixed(0)}% of total
          </p>
        </>
      ) : (
        <p className="text-sm font-bold text-on-surface-variant/40 mt-4">No expense data</p>
      )}
    </CardWrapper>
  );
}
