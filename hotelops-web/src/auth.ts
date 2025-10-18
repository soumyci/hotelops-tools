// keep the small helpers you already have…
export const isAuthed = () =>
  !!localStorage.getItem("token") || !!localStorage.getItem("demoAuth");

// Make sure we have a permissive Demo token so API won't 403
export function ensureDemo(role: "CorporateAdmin" | "Admin" | "Staff" = "CorporateAdmin") {
  if (!localStorage.getItem("jwt") && !localStorage.getItem("demoAuth")) {
    localStorage.setItem(
      "demoAuth",
      `Demo role=${role}; name=Demo User; email=demo@example.com`
    );
    // optional: also set roles[] for your guards if you re-enable them later
    localStorage.setItem("roles", JSON.stringify([role]));
  }
}
