// src/api/auth.ts
export const API =
  import.meta.env.VITE_API_URL ?? "https://localhost:7212";

 export const getToken = () => localStorage.getItem("jwt") ?? null;
export const setToken = (t: string) => {
  localStorage.setItem("jwt", t);
  window.dispatchEvent(new Event("auth:changed"));
};
// export const clearToken = () => {
//   localStorage.removeItem("jwt");
//   localStorage.removeItem("roles");
//   window.dispatchEvent(new Event("auth:changed"));
// };

export const getRoles = (): string[] => {
  try { return JSON.parse(localStorage.getItem("roles") ?? "[]"); }
  catch { return []; }
};

export async function authFetch(path: string, init: RequestInit = {}) {
  const url = `${API}${path.startsWith("/") ? path : `/${path}`}`;
  const token = getToken();
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function login(userName: string, password: string) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  setToken(data.token);
  localStorage.setItem("roles", JSON.stringify(data.roles ?? []));
  return data;
}

export async function registerUser(payload: {
  userName: string;
  fullName?: string;
  companyName?: string;
  role: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch(`${API}/api/admin/registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.title || `${res.status} ${res.statusText}`);
  }
  return res.json();
}
// export function saveToken(t: string) {
//   localStorage.setItem("token", t);
// }

// export function getToken(): string | null {
//   return localStorage.getItem("token");
// }

// export function clearToken() {
//   localStorage.removeItem("token");
// }

// export function getRoles(): string[] {
//   const t = getToken();
//   if (!t) return [];
//   const payload = JSON.parse(atob(t.split(".")[1] || ""));
//   // Roles may be array or single string based on backend mapping
//   const r = payload["role"] || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
//   return Array.isArray(r) ? r : r ? [r] : [];
// }

export function isAdmin(){ return getRoles().includes("Admin"); }
export function isHotel(){ return getRoles().includes("Hotel"); }
export function isCorporate(){ return getRoles().includes("Corporate"); }
// src/auth.ts
export function notifyAuthChanged() {
  // tell guards to re-check role
  window.dispatchEvent(new Event("auth-changed"));
}

// wherever you set/clear token or role:
export function saveToken(t: string) {
  localStorage.setItem("token", t);
  notifyAuthChanged();
}
export function saveRole(r: "admin" | "corporate" | "staff") {
  localStorage.setItem("role", r);
  notifyAuthChanged();
}
export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  notifyAuthChanged();
}