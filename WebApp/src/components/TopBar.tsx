import { Search, Bell } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex justify-between items-center w-full px-8 py-6 max-w-full bg-transparent font-headline">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search entries, goals or assets..."
            className="w-full bg-surface-container-lowest border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm transition-all shadow-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity">
          Add Entry
        </button>
        <div className="flex items-center gap-4 text-slate-600">
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <Bell className="w-5 h-5 text-on-surface-variant" />
          </button>
          <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/30">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-highest ring-2 ring-white shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXvbxjL_s204mCz344rW4xVaQR9uRfGDxh4vng0juWttvC_qSSas0Q9B7dOa-LyJRRJnS_1mjCUP6b5qapKxE3NUxx5wZbc8YCeDbmM8suZb_c8gWE6bKRgcOXhcVIGzh5E4NrbMmWP-jjmJqT5hIFXyITDwrrTC79fOSIAGGwmisk-GIHRRuc60kk2SjbXLunT4CYW0y6R0_ry06sgoaUdq5hQPVkVWbwau9XxSWpA82165L0icu82hRta3zMxabUsv6qECoEE3I"
                alt="User Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
