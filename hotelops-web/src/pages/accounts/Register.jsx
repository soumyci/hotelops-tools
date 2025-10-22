import { useState } from "react";
import { registerUser } from "../../api/auth";

export default function Register() {
  const [form, setForm] = useState({
    userName: "", fullName: "", companyName: "",
    role: "staff", password: "", confirmPassword: ""
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setMsg(null);

    if (form.password !== form.confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setBusy(true);
    try {
      const data = await registerUser(form); // << uses absolute `${API}/api/admin/registration`
      setMsg({ type: "ok", text: `User ${data.userName} created as ${data.role}.` });
      setForm({ userName:"", fullName:"", companyName:"", role:"staff", password:"", confirmPassword:"" });
    } catch (ex) {
      setMsg({ type: "error", text: ex.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Create User</h1>

      {msg && (
        <div className={`mb-3 p-2 rounded ${msg.type==="ok" ? "bg-green-100" : "bg-red-100"}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="grid gap-4">
        {/* ... existing inputs ... */}
     
  

        <label className="grid gap-1">
          <span>Login (email or code)</span>
          <input value={form.userName} onChange={set("userName")} required className="border p-2 rounded" />
        </label>

        <label className="grid gap-1">
          <span>Full Name</span>
          <input value={form.fullName} onChange={set("fullName")} className="border p-2 rounded" />
        </label>

        <label className="grid gap-1">
          <span>Company Name</span>
          <input value={form.companyName} onChange={set("companyName")} className="border p-2 rounded" />
        </label>

        <label className="grid gap-1">
          <span>User Role</span>
          <select value={form.role} onChange={set("role")} className="border p-2 rounded">
            <option value="admin">admin</option>
            <option value="staff">staff</option>
            <option value="corporate">corporate</option>
          </select>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span>Password</span>
            <input type="password" value={form.password} onChange={set("password")} required className="border p-2 rounded" />
          </label>
          <label className="grid gap-1">
            <span>Confirm Password</span>
            <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} required className="border p-2 rounded" />
          </label>
        </div>

        <button disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded">
          {busy ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
