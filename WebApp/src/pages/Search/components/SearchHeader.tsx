import { X } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  rowsCount: number;
  clearSearch: () => void;
}

export function SearchHeader({ query, rowsCount, clearSearch }: SearchHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        {query ? (
          <>
            <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight flex items-center gap-3">
              Search Results for <span className="text-primary">"{query}"</span>
              <button
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={20} />
              </button>
            </h1>
            <p className="text-sm font-medium text-on-surface-variant mt-2 opacity-80">
              {rowsCount} result{rowsCount !== 1 ? "s" : ""} across your financial vault.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight">
              Universal Ledger
            </h1>
            <p className="text-sm font-medium text-on-surface-variant mt-2 opacity-80">
              Explore and filter all your financial data.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
