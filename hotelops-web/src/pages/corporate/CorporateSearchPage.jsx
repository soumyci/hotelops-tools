import React, { useMemo, useState } from "react";
import api from "../../lib/api";

export default function CorporateSearchPage() {
  const [checkIn, setCheckIn] = useState("2025-10-05");
  const [checkOut, setCheckOut] = useState("2025-10-06");
  const [corporateId, setCorporateId] = useState("ACME");
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function search() {
    setBusy(true); setMessage("");
    try {
      const url = `/api/corporate/search?checkIn=${checkIn}&checkOut=${checkOut}&adults=1&corporateId=${encodeURIComponent(corporateId)}`;
      const { data } = await api.get(url);
      setRows(data);
      if (!data?.length) setMessage("No rooms found for these dates.");
    } catch (e) {
      setMessage(e?.response?.data ?? "Search failed.");
    } finally { setBusy(false); }
  }

  async function book(r) {
    setBusy(true); setMessage("");
    try {
      const payload = {
        corporateId,
        roomTypeId: r.roomTypeId,
        ratePlanCode: r.plan,
        checkIn: `${checkIn}T14:00:00Z`,
        checkOut: `${checkOut}T10:00:00Z`,
        guestName: "Demo Corporate Guest",
        phone: "9000000000",
        pricePerNight: r.finalPrice || r.basePrice
      };
      const { data } = await api.post("/api/corporate/book", payload);
      setMessage(`Booked #${data.id} (${data.roomTypeId}) ✅`);
    } catch (e) {
      setMessage(e?.response?.data ?? "Booking failed.");
    } finally { setBusy(false); }
  }

  const disabled = useMemo(() => new Date(checkIn) >= new Date(checkOut), [checkIn, checkOut]);

  return (
    <div>
      <h2 style={{marginBottom:12}}>Corporate Search & Book</h2>

      <div style={{display:"grid", gridTemplateColumns:"repeat(5, minmax(140px, 1fr))", gap:12, alignItems:"end"}}>
        <label>Check-in<br/><input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)}/></label>
        <label>Check-out<br/><input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)}/></label>
        <label>Corporate ID<br/><input value={corporateId} onChange={e=>setCorporateId(e.target.value)} placeholder="ACME"/></label>
        <button disabled={busy || disabled} onClick={search}>Search</button>
        {disabled && <small style={{color:"#b00"}}>Check-out must be after check-in</small>}
      </div>

      {message && <div style={{marginTop:12}}>{message}</div>}

      <table style={{marginTop:16, width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th align="left">Room Type</th>
            <th align="right">Base</th>
            <th align="right">Final</th>
            <th align="left">Plan</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i)=>(
            <tr key={i} style={{borderTop:"1px solid #eee"}}>
              <td>{r.roomTypeName}</td>
              <td align="right">{r.basePrice.toLocaleString()} {r.currency}</td>
              <td align="right"><strong>{(r.finalPrice ?? r.basePrice).toLocaleString()} {r.currency}</strong></td>
              <td>{r.plan}</td>
              <td><button disabled={busy} onClick={()=>book(r)}>Book</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
