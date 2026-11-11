/* =====================================================
   pengaturan.js - halaman Pengaturan
   Membutuhkan js/app.js (dimuat lebih dulu di HTML)
   ===================================================== */

function renderPengaturan() {
  const s = getData('settings');
  $('setNama').value = s.namaLaundry; $('setAlamat').value = s.alamat;
  $('setTarif').innerHTML = LAYANAN.map(l => `<div class="fg"><label>Tarif ${l[1]} (Rp/kg)</label><input type="number" min="1" data-tarif="${l[0]}" value="${s.tarif[l[0]]}"></div>`).join('');
  $('eSet').textContent = '';
}
function simpanPengaturan() {
  const s = getData('settings'), nama = $('setNama').value.trim();
  const tarif = {}; let valid = !!nama;
  document.querySelectorAll('[data-tarif]').forEach(i => { const v = parseFloat(i.value); if (!(v > 0)) valid = false; tarif[i.dataset.tarif] = v; });
  if (!valid) { $('eSet').textContent = 'Nama wajib diisi dan semua tarif harus angka > 0'; return; }
  saveData('settings', { namaLaundry: nama, alamat: $('setAlamat').value.trim(), tarif }); toast('Pengaturan disimpan'); renderPengaturan();
}


/* ---------- START ---------- */
$('btnSimpanSet').addEventListener('click', simpanPengaturan);
renderPengaturan();
