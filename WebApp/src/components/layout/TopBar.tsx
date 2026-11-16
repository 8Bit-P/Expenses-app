import NotificationDropdown from "./NotificationDropdown";
import GlobalSearchBar from "../ui/GlobalSearchBar";
import ThemeToggle from "./ThemeToggle";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 h-14 flex items-center gap-6 px-8 bg-background border-b border-outline-variant">
      <div className="flex-1 min-w-0">
        <GlobalSearchBar />
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationDropdown />
      </div>
    </header>
  );
}
