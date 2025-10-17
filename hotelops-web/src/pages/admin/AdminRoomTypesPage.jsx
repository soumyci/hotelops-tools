// src/pages/admin/AdminRoomTypesPage.jsx
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminRoomTypesPage() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    basePrice: 0,
    active: true,
  });

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await fetch("/api/admin/roomtypes");
    if (!r.ok) {
      console.error("room types load failed");
      return;
    }
    setItems(await r.json());
  }

  function startEdit(rt) {
    setEditingId(rt.id);
    setForm({
      code: rt.code ?? "",
      name: rt.name ?? "",
      basePrice: rt.basePrice ?? 0,
      active: rt.active ?? true,
    });
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: (form.code || "").trim().toUpperCase(),
        name: (form.name || "").trim(),
        basePrice: Number(form.basePrice) || 0,
        active: !!form.active,
      };

      const url = editingId
        ? `/api/admin/roomtypes/${editingId}`
        : `/api/admin/roomtypes`;
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
      setForm({ code: "", name: "", basePrice: 0, active: true });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this room type?")) return;
    const r = await fetch(`/api/admin/roomtypes/${id}`, { method: "DELETE" });
    if (!r.ok) {
      alert(await readMessage(r) || "Delete failed");
      return;
    }
    await load();
    if (editingId === id) {
      setEditingId(null);
      setForm({ code: "", name: "", basePrice: 0, active: true });
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Room Types</h1>

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
            placeholder="Base Price"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
          />
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span className="text-sm">Active</span>
        </label>

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
                setForm({ code: "", name: "", basePrice: 0, active: true });
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
              <th className="text-left py-2 px-3">Base Price</th>
              <th className="text-left py-2 px-3">Active</th>
              <th className="text-right py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((rt) => (
              <tr key={rt.id} className="border-t">
                <td className="py-2 px-3">{rt.code}</td>
                <td className="py-2 px-3">{rt.name}</td>
                <td className="py-2 px-3">{rt.basePrice}</td>
                <td className="py-2 px-3">{rt.active ? "Yes" : "No"}</td>
                <td className="py-2 px-3 text-right">
                 <button className="icon-btn" title="Edit" onClick={() => startEdit(rt)}>
                    <Pencil />
                  </button>
                  <button className="icon-btn danger" title="Delete" onClick={() => remove(rt.id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No room types yet
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
