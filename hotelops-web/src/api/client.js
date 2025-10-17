// Simple JSON fetch with helpful errors
async function getJson(url) {
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);
  try { return JSON.parse(text); }
  catch { throw new Error(`Not JSON: ${text.slice(0, 120)}`); }
}

export const getHealth            = () => getJson('/api/health');
export const getRooms             = () => getJson('/api/rooms');
export const getKpisSummary       = () => getJson('/api/kpis/summary');
export const getAvailability      = (y, m) => getJson(`/api/availability?year=${y}&month=${m}`);
export const getUpcomingBookings  = () => getJson('/api/bookings/upcoming');

export async function createBooking(payload) {
  const res = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  const b = JSON.parse(text);
  if (b.totalHours == null && b.checkIn && b.checkOut) {
    const diff = (new Date(b.checkOut) - new Date(b.checkIn)) / 36e5;
    b.totalHours = Math.max(0, Math.round(diff * 10) / 10);
  }
  return b;
}