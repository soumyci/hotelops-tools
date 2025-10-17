// src/auth/jwt.js
export function decodeJwt(token) {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function hasRole(token, roleName) {
  const data = decodeJwt(token);
  if (!data) return false;
  // common places roles show up in JWTs
  const claims = [
    ...(Array.isArray(data.role) ? data.role : data.role ? [data.role] : []),
    ...(Array.isArray(data.roles) ? data.roles : []),
    ...(Array.isArray(data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
      ? data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      : data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        ? [data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]]
        : [])
  ];
  return claims.includes(roleName);
}

export function isExpired(token) {
  const data = decodeJwt(token);
  if (!data?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return data.exp <= now;
}