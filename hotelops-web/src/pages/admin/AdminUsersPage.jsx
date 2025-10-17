import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // TODO: hook up to /api/admin/users when you add it
    setUsers([]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      <div className="rounded-xl border p-4 mb-6">
        <p className="text-sm text-slate-600">
          User management UI coming next. This placeholder keeps routing happy.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="font-medium mb-2">Users</h2>
        {users.length === 0 && (
          <div className="text-slate-500 text-sm">No users yet.</div>
        )}
      </div>
    </div>
  );
}
