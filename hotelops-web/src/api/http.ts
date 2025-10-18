// src/api/http.ts
// Minimal fetch helper with "Demo" auth fallback (no localStorage hacks needed)

const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE ||
  "https://localhost:7212";

function pickAuth(): string {
  // Prefer a real JWT if you add one later
  const jwt = localStorage.getItem("jwt") || localStorage.getItem("token");
  if (jwt) return `Bearer ${jwt}`;

  // Otherwise send a permissive Demo header with all roles
  // This unblocks 403s while we finish role wiring.
  return "Demo role=Admin,CorporateAdmin,Staff; name=Dev User; email=dev@example.com";
}

export default async function http<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  headers.set("Authorization", pickAuth());

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.title) msg = body.title;
    } catch {}
    throw new Error(msg);
  }

  // 204 no content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
