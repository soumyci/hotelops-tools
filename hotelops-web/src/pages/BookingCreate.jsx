import { useState } from "react";
//import client from "@/api/client";
import { createBooking } from "@/api/http.js"
export default function BookingCreate() {
  const [form, setForm] = useState({
    guestName: "", mobile: "", checkIn: new Date().toISOString().slice(0,10),
    nights: 1, adults: 2, children: 0, roomCategory: "Deluxe",
    corporateCode: "", couponCode: "",
    pickupAirport: false, pickupRail: false, localCab: false
  });
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");
  const set = (k,v) => setForm(s => ({...s, [k]: v}));

  async function submit(e){
    e.preventDefault();
    setSaving(true);
    try{
    //   const res = await client.post("/api/bookings", {
    //     guestName: form.guestName, mobile: form.mobile,
    //     checkIn: new Date(form.checkIn),
    //     nights: Number(form.nights), adults: Number(form.adults), children: Number(form.children),
    //     roomCategory: form.roomCategory,
    //     corporateCode: form.corporateCode || null, couponCode: form.couponCode || null,
    //     pickupAirport: !!form.pickupAirport, pickupRail: !!form.pickupRail, localCab: !!form.localCab
    //   });
    //   setCreated(res.data);
    const b = await createBooking({
  guestName: form.guestName, mobile: form.mobile,
   checkIn: new Date(form.checkIn),
   nights: Number(form.nights), adults: Number(form.adults), children: Number(form.children),
   roomCategory: form.roomCategory,
   corporateCode: form.corporateCode || null, couponCode: form.couponCode || null,
   pickupAirport: !!form.pickupAirport, pickupRail: !!form.pickupRail, localCab: !!form.localCab
 });
 setCreated(b);
    } finally { setSaving(false); }
  }

  const checkout = new Date(form.checkIn);
  checkout.setDate(checkout.getDate() + Number(form.nights));
  async function submit(e){
  e.preventDefault();
  setSaving(true); setError("");
  try {
    const b = await createBooking({ /* ...as above... */ });
    setCreated(b);
  } catch (err) {
    setError(String(err));
  } finally { setSaving(false); }
}
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Guest Booking</h2>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Guest Name" value={form.guestName} onChange={e=>set("guestName",e.target.value)} />
          <input placeholder="Mobile" value={form.mobile} onChange={e=>set("mobile",e.target.value)} />
          <input type="date" value={form.checkIn} onChange={e=>set("checkIn",e.target.value)} />
          <input type="number" min="1" value={form.nights} onChange={e=>set("nights",e.target.value)} />
          <input type="number" min="1" value={form.adults} onChange={e=>set("adults",e.target.value)} />
          <input type="number" min="0" value={form.children} onChange={e=>set("children",e.target.value)} />
          <select value={form.roomCategory} onChange={e=>set("roomCategory",e.target.value)}>
            <option>Deluxe</option><option>Suite</option><option>Standard</option>
          </select>
          <input placeholder="Corporate Code" value={form.corporateCode} onChange={e=>set("corporateCode",e.target.value)} />
          <input placeholder="Coupon Code" value={form.couponCode} onChange={e=>set("couponCode",e.target.value)} />
        </div>

        <div>
          <label><input type="checkbox" checked={form.pickupAirport} onChange={e=>set("pickupAirport",e.target.checked)} /> Airport Pick-up</label>{" "}
          <label><input type="checkbox" checked={form.pickupRail} onChange={e=>set("pickupRail",e.target.checked)} /> Railway Stn Pick-up</label>{" "}
          <label><input type="checkbox" checked={form.localCab} onChange={e=>set("localCab",e.target.checked)} /> Local Cab</label>
        </div>

        <div className="p-3 rounded border">
          <b>Price Summary</b><br/>
          Nights: {form.nights} • Check-out: {checkout.toISOString().slice(0,10)}<br/>
          Base ₹0 • Corporate Discount ₹0 • Facilities ₹0 <hr/> <b>Total ₹0</b>
        </div>

        <button disabled={saving}>{saving ? "Saving..." : "Submit Request"}</button>
      </form>

      {created && (
        <div className="p-3 rounded border">
          <b>Booking saved:</b> {created.code} for {created.guestName} (Check-out {created.checkOut?.slice(0,10)})
        </div>
      )}
      {error && <div className="p-2 border text-red-600">{error}</div>}
    </div>
  );
}
