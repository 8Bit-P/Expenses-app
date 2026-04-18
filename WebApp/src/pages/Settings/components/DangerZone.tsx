interface DangerZoneProps {
  onDeleteClick: () => void;
}

export default function DangerZone({ onDeleteClick }: DangerZoneProps) {
  return (
    <div className="mt-12 p-8 rounded-xl bg-error-container/20 border border-error/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        <h5 className="text-error font-extrabold font-headline">Danger Zone</h5>
        <p className="text-error/70 text-sm font-medium mt-1">Permanently delete your vault and all ethereal data.</p>
      </div>
      <button
        onClick={onDeleteClick}
        className="px-6 py-2.5 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-all active:scale-95 shadow-sm whitespace-nowrap"
      >
        Delete Account
      </button>
    </div>
  );
}
