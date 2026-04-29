import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import NewTransactionSheet from "../ui/NewTransactionSheet";

export default function AppLayout() {
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ignore if modifier keys are pressed (except shift for some reason, but let's be strict)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "1":
          navigate("/home");
          break;
        case "2":
          navigate("/expenses");
          break;
        case "3":
          navigate("/assets");
          break;
        case "4":
          navigate("/recurring");
          break;
        case "n":
          setIsNewTxOpen(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

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
