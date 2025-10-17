
const PriceSummary = {
  render: (containerId, quote) => {
    const el = document.getElementById(containerId);
    if (!el || !quote) return;
    el.innerHTML = `
      <div class="d-flex flex-column gap-2">
        ${(quote.lineItems||[]).map(li => `<div class="d-flex justify-content-between"><span>${li.label}</span><span>₹ ${li.amount}</span></div>`).join('')}
        <hr class="my-2"/>
        ${(quote.taxes||[]).map(t => `<div class="d-flex justify-content-between"><span>${t.label}</span><span>₹ ${t.amount}</span></div>`).join('')}
        <div class="d-flex justify-content-between fw-semibold fs-5"><span>Total</span><span>₹ ${quote.total}</span></div>
      </div>
    `;
  }
};
