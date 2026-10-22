import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import PageHeader from "../../../components/ui/PageHeader";

interface SearchHeaderProps {
  query: string;
  rowsCount: number;
  clearSearch: () => void;
}

export function SearchHeader({ query, rowsCount, clearSearch }: SearchHeaderProps) {
  const { t } = useTranslation();

  if (query) {
    return (
      <PageHeader
        eyebrow={t("search.resultsFor")}
        title={<span className="break-words">“{query}”</span>}
        description={t("search.recordsAcross", { count: rowsCount, suffix: rowsCount !== 1 ? "s" : "" })}
        actions={
          <button
            onClick={clearSearch}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
            aria-label={t("search.clearSearch")}
            title={t("search.clearSearch")}
          >
            <X size={15} className="text-on-surface-variant" />
            {t("search.clearSearch")}
          </button>
        }
      />
    );
  }

  return <PageHeader title={t("search.universalLedger")} description={t("search.exploreSubtitle")} />;
}
