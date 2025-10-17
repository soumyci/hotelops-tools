// src/pages/accounts/PendingReportPage.jsx
import { useEffect, useState } from "react";
export default function PendingReportPage(){
  const [rows,setRows]=useState([]);
  useEffect(()=>{ (async()=>{ const r=await fetch("/api/accounts/reports/pending"); if(r.ok)setRows(await r.json());})(); },[]);
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Pending Bills (by Customer)</h1>
      <table className="w-full text-sm">
        <thead><tr>
          <th className="text-left">Customer</th>
          <th className="text-right">Billed</th>
          <th className="text-right">Paid</th>
          <th className="text-right">Pending</th>
        </tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>{r.customer}</td>
              <td className="text-right">{r.billed.toFixed?.(2) ?? r.billed}</td>
              <td className="text-right">{r.paid.toFixed?.(2) ?? r.paid}</td>
              <td className="text-right font-semibold">{r.pending.toFixed?.(2) ?? r.pending}</td>
            </tr>
          ))}
          {rows.length===0 && <tr><td className="py-6 text-center" colSpan={4}>No data</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
