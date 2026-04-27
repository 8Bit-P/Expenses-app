import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  rowsCount: number;
  clearSearch: () => void;
}

export function SearchHeader({ query, rowsCount, clearSearch }: SearchHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        {query ? (
          <>
            <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight flex items-center gap-3">
              {t("search.resultsFor")} <span className="text-primary">"{query}"</span>
              <button
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
                aria-label={t("search.clearSearch")}
                title={t("search.clearSearch")}
              >
                <X size={20} />
              </button>
            </h1>
            <p className="text-sm font-medium text-on-surface-variant mt-2 opacity-80">
              {t("search.recordsAcross", { count: rowsCount, suffix: rowsCount !== 1 ? "s" : "" })}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight">
              {t("search.universalLedger")}
            </h1>
            <p className="text-sm font-medium text-on-surface-variant mt-2 opacity-80">
              {t("search.exploreSubtitle")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
