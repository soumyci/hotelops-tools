export const isAuthed = () => !!localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const isAdmin = () => getRole() === "admin";
export const isCorporate = () => getRole() === "corporate";
export const isStaff = () => getRole() === "staff";

// export function isAuthed() {
//   return !!localStorage.getItem("jwt");
// }
export function getRoles(): string[] {
  try { return JSON.parse(localStorage.getItem("roles") || "[]"); } catch { return []; }
}
// export function isAdmin() {
//   return getRoles().includes("Admin");
// }
export function getToken(): string {
  return localStorage.getItem("jwt") || "";
}
export function getDevRole(): string {
  const roles = getRoles();
  return roles[0] || "Guest";
}