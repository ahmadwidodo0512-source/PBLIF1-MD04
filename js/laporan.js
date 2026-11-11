/* =====================================================
   laporan.js - halaman Laporan
   Membutuhkan js/app.js (dimuat lebih dulu di HTML)
   ===================================================== */

let dataLaporan = [];
function renderLaporan() {
  if (!$('lapDari').value) { $('lapDari').value = tanggalGeser(-6); $('lapSampai').value = hariIni(); }
  const dari = $('lapDari').value, sampai = $('lapSampai').value;
  dataLaporan = getData('transactions', []).filter(t => t.status === 'diambil' && t.tanggalSelesai >= dari && t.tanggalSelesai <= sampai);
  $('lapUang').textContent = rupiah(dataLaporan.reduce((a, t) => a + t.total, 0));
  $('lapJml').textContent = dataLaporan.length;
  $('lapKg').textContent = dataLaporan.reduce((a, t) => a + t.berat, 0).toFixed(1) + ' kg';
  $('tbLap').innerHTML = dataLaporan.length ? dataLaporan.map(t => `<tr><td>${fmtTgl(t.tanggalSelesai)}</td><td><b>${esc(t.id)}</b></td><td>${esc(namaPel(t.customerId))}</td><td>${namaLayanan(t.layanan)}</td><td>${t.berat} kg</td><td>${rupiah(t.total)}</td></tr>`).join('')
    : '<tr><td colspan="6" class="empty">Tidak ada data pada rentang ini</td></tr>';
}
function exportCsv() {
  if (!dataLaporan.length) { toast('Tidak ada data untuk diexport', true); return; }
  const baris = [['Tanggal Selesai', 'Kode', 'Pelanggan', 'Layanan', 'Berat (kg)', 'Total (Rp)']]
    .concat(dataLaporan.map(t => [fmtTgl(t.tanggalSelesai), t.id, namaPel(t.customerId), namaLayanan(t.layanan), t.berat, t.total]));
  const csv = baris.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = 'laporan-laundry.csv'; a.click(); URL.revokeObjectURL(a.href); toast('CSV berhasil diexport');
}


/* ---------- START ---------- */
$('btnLap').addEventListener('click', renderLaporan);
$('btnCsv').addEventListener('click', exportCsv);
renderLaporan();
