

// const Stat = ({ label, value, hint, tone = "slate" }) => (
//   <Card>
//     <div className="text-sm text-slate-500">{label}</div>
//     <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
//     {hint && <div className={`mt-1 text-xs text-${tone}-600`}>{hint}</div>}
//   </Card>
// );

const Progress = ({ pct = 0 }) => (
  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
    <div className="h-full bg-slate-900" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
  </div>
);

const Row = ({ left, right }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className="text-slate-600">{left}</span>
    <span className="font-medium text-slate-900">{right}</span>
  </div>
);

const Pill = ({ children, tone = "slate" }) => (
  <span className={`rounded-full px-2 py-0.5 text-xs bg-${tone}-50 text-${tone}-700`}>{children}</span>
);
// --- tiny helpers used on the dashboard ----
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <Card className="w-full">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
    </Card>
  );
}
// ———— Staff (Normal Users) Dashboard ————
export default function StaffDashboard() {
  const stats = {
    todayBookings: 22,
    pendingApprovals: 5,
    occupancy: 71,
    paymentsDue: 3,
  };

  const corporates = [
    { name: "Acme Industries", due: 128000, last: "Oct 10" },
    { name: "Globex Pvt Ltd", due: 76450, last: "Oct 09" },
    { name: "Soylent Corp", due: 45200, last: "Oct 08" },
  ];

  const upcoming = [
    { id: "#1251", guest: "Arun K.", room: "DLX-221", when: "Today 3:00 PM", src: "Corporate" },
    { id: "#1250", guest: "Varsha N.", room: "STD-109", when: "Today 5:30 PM", src: "Direct" },
    { id: "#1249", guest: "D. Patel", room: "SUI-305", when: "Tomorrow 10:00 AM", src: "OTA" },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Staff · Dashboard</h1>
        <div className="text-sm text-slate-500">Front desk snapshot</div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bookings today" value={stats.todayBookings} />
        <Stat label="Pending approvals" value={stats.pendingApprovals} hint="need action" tone="amber" />
        <Stat label="Occupancy" value={`${stats.occupancy}%`} />
        <Stat label="Payments due (corporates)" value={stats.paymentsDue} hint="this week" tone="rose" />
      </div>

      {/* Middle row: availability + upcoming */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Availability</h2>
          <p className="text-xs text-slate-500">Across room types</p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { t: "SUI", tot: 20, occ: 15 },
              { t: "DLX", tot: 40, occ: 28 },
              { t: "STD", tot: 30, occ: 19 },
              { t: "TWN", tot: 16, occ: 10 },
            ].map((r) => (
              <div key={r.t} className="rounded-xl border p-3">
                <div className="text-sm font-medium text-slate-900">{r.t}</div>
                <div className="mt-1 text-xs text-slate-500">{r.occ}/{r.tot} occupied</div>
                <div className="mt-2"><Progress pct={(r.occ / r.tot) * 100} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-900">Upcoming check‑ins</h2>
          <div className="mt-3 space-y-3">
            {upcoming.map((u) => (
              <div key={u.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-slate-900">{u.id}</div>
                  <Pill tone="slate">{u.src}</Pill>
                </div>
                <div className="mt-1 text-sm text-slate-700">{u.guest} · {u.room}</div>
                <div className="mt-1 text-xs text-slate-500">{u.when}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payments due by corporate */}
      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Corporate payments due</h2>
          <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-50">Send reminders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="pb-2">Corporate</th>
                <th className="w-40 pb-2">Last payment</th>
                <th className="w-40 pb-2 text-right">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {corporates.map((c) => (
                <tr key={c.name} className="border-b last:border-0">
                  <td className="py-3 text-sm font-medium text-slate-900">{c.name}</td>
                  <td className="py-3 text-sm text-slate-700">{c.last}</td>
                  <td className="py-3 text-right text-sm text-slate-900">₹{c.due.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
