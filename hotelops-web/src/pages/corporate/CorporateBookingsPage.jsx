import { useEffect, useState } from "react";

export default function CorporateBookingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: wire to your API when ready
    setItems([]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Corporate Bookings</h1>

      <div className="rounded-xl border p-4 mb-6">
        <p className="text-sm text-slate-600">
          Booking UI coming next. For now this page exists so routes load cleanly.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="font-medium mb-2">Recent Bookings</h2>
        {loading && <div>Loading…</div>}
        {!loading && items.length === 0 && (
          <div className="text-slate-500 text-sm">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}
