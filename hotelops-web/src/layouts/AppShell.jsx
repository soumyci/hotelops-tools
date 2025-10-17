// src/layouts/AppShell.jsx (or .tsx)
import { Outlet } from "react-router-dom";
import { useCurrentRole } from "@/hooks/useCurrentRole";

export default function AppShell() {
  const { role } = useCurrentRole();

  return (
    <div className="min-h-screen">
      <header className="px-4 py-3 border-b flex items-center gap-3">
        <span className="font-semibold">HotelOps</span>
        <span className="ml-auto text-sm border rounded px-2 py-0.5">
          {role ?? "Guest"}
        </span>
      </header>

      <main className="p-4">
        <Outlet />   {/* ← this is the key line */}
      </main>
    </div>
  );
}
