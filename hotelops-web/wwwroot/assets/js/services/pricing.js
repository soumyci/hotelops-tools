
const PricingEngine = {
  // naive quote: base * nights * qty + taxes
  quote: ({ nights=1, roomType='STD', qty=1, extras=[] }) => {
    const baseMap = { STD: 3200, DLX: 3900, STE: 5400 };
    const base = baseMap[roomType] || 3200;
    let subtotal = base * Math.max(1,nights) * Math.max(1,qty);
    let extrasTotal = 0;
    (extras||[]).forEach(x => { if (x==='breakfast') extrasTotal+=250*qty*nights; if (x==='airport') extrasTotal+=600; if (x==='late') extrasTotal+=base*0.5; });
    subtotal += extrasTotal;
    const tax = Math.round(subtotal * 0.12);
    return {
      currency: 'INR',
      lineItems: [
        { label: `Room (${roomType})`, amount: base * nights * qty },
        ...(extrasTotal? [{label:'Extras', amount: extrasTotal}] : [])
      ],
      taxes: [{ label: 'GST (12%)', amount: tax }],
      total: subtotal + tax
    };
  }
};
