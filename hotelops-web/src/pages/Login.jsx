import { useState } from "react";
import { http } from "../api/http";
import { saveToken, saveRole } from "../auth";

function mapRolesToUi(roles) {
  if (!Array.isArray(roles)) return null;
  if (roles.includes("Admin")) return "admin";
  if (roles.includes("Corporate")) return "corporate";
  if (roles.includes("Hotel")) return "staff";
  return null;
}

export default function Login() {
  const [email, setEmail] = useState("admin@hotelops.local");
  const [password, setPassword] = useState("Admin#12345");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("Signing in...");
    try {
      const res = await http.post("/api/auth/login", { email, password });
      const { accessToken, roles } = res.data;

      saveToken(accessToken);
      const uiRole = mapRolesToUi(roles);
      if (uiRole) saveRole(uiRole);

      // role-based redirect
      if (uiRole === "admin") window.location.href = "/dashboard";
      else if (uiRole === "corporate") window.location.href = "/corporate";
      else if (uiRole === "staff") window.location.href = "/staff";
      else window.location.href = "/login";
    } catch (err) {
      const txt = err?.response?.data || "Login failed";
      setMsg(typeof txt === "string" ? txt : JSON.stringify(txt));
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: "40px auto", display:"grid", gap:12 }}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Sign in</button>
      <div style={{color:"#444"}}>{msg}</div>
    </form>
  );
}
