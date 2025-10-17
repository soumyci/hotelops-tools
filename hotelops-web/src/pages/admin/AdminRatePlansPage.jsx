// src/pages/admin/AdminRatePlansPage.jsx
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminRatePlansPage() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    priceModifier: 0,
    isPercent: false,
    active: true,
  });

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await fetch("/api/admin/rateplans");
    if (!r.ok) {
      console.error("rate plans load failed");
      return;
    }
    setItems(await r.json());
  }

  function startEdit(rp) {
    setEditingId(rp.id);
    setForm({
      code: rp.code ?? "",
      name: rp.name ?? "",
      description: rp.description ?? "",
      priceModifier: rp.priceModifier ?? 0,
      isPercent: !!rp.isPercent,
      active: !!rp.active,
    });
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: (form.code || "").trim().toUpperCase(),
        name: (form.name || "").trim(),
        description: (form.description || "").trim(),
        priceModifier: Number(form.priceModifier) || 0,
        isPercent: !!form.isPercent,
        active: !!form.active,
      };

      const url = editingId
        ? `/api/admin/rateplans/${editingId}`
        : `/api/admin/rateplans`;
      const method = editingId ? "PUT" : "POST";

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        alert(await readMessage(r) || "Save failed");
        return;
      }

      await load();
      setEditingId(null);
      setForm({
        code: "",
        name: "",
        description: "",
        priceModifier: 0,
        isPercent: false,
        active: true,
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this rate plan?")) return;
    const r = await fetch(`/api/admin/rateplans/${id}`, { method: "DELETE" });
    if (!r.ok) {
      alert(await readMessage(r) || "Delete failed");
      return;
    }
    await load();
    if (editingId === id) {
      setEditingId(null);
      setForm({
        code: "",
        name: "",
        description: "",
        priceModifier: 0,
        isPercent: false,
        active: true,
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Rate Plans</h1>

      <form onSubmit={save} className="space-y-3 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 sm:col-span-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2"
            type="number"
            step="0.01"
            placeholder="Price Modifier"
            value={form.priceModifier}
            onChange={(e) => setForm({ ...form, priceModifier: e.target.value })}
          />
        </div>

        <textarea
          className="border rounded-lg px-3 py-2 w-full"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.isPercent}
              onChange={(e) => setForm({ ...form, isPercent: e.target.checked })}
            />
            <span className="text-sm">Is Percent</span>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div>
          <button
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-3 px-3 py-2 rounded border"
              onClick={() => {
                setEditingId(null);
                setForm({
                  code: "",
                  name: "",
                  description: "",
                  priceModifier: 0,
                  isPercent: false,
                  active: true,
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="text-left py-2 px-3">Code</th>
              <th className="text-left py-2 px-3">Name</th>
              <th className="text-left py-2 px-3">Price Mod.</th>
              <th className="text-left py-2 px-3">Is %</th>
              <th className="text-left py-2 px-3">Active</th>
              <th className="text-left py-2 px-3">Description</th>
              <th className="text-right py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((rp) => (
              <tr key={rp.id} className="border-t">
                <td className="py-2 px-3">{rp.code}</td>
                <td className="py-2 px-3">{rp.name}</td>
                <td className="py-2 px-3">{rp.priceModifier}</td>
                <td className="py-2 px-3">{rp.isPercent ? "Yes" : "No"}</td>
                <td className="py-2 px-3">{rp.active ? "Yes" : "No"}</td>
                <td className="py-2 px-3">{rp.description || "—"}</td>
                <td className="py-2 px-3 text-right">
                  <button className="icon-btn" title="Edit" onClick={() => startEdit(rp)}>
                    <Pencil />
                  </button>
                  <button className="icon-btn danger" title="Delete" onClick={() => remove(rp.id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  No rate plans yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function readMessage(r) {
  try {
    const t = await r.text();
    if (!t) return "";
    try {
      const j = JSON.parse(t);
      return j.message || j.title || t;
    } catch {
      return t;
    }
  } catch {
    return "";
  }
}
