import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import NewTransactionSheet from "../ui/NewTransactionSheet";

export default function AppLayout() {
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Desktop Sidebar (Hidden on mobile/tablet) */}
      <div className="hidden desk:block">
        <Sidebar onNewTransaction={() => setIsNewTxOpen(true)} />
      </div>

      <div className="flex-1 flex flex-col desk:ml-64 pb-32 desk:pb-0">
        {/* Mobile Header (Hidden on desktop) */}
        <MobileHeader />

        {/* Desktop TopBar (Hidden on mobile/tablet) */}
        <div className="hidden desk:block">
          <TopBar />
        </div>

        <main className="p-6 desk:p-8 mt-20 desk:mt-0 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>


      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* Global New Transaction Sheet */}
      <NewTransactionSheet isOpen={isNewTxOpen} onClose={() => setIsNewTxOpen(false)} />
    </div>
  );
}
