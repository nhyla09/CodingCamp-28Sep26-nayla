# Requirements Document

## Introduction

**Expense & Budget Visualizer** adalah aplikasi web berbasis peramban (browser) yang memungkinkan pengguna mencatat, memvisualisasikan, dan mengelola pengeluaran pribadi secara sederhana. Proyek ini merupakan tugas Coding Camp yang dibangun menggunakan HTML, CSS, dan Vanilla JavaScript murni — tanpa framework atau library tambahan selain Chart.js untuk visualisasi pie chart.

Aplikasi ini berjalan sepenuhnya di sisi klien (client-side) tanpa memerlukan server backend. Data pengeluaran disimpan secara persisten menggunakan Browser Local Storage API sehingga tetap tersedia meskipun peramban ditutup dan dibuka kembali.

Pengguna dapat menambahkan transaksi pengeluaran dengan nama item, jumlah, dan kategori; melihat daftar transaksi; memantau total pengeluaran secara real-time; serta melihat distribusi pengeluaran per kategori dalam bentuk Pie Chart interaktif yang dirender menggunakan Chart.js.

---

## Glossary

- **Aplikasi**: Aplikasi web Expense & Budget Visualizer yang berjalan di peramban.
- **Pengguna**: Orang yang menggunakan aplikasi melalui peramban web.
- **Transaksi**: Satu catatan pengeluaran yang terdiri dari nama item, jumlah dalam Rupiah, dan kategori.
- **Formulir Input**: Antarmuka HTML yang berisi field untuk memasukkan data transaksi baru.
- **Daftar Transaksi**: Elemen antarmuka yang menampilkan semua transaksi yang telah dicatat.
- **Total Pengeluaran**: Jumlah kumulatif dari semua transaksi yang tersimpan, ditampilkan dalam format Rupiah.
- **Kategori**: Klasifikasi jenis pengeluaran. Nilai yang valid adalah: `Food`, `Transport`, dan `Fun`.
- **Validasi**: Proses pemeriksaan input pengguna untuk memastikan semua field terisi dan sesuai format.
- **Pesan Error**: Teks yang ditampilkan di bawah field yang tidak valid untuk memberi tahu pengguna tentang kesalahan.
- **Local Storage**: Browser Local Storage API — mekanisme penyimpanan data persisten di sisi klien menggunakan pasangan kunci-nilai, tanpa memerlukan server.
- **Kunci Penyimpanan**: String `"expenses"` yang digunakan sebagai kunci untuk menyimpan dan mengambil data dari Local Storage.
- **Format JSON**: Format JavaScript Object Notation yang digunakan untuk mengubah array objek transaksi menjadi string (serialisasi) sebelum disimpan ke Local Storage, dan sebaliknya (deserialisasi) saat dibaca.
- **Chart.js**: Library JavaScript open-source untuk membuat grafik dan visualisasi data di peramban. Dimuat melalui CDN (Content Delivery Network) menggunakan tag `<script>` di `index.html`. Tidak perlu instalasi npm.
- **CDN (Content Delivery Network)**: Jaringan server yang mendistribusikan file library (seperti Chart.js) secara langsung ke peramban melalui URL publik.
- **Pie Chart**: Jenis grafik lingkaran yang menampilkan proporsi setiap kategori pengeluaran terhadap total. Dibuat menggunakan `new Chart(ctx, { type: 'pie', ... })` dari Chart.js.
- **Instance Chart**: Objek Chart.js yang dibuat dengan `new Chart()`, disimpan dalam variabel global agar dapat diperbarui dengan memanggil `chart.update()`.
- **Rupiah (Rp)**: Satuan mata uang Indonesia. Jumlah ditampilkan dengan format `Rp X.XXX` menggunakan `toLocaleString('id-ID')`.
- **Responsive**: Kemampuan tampilan antarmuka menyesuaikan diri dengan ukuran layar perangkat yang berbeda.
- **Mobile-first**: Pendekatan desain yang mengutamakan tampilan layar kecil (≥ 320px) terlebih dahulu, kemudian diperluas untuk layar lebih besar.
- **`index.html`**: File HTML utama dan satu-satunya halaman aplikasi.
- **`css/style.css`**: File CSS tunggal yang berisi seluruh gaya tampilan aplikasi.
- **`js/app.js`**: File JavaScript tunggal yang berisi seluruh logika aplikasi.

---

## Requirements

### Kebutuhan 1: Formulir Input Transaksi

**User Story:** Sebagai pengguna, saya ingin mengisi formulir dengan nama item, jumlah, dan kategori pengeluaran, agar saya dapat mencatat transaksi baru dengan mudah.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan satu formulir input yang memuat tiga field: field teks untuk nama item, field angka untuk jumlah, dan dropdown untuk kategori.
2. THE Formulir Input SHALL menyediakan dropdown kategori dengan tepat tiga pilihan: `Food`, `Transport`, dan `Fun`.
3. WHEN pengguna mengklik tombol "Tambah", THE Formulir Input SHALL memproses data yang dimasukkan pengguna dan memicu proses validasi.
4. WHEN proses penambahan transaksi berhasil, THE Formulir Input SHALL mengosongkan semua field (reset ke kondisi awal) sehingga siap untuk input berikutnya.
5. THE Aplikasi SHALL menggunakan tepat satu file HTML (`index.html`), satu file CSS (`css/style.css`), dan satu file JavaScript (`js/app.js`).

---

### Kebutuhan 2: Validasi Input

**User Story:** Sebagai pengguna, saya ingin mendapatkan umpan balik yang jelas ketika saya lupa mengisi salah satu field, agar saya tidak menyimpan transaksi yang tidak lengkap.

#### Kriteria Penerimaan

1. WHEN pengguna mengklik tombol "Tambah" dengan field nama item kosong, THE Aplikasi SHALL menampilkan pesan error "Nama item wajib diisi" di bawah field nama item.
2. WHEN pengguna mengklik tombol "Tambah" dengan field jumlah kosong atau bernilai nol, THE Aplikasi SHALL menampilkan pesan error "Jumlah wajib diisi dan harus lebih dari 0" di bawah field jumlah.
3. WHEN pengguna mengklik tombol "Tambah" tanpa memilih kategori, THE Aplikasi SHALL menampilkan pesan error "Kategori wajib dipilih" di bawah field kategori.
4. IF satu atau lebih field tidak valid, THEN THE Aplikasi SHALL menghentikan proses penambahan transaksi tanpa menyimpan data apapun.
5. WHEN pengguna berhasil menambahkan transaksi (semua field valid), THE Aplikasi SHALL menghapus semua pesan error yang sebelumnya ditampilkan.
6. THE Aplikasi SHALL menampilkan pesan error tepat di bawah field yang bermasalah, bukan di tempat lain.

---

### Kebutuhan 3: Daftar Transaksi

**User Story:** Sebagai pengguna, saya ingin melihat semua transaksi yang telah saya catat dalam sebuah daftar, agar saya dapat memantau pengeluaran saya secara keseluruhan.

#### Kriteria Penerimaan

1. THE Daftar Transaksi SHALL menampilkan setiap transaksi dalam satu baris yang memuat: nama item, jumlah dalam format Rupiah (`Rp X.XXX`), dan kategori.
2. WHEN pengguna berhasil menambahkan transaksi baru, THE Daftar Transaksi SHALL segera menampilkan transaksi tersebut di bagian bawah daftar tanpa memuat ulang halaman.
3. THE Daftar Transaksi SHALL menampilkan tombol "Hapus" pada setiap baris transaksi.
4. WHEN pengguna mengklik tombol "Hapus" pada suatu transaksi, THE Aplikasi SHALL menghapus transaksi tersebut dari daftar tampilan secara permanen.
5. WHILE tidak ada transaksi yang tersimpan, THE Daftar Transaksi SHALL menampilkan teks "Belum ada transaksi" sebagai informasi kepada pengguna.
6. WHEN halaman pertama kali dimuat, THE Daftar Transaksi SHALL menampilkan semua transaksi yang sebelumnya tersimpan di Local Storage.

---

### Kebutuhan 4: Total Pengeluaran Real-time

**User Story:** Sebagai pengguna, saya ingin melihat total pengeluaran saya yang selalu diperbarui secara otomatis, agar saya dapat memantau jumlah keseluruhan tanpa perlu menghitung manual.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan total pengeluaran dalam format Rupiah di area yang terlihat jelas pada halaman.
2. WHEN pengguna berhasil menambahkan transaksi baru, THE Aplikasi SHALL memperbarui nilai total pengeluaran secara langsung tanpa memuat ulang halaman.
3. WHEN pengguna menghapus suatu transaksi, THE Aplikasi SHALL memperbarui nilai total pengeluaran dengan mengurangi jumlah transaksi yang dihapus.
4. WHILE tidak ada transaksi yang tersimpan, THE Aplikasi SHALL menampilkan total pengeluaran sebagai `Rp 0`.
5. WHEN halaman pertama kali dimuat, THE Aplikasi SHALL menghitung dan menampilkan total pengeluaran berdasarkan data yang tersimpan di Local Storage.

---

### Kebutuhan 5: Visualisasi Pie Chart dengan Chart.js

**User Story:** Sebagai pengguna, saya ingin melihat distribusi pengeluaran saya dalam bentuk Pie Chart, agar saya dapat memahami proporsi pengeluaran per kategori secara visual.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL memuat library Chart.js melalui CDN dengan menambahkan tag `<script src="https://cdn.jsdelivr.net/npm/chart.js">` di dalam file `index.html` sebelum tag `<script>` yang memuat `js/app.js`.
2. WHEN halaman pertama kali dimuat, THE Aplikasi SHALL membuat satu instance Chart.js dengan memanggil `new Chart(ctx, { type: 'pie', data: { ... }, options: { ... } })` di dalam fungsi `initChart()`.
3. THE Pie Chart SHALL menampilkan tiga segmen yang mewakili total pengeluaran untuk kategori `Food`, `Transport`, dan `Fun`.
4. THE Pie Chart SHALL menggunakan warna berbeda untuk setiap segmen kategori: satu warna untuk `Food`, satu warna untuk `Transport`, dan satu warna untuk `Fun`.
5. THE Pie Chart SHALL menampilkan legenda yang memuat nama kategori dan warna yang sesuai.
6. WHEN pengguna menambahkan atau menghapus transaksi, THE Aplikasi SHALL memperbarui Pie Chart dengan cara memutakhirkan `chart.data.datasets[0].data` dengan nilai baru dan memanggil `chart.update()` di dalam fungsi `updateChart()`.
7. WHILE semua nilai pengeluaran per kategori adalah nol (belum ada transaksi), THE Pie Chart SHALL tetap ditampilkan dalam kondisi kosong tanpa error.
8. THE Aplikasi SHALL TIDAK menggunakan Canvas 2D API secara manual (seperti `ctx.arc()`, `ctx.fillStyle`, atau metode drawing context lainnya) untuk menggambar Pie Chart — seluruh rendering diserahkan kepada Chart.js.

---

### Kebutuhan 6: Penyimpanan Data di Local Storage

**User Story:** Sebagai pengguna, saya ingin data pengeluaran saya tetap tersimpan setelah saya menutup peramban, agar saya tidak kehilangan catatan yang sudah dibuat.

#### Kriteria Penerimaan

1. WHEN pengguna berhasil menambahkan transaksi baru, THE Aplikasi SHALL menyimpan seluruh array transaksi terbaru ke Local Storage menggunakan kunci `"expenses"` dalam format JSON (`JSON.stringify`).
2. WHEN pengguna menghapus suatu transaksi, THE Aplikasi SHALL memperbarui data di Local Storage dengan menyimpan array transaksi yang telah diperbarui menggunakan kunci `"expenses"`.
3. WHEN halaman pertama kali dimuat, THE Aplikasi SHALL membaca data dari Local Storage menggunakan kunci `"expenses"` dan mengurai string JSON tersebut menggunakan `JSON.parse` untuk mendapatkan array transaksi.
4. IF kunci `"expenses"` tidak ditemukan di Local Storage (misalnya saat pertama kali digunakan), THEN THE Aplikasi SHALL menggunakan array kosong `[]` sebagai nilai awal tanpa menampilkan error.
5. FOR ALL array transaksi yang valid, menyimpan ke Local Storage kemudian membaca kembali SHALL menghasilkan array dengan data yang identik (properti round-trip).

---

### Kebutuhan 7: Tampilan Responsif

**User Story:** Sebagai pengguna yang mengakses dari perangkat berbeda, saya ingin tampilan aplikasi menyesuaikan dengan ukuran layar saya, agar pengalaman penggunaan tetap nyaman di ponsel maupun komputer.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL mengimplementasikan desain mobile-first dimulai dari lebar minimum 320px.
2. WHILE lebar viewport kurang dari 768px, THE Aplikasi SHALL menampilkan seluruh konten dalam satu kolom vertikal.
3. WHEN lebar viewport mencapai 768px atau lebih, THE Aplikasi SHALL menampilkan tata letak dua kolom (formulir input dan daftar transaksi di satu sisi; Pie Chart di sisi lainnya).
4. THE Aplikasi SHALL menggunakan CSS media query dengan breakpoint `min-width: 768px` untuk mengatur perubahan tata letak dari satu kolom ke dua kolom.
5. THE `css/style.css` SHALL menjadi satu-satunya file CSS yang digunakan; tidak boleh ada file CSS tambahan atau framework CSS eksternal.

---

## Struktur Folder dan File

```
CodingCamp-28Sep26-nayla/
├── index.html          # Halaman utama aplikasi (satu-satunya file HTML)
├── css/
│   └── style.css       # Seluruh gaya tampilan aplikasi
├── js/
│   └── app.js          # Seluruh logika aplikasi (Vanilla JavaScript)
└── .kiro/              # Folder konfigurasi Kiro — JANGAN dihapus
    └── specs/
        └── expense-budget-visualizer/
            ├── .config.kiro
            └── requirements.md
```

**Catatan penting:**
- Folder `.kiro/` wajib dipertahankan karena dibutuhkan untuk proses submission Coding Camp.
- Seluruh logika aplikasi harus berada di `js/app.js` — tidak ada file JavaScript tambahan.
- Tidak ada folder `node_modules`, `package.json`, atau file konfigurasi build apapun.

---

## Rencana Implementasi Bertahap

### Tahap 1 — Struktur HTML Dasar
Buat file `index.html` dengan struktur semantik yang mencakup:
- Tag `<head>` dengan `<link>` ke `css/style.css`.
- Tag `<script>` untuk memuat Chart.js via CDN.
- Tag `<script>` untuk memuat `js/app.js` (harus setelah Chart.js).
- Elemen formulir input dengan tiga field (nama item, jumlah, kategori) dan tombol "Tambah".
- Elemen untuk menampilkan pesan error di bawah setiap field.
- Elemen untuk menampilkan Daftar Transaksi.
- Elemen untuk menampilkan Total Pengeluaran.
- Elemen `<canvas id="expenseChart">` sebagai wadah Pie Chart.

### Tahap 2 — Gaya CSS Dasar (Mobile-first)
Buat file `css/style.css` dengan:
- Reset CSS sederhana dan gaya tipografi dasar.
- Tata letak satu kolom untuk layar kecil (mobile-first, ≥ 320px).
- Gaya untuk formulir, field input, dropdown, dan tombol.
- Gaya untuk baris transaksi di daftar.
- Gaya untuk teks pesan error (misalnya warna merah).
- Media query `@media (min-width: 768px)` untuk tata letak dua kolom.

### Tahap 3 — Logika Formulir dan Validasi
Di `js/app.js`, buat fungsi-fungsi dasar:
- Fungsi `validateForm()` untuk memeriksa semua field dan menampilkan pesan error yang sesuai.
- Fungsi `showError(fieldId, message)` untuk menampilkan pesan error di bawah field yang ditentukan.
- Fungsi `clearErrors()` untuk menghapus semua pesan error.
- Event listener pada tombol "Tambah" yang memanggil `validateForm()` sebelum memproses data.

### Tahap 4 — Manajemen Transaksi (Tambah dan Hapus)
Di `js/app.js`, implementasikan:
- Struktur data array `expenses` untuk menyimpan transaksi dalam memori.
- Fungsi `addExpense(name, amount, category)` untuk menambahkan objek transaksi baru ke array.
- Fungsi `deleteExpense(index)` untuk menghapus transaksi berdasarkan indeksnya.
- Fungsi `renderTransactions()` untuk merender ulang seluruh daftar transaksi ke DOM.
- Fungsi `updateTotal()` untuk menghitung ulang dan menampilkan total pengeluaran.

### Tahap 5 — Integrasi Local Storage
Di `js/app.js`, tambahkan:
- Fungsi `saveToLocalStorage()` yang memanggil `localStorage.setItem("expenses", JSON.stringify(expenses))`.
- Fungsi `loadFromLocalStorage()` yang memanggil `JSON.parse(localStorage.getItem("expenses") || "[]")`.
- Panggil `saveToLocalStorage()` setiap kali transaksi ditambah atau dihapus.
- Panggil `loadFromLocalStorage()` saat halaman pertama kali dimuat (dalam event `DOMContentLoaded`).

### Tahap 6 — Visualisasi Pie Chart dengan Chart.js
Di `index.html`, tambahkan tag pemuatan CDN sebelum `js/app.js`:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

Di `js/app.js`, implementasikan:
- Deklarasi variabel global `let chart = null;` untuk menyimpan instance Chart.js.
- Fungsi `initChart()` yang membuat instance Chart.js pertama kali:
  ```javascript
  function initChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Food', 'Transport', 'Fun'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
  ```
- Fungsi `updateChart()` yang menghitung total per kategori dari array `expenses` dan memperbarui chart:
  ```javascript
  function updateChart() {
    // Hitung total pengeluaran per kategori
    const totals = { Food: 0, Transport: 0, Fun: 0 };
    expenses.forEach(exp => { totals[exp.category] += exp.amount; });

    // Perbarui data chart dan render ulang
    chart.data.datasets[0].data = [totals.Food, totals.Transport, totals.Fun];
    chart.update();
  }
  ```
- Panggil `initChart()` satu kali saat halaman dimuat, kemudian panggil `updateChart()` setiap kali transaksi ditambah atau dihapus.

### Tahap 7 — Pengujian dan Pembersihan Kode
Lakukan verifikasi menyeluruh:
- Uji semua skenario validasi (field kosong satu per satu, semua kosong, semua terisi).
- Uji penambahan dan penghapusan transaksi, pastikan total dan chart diperbarui dengan benar.
- Uji persistensi data: tutup dan buka kembali peramban, pastikan data masih ada.
- Uji tampilan di lebar 320px (mobile) dan ≥ 768px (desktop).
- Pastikan setiap fungsi utama memiliki komentar penjelasan yang jelas.
- Hapus semua `console.log` yang digunakan untuk debugging.
- Pastikan folder `.kiro/` tidak terhapus.

---

## Diagram Hubungan Antar Komponen

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Formulir    │  │  Daftar          │  │  Pie Chart   │  │
│  │  Input       │  │  Transaksi       │  │  (Chart.js   │  │
│  │              │  │                  │  │   via CDN)   │  │
│  │  - Nama Item │  │  - Baris item    │  │              │  │
│  │  - Jumlah    │  │  - Tombol Hapus  │  │  <canvas>    │  │
│  │  - Kategori  │  │                  │  │              │  │
│  │  - Tombol    │  │                  │  │              │  │
│  │    Tambah    │  │                  │  │              │  │
│  └──────┬───────┘  └────────┬─────────┘  └──────┬───────┘  │
│         │                   │                    │          │
│         └─────────┬─────────┘                    │          │
│                   ▼                              │          │
│  ┌────────────────────────────────────────────── ┤          │
│  │               js/app.js                       │          │
│  │                                               │          │
│  │  validateForm()   ──► showError()             │          │
│  │  addExpense()     ──► saveToLocalStorage()     │          │
│  │  deleteExpense()  ──► saveToLocalStorage()     │          │
│  │  renderTransactions()                         │          │
│  │  updateTotal()                                │          │
│  │  initChart()      ──► new Chart(ctx, {...})   ─┘          │
│  │  updateChart()    ──► chart.update()                      │
│  │  loadFromLocalStorage()                                   │
│  └───────────────────────┬────────────────────────────────── ┘
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            Browser Local Storage API                   │  │
│  │         Kunci: "expenses" | Format: JSON               │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Alur data utama:**
1. Pengguna mengisi formulir → klik "Tambah" → `validateForm()` dipanggil.
2. Jika valid → `addExpense()` menambahkan ke array `expenses`.
3. `saveToLocalStorage()` menyimpan array terbaru ke Local Storage.
4. `renderTransactions()` memperbarui tampilan daftar di DOM.
5. `updateTotal()` menghitung ulang dan menampilkan total.
6. `updateChart()` memperbarui data dan memanggil `chart.update()` untuk render ulang Pie Chart.

---

## Fitur yang Tidak Termasuk Scope

Fitur-fitur berikut **tidak akan diimplementasikan** dalam proyek ini:

- **Kategori kustom**: Pengguna tidak dapat menambahkan atau mengubah kategori selain `Food`, `Transport`, dan `Fun`.
- **Tampilan ringkasan bulanan**: Tidak ada filter atau pengelompokan transaksi berdasarkan bulan.
- **Pengurutan transaksi**: Tidak ada fitur untuk mengurutkan daftar berdasarkan jumlah atau kategori.
- **Sorotan batas pengeluaran**: Tidak ada fitur peringatan atau highlight saat pengeluaran melebihi batas tertentu.
- **Toggle tema gelap/terang**: Tidak ada fitur pergantian tema tampilan.
- **Backend server**: Aplikasi berjalan sepenuhnya di sisi klien tanpa API atau database server.
- **Framework JavaScript/CSS**: Tidak menggunakan React, Vue, Angular, jQuery, Bootstrap, Tailwind, atau framework lainnya — hanya Vanilla JavaScript dan CSS murni, dengan pengecualian Chart.js untuk visualisasi.
