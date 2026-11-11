/* =====================================================
   dashboard.js - halaman Dashboard
   Membutuhkan js/app.js (dimuat lebih dulu di HTML)
   ===================================================== */

let chart = null;
function renderDashboard() {
  const trx = getData('transactions', []), h = hariIni();
  $('stPelanggan').textContent = getData('customers', []).length;
  $('stAktif').textContent = trx.filter(t => t.status !== 'diambil').length;
  $('stSelesai').textContent = trx.filter(t => t.status === 'diambil' && t.tanggalSelesai === h).length;
  $('stUang').textContent = rupiah(trx.filter(t => t.status === 'diambil' && t.tanggalSelesai === h).reduce((a, t) => a + t.total, 0));
  // Data grafik 7 hari terakhir (pendapatan dihitung dari status Diambil)
  const label = [], nilai = [];
  for (let i = 6; i >= 0; i--) {
    const tgl = tanggalGeser(-i); label.push(fmtTgl(tgl).slice(0, 5));
    nilai.push(trx.filter(t => t.status === 'diambil' && t.tanggalSelesai === tgl).reduce((a, t) => a + t.total, 0));
  }
  if (window.Chart) {
    if (chart) chart.destroy();
    chart = new Chart($('grafik'), { type: 'bar', data: { labels: label, datasets: [{ label: 'Pendapatan', data: nilai, backgroundColor: '#14b8a6', borderRadius: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => rupiah(v) } } } } });
  }
  const terbaru = [...trx].reverse().slice(0, 5);
  $('tbTerbaru').innerHTML = terbaru.length ? terbaru.map(t => `<tr><td><b>${esc(t.id)}</b></td><td>${esc(namaPel(t.customerId))}</td><td>${namaLayanan(t.layanan)}</td><td>${t.berat} kg</td><td>${rupiah(t.total)}</td><td>${badge(t.status)}</td></tr>`).join('') : '<tr><td colspan="6" class="empty">Belum ada transaksi</td></tr>';
}


/* ---------- START ---------- */
renderDashboard();
