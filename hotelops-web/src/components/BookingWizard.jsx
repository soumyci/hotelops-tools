
// src/components/BookingWizard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { parseLocalInput, toIsoWithOffset } from "../lib/dates";

export default function BookingWizard() {
  // -------------------- Stepper state --------------------
  const [step, setStep] = useState(1);

  // -------------------- Form state --------------------
  const [corporate, setCorporate] = useState("");
  const [guestName, setGuestName] = useState("Primary guest");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [rooms, setRooms] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [roomsQty, setRoomsQty] = useState(1);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState(null);

  // -------------------- Load rooms --------------------
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/rooms");
        const data = await r.json();
        if (!alive) return;
        setRooms(data ?? []);
      } catch (e) {
        console.error("rooms load failed", e);
        setRooms([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Selected room (by roomCode)
  const selRoom = useMemo(
    () => rooms.find(r => r.roomCode === roomCode) || null,
    [rooms, roomCode]
  );

  // Derived: estimated rate & total (uses selRoom.basePrice if present)
  const basePrice = selRoom?.basePrice ?? 0;
  const estimatedRate = basePrice || 0;
  const nights = useMemo(() => {
    const ci = parseLocalInput(checkIn);
    const co = parseLocalInput(checkOut);
    if (!ci || !co) return 0;
    const ms = Math.max(0, co - ci);
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const estTotal = useMemo(
    () => (estimatedRate * (roomsQty || 1) * (nights || 1)) || 0,
    [estimatedRate, roomsQty, nights]
  );

  // Step 1 guard
  const canGoStep2 = () => {
    const ci = parseLocalInput(checkIn);
    const co = parseLocalInput(checkOut);
    return !!guestName && !!ci && !!co && co > ci;
  };

  // Step 2 guard
  const canGoStep3 = () => {
    return canGoStep2() && !!roomCode && (roomsQty || 0) > 0;
  };

  // -------------------- Actions --------------------
  const goStep = (n) => setStep(n);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitErr(null);

      const ci = parseLocalInput(checkIn);
      const co = parseLocalInput(checkOut);

      // Build payload expected by API
      const payload = {
        roomCode,
        guestName: guestName || corporate || "Corporate Guest",
        rooms: Number(roomsQty) || 1,
        checkIn: toIsoWithOffset(ci),   // keep local wall clock time with offset
        checkOut: toIsoWithOffset(co),  // "
        status: "pending",
        notes
      };

      const r = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const text = await r.text().catch(() => "");
        throw new Error(text || `HTTP ${r.status}`);
      }

      // Notify dashboard widgets immediately
      window.dispatchEvent(new CustomEvent("booking:created"));

      // Reset & go back to step 1 or stay on review as you prefer
      setStep(1);
      setRoomCode("");
      setRoomsQty(1);
      // keep dates & name for convenience
    } catch (e) {
      console.error(e);
      setSubmitErr(String(e?.message || e));
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold mb-3">Corporate Booking</h2>

      {/* Steps header */}
      <div className="flex gap-6 text-sm mb-4">
        <Step n={1} step={step} onClick={() => goStep(1)} title="Dates & Guests" />
        <Step n={2} step={step} onClick={() => canGoStep2() && goStep(2)} title="Select Room" />
        <Step n={3} step={step} onClick={() => canGoStep3() && goStep(3)} title="Review & Submit" />
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <Labeled label="Corporate (optional)">
            <input className="border rounded px-2 py-1 w-80"
                   placeholder="e.g., Acme Pvt Ltd"
                   value={corporate} onChange={e => setCorporate(e.target.value)} />
          </Labeled>

          <Labeled label="Guest name">
            <input className="border rounded px-2 py-1 w-80"
                   value={guestName} onChange={e => setGuestName(e.target.value)} />
          </Labeled>

          <div className="flex gap-6">
            <Labeled label="Check-in">
              <input className="border rounded px-2 py-1"
                     type="datetime-local"
                     value={checkIn}
                     onChange={e => setCheckIn(e.target.value)} />
            </Labeled>
            <Labeled label="Check-out">
              <input className="border rounded px-2 py-1"
                     type="datetime-local"
                     value={checkOut}
                     onChange={e => setCheckOut(e.target.value)} />
            </Labeled>
          </div>

          <button
            className={`px-3 py-1 rounded ${canGoStep2() ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            onClick={() => canGoStep2() && goStep(2)}
            disabled={!canGoStep2()}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">Pick a room and quantity</div>

          <div className="grid gap-3">
            {rooms.map(r => (
              <label key={r.roomCode} className="flex items-center gap-3 border rounded p-3">
                <input type="radio" name="room" value={r.roomCode}
                       checked={roomCode === r.roomCode}
                       onChange={() => setRoomCode(r.roomCode)} />
                <div className="flex-1">
                  <div className="font-medium">{r.roomCode} <span className="text-gray-500">({r.type || "—"})</span></div>
                  <div className="text-sm text-gray-600">Capacity: {r.capacity ?? "—"}</div>
                </div>
                <div className="text-right">
                  {r.basePrice ? `₹ ${r.basePrice}` : "—"}
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span>Rooms</span>
            <input className="border rounded px-2 py-1 w-16"
                   type="number" min={1}
                   value={roomsQty}
                   onChange={e => setRoomsQty(Number(e.target.value) || 1)} />
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-200" onClick={() => goStep(1)}>Back</button>
            <button
              className={`px-3 py-1 rounded ${canGoStep3() ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              onClick={() => canGoStep3() && goStep(3)}
              disabled={!canGoStep3()}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">Review</div>
          <ReviewRow k="Corporate" v={corporate || "—"} />
          <ReviewRow k="Guest" v={guestName} />
          <ReviewRow k="Room"
                     v={selRoom ? `${selRoom.roomCode} (${selRoom.type ?? "—"})` : "—"} />
          <ReviewRow k="Rooms" v={roomsQty} />
          <ReviewRow k="Check-in" v={checkIn} />
          <ReviewRow k="Check-out" v={checkOut} />
          <ReviewRow k="Nights" v={nights} />
          <ReviewRow k="ARR" v={`₹ ${estimatedRate}`} />
          <ReviewRow k="Estimated total" v={`₹ ${estTotal}`} />

          <Labeled label="Notes">
            <textarea className="border rounded px-2 py-1 w-full"
                      rows={2} value={notes}
                      onChange={e => setNotes(e.target.value)} />
          </Labeled>

          {submitErr && <div className="text-red-600 text-sm">{submitErr}</div>}

          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-200" onClick={() => goStep(2)}>Back</button>
            <button
              className={`px-3 py-1 rounded ${submitting ? "bg-gray-400" : "bg-emerald-600 text-white"}`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit for Approval"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- small UI helpers ---------------- */

function Step({ n, step, onClick, title }) {
  const active = step === n;
  return (
    <button
      className={`px-2 py-1 rounded ${active ? "bg-black text-white" : "bg-gray-200"}`}
      onClick={onClick}
      type="button"
    >
      {n}. {title}
    </button>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm mb-1">{label}</div>
      {children}
    </label>
  );
}

function ReviewRow({ k, v }) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="w-40 text-gray-600">{k}:</div>
      <div className="flex-1">{String(v)}</div>
    </div>
  );
}
