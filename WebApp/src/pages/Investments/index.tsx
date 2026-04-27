import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInvestments } from "../../hooks/useInvestments";
import AllocationDonut from "./components/AllocationDonut";
import LogSnapshotModal from "./components/LogSnapshotModal";
import VaultAssetsList from "./components/VaultAssetsList";
import HeroMetrics from "./components/HeroMetrics";
import PerformanceChart from "./components/PerformanceChart";
import SnapshotHistoryTable from "./components/SnapshotHistoryTable";

export default function Investments() {
  const { t } = useTranslation();
  const { assets, metrics, isLoading, error } = useInvestments();
  const [stealthMode, setStealthMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Premium Vault Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-center border border-outline-variant/10 animate-pulse">
          <span
            className="material-symbols-outlined text-primary text-3xl animate-spin"
            style={{ animationDuration: "3s" }}
          >
            change_circle
          </span>
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-on-surface-variant/70 animate-pulse">
          {t("investments.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-error">
        <span className="material-symbols-outlined text-5xl">warning</span>
        <p className="text-sm font-bold">{t("investments.error")}</p>
      </div>
    );
  }

  return (
    <div className="w-full relative pb-32 overflow-x-hidden px-4 md:px-0">
      {/* Refined Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-6">
        <div>
          {/* Dynamic Badge */}
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary rounded-lg border border-primary/20">
              {t("investments.header.activeAssets", { count: assets.length })}
            </span>
          </div>
          <h1 className="text-4xl font-black font-headline tracking-tight text-on-surface">{t("investments.header.title")}</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-2 max-w-md">
            {t("investments.header.subtitle")}
          </p>
        </div>

        {/* Tactile Primary Action */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 px-6 py-3.5 bg-on-surface text-surface-container-lowest font-bold rounded-2xl shadow-xl hover:bg-on-surface/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_box</span>
          {t("investments.header.logSnapshot")}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-6 sm:space-y-8">
        <HeroMetrics metrics={metrics} stealthMode={stealthMode} onToggleStealth={() => setStealthMode(!stealthMode)} />

        {/* Investment Performance Graphic */}
        <div className="w-full">
          <PerformanceChart assets={assets} stealthMode={stealthMode} />
        </div>

        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 xl:col-span-4 h-full">
            <AllocationDonut assets={assets} stealthMode={stealthMode} />
          </div>
          <div className="col-span-12 xl:col-span-8 h-full">
            <VaultAssetsList
              assets={assets}
              stealthMode={stealthMode}
              onLogSnapshot={() => {
                // Future wiring: You can pass the specific asset ID into the modal
                // state here so it auto-selects when clicking a specific asset!
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* Historical Ledger Table */}
        <div className="w-full">
          <SnapshotHistoryTable assets={assets} stealthMode={stealthMode} />
        </div>
      </div>

      {/* Floating Gradient Decoration for Ethereal Feel */}
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none z-[-1]"></div>
      <div className="fixed top-1/4 -left-24 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl pointer-events-none z-[-1]"></div>

      {/* Modals */}
      <LogSnapshotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} assets={assets} />
    </div>
  );
}
