export default function TopBar() {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4 font-headline bg-background/50 backdrop-blur-md sticky top-0 z-40">
      
      {/* Search Input */}
      <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-2xl w-96 transition-focus-within focus-within:ring-2 focus-within:ring-primary/20">
        <span className="material-symbols-outlined text-outline">search</span>
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-outline-variant outline-none" 
          placeholder="Search entries..." 
          type="text"
        />
      </div>
      
      {/* Quick Actions & Profile */}
      <div className="flex items-center gap-6">
        <button className="px-6 py-2 bg-surface-container-high text-on-surface font-semibold rounded-2xl hover:opacity-80 transition-opacity">
          Add Entry
        </button>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
            <img 
              alt="User Profile" 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
    </header>
  );
}