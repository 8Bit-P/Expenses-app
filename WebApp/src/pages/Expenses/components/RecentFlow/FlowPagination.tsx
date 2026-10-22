import { buildPageRange } from "../../utils/pagination";
import { cn } from "../../../../utils/cn";

interface FlowPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const navBtn =
  "h-8 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-medium text-on-surface inline-flex items-center gap-1 hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface-container-lowest transition-colors";

export default function FlowPagination({ page, totalPages, onPageChange }: FlowPaginationProps) {
  const pages = buildPageRange(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-outline-variant">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className={navBtn}>
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`el-${i}`} className="w-8 text-center text-xs text-outline select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "w-8 h-8 rounded-md text-xs font-medium tabular-nums transition-colors",
                p === page
                  ? "bg-on-surface text-surface-container-lowest"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className={navBtn}>
        Next
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
    </div>
  );
}
