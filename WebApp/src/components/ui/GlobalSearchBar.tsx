import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GlobalSearchBar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd + K (Mac) or Ctrl + K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        navigate("/search");
      }
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative group w-full max-w-md hidden md:block">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-on-surface transition-colors">
        <Search size={16} strokeWidth={1.75} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={t("search.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="w-full h-9 bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-20 text-[13px] text-on-surface placeholder:text-on-surface-variant focus:border-on-surface focus:ring-0 focus:outline-none transition-colors"
      />
      <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate("/search");
          }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title={t("search.advancedFilters")}
        >
          <SlidersHorizontal size={14} strokeWidth={1.75} />
        </button>
        <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 rounded border border-outline-variant bg-surface-container-low font-mono text-[10px] text-on-surface-variant">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}
