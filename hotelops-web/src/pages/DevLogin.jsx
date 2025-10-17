// src/pages/DevLogin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, JWT_KEY } from "../auth";
export default function DevLogin() {
  const nav = useNavigate();
  const [jwt, setJwt] = useState("");

  // preload any existing token so you can see/replace it
  useEffect(() => {
    const t = localStorage.getItem("jwt") || "";
    setJwt(t);
  }, []);

  const save = (e) => {
    e?.preventDefault(); // avoid full page reload if inside a <form>
    const trimmed = jwt.trim();

    // very light sanity check (JWT has 3 dot-separated segments)
    if (!trimmed || trimmed.split(".").length !== 3) {
      alert("That doesn't look like a JWT. Paste the full token.");
      return;
    }

    localStorage.setItem("jwt", trimmed);
    // optional: quick decode for visual confirmation (no validation)
    try {
      const payload = JSON.parse(atob(trimmed.split(".")[1]));
      console.log("JWT payload", payload);
    } catch { /* ignore */ }

    // go to admin
    nav("/admin/rooms", { replace: true });
  };

  const clear = () => {
    localStorage.removeItem("jwt");
    setJwt("");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Dev Login (paste JWT)</h2>
      <textarea
        value={jwt}
        onChange={(e) => setJwt(e.target.value)}
        rows={6}
        style={{ width: 600, maxWidth: "100%" }}
        placeholder="paste token here"
      />
      <div style={{ marginTop: 8 }}>
        <button type="button" onClick={save} style={{ marginRight: 8 }}>
          Save token
        </button>
        <button type="button" onClick={clear}>Clear</button>
      </div>
      <p style={{ marginTop: 12, color: "#666" }}>
        After saving, you’ll be redirected to <code>/admin/rooms</code>.
      </p>
    </div>
  );
}