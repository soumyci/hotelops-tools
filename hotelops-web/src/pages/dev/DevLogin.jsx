import { setDevRole } from "@/auth";

export default function DevLogin() {
  const pick = (r) => { setDevRole(r); location.href = "/admin/rooms"; };
  return (
    <div style={{ padding: 24 }}>
      <h3>Dev Login</h3>
      <button onClick={() => pick("Admin")}>Admin</button>
      <button onClick={() => pick("Hotel")}>Hotel</button>
      <button onClick={() => pick("Corporate")}>Corporate</button>
    </div>
  );
}
