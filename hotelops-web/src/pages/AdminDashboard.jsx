export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-slate-900">Admin · Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Occupancy" value="68%" delta="▲ 4%" tone="green" />
        <Stat title="Average Daily Rate" value="₹4,123" delta="▲ 2%" tone="green" />
        <Stat title="RevPAR" value="₹2,800" delta="▼ 1%" tone="red" />
        <Stat title="Arrivals (today)" value="12" />
      </div>

      {/* Chart + Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-medium mb-2">Bookings trend</h3>
          <Card className="lg:col-span-2">
          <h3 className="font-medium mb-2">Bookings trend</h3>
          <Sparkline data={[12, 14, 11, 16, 15, 17, 19, 18, 21, 20]} />
        </Card>

        </Card>
        <Card>
          <h3 className="font-medium mb-2">Availability</h3>
          <p className="text-sm text-slate-600 mb-2">Rooms across all types</p>
          <div className="space-y-2">
            <Bar label="Occupancy" pct={68} />
            <div className="flex items-center gap-3 text-sm">
              <Legend color="bg-slate-900" label="Occupied" />
              <Legend color="bg-slate-300" label="Available" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Recent bookings</h3>
          <button className="text-sm underline">View all</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2">BOOKING</th>
              <th className="text-left">GUEST</th>
              <th className="text-left">ROOM</th>
              <th className="text-left">DATES</th>
              <th className="text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <Row id="#1248" guest="Jane Cooper" room="DLX-120" dates="Oct 12 → Oct 14" status="Confirmed" tone="green" />
            <Row id="#1247" guest="Wade Warren" room="STD-334" dates="Oct 13 → Oct 15" status="Pending" tone="amber" />
            <Row id="#1246" guest="Guy Hawkins" room="SUI-101" dates="Oct 12 → Oct 13" status="Confirmed" tone="green" />
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* --- tiny helpers used above --- */
function Card({ children, className = "" }) {
  return <div className={`rounded-xl border border-slate-200 p-4 bg-white ${className}`}>{children}</div>;
}
function Stat({ title, value, delta, tone = "slate" }) {
  return (
    <Card>
      <div className="text-slate-500 text-sm">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-semibold">{value}</div>
        {delta && (
          <span className={`text-xs ${tone === "green" ? "text-green-600" : tone === "red" ? "text-red-600" : "text-slate-500"}`}>
            {delta}
          </span>
        )}
      </div>
    </Card>
  );
}
function Bar({ label, pct }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-slate-600 mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded bg-slate-200">
        <div className="h-2 rounded bg-slate-900" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-3 h-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}
function Row({ id, guest, room, dates, status, tone }) {
  const toneCls = tone === "green" ? "text-green-700 bg-green-50" : tone === "amber" ? "text-amber-700 bg-amber-50" : "text-slate-700 bg-slate-50";
  return (
    <tr className="border-t">
      <td className="py-3">{id}</td>
      <td>{guest}</td>
      <td>{room}</td>
      <td>{dates}</td>
      <td>
        <span className={`px-2 py-1 rounded text-xs ${toneCls}`}>{status}</span>
      </td>
    </tr>
  );
}
function Sparkline({ data = [], height = 140, stroke = "#0f172a" /* slate-900 */ }) {
  // Pad left/right so the line doesn’t touch the card edges
  const paddingX = 8;
  const w = 600;               // internal drawing width (will scale to container)
  const h = height;

  if (!data.length) return <div className="h-[140px] bg-slate-100 rounded" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(1, max - min);

  const points = data.map((v, i) => {
    const x = paddingX + (i * (w - paddingX * 2)) / (data.length - 1);
    const y = h - ((v - min) / span) * (h - 12) - 6; // 6px top/bottom padding
    return [x, y];
  });

  const d = points.map((p, i) => (i ? "L" : "M") + p[0] + "," + p[1]).join(" ");

  // simple area under line
  const dArea =
    `M${points[0][0]},${h} ` +
    points.map((p) => `L${p[0]},${p[1]}`).join(" ") +
    ` L${points[points.length - 1][0]},${h} Z`;

  return (
    <div className="h-[140px]">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <defs>
          <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* subtle grid baseline */}
        <line x1="0" x2={w} y1={h - 20} y2={h - 20} stroke="#e2e8f0" strokeWidth="1" />

        <path d={dArea} fill="url(#sparkFill)" />
        <path d={d} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
