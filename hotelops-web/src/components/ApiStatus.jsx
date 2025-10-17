import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function ApiStatus() {
  const [ok, setOk] = useState(null); // null=loading, true/false=result
  useEffect(() => {
    api.get("/api/ping").then(()=>setOk(true)).catch(()=>setOk(false));
  }, []);
  const color = ok === null ? "#999" : ok ? "#2e7d32" : "#c62828";
  const text  = ok === null ? "checking…" : ok ? "API online" : "API offline";
  return (
    <span style={{display:"inline-flex", alignItems:"center", gap:6}}>
      <span style={{width:10, height:10, borderRadius:999, background:color, display:"inline-block"}} />
      <small>{text}</small>
    </span>
  );
}
