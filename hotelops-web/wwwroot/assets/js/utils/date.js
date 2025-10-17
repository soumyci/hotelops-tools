
const DateUtil = {
  toLocalInput: (d) => {
    const pad = (n)=> String(n).padStart(2,'0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth()+1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  },
  setTime: (isoLocal, hhmm) => {
    const [date,_time] = isoLocal.split('T');
    return `${date}T${hhmm}`;
  },
  hoursBetween: (isoLocal1, isoLocal2) => {
    const a = new Date(isoLocal1);
    const b = new Date(isoLocal2);
    return Math.max(0, Math.round((b - a)/36e5));
  },
  leadHours: (isoLocal) => {
    const a = new Date();
    const b = new Date(isoLocal);
    return Math.max(0, Math.round((b - a)/36e5));
  }
};
