import { Outlet } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col md:ml-64 pb-24 md:pb-0">
        {/* Mobile Header (Hidden on desktop) */}
        <MobileHeader />
        
        {/* Desktop TopBar (Hidden on mobile) */}
        <div className="hidden md:block">
          <TopBar />
        </div>

        <main className="p-6 md:p-8 mt-20 md:mt-0 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav & Floating Action Button */}
      <BottomNav />
      
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-transform">
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add</span>
        </button>
      </div>
    </div>
  );
}