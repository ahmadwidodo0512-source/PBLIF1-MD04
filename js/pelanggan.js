/* =====================================================
   pelanggan.js - halaman Data Pelanggan (CRUD)
   Membutuhkan js/app.js (dimuat lebih dulu di HTML)
   ===================================================== */

function renderPelanggan() {
  const kata = $('cariPel').value.toLowerCase(), trx = getData('transactions', []);
  const daftar = getData('customers', []).filter(c => (c.nama + c.noHp + c.alamat).toLowerCase().includes(kata));
  $('tbPel').innerHTML = daftar.length ? daftar.map((c, i) => `<tr><td>${i + 1}</td><td>${esc(c.nama)}</td><td>${esc(c.noHp)}</td><td>${esc(c.alamat) || '-'}</td>
    <td>${trx.filter(t => t.customerId === c.id).length}</td><td><button class="btn btn-sm" data-edit="${c.id}">Edit</button><button class="btn btn-sm btn-d" data-hapus="${c.id}">Hapus</button></td></tr>`).join('')
    : '<tr><td colspan="6" class="empty">Data tidak ditemukan</td></tr>';
}
function bukaModalPel(id) {
  const c = id ? cariPelanggan(id) : null;
  $('modalPelJudul').textContent = c ? 'Edit Pelanggan' : 'Tambah Pelanggan';
  $('pelId').value = c ? c.id : ''; $('pelNama').value = c ? c.nama : ''; $('pelHp').value = c ? c.noHp : ''; $('pelAlamat').value = c ? c.alamat : '';
  $('ePelNama').textContent = $('ePelHp').textContent = '';
  $('modalPel').classList.add('show'); $('pelNama').focus();
}
function simpanPelanggan() {
  const nama = $('pelNama').value.trim(), hp = $('pelHp').value.trim(), alamat = $('pelAlamat').value.trim();
  $('ePelNama').textContent = nama ? '' : 'Nama wajib diisi';
  $('ePelHp').textContent = !hp ? 'No. HP wajib diisi' : !/^\d{9,15}$/.test(hp) ? 'No. HP harus angka (9-15 digit)' : '';
  if ($('ePelNama').textContent || $('ePelHp').textContent) return;
  const data = getData('customers', []), id = $('pelId').value;
  if (id) { const c = data.find(x => x.id === id); Object.assign(c, { nama, noHp: hp, alamat }); toast('Pelanggan diperbarui'); }
  else { data.push({ id: generateId('CUS'), nama, noHp: hp, alamat, createdAt: hariIni() }); toast('Pelanggan ditambahkan'); }
  saveData('customers', data); $('modalPel').classList.remove('show'); renderPelanggan();
}
function hapusPelanggan(id) {
  if (!confirm('Yakin ingin menghapus pelanggan ini?')) return;
  saveData('customers', getData('customers', []).filter(c => c.id !== id));
  toast('Pelanggan dihapus'); renderPelanggan();
}


/* ---------- START ---------- */
$('btnTambahPel').addEventListener('click', () => bukaModalPel());
$('btnBatalPel').addEventListener('click', () => $('modalPel').classList.remove('show'));
$('btnSimpanPel').addEventListener('click', simpanPelanggan);
$('cariPel').addEventListener('input', renderPelanggan); // pencarian real-time
$('tbPel').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.edit) bukaModalPel(b.dataset.edit); if (b.dataset.hapus) hapusPelanggan(b.dataset.hapus); });
renderPelanggan();
