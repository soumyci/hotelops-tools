import { useEffect, useState } from "react";

function Row({ item, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ code: item.code, name: item.name });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onSave(item.id, form);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-t">
      <td className="py-2">
        {edit ? (
          <input
            className="border rounded px-2 py-1 w-32"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />
        ) : (
          item.code
        )}
      </td>
      <td className="py-2">
        {edit ? (
          <input
            className="border rounded px-2 py-1 w-64"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        ) : (
          item.name
        )}
      </td>
      <td className="py-2 text-right space-x-3">
        {edit ? (
          <>
            <button
              onClick={save}
              disabled={saving}
              className="text-emerald-600 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setForm({ code: item.code, name: item.name });
                setEdit(false);
              }}
              className="text-slate-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEdit(true)} className="text-blue-600">
              ✏️
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-600"
            >
              🗑️
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default function AmenitiesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ code: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // list
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("/api/admin/amenities");
        if (!res.ok) throw new Error(await res.text());
        setItems(await res.json());
      } catch (e) {
        setErr("Failed to load amenities");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // create
  async function create(e) {
    e.preventDefault();
    setErr("");
    if (!form.code.trim() || !form.name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          name: form.name.trim(),
        }),
      });
      if (!res.ok) {
        const msg = await safeProblem(res);
        throw new Error(msg || "Save failed");
      }
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      setForm({ code: "", name: "" });
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  // update
  async function update(id, data) {
    setErr("");
    const res = await fetch(`/api/admin/amenities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: data.code.trim().toUpperCase(),
        name: data.name.trim(),
      }),
    });
    if (!res.ok) {
      const msg = await safeProblem(res);
      throw new Error(msg || "Update failed");
    }
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...data, code: data.code.toUpperCase() } : x))
    );
  }

  // delete
  async function remove(id) {
    setErr("");
    if (!confirm("Delete amenity?")) return;
    const res = await fetch(`/api/admin/amenities/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const msg = await safeProblem(res);
      throw new Error(msg || "Delete failed");
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Amenities</h1>
        <p className="text-slate-500">Create & manage standard amenities.</p>
      </div>

      <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Code (e.g. WIFI)"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value.toUpperCase() })
          }
        />
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <button
          className="rounded-lg px-4 py-2 bg-slate-900 text-white disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      {err && (
        <div className="mb-3 text-red-600 text-sm">
          {err}
        </div>
      )}

      <div className="rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="text-left py-2 px-3">Code</th>
              <th className="text-left py-2 px-3">Name</th>
              <th className="text-right py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-6 px-3 text-slate-500" colSpan={3}>
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="py-6 px-3 text-slate-500" colSpan={3}>
                  No amenities yet
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <Row key={a.id} item={a} onSave={update} onDelete={remove} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function safeProblem(res) {
  try {
    const data = await res.json();
    // ASP.NET Core problem details often in 'title' or 'detail'
    return data?.detail || data?.title || "";
  } catch {
    return "";
  }
}
