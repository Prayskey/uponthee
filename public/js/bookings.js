document.addEventListener('DOMContentLoaded', function () {
  let allBookings  = BOOKINGS_DATA || [];
  let activeFilter = 'all';
  let activeSort   = 'date-desc';
  let cancelTarget = null;

  const listEl        = document.getElementById('bookings-list');
  const emptyEl       = document.getElementById('empty-state');
  const filterPills   = document.querySelectorAll('.filter-pill');
  const sortSelect    = document.getElementById('sort-select');
  const cancelModal   = document.getElementById('cancel-modal');
  const cancelInfo    = document.getElementById('cancel-booking-info');
  const cancelConfirm = document.getElementById('cancel-confirm-btn');
  const cancelDismiss = document.getElementById('cancel-dismiss-btn');
  const detailModal   = document.getElementById('detail-modal');
  const detailContent = document.getElementById('detail-content');
  const detailDismiss = document.getElementById('detail-dismiss-btn');

  function fmt(n) { return '₦' + Number(n).toLocaleString('en-NG'); }
  function fmtDate(d) { return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }); }
  function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / (1000*60*60*24)); }
  function nightsBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / (1000*60*60*24)); }
  function badgeClass(s) { return { confirmed:'badge-confirmed', pending:'badge-pending', completed:'badge-completed', cancelled:'badge-cancelled' }[s] || 'badge-pending'; }

  function updateStats() {
    document.getElementById('stat-total').textContent     = allBookings.length;
    document.getElementById('stat-upcoming').textContent  = allBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
    document.getElementById('stat-completed').textContent = allBookings.filter(b => b.status === 'completed').length;
    const spent = allBookings.filter(b => b.status !== 'cancelled').reduce((s,b) => s + Number(b.total), 0);
    document.getElementById('stat-spent').textContent = fmt(spent);
  }

  function getFiltered() {
    let data = activeFilter === 'all' ? [...allBookings] : allBookings.filter(b => b.status === activeFilter);
    data.sort((a, b) => {
      if (activeSort === 'date-desc')  return new Date(b.check_in) - new Date(a.check_in);
      if (activeSort === 'date-asc')   return new Date(a.check_in) - new Date(b.check_in);
      if (activeSort === 'price-desc') return Number(b.total) - Number(a.total);
      if (activeSort === 'price-asc')  return Number(a.total) - Number(b.total);
      return 0;
    });
    return data;
  }

  function actionsHTML(b) {
    if (b.status === 'confirmed' || b.status === 'pending') {
      return `<button onclick="openDetail('${b.id}')" class="rounded-lg bg-[#55142A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#6e1a35]">View details</button>
              <button onclick="openCancel('${b.id}')" class="rounded-lg border border-red-200 px-4 py-2 text-xs text-red-600 transition hover:bg-red-50">Cancel</button>`;
    }
    if (b.status === 'completed') {
      return `<button onclick="window.location.href='/lodges/${b.lodge_id}'" class="rounded-lg bg-[#55142A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#6e1a35]">Book again</button>
              <button onclick="openDetail('${b.id}')" class="rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 transition hover:bg-gray-50">Leave a review</button>`;
    }
    return `<button onclick="window.location.href='/lodges'" class="rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 transition hover:bg-gray-50">Find similar</button>`;
  }

  function progressHTML(b) {
    if (b.status !== 'confirmed' && b.status !== 'pending') return '';
    const days = daysUntil(b.check_in);
    if (days <= 0 || days > 90) return '';
    const pct = Math.max(0, Math.min(100, Math.round((1 - days / 90) * 100)));
    return `<div class="mt-3"><p class="mb-1 text-xs text-gray-400">Check-in in <span class="font-medium text-[#55142A]">${days} day${days !== 1 ? 's' : ''}</span></p><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div></div>`;
  }

  function cardHTML(b, i) {
    const label = b.status.charAt(0).toUpperCase() + b.status.slice(1);
    return `<div class="booking-card overflow-hidden rounded-2xl border border-gray-100 bg-white" style="animation-delay:${i*80}ms;" data-id="${b.id}">
      <div class="flex flex-col sm:flex-row">
        <div class="h-44 shrink-0 overflow-hidden sm:h-auto sm:w-44">
          <img src="${b.image || '/images/lodge1.jpg'}" alt="${b.name}" class="h-full w-full object-cover" />
        </div>
        <div class="flex flex-1 flex-col justify-between gap-4 p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-medium leading-tight text-gray-900" style="font-family:'Cormorant Garamond',serif;">${b.name}</h3>
              <p class="mt-1 text-xs text-gray-400">${b.location}</p>
              <p class="mt-0.5 font-mono text-[10px] tracking-wide text-gray-300">${b.id}</p>
            </div>
            <span class="shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClass(b.status)}">${label}</span>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl bg-gray-50 p-3"><p class="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Check-in</p><p class="text-sm font-medium text-gray-800">${fmtDate(b.check_in)}</p></div>
            <div class="rounded-xl bg-gray-50 p-3"><p class="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Check-out</p><p class="text-sm font-medium text-gray-800">${fmtDate(b.check_out)}</p></div>
            <div class="rounded-xl bg-gray-50 p-3"><p class="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Guests</p><p class="text-sm font-medium text-gray-800">${b.guests} guest${b.guests > 1 ? 's' : ''}</p></div>
          </div>
          ${progressHTML(b)}
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div><p class="text-lg font-medium text-gray-900">${fmt(b.total)}</p><p class="text-xs text-gray-400">${nightsBetween(b.check_in, b.check_out)} nights · ${fmt(b.price_per_night)}/night</p></div>
            <div class="flex flex-wrap items-center gap-2">${actionsHTML(b)}</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function render() {
    const data = getFiltered();
    updateStats();
    if (!data.length) { listEl.innerHTML = ''; emptyEl.classList.remove('hidden'); return; }
    emptyEl.classList.add('hidden');
    listEl.innerHTML = data.map((b, i) => cardHTML(b, i)).join('');
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      render();
    });
  });

  sortSelect.addEventListener('change', () => { activeSort = sortSelect.value; render(); });

  window.openCancel = function (id) {
    cancelTarget = allBookings.find(b => b.id === id);
    if (!cancelTarget) return;
    cancelInfo.innerHTML = `<p class="font-medium text-gray-800 mb-1">${cancelTarget.name}</p><p class="text-gray-500">${fmtDate(cancelTarget.check_in)} → ${fmtDate(cancelTarget.check_out)}</p><p class="text-gray-500 mt-1">Total: <span class="font-medium">${fmt(cancelTarget.total)}</span></p>`;
    cancelModal.classList.remove('hidden'); cancelModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  cancelConfirm.addEventListener('click', async () => {
    if (!cancelTarget) return;
    try {
      const res = await fetch(`/bookings/${cancelTarget.id}/cancel`, { method:'POST', credentials:'same-origin' });
      if (res.ok) { const b = allBookings.find(b => b.id === cancelTarget.id); if (b) b.status = 'cancelled'; closeCancel(); render(); }
    } catch {}
  });

  cancelDismiss.addEventListener('click', closeCancel);
  cancelModal.addEventListener('click', e => { if (e.target === cancelModal) closeCancel(); });
  function closeCancel() { cancelModal.classList.add('hidden'); cancelModal.classList.remove('flex'); cancelTarget = null; document.body.style.overflow = ''; }

  window.openDetail = function (id) {
    const b = allBookings.find(b => b.id === id);
    if (!b) return;
    detailContent.innerHTML = `
      <div class="mb-6 flex items-start justify-between"><div><h3 class="text-2xl font-medium text-gray-900" style="font-family:'Cormorant Garamond',serif;">${b.name}</h3><p class="mt-1 text-sm text-gray-400">${b.location}</p></div><span class="rounded-full px-3 py-1 text-xs font-medium ${badgeClass(b.status)}">${b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span></div>
      <div class="mb-6 grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-gray-50 p-4"><p class="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Booking ref</p><p class="font-mono text-sm font-medium text-gray-800">${b.id}</p></div>
        <div class="rounded-xl bg-gray-50 p-4"><p class="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Guests</p><p class="text-sm font-medium text-gray-800">${b.guests} guest${b.guests>1?'s':''}</p></div>
        <div class="rounded-xl bg-gray-50 p-4"><p class="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Check-in</p><p class="text-sm font-medium text-gray-800">${fmtDate(b.check_in)}</p></div>
        <div class="rounded-xl bg-gray-50 p-4"><p class="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Check-out</p><p class="text-sm font-medium text-gray-800">${fmtDate(b.check_out)}</p></div>
      </div>
      <div class="border-t border-gray-100 pt-5">
        <div class="mb-2 flex justify-between text-sm text-gray-500"><span>${fmt(b.price_per_night)} × ${nightsBetween(b.check_in,b.check_out)} nights</span><span>${fmt(b.total)}</span></div>
        <div class="mt-3 flex justify-between border-t border-gray-100 pt-3 text-base font-medium text-gray-900"><span>Total</span><span>${fmt(b.total)}</span></div>
      </div>`;
    detailModal.classList.remove('hidden'); detailModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  detailDismiss.addEventListener('click', closeDetail);
  detailModal.addEventListener('click', e => { if (e.target === detailModal) closeDetail(); });
  function closeDetail() { detailModal.classList.add('hidden'); detailModal.classList.remove('flex'); document.body.style.overflow = ''; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCancel(); closeDetail(); } });

  render();
});
