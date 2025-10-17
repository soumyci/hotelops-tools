// assets/js/app.js
// Bootstrap init (tooltips & popovers) + app wiring
document.addEventListener('DOMContentLoaded', () => {
  // ---- Enable Bootstrap tooltips/popovers globally ----
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(el => new bootstrap.Popover(el, { html: true }));

  // =====================================================
  // A) DASHBOARD: Live KPIs + Recent Bookings
  // =====================================================
  const occ = document.getElementById('kpi-occupancy');
  if (occ) {
    (async () => {
      const iso = (d) => d.toISOString();
      const toLocal = (isoStr) => (isoStr || '').replace('T', ' ').slice(0, 16);

      // 1) Optional health ping (for console visibility)
      try {
        const health = await fetch('/health').then(r => r.json());
        console.log('API health:', health);
      } catch (e) {
        console.warn('Health ping failed:', e);
      }

      // 2) Rooms → total count + provisional ARR
      let rooms = [];
      try {
        rooms = await fetch('/api/rooms').then(r => r.json());
      } catch (e) {
        console.warn('Rooms fetch failed:', e);
      }
      const totalRooms = rooms.length || 0;
      const arr = totalRooms
        ? Math.round(rooms.reduce((s, r) => s + (r.basePrice || 0), 0) / totalRooms)
        : 0;

      // 3) Bookings for today + next 7 days
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const next7      = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 0, 0, 0);

      const qToday = `/api/booking?from=${encodeURIComponent(iso(startOfDay))}&to=${encodeURIComponent(iso(endOfDay))}`;
      const qNext7 = `/api/booking?from=${encodeURIComponent(iso(now))}&to=${encodeURIComponent(iso(next7))}`;

      let bookingsToday = [];
      let bookingsNext7 = [];
      try {
        [bookingsToday, bookingsNext7] = await Promise.all([
          fetch(qToday).then(r => r.json()),
          fetch(qNext7).then(r => r.json())
        ]);
      } catch (e) {
        console.warn('Bookings fetch failed:', e);
      }

      // 4) Compute KPIs
      const bookedRoomCount = new Set((bookingsToday || []).map(b => b.roomCode)).size;
      const occupancyPct = totalRooms ? Math.round((bookedRoomCount / totalRooms) * 100) : 0;
      const pickup = (bookingsNext7 || []).filter(b => {
        const ci = new Date(b.checkIn);
        return ci >= now && ci < next7;
      }).length;
      const revpar = Math.round((arr * occupancyPct) / 100);

      // 5) Bind KPIs
      occ.textContent = `${occupancyPct}%`;
      const pickupEl = document.getElementById('kpi-pickup');
      const arrEl    = document.getElementById('kpi-arr');
      const rpEl     = document.getElementById('kpi-revpar');
      if (pickupEl) pickupEl.textContent = String(pickup);
      if (arrEl)    arrEl.textContent    = `₹ ${arr.toLocaleString('en-IN')}`;
      if (rpEl)     rpEl.textContent     = `₹ ${revpar.toLocaleString('en-IN')}`;

      // 6) Recent bookings table
      const tb = document.querySelector('#recentBookings tbody');
      if (tb) {
        const recent = (bookingsNext7 || []).slice(0, 10);
        tb.innerHTML = recent.map(r => `
          <tr>
            <td>${r.id || '-'}</td>
            <td>${r.guestName || '-'}</td>
            <td>${toLocal(r.checkIn)}</td>
            <td>${toLocal(r.checkOut)}</td>
            <td>${r.roomCode || '-'}</td>
            <td><span class="badge text-bg-secondary">${(r.status || 'Draft')}</span></td>
          </tr>
        `).join('');
      }
    })();
  }

  // =====================================================
  // B) BOOKING WIZARD NAV + AVAILABILITY + HINTS
  // =====================================================
  const step2Btn = document.getElementById('toStep2');
  if (step2Btn) {
    step2Btn.addEventListener('click', async () => {
      const ci = document.getElementById('checkIn').value;
      const co = document.getElementById('checkOut').value;

      // Hours difference tooltip
      const hours = DateUtil.hoursBetween(ci, co);
      HintBubble.show('checkOut', `Total hours booked: <b>${hours}h</b>.`, { autohide: true });

      // Load dummy availability (can swap to /api/availability later)
      const from = ci.slice(0, 10);
      const to   = co.slice(0, 10);
      const avail = await DummyAvailabilityProvider.get(from, to, []);
      renderAvailabilityMatrix('matrixNarrow', avail, { narrow: true });

      // Price & policy (placeholder logic)
      const quote = PricingEngine.quote({ nights: Math.max(1, Math.floor(hours / 24)), roomType: 'STD', qty: 1 });
      PriceSummary.render('priceSummary', quote);
      const status = ApprovalService.evaluate({ leadHours: DateUtil.leadHours(ci) });
      document.getElementById('policyBadge').innerHTML = status.requiresApproval
        ? '<span class="badge text-bg-warning">Needs Approval</span>'
        : '<span class="badge text-bg-success">On-policy</span>';

      // Early check-in hint
      const hour = ci.split('T')[1]?.slice(0, 2) || '14';
      if (parseInt(hour) < 14) {
        HintBubble.show('checkIn', 'Rates may increase for arrivals before <b>14:00</b>. <a href="#" id="apply1400">Apply 14:00</a>');
        setTimeout(() => {
          const a = document.getElementById('apply1400');
          if (a) a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('checkIn').value = DateUtil.setTime(ci, '14:00');
            HintBubble.dismiss('checkIn');
          });
        }, 0);
      }

      // Switch to Step 2 tab
      document.querySelector('#step2-tab').click();
    });
  }

  const back1 = document.getElementById('backTo1');
  if (back1) back1.addEventListener('click', () => document.querySelector('#step1-tab').click());

  const to3 = document.getElementById('toStep3');
  if (to3) to3.addEventListener('click', () => document.querySelector('#step3-tab').click());

  const back2 = document.getElementById('backTo2');
  if (back2) back2.addEventListener('click', () => document.querySelector('#step2-tab').click());

  const submitApproval = document.getElementById('submitApproval');
  if (submitApproval) submitApproval.addEventListener('click', () => {
    alert('Submitted for approval (mock).');
    window.location.href = 'bookings.html';
  });

  const confirmBooking = document.getElementById('confirmBooking');
  if (confirmBooking) confirmBooking.addEventListener('click', () => {
    alert('Booking confirmed (auto-approve mock).');
    window.location.href = 'bookings.html';
  });

  // =====================================================
  // C) DEFAULTS for wizard times (14:00 / 10:00)
  // =====================================================
  const checkInEl = document.getElementById('checkIn');
  const checkOutEl = document.getElementById('checkOut');
  if (checkInEl && checkOutEl) {
    const now = new Date();
    const inD = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0);
    const outD = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0);
    checkInEl.value = DateUtil.toLocalInput(inD);
    checkOutEl.value = DateUtil.toLocalInput(outD);
  }
});