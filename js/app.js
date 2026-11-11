/* =====================================================
   app.js - KODE BERSAMA (dipakai semua halaman)
   Isi: helper database, helper format, konstanta, data dummy, toast, sidebar
   ===================================================== */

/* ---------- 1. HELPER DATABASE (LocalStorage) ---------- */
// Ambil data dari localStorage; jika kosong/rusak, kembalikan nilai bawaan
function getData(key, bawaan) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : bawaan; }
  catch (e) { return bawaan; }
}
// Simpan data ke localStorage
function saveData(key, nilai) { localStorage.setItem(key, JSON.stringify(nilai)); }
// Buat ID unik, contoh: generateId('CUS') -> CUS-k3j2h1
function generateId(awalan) { return awalan + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

/* ---------- 2. HELPER FORMAT ---------- */
const rupiah = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
// "2026-11-06" -> "06-11-2026"
const fmtTgl = iso => iso ? iso.split('-').reverse().join('-') : '-';
// Tanggal lokal hari ini format yyyy-mm-dd (tanpa efek zona waktu)
function isoTanggal(d) { const z = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
const hariIni = () => isoTanggal(new Date());
function tanggalGeser(hari) { const d = new Date(); d.setDate(d.getDate() + hari); return isoTanggal(d); }
// Cegah XSS saat menampilkan teks dari input pengguna
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = id => document.getElementById(id);

/* ---------- 3. KONSTANTA ---------- */
const STATUS = [['masuk', 'Masuk'], ['dicuci', 'Dicuci'], ['disetrika', 'Disetrika'], ['siap', 'Siap Diambil'], ['diambil', 'Diambil']];
const LAYANAN = [['cuciKering', 'Cuci Kering'], ['cuciSetrika', 'Cuci Setrika'], ['setrikaSaja', 'Setrika Saja'], ['express', 'Express']];
const namaStatus = k => (STATUS.find(s => s[0] === k) || [])[1] || k;
const namaLayanan = k => (LAYANAN.find(s => s[0] === k) || [])[1] || k;

/* ---------- 4. DATA AWAL (DUMMY) ---------- */
function seedData() {
  if (getData('settings', null)) return; // sudah pernah diisi
  saveData('settings', { namaLaundry: 'Kiloan Laundry', alamat: 'Jl. Batam Center No. 1, Batam',
    tarif: { cuciKering: 7000, cuciSetrika: 9000, setrikaSaja: 5000, express: 15000 } });
  const pel = [['Budi Santoso', '081234567890', 'Jl. Batam Center No. 5'], ['Siti Aminah', '085678901234', 'Perumahan Taman Raya'],
    ['Ahmad Sabil Widodo', '081212345678', 'Jl. Ngawi No. 10, Batam'], ['Kevin Fabio', '082155667788', 'Jl. Diponegoro No. 8, Batam']]
    .map(p => ({ id: generateId('CUS'), nama: p[0], noHp: p[1], alamat: p[2], createdAt: tanggalGeser(-10) }));
  saveData('customers', pel);
  const t = getData('settings').tarif;
  // [indeks pelanggan, layanan, berat, status, selisih hari masuk, hari selesai]
  const contoh = [[0, 'cuciSetrika', 3.5, 'diambil', -6, -6], [1, 'cuciKering', 5, 'diambil', -5, -4], [2, 'express', 2, 'diambil', -4, -3],
    [3, 'cuciSetrika', 4.5, 'diambil', -3, -2], [0, 'cuciKering', 6, 'diambil', -2, -1], [1, 'setrikaSaja', 3, 'diambil', -1, 0],
    [2, 'cuciSetrika', 5.5, 'diambil', 0, 0], [3, 'cuciKering', 2.5, 'siap', 0, null], [0, 'express', 3, 'disetrika', 0, null],
    [1, 'cuciSetrika', 4, 'dicuci', 0, null], [2, 'cuciKering', 7, 'masuk', 0, null]];
  saveData('transactions', contoh.map((c, i) => ({
    id: 'TRX-' + String(i + 1).padStart(3, '0'), customerId: pel[c[0]].id, berat: c[2], layanan: c[1], tarifPerKg: t[c[1]],
    total: c[2] * t[c[1]], status: c[3], catatan: '', tanggalMasuk: tanggalGeser(c[4]), tanggalSelesai: c[5] === null ? null : tanggalGeser(c[5]) })));
}

/* ---------- 5. TOAST & HELPER BERSAMA ---------- */
function toast(pesan, error) {
  const el = document.createElement('div');
  el.className = 'toast' + (error ? ' error' : ''); el.textContent = pesan;
  $('toasts').appendChild(el); setTimeout(() => el.remove(), 2800);
}

const cariPelanggan = id => getData('customers', []).find(c => c.id === id);
const namaPel = id => (cariPelanggan(id) || { nama: '(dihapus)' }).nama;
const badge = s => `<span class="badge b-${s}">${namaStatus(s)}</span>`;

/* ---------- 6. START (jalan di setiap halaman) ---------- */
seedData(); // isi data dummy jika database masih kosong
$("burger").addEventListener("click", () => $("sidebar").classList.toggle("open")); // sidebar mobile
