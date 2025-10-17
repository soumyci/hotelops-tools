// src/pages/accounts/RecordPaymentPage.jsx
import { useState } from "react";
export default function RecordPaymentPage(){
  const [form,setForm] = useState({ reservationId:"", amount:"", method:"Cash", reference:"" });
  async function save(e){
    e.preventDefault();
    const r = await fetch("/api/accounts/payments",{
      method:"POST", headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ reservationId:+form.reservationId, amount:+form.amount, method:form.method, reference:form.reference })
    });
    if(r.ok){ alert("Saved"); setForm({ reservationId:"", amount:"", method:"Cash", reference:"" });}
  }
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Record Payment</h1>
      <form onSubmit={save} className="grid gap-2">
        <input placeholder="Reservation Id" value={form.reservationId} onChange={e=>setForm({...form, reservationId:e.target.value})}/>
        <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})}/>
        <input placeholder="Method" value={form.method} onChange={e=>setForm({...form, method:e.target.value})}/>
        <input placeholder="Reference" value={form.reference} onChange={e=>setForm({...form, reference:e.target.value})}/>
        <button>Save</button>
      </form>
    </div>
  );
}
