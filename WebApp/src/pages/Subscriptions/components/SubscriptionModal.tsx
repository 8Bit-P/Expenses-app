import { useState, useEffect } from "react";
import type { BillingCycle, Subscription } from "../../../types/expenses";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
}

export default function SubscriptionModal({ isOpen, onClose, subscription }: SubscriptionModalProps) {
  const { addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const { currency } = useUserPreferences();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [nextDate, setNextDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditing = !!subscription;

  // Sync state when editing subscription changes
  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setAmount(subscription.amount.toString());
      setBillingCycle(subscription.billing_cycle);
      setNextDate(subscription.next_billing_date);
    } else {
      // Reset for new subscription
      setName("");
      setAmount("");
      setBillingCycle("monthly");
      setNextDate(new Date().toISOString().split("T")[0]);
    }
  }, [subscription, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount || !nextDate) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (isEditing && subscription) {
        await updateSubscription.mutateAsync({
          id: subscription.id,
          updates: {
            name,
            amount: parseFloat(amount),
            billing_cycle: billingCycle,
            next_billing_date: nextDate,
          },
        });
      } else {
        await addSubscription.mutateAsync({
          name,
          amount: parseFloat(amount),
          billing_cycle: billingCycle,
          next_billing_date: nextDate,
          status: "active",
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!subscription || !window.confirm(`Are you sure you want to delete ${subscription.name}?`)) return;

    setIsSubmitting(true);
    try {
      await deleteSubscription.mutateAsync(subscription.id);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete subscription.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-[#0c1324] text-slate-100 rounded-3xl shadow-2xl overflow-hidden border border-slate-800/50 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            </div>
            <div>
              <h2 className="text-2xl font-black font-headline tracking-tight">
                {isEditing ? "Manage" : "Add"} Subscription
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                {isEditing ? "Update your vault entry." : "Secure your ledger with a new commitment."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-bold leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Service Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Service Name</label>
              <div className="relative">
                <input 
                  autoFocus
                  className="w-full bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600 outline-none"
                  placeholder="e.g., Netflix, Spotify"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                />
              </div>
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Amount</label>
                <div className="relative">
                  <input 
                    className="w-full bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600 outline-none"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm pointer-events-none">
                    {currency.code}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 opacity-50">Currency</label>
                <div className="w-full bg-slate-800/30 border-none rounded-2xl px-5 py-4 text-slate-500 font-bold opacity-50 cursor-not-allowed">
                  {currency.code}
                </div>
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Billing Cycle</label>
              <div className="flex p-1 bg-slate-800/50 rounded-2xl self-start max-w-[200px]">
                <button 
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${billingCycle === "monthly" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Monthly
                </button>
                <button 
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${billingCycle === "yearly" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Next Payment Date</label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all [color-scheme:dark] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  type="date"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-4 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : isEditing ? "Save Changes" : "Add Subscription"}
              </button>
              
              {isEditing && (
                <button 
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="w-full py-2 text-rose-500 font-bold hover:text-rose-400 text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Delete Service
                </button>
              )}

              <button 
                type="button"
                onClick={onClose}
                className="w-full py-2 text-slate-500 font-bold hover:text-slate-300 text-xs uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
