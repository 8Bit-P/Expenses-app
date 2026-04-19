import { useState } from "react";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import SubscriptionMetrics from "./components/SubscriptionMetrics";
import SubscriptionCard from "./components/SubscriptionCard";
import UpcomingRenewals from "./components/UpcomingRenewals";
import SubscriptionModal from "./components/SubscriptionModal";
import type { Subscription } from "../../types/expenses";

export default function Subscriptions() {
  const { subscriptions, loading } = useSubscriptions();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const handleManage = (s: Subscription) => {
    setSelectedSubscription(s);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-on-surface font-headline">Subscriptions</h1>
          <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest opacity-60">
            Managed Services
          </p>
        </div>
      </div>

      {/* Metrics Highlights */}
      <SubscriptionMetrics subscriptions={subscriptions} loading={loading} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Grid Area */}
        <div className="flex-1 w-full lg:min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight font-headline">Your Services</h2>
            <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1 border border-outline-variant/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">list</span>
              </button>
            </div>
          </div>

          {!loading && subscriptions.length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>
              <div>
                <p className="text-lg font-black text-on-surface">No subscriptions tracked yet</p>
                <p className="text-sm font-bold text-on-surface-variant/60 max-w-xs mx-auto mt-1">
                  Connect your recurring digital services to keep your private vault accurate.
                </p>
              </div>
              <button className="bg-primary/10 text-primary hover:bg-primary/20 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                Add your first subscription
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-surface-container-low rounded-xl animate-pulse border border-outline-variant/10"
                    />
                  ))
                : subscriptions.map((s) => <SubscriptionCard key={s.id} subscription={s} onManage={handleManage} />)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 shrink-0 desk:block sticky top-24">
          <UpcomingRenewals
            subscriptions={subscriptions}
            onAdd={() => {
              setSelectedSubscription(null);
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Creation/Edit Modal */}
      <SubscriptionModal isOpen={isModalOpen} onClose={handleCloseModal} subscription={selectedSubscription} />
    </div>
  );
}
