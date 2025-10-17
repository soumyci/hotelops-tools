import React from "react";

/*
  Two dashboards with mock data, Tailwind-only, no external libs.
  - CorporateDashboard: for corporate customers managing bookings & billing.
  - StaffDashboard: for internal/normal users who operate the property.

  Usage:
    import { CorporateDashboard, StaffDashboard } from "./Corporate & Staff Dashboards";
    <CorporateDashboard />
    <StaffDashboard />
*/

// ———— Reusable UI bits ————

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

const Stat = ({ label, value, hint, tone = "slate" }) => (
  <Card>
    <div className="text-sm text-slate-500">{label}</div>
    <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    {hint && <div className={`mt-1 text-xs text-${tone}-600`}>{hint}</div>}
  </Card>
);

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

// ———— Corporate Dashboard ————
export default function CorporateDashboard() {
  // Mock corporate data
  const corp = {
    name: "Acme Industries Pvt Ltd",
    tier: "Gold",
    savingsThisMonth: 48250,
    outstanding: 128000,
    creditLimit: 300000,
    utilization: 43, // % of credit used
    approvalsPending: 3,
    confirmedThisMonth: 18,
    averageDiscount: 14, // %
    combos: [
      { code: "SUI-Diwali+Dinner", price: 7999 },
      { code: "DLX+Breakfast", price: 3299 },
    ],
  };

  const approvals = [
    { id: "#C-2310", guest: "Rahul K.", room: "SUI-210", dates: "Oct 14 → Oct 16", amount: 15499, status: "Waiting" },
    { id: "#C-2309", guest: "Meera P.", room: "DLX-334", dates: "Oct 15 → Oct 17", amount: 6899, status: "Waiting" },
    { id: "#C-2308", guest: "A. Sharma", room: "SUI-118", dates: "Oct 13 → Oct 14", amount: 8999, status: "Waiting" },
  ];

  const recent = [
    { id: "#C-2307", guest: "Sunil D.", plan: "DLX+Breakfast", amount: 3499, state: "Confirmed" },
    { id: "#C-2306", guest: "Deepti R.", plan: "SUI-Diwali+Dinner", amount: 14999, state: "Modified" },
    { id: "#C-2305", guest: "Nikhil S.", plan: "DLX+Breakfast", amount: 3299, state: "Cancelled" },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Corporate · Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome, {corp.name} · Tier {corp.tier}</p>
        </div>
        <Pill tone="emerald">Avg discount {corp.averageDiscount}%</Pill>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Approvals pending" value={corp.approvalsPending} hint="awaiting hotel confirmation" tone="amber" />
        <Stat label="Confirmed (this month)" value={corp.confirmedThisMonth} />
        <Stat label="Savings (this month)" value={`₹${corp.savingsThisMonth.toLocaleString()}`} hint={`${corp.averageDiscount}% blended discount`} tone="emerald" />
        <Stat label="Outstanding" value={`₹${corp.outstanding.toLocaleString()}`} hint={`of ₹${corp.creditLimit.toLocaleString()} credit`} tone="rose" />
      </div>

      {/* Credit & combos */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Credit & billing</h2>
          <p className="text-xs text-slate-500">Monthly settlement snapshot</p>
          <div className="mt-4 space-y-2">
            <Row left="Credit utilization" right={`${corp.utilization}%`} />
            <Progress pct={corp.utilization} />
            <Row left="Outstanding" right={`₹${corp.outstanding.toLocaleString()}`} />
            <Row left="Savings this month" right={`₹${corp.savingsThisMonth.toLocaleString()}`} />
          </div>
          <div className="mt-4 flex gap-2">
            <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-50">View statement</button>
            <button className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm text-white">Pay now</button>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-900">Popular combos</h2>
          <p className="text-xs text-slate-500">Tailored offers for you</p>
          <div className="mt-4 space-y-3">
            {corp.combos.map((c) => (
              <div key={c.code} className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-900">{c.code}</div>
                <div className="text-sm text-slate-700">₹{c.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">View all offers</button>
        </Card>
      </div>

      {/* Approvals table */}
      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Bookings awaiting approval</h2>
          <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-50">Approve selected</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="w-28 pb-2">Request</th>
                <th className="pb-2">Guest</th>
                <th className="pb-2">Room</th>
                <th className="pb-2">Dates</th>
                <th className="w-28 pb-2 text-right">Amount</th>
                <th className="w-28 pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-3 text-sm font-medium text-slate-900">{r.id}</td>
                  <td className="py-3 text-sm text-slate-700">{r.guest}</td>
                  <td className="py-3 text-sm text-slate-700">{r.room}</td>
                  <td className="py-3 text-sm text-slate-700">{r.dates}</td>
                  <td className="py-3 text-right text-sm text-slate-900">₹{r.amount.toLocaleString()}</td>
                  <td className="py-3 text-right text-xs"><Pill tone="amber">{r.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent activity */}
      <Card className="mt-6">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Recent activity</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {recent.map((x) => (
            <div key={x.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium text-slate-900">{x.id}</div>
                <Pill tone={x.state === "Confirmed" ? "emerald" : x.state === "Modified" ? "amber" : "slate"}>{x.state}</Pill>
              </div>
              <div className="mt-1 text-sm text-slate-700">{x.guest}</div>
              <div className="mt-1 text-xs text-slate-500">{x.plan}</div>
              <div className="mt-1 text-sm font-medium text-slate-900">₹{x.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );


}