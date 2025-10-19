// ---- Simple fetch helpers (with auth header) ----
function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}
export async function getJson(url) {
  const res = await fetch(url, { headers: { ...authHeaders() } });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`);
  return JSON.parse(text);
}
export async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`);
  return JSON.parse(text);
}

// API wrappers
export const createBooking = (payload) => postJson("/api/bookings", payload);
export const getRooms      = () => getJson("/api/admin/rooms"); // tweak if needed
