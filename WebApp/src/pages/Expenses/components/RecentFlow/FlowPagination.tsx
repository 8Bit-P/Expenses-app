import { buildPageRange } from "../../utils/pagination";

interface FlowPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function FlowPagination({ page, totalPages, onPageChange }: FlowPaginationProps) {
  const pages = buildPageRange(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-outline-variant/10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-25 disabled:cursor-not-allowed transition-all group"
      >
        <span className="material-symbols-outlined text-[15px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`el-${i}`} className="w-8 text-center text-[11px] text-on-surface-variant/30 select-none">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                p === page ? "bg-primary text-white shadow-sm shadow-primary/20" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-25 disabled:cursor-not-allowed transition-all group"
      >
        Next
        <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
      </button>
    </div>
  );
}
