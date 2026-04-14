export default function TotalOutflow() {
  return (
    <div className="bg-primary-container p-8 rounded-xl relative overflow-hidden text-on-primary-container shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-80">Total Outflow (Month)</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-headline font-bold">$4,280.50</span> {/* TODO:  */}
          <span className="text-xs font-bold bg-error-container text-on-error-container px-2 py-1 rounded-full">+12%</span>
        </div>
      </div>
    </div>
  );
}