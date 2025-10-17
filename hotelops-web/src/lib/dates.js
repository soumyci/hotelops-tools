// src/lib/dates.js
// Parse an <input type="datetime-local"> string into a Date in local time
export function parseLocalInput(s) {
  // Accept "YYYY-MM-DDTHH:mm" (what browsers emit) and tolerate empty
  if (!s) return null;
  // Safari sometimes needs ":ss"
  const withSeconds = s.length === 16 ? `${s}:00` : s;
  // Treat as local by splitting parts instead of new Date(s) (which can assume Z in some engines)
  const [date, time] = withSeconds.split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm, ss] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, ss || 0);
}

// Turn a local Date into 'YYYY-MM-DDTHH:mm:ss±HH:MM'
export function toIsoWithOffset(d) {
  if (!d) return null;
  const pad = n => String(n).padStart(2, '0');
  const off = -d.getTimezoneOffset(); // minutes from UTC
  const sign = off >= 0 ? '+' : '-';
  const hh = pad(Math.floor(Math.abs(off) / 60));
  const mm = pad(Math.abs(off) % 60);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${sign}${hh}:${mm}`;
}
