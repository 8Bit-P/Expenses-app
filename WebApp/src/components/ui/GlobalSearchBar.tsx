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
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/60 group-focus-within:text-primary transition-colors">
        <Search size={18} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={t("search.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full pl-10 pr-16 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all shadow-sm"
      />
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate("/search");
          }}
          className="p-1.5 rounded-lg text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
          title={t("search.advancedFilters")}
        >
          <SlidersHorizontal size={14} />
        </button>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-on-surface-variant/60 bg-surface-container border border-outline-variant/30 rounded flex items-center gap-0.5 mr-1">
          <span className="text-[12px] leading-none">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
