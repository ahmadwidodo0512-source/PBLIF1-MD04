/* =====================================================
   transaksi.js - halaman Transaksi Laundry
   Membutuhkan js/app.js (dimuat lebih dulu di HTML)
   ===================================================== */

function renderTransaksi() {
  const pel = getData('customers', []), tarif = getData('settings').tarif;
  const pilih = $('trPel').value;
  $('trPel').innerHTML = '<option value="">-- Pilih Pelanggan --</option>' + pel.map(c => `<option value="${c.id}">${esc(c.nama)}</option>`).join('');
  $('trPel').value = pilih;
  const lay = $('trLay').value || 'cuciKering';
  $('trLay').innerHTML = LAYANAN.map(l => `<option value="${l[0]}">${l[1]} (${rupiah(tarif[l[0]])}/kg)</option>`).join('');
  $('trLay').value = lay;
  const fs = $('filterStatus').value;
  $('filterStatus').innerHTML = '<option value="">Semua Status</option>' + STATUS.map(s => `<option value="${s[0]}">${s[1]}</option>`).join('');
  $('filterStatus').value = fs;
  hitungTotal(); renderTabelTr();
}
function hitungTotal() {
  const berat = parseFloat($('trBerat').value) || 0;
  $('trTotal').textContent = rupiah(berat * getData('settings').tarif[$('trLay').value]);
}
function renderTabelTr() {
  const kata = $('cariTr').value.toLowerCase(), fs = $('filterStatus').value;
  const daftar = [...getData('transactions', [])].reverse().filter(t => (!fs || t.status === fs) && (t.id + namaPel(t.customerId)).toLowerCase().includes(kata));
  $('tbTr').innerHTML = daftar.length ? daftar.map(t => `<tr><td><b>${esc(t.id)}</b></td><td>${esc(namaPel(t.customerId))}</td><td>${namaLayanan(t.layanan)}</td><td>${t.berat} kg</td><td>${rupiah(t.total)}</td><td>${fmtTgl(t.tanggalMasuk)}</td>
    <td><select class="stsel" data-status="${t.id}">${STATUS.map(s => `<option value="${s[0]}" ${s[0] === t.status ? 'selected' : ''}>${s[1]}</option>`).join('')}</select></td>
    <td><button class="btn btn-sm" data-struk="${t.id}">🖨️ Struk</button><button class="btn btn-sm btn-d" data-hapustr="${t.id}">Hapus</button></td></tr>`).join('')
    : '<tr><td colspan="8" class="empty">Belum ada transaksi</td></tr>';
}
function simpanTransaksi() {
  const cid = $('trPel').value, berat = parseFloat($('trBerat').value), lay = $('trLay').value;
  $('eTrPel').textContent = cid ? '' : 'Pilih pelanggan terlebih dahulu';
  $('eTrBerat').textContent = (!isNaN(berat) && berat > 0) ? '' : 'Berat harus berupa angka lebih dari 0';
  if ($('eTrPel').textContent || $('eTrBerat').textContent) return;
  const data = getData('transactions', []), tarif = getData('settings').tarif[lay];
  const nomor = data.reduce((m, t) => Math.max(m, parseInt(t.id.slice(4)) || 0), 0) + 1;
  data.push({ id: 'TRX-' + String(nomor).padStart(3, '0'), customerId: cid, berat, layanan: lay, tarifPerKg: tarif, total: berat * tarif,
    status: 'masuk', catatan: $('trCat').value.trim(), tanggalMasuk: hariIni(), tanggalSelesai: null });
  saveData('transactions', data);
  $('trBerat').value = ''; $('trCat').value = ''; $('trPel').value = '';
  toast('Transaksi disimpan (status: Masuk)'); renderTransaksi();
}
function ubahStatus(id, status) {
  const data = getData('transactions', []), t = data.find(x => x.id === id);
  t.status = status; t.tanggalSelesai = status === 'diambil' ? hariIni() : null; // masuk laporan saat Diambil
  saveData('transactions', data); toast('Status diubah: ' + namaStatus(status)); renderTabelTr();
}
function hapusTransaksi(id) {
  if (!confirm('Yakin ingin menghapus transaksi ' + id + '?')) return;
  saveData('transactions', getData('transactions', []).filter(t => t.id !== id)); toast('Transaksi dihapus'); renderTabelTr();
}
function cetakStruk(id) {
  const t = getData('transactions', []).find(x => x.id === id), s = getData('settings');
  $('receipt').innerHTML = `<div style="text-align:center"><b>${esc(s.namaLaundry)}</b><br>${esc(s.alamat)}</div><hr>
    Kode : ${esc(t.id)}<br>Tgl  : ${fmtTgl(t.tanggalMasuk)}<br>Nama : ${esc(namaPel(t.customerId))}<hr>
    ${namaLayanan(t.layanan)}<br>${t.berat} kg x ${rupiah(t.tarifPerKg)}<hr><b>TOTAL: ${rupiah(t.total)}</b><br>Status: ${namaStatus(t.status)}<hr>
    <div style="text-align:center">Terima kasih 🧺</div>`;
  window.print();
}


/* ---------- START ---------- */
['trLay', 'trBerat'].forEach(id => $(id).addEventListener('input', hitungTotal));
$('btnSimpanTr').addEventListener('click', simpanTransaksi);
$('cariTr').addEventListener('input', renderTabelTr);
$('filterStatus').addEventListener('change', renderTabelTr);
$('tbTr').addEventListener('change', e => { if (e.target.dataset.status) ubahStatus(e.target.dataset.status, e.target.value); });
$('tbTr').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.struk) cetakStruk(b.dataset.struk); if (b.dataset.hapustr) hapusTransaksi(b.dataset.hapustr); });
renderTransaksi();
