export default function ProfileSection() {
  return (
    <section className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-primary-container/30">
              <img alt="User Avatar" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div>
            {/* TODO:  */}
            <h3 className="text-2xl font-bold font-headline text-on-surface">Julian Thorne</h3>
            <p className="text-on-surface-variant font-medium">julian.thorne@luminous.io</p>
          </div>
        </div>
        <button className="px-6 py-2 border-2 border-primary-container text-primary rounded-xl font-bold hover:bg-primary-container/50 transition-colors">
          Edit
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Name</p>
          <p className="font-semibold text-on-surface">Julian Thorne</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Language</p>
          <p className="font-semibold text-on-surface">English (US)</p>
        </div>
      </div>
    </section>
  );
}