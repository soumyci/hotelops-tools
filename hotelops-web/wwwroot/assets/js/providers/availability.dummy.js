
const DummyAvailabilityProvider = {
  get: async (fromISO, toISO, roomTypeIds=[]) => {
    // generate date list
    const dates = [];
    let d = new Date(fromISO);
    const end = new Date(toISO);
    while (d <= end){
      dates.push(d.toISOString().slice(0,10));
      d = new Date(d.getTime() + 24*3600*1000);
    }
    const types = ['Deluxe','Suite','Standard'];
    const rows = [];
    for (const t of types){
      for (const date of dates){
        const total = t==='Suite'?4:(t==='Deluxe'?10:12);
        const sold  = Math.floor(Math.random()*total);
        const blocked = Math.random()<0.1?1:0;
        rows.push({ date, roomType: t, total, sold, blocked });
      }
    }
    return rows;
  }
};
