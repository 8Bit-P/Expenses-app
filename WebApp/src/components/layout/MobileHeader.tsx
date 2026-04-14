export default function MobileHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm shadow-indigo-500/5 flex justify-between items-center px-6 py-4 md:hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center">
          <img 
            alt="User" 
            className="w-full h-full object-cover" 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          />
        </div>
        <span className="font-headline font-extrabold text-primary tracking-tighter text-xl">Personal Vault</span>
      </div>
      <button className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white/40 transition-all duration-300 active:scale-90 rounded-full">
        <span className="material-symbols-outlined">notifications</span>
      </button>
    </header>
  );
}