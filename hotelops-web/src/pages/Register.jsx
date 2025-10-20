import { useState } from "react";
import { postJson } from "@/api/http";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    role: "staff",
    companyCode: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    if (!form.fullName.trim()) {
      setMsg("Full Name is required");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setMsg("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const body = {
        fullName: form.fullName,
        role: form.role,
        companyCode: form.companyCode || null,
        password: form.password,
      };
      const res = await postJson("/api/accounts/register", body);
      setMsg(`User created: ${res.fullName} (role: ${res.role})`);
      // optionally redirect to /login
    } catch (err) {
      setMsg(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Create User</h2>

      <form className="space-y-3" onSubmit={submit}>
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => set("fullName", e.target.value)}
        />

        <select value={form.role} onChange={e => set("role", e.target.value)}>
          <option value="admin">Admin</option>
          <option value="corporate">Corporate</option>
          <option value="staff">Staff</option>
        </select>

        <input
          placeholder="Company Code (label only for now)"
          value={form.companyCode}
          onChange={e => set("companyCode", e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => set("password", e.target.value)}
        />
        <input
          type="password"
          placeholder="Re-type Password"
          value={form.confirmPassword}
          onChange={e => set("confirmPassword", e.target.value)}
          onBlur={() => {
            if (
              form.password &&
              form.confirmPassword &&
              form.password !== form.confirmPassword
            ) setMsg("Passwords do not match");
          }}
        />

        <button disabled={saving}>
          {saving ? "Creating..." : "Create User"}
        </button>
      </form>

      {msg && <div className="p-2 rounded border">{msg}</div>}
    </div>
  );
}
