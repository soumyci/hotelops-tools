import { useEffect, useState } from "react";
import { postJson, getJson } from "@/api/http.js";

const MODES = ["Cash","Card","UPI","BankTransfer","Cheque","Other"];

export default function PaymentCreate() {
  const [form, setForm] = useState({
    paymentDate: new Date().toISOString().slice(0,10),
    invoiceNumber: "",
    customerCode: "",
    customerName: "",
    amount: "",
    mode: "Cash",
    details: "",
    enteredByStaffId: localStorage.getItem("userId") || ""
  });
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);
  const [err, setErr] = useState("");

  const set = (k,v)=> setForm(s=>({...s,[k]:v}));

  async function lookupCustomer(code){
    if(!code) { set("customerName",""); return; }
    try {
      // adjust to your real lookup when available
      const r = await getJson(`/api/corporates/lookup?code=${encodeURIComponent(code)}`);
      set("customerName", r?.name || "(unknown)");
    } catch {
      set("customerName","(unknown)");
    }
  }

  async function submit(e){
    e.preventDefault();
    setSaving(true); setErr("");
    try{
      const payload = {
        paymentDate: new Date(form.paymentDate),
        invoiceNumber: form.invoiceNumber || null,
        customerCode: form.customerCode || null,
        customerName: form.customerName || null,
        amount: Number(form.amount || 0),
        mode: form.mode,
        details: form.details || null,
        enteredByStaffId: form.enteredByStaffId || "staff"
      };
      const created = await postJson("/api/payments", payload); // endpoint to be wired later
      setCreated(created);
    } catch (e) {
      setErr(String(e));
    } finally { setSaving(false); }
  }

  useEffect(()=>{ /* autofocus */ },[]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Record Payment</h2>

      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span>Payment date</span>
            <input type="date" value={form.paymentDate} onChange={e=>set("paymentDate", e.target.value)} />
          </label>

          <label className="flex flex-col gap-1">
            <span>Invoice number</span>
            <input value={form.invoiceNumber} onChange={e=>set("invoiceNumber", e.target.value)} />
          </label>

          <label className="flex flex-col gap-1">
            <span>Customer/Corporate code</span>
            <input
              value={form.customerCode}
              onChange={e=>set("customerCode", e.target.value)}
              onBlur={()=>lookupCustomer(form.customerCode)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span>Customer name</span>
            <input value={form.customerName} onChange={e=>set("customerName", e.target.value)} />
          </label>

          <label className="flex flex-col gap-1">
            <span>Amount paid</span>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={e=>set("amount", e.target.value)} />
          </label>

          <label className="flex flex-col gap-1">
            <span>Mode of Payment</span>
            <select value={form.mode} onChange={e=>set("mode", e.target.value)}>
              {MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1 col-span-2">
            <span>Payment details</span>
            <textarea rows="3" value={form.details} onChange={e=>set("details", e.target.value)} />
          </label>

          <label className="flex flex-col gap-1">
            <span>Entered by (staff id)</span>
            <input value={form.enteredByStaffId} onChange={e=>set("enteredByStaffId", e.target.value)} />
          </label>
        </div>

        <button disabled={saving} className="px-4 py-2 rounded border">
          {saving ? "Saving..." : "Save Payment"}
        </button>
      </form>

      {err && <div className="p-2 border text-red-600">{err}</div>}
      {created && (
        <div className="p-3 rounded border">
          <b>Saved:</b> #{created.id} • ₹{created.amount} on {created.paymentDate?.slice(0,10)} • {created.mode}
        </div>
      )}
    </div>
  );
}
