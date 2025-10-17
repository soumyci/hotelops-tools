// src/pages/admin/RatePlansPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { listRatePlans, createRatePlan, deleteRatePlan } from "@/api/admin";

const emptyPlan = {
  code: "", name: "", price: 0, description: "", active: true,
};

export default function RatePlansPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyPlan);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const busy = useMemo(() => loading || saving, [loading, saving]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listRatePlans();
        setItems((Array.isArray(data) ? data : []).sort((a,b)=>a.code.localeCompare(b.code)));
      } catch {
        setMsg({ type: "error", text: "Failed to load rate plans." });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setMsg(null);
    if (!form.code.trim()) return setMsg({ type: "error", text: "Code is required." });
    if (form.price < 0)  return setMsg({ type: "error", text: "Price cannot be negative." });

    try {
      setSaving(true);
      const created = await createRatePlan({
        code: form.code,
        name: form.name,
        price: form.price,
        description: form.description,
        active: form.active,
      });
      setItems(prev => [created, ...prev].sort((a,b)=>a.code.localeCompare(b.code)));
      setForm(emptyPlan);
      setMsg({ type: "ok", text: "Saved." });
    } catch (err) {
      const t = err?.response?.data?.title || err?.message || "Save failed.";
      setMsg({ type: "error", text: t });
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteClick(item) {
    if (!item) return;
    if (!confirm(`Delete rate plan "${item.code}"?`)) return;
    try {
      setLoading(true);
      await deleteRatePlan(item.id);
      setItems(prev => prev.filter(x => x.id !== item.id));
    } catch {
      setMsg({ type: "error", text: "Delete failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Admin · Rate Plans</h2>

      {msg && (
        <div className={`alert ${msg.type === "error" ? "alert-error" : "alert-ok"}`}>{msg.text}</div>
      )}

      {loading && <div className="alert">Loading…</div>}

      <div className="grid grid-2">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 120 }}>Code</th>
                <th>Name</th>
                <th style={{ width: 120, textAlign: "right" }}>Price</th>
                <th style={{ width: 110 }}></th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map(p => (
                <tr key={p.id ?? p.code}>
                  <td>{p.code}</td>
                  <td title={p.description || ""}>
                    {p.name} {p.active ? "" : <span style={{opacity:.6}}>(inactive)</span>}
                  </td>
                  <td style={{ textAlign: "right" }}>{p.price}</td>
                  <td><button onClick={() => onDeleteClick(p)}>Delete</button></td>
                </tr>
              ))}
              {!loading && (items ?? []).length === 0 && (
                <tr><td colSpan={4} style={{opacity:.7}}>No rate plans yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={onSave} className="card" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Add a rate plan</h3>

          <label className="label">Code *</label>
          <input className="input" value={form.code}
                 onChange={e=>setForm(f=>({ ...f, code: e.target.value }))} placeholder="BAR" />

          <label className="label" style={{ marginTop: 12 }}>Name</label>
          <input className="input" value={form.name}
                 onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} placeholder="Best Available" />

          <label className="label" style={{ marginTop: 12 }}>Price</label>
          <input className="input" type="number" min="0" value={form.price}
                 onChange={e=>setForm(f=>({ ...f, price: e.target.value }))} />

          <label className="label" style={{ marginTop: 12 }}>Description</label>
          <input className="input" value={form.description}
                 onChange={e=>setForm(f=>({ ...f, description: e.target.value }))} placeholder="optional" />

          <div style={{ marginTop: 12 }}>
            <label><input type="checkbox" checked={form.active}
                          onChange={e=>setForm(f=>({ ...f, active: e.target.checked }))} /> Active</label>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button className="btn btn-primary" disabled={busy} type="submit">Save</button>
            <button className="btn" type="button" disabled={busy} onClick={()=>setForm(emptyPlan)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
