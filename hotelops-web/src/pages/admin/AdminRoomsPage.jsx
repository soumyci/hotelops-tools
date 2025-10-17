import { useEffect, useMemo, useState } from "react";
import { getAmenities, getRoomTypes } from "@/lib/api";
import { useBusy } from "@/components/BusyProvider";
import { useToast } from "@/components/ToastProvider";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminRoomsPage() {
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    capacity: 2,
    basePrice: 0,
    roomTypeId: 0,
    amenityIds: [],
  });

  const amenityById = useMemo(() => {
    const m = new Map();
    amenities.forEach((a) => m.set(a.id, a.name));
    return m;
  }, [amenities]);

  const rtById = useMemo(() => new Map(types.map((t) => [t.id, t.name])), [types]);

  const { show, hide } = useBusy();
  const { push } = useToast();

  useEffect(() => {
    (async () => {
      show();
      try {
        const [rt, am] = await Promise.all([getRoomTypes(), getAmenities()]);
        setTypes(rt);
        setAmenities(am);

        const res = await fetch("/api/admin/rooms");
        if (!res.ok) throw new Error("rooms load failed");
        setItems(await res.json());
      } catch (err) {
        push(err.message || "Load failed", "error");
      } finally {
        hide(); // <-- MUST be called as a function
      }
    })();
  }, []);

  const toggleAmenity = (id) => {
    setForm((f) => {
      const set = new Set(f.amenityIds);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...f, amenityIds: [...set] };
    });
  };

  function startEdit(r) {
    setEditingId(r.id);
    setForm({
      code: r.code,
      name: r.name,
      capacity: r.capacity,
      basePrice: r.basePrice,
      roomTypeId: r.roomTypeId,
      amenityIds: [...(r.amenityIds || [])],
    });
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    show();
    try {
      const payload = { ...form, amenityIds: form.amenityIds };
      const url = editingId ? `/api/admin/rooms/${editingId}` : `/api/admin/rooms`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");

      const list = await (await fetch("/api/admin/rooms")).json();
      setItems(list);
      setForm({ code: "", name: "", capacity: 2, basePrice: 0, roomTypeId: 0, amenityIds: [] });
      setEditingId(null);
      push(editingId ? "Room updated" : "Room created", "success");
    } catch (err) {
      push(err.message || "Save failed", "error");
    } finally {
      hide();          // <-- call it
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this room?")) return;
    show();
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setItems((a) => a.filter((r) => r.id !== id));
      push("Room deleted", "success");
    } catch (err) {
      push(err.message || "Delete failed", "error");
    } finally {
      hide();          // <-- call it
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Rooms</h1>

      <form onSubmit={save} className="space-y-3 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Code" value={form.code}
                 onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <input className="border rounded-lg px-3 py-2 sm:col-span-2" placeholder="Name" value={form.name}
                 onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" type="number" min="1" placeholder="Capacity"
                 value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} />
          <input className="border rounded-lg px-3 py-2" type="number" step="0.01" placeholder="Base Price"
                 value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: +e.target.value })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select className="border rounded-lg px-3 py-2"
                  value={form.roomTypeId}
                  onChange={(e) => setForm({ ...form, roomTypeId: +e.target.value })}>
            <option value={0} disabled>Room Type</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.code} — {t.name}</option>
            ))}
          </select>

          <div className="border rounded-lg p-3">
            <div className="text-sm text-slate-600 mb-2">Amenities</div>
            <div className="flex flex-wrap gap-3">
              {amenities.map((a) => (
                <label key={a.id} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.amenityIds.includes(a.id)}
                    onChange={() => toggleAmenity(a.id)}
                  />
                  <span className="text-sm">{a.code}</span>
                </label>
              ))}
              {amenities.length === 0 && <span className="text-slate-500 text-sm">None yet</span>}
            </div>
          </div>
        </div>

        <button disabled={saving} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50">
          {editingId ? "Update" : "Save"}
        </button>
      </form>

      <div className="rounded-xl border p-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="text-left py-2">Code</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Amenities</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((room) => {
              const amenityNames = (room.amenityIds || []).map((id) => amenityById.get(id) ?? id).join(", ");
              return (
                <tr key={room.id}>
                  <td>{room.code}</td>
                  <td>{room.name}</td>
                  <td>{rtById.get(room.roomTypeId) ?? room.roomTypeId}</td>
                  <td>{amenityNames || "—"}</td>
                  <td className="text-right space-x-3">
                    <button className="icon-btn" title="Edit" onClick={() => startEdit(room)}>
                      <Pencil />
                    </button>
                    <button className="icon-btn danger" title="Delete" onClick={() => remove(room.id)}>
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-slate-500" colSpan={5}>
                  No rooms yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
