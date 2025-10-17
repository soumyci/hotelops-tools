
function renderAvailabilityMatrix(containerId, rows, opts={}){
  const el = document.getElementById(containerId);
  if (!el) return;
  // Build a pivot: roomType -> date -> cell
  const dates = [...new Set(rows.map(r=>r.date))].sort();
  const types = [...new Set(rows.map(r=>r.roomType))];
  function cell(r){ const free = r.total - r.sold - r.blocked; 
    let tag = free<=0? 'Sold' : (free <= Math.ceil(r.total*0.3)? 'Low':'Free');
    const badge = tag==='Sold'?'danger':(tag==='Low'?'warning':'success');
    return `<span class="badge text-bg-${badge}"><span class="badge-dot bg-${badge==='danger'?'danger':(badge==='warning'?'warning':'success')}"></span>${free}/${r.total} ${tag}</span>`;
  }
  let html = '<table class="table table-sm align-middle">';
  html += '<thead><tr><th>Room Type</th>'+dates.map(d=>`<th>${d}</th>`).join('')+'</tr></thead><tbody>';
  for (const t of types){
    html += `<tr><th>${t}</th>`;
    for (const d of dates){
      const r = rows.find(x=>x.roomType===t && x.date===d);
      html += `<td>${r?cell(r):'-'}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  el.innerHTML = html;
}
