APLIKASI PENGELOLAAN LAUNDRY KILOAN
Cara pakai: ekstrak ZIP, buka index.html di browser (Chrome/Edge). Perlu internet untuk Chart.js & font.

laundry-kiloan/
|-- index.html        (Dashboard)
|-- pelanggan.html    (Data Pelanggan)
|-- transaksi.html    (Transaksi Laundry)
|-- laporan.html      (Laporan)
|-- pengaturan.html   (Pengaturan)
|-- css/style.css     (gaya semua halaman)
`-- js/
    |-- app.js        (kode bersama: LocalStorage, format, data dummy, toast)
    |-- dashboard.js, pelanggan.js, transaksi.js, laporan.js, pengaturan.js

Reset data: buka Console browser, ketik localStorage.clear() lalu refresh.
