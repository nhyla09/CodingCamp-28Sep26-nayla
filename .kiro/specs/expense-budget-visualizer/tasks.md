# Implementation Plan: Expense & Budget Visualizer

## Overview

Implementasi aplikasi web client-side untuk mencatat dan memvisualisasikan pengeluaran pribadi. Aplikasi dibangun menggunakan HTML, CSS, dan Vanilla JavaScript murni — tanpa framework atau build system. Chart.js dimuat via CDN untuk visualisasi pie chart, dan data disimpan di Browser Local Storage.

Tiga file utama yang dihasilkan:
- `index.html` — struktur halaman dan elemen UI
- `css/style.css` — seluruh gaya tampilan (mobile-first)
- `js/app.js` — seluruh logika aplikasi (Vanilla JavaScript)

---

## Tasks

- [x] 1. Setup struktur folder dan file kosong
  - Buat file `index.html` di root workspace dengan boilerplate HTML5 minimal
  - Buat folder `css/` dan file `css/style.css` kosong
  - Buat folder `js/` dan file `js/app.js` kosong
  - Pastikan folder `.kiro/` tidak terganggu
  - _Kebutuhan: 1.5_

- [x] 2. Buat struktur HTML lengkap di `index.html`
  - [x] 2.1 Buat elemen header, main container, dan dua panel (left-panel dan right-panel)
    - Gunakan tag semantik: `<header>`, `<main>`, `<section>`
    - Beri class `.container`, `.left-panel`, `.right-panel` sesuai desain
    - _Kebutuhan: 1.1, 7.3_

  - [x] 2.2 Buat formulir input transaksi dengan tiga field dan tombol "Tambah"
    - Tambahkan `<input type="text" id="item-name">` dengan `<span class="error-message" id="error-item-name">`
    - Tambahkan `<input type="number" id="item-amount" min="1">` dengan `<span class="error-message" id="error-item-amount">`
    - Tambahkan `<select id="item-category">` dengan tiga `<option>`: `Food`, `Transport`, `Fun` — ditambah opsi placeholder kosong
    - Tambahkan `<span class="error-message" id="error-item-category">`
    - Tambahkan `<button id="btn-add" type="button">Tambah</button>`
    - _Kebutuhan: 1.1, 1.2, 1.3, 2.6_

  - [x] 2.3 Buat elemen total pengeluaran, daftar transaksi, dan canvas pie chart
    - Tambahkan `<p id="total-display">Rp 0</p>` di area yang terlihat jelas
    - Tambahkan `<ul id="transaction-list"></ul>` sebagai wadah daftar transaksi
    - Tambahkan `<canvas id="expenseChart"></canvas>` di right-panel
    - _Kebutuhan: 3.1, 3.5, 4.1, 4.4, 5.3_

  - [x] 2.4 Tambahkan tag `<script>` untuk Chart.js CDN dan app.js (urutan wajib benar)
    - Tambahkan `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>` sebelum `app.js`
    - Tambahkan `<script src="js/app.js"></script>` setelahnya — urutan ini tidak boleh terbalik
    - _Kebutuhan: 5.1_

- [x] 3. Buat gaya CSS mobile-first di `css/style.css`
  - [x] 3.1 Tulis reset CSS, base styles, dan layout container satu kolom (mobile)
    - Terapkan `box-sizing: border-box` universal, reset margin/padding
    - `.container { display: flex; flex-direction: column; }` untuk mobile
    - `.left-panel`, `.right-panel` dengan `width: 100%`
    - _Kebutuhan: 7.1, 7.2, 7.5_

  - [x] 3.2 Tulis gaya formulir, field input, dropdown, dan tombol "Tambah"
    - Gaya `.form-group { display: flex; flex-direction: column; }` dengan margin antar field
    - Gaya `input`, `select` dengan padding, border, border-radius
    - Gaya `#btn-add` dengan lebar penuh, warna hijau, dan padding yang nyaman
    - _Kebutuhan: 1.1_

  - [x] 3.3 Tulis gaya daftar transaksi, baris item, dan tombol "Hapus"
    - Reset `list-style: none` pada `#transaction-list`
    - Setiap `<li>` menggunakan flexbox untuk menampilkan nama, jumlah, kategori, dan tombol hapus secara sejajar
    - Gaya `.btn-delete` dengan warna merah dan padding yang dapat diklik
    - _Kebutuhan: 3.1, 3.3_

  - [x] 3.4 Tulis gaya pesan error, total pengeluaran, dan teks empty state
    - `.error-message { color: #e53935; font-size: 0.85rem; min-height: 1.2rem; }`
    - `#total-display` dengan font besar, tebal, dan warna yang mencolok
    - Gaya untuk `.empty-state` (teks "Belum ada transaksi")
    - _Kebutuhan: 2.6, 4.1_

  - [x] 3.5 Tambahkan media query untuk tata letak dua kolom (desktop ≥ 768px)
    - `@media (min-width: 768px) { .container { flex-direction: row; } }`
    - `.left-panel { flex: 1; }` dan `.right-panel { flex: 1; }`
    - _Kebutuhan: 7.3, 7.4, 7.5_

- [x] 4. Checkpoint — Verifikasi HTML dan CSS
  - Buka `index.html` di browser dan periksa tampilan visual
  - Pastikan layout mobile (satu kolom) dan desktop (dua kolom di ≥ 768px) berjalan benar
  - Pastikan semua elemen HTML tampil dengan ID yang benar
  - Pastikan Chart.js dimuat (cek console browser — tidak boleh ada error "Chart is not defined")
  - Pastikan semua tugas sebelumnya selesai sebelum lanjut menulis JavaScript

- [x] 5. Implementasi utilitas dan Local Storage di `js/app.js`
  - [x] 5.1 Deklarasikan state global dan implementasikan `formatRupiah(amount)`
    - Deklarasikan `let expenses = [];` dan `let chart = null;` di scope global
    - Implementasikan `formatRupiah(amount)` yang mengembalikan `'Rp ' + amount.toLocaleString('id-ID')`
    - Tambahkan komentar JSDoc yang menjelaskan setiap variabel dan fungsi
    - _Kebutuhan: 3.1, 4.1_

  - [x] 5.2 Implementasikan `saveToLocalStorage()` dan `loadFromLocalStorage()`
    - `saveToLocalStorage()`: panggil `localStorage.setItem('expenses', JSON.stringify(expenses))`
    - `loadFromLocalStorage()`: gunakan `try/catch` — kembalikan `JSON.parse(localStorage.getItem('expenses'))` atau `[]` jika null/error
    - _Kebutuhan: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 5.3 Tulis property-based test untuk Property 4: Round-trip Local Storage
    - **Property 4: Round-trip serialisasi Local Storage**
    - **Validates: Kebutuhan 6.5, 6.1, 6.2, 6.3**
    - Gunakan fast-check dengan generator `validExpense` dan `expenseArray`
    - Verifikasi bahwa `saveToLocalStorage()` diikuti `loadFromLocalStorage()` menghasilkan array identik
    - Jalankan minimal 100 iterasi
    - _Kebutuhan: 6.5_

- [x] 6. Implementasi validasi form di `js/app.js`
  - [x] 6.1 Implementasikan `showError(fieldId, message)` dan `clearErrors()`
    - `showError(fieldId, message)`: set `textContent` pada elemen `#error-{fieldId}`
    - `clearErrors()`: iterasi semua `.error-message` dan set `textContent` ke `''`
    - _Kebutuhan: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 6.2 Implementasikan `validateForm()` yang mengembalikan boolean
    - Trim nama item — jika kosong: `showError('item-name', 'Nama item wajib diisi')`
    - Periksa jumlah ≤ 0 atau kosong: `showError('item-amount', 'Jumlah wajib diisi dan harus lebih dari 0')`
    - Periksa kategori kosong: `showError('item-category', 'Kategori wajib dipilih')`
    - Kumpulkan semua error sebelum `return` — jangan berhenti di error pertama
    - Kembalikan `true` hanya jika tidak ada error sama sekali
    - _Kebutuhan: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 6.3 Tulis property-based test untuk Property 1: Validasi menolak input tidak valid
    - **Property 1: Validasi menolak semua input tidak valid tanpa menyimpan data**
    - **Validates: Kebutuhan 2.1, 2.2, 2.3, 2.4**
    - Gunakan generator `invalidName`, `invalidAmount`, `invalidCategory` dari fast-check
    - Verifikasi bahwa untuk setiap kombinasi input tidak valid, array `expenses` tidak berubah
    - Jalankan minimal 100 iterasi
    - _Kebutuhan: 2.1, 2.2, 2.3, 2.4_

- [x] 7. Implementasi manajemen transaksi di `js/app.js`
  - [x] 7.1 Implementasikan `addExpense(name, amount, category)`
    - Buat objek transaksi `{ id: Date.now(), name, amount: Number(amount), category }`
    - Push ke array `expenses`
    - Panggil secara berurutan: `saveToLocalStorage()`, `renderTransactions()`, `updateTotal()`, `updateChart()`
    - Reset semua field form ke nilai awal dan panggil `clearErrors()`
    - _Kebutuhan: 1.3, 1.4, 3.2, 4.2_

  - [x] 7.2 Implementasikan `deleteExpense(index)`
    - Gunakan `expenses.splice(index, 1)` untuk menghapus berdasarkan indeks
    - Panggil secara berurutan: `saveToLocalStorage()`, `renderTransactions()`, `updateTotal()`, `updateChart()`
    - _Kebutuhan: 3.4, 4.3, 6.2_

  - [ ]* 7.3 Tulis property-based test untuk Property 5: Hapus menghilangkan transaksi secara permanen
    - **Property 5: Hapus menghilangkan transaksi secara permanen**
    - **Validates: Kebutuhan 3.4, 6.2**
    - Gunakan generator `expenseArray` dengan filter `length >= 1` dan indeks valid acak
    - Verifikasi tiga kondisi setelah `deleteExpense(i)`: panjang berkurang 1, id tidak ada di array, id tidak ada di localStorage
    - Jalankan minimal 100 iterasi
    - _Kebutuhan: 3.4, 6.2_

- [x] 8. Implementasi render DOM di `js/app.js`
  - [x] 8.1 Implementasikan `renderTransactions()`
    - Set `innerHTML = ''` pada `#transaction-list` setiap kali dipanggil
    - Jika `expenses.length === 0`: tampilkan `<li class="empty-state">Belum ada transaksi</li>`
    - Untuk setiap transaksi: buat `<li>` dengan nama, `formatRupiah(amount)`, kategori, dan tombol `.btn-delete` dengan atribut `data-index`
    - _Kebutuhan: 3.1, 3.2, 3.3, 3.5_

  - [x] 8.2 Implementasikan `updateTotal()`
    - Hitung total menggunakan `expenses.reduce((sum, e) => sum + e.amount, 0)`
    - Set `textContent` dari `#total-display` ke `formatRupiah(total)`
    - _Kebutuhan: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 8.3 Tulis property-based test untuk Property 2: Invariant total
    - **Property 2: Invariant total — total selalu sama dengan jumlah semua amount**
    - **Validates: Kebutuhan 4.2, 4.3, 4.5**
    - Gunakan generator `expenseArray` — set `expenses` ke array acak, panggil `updateTotal()`
    - Verifikasi bahwa nilai di `#total-display` sama persis dengan hasil `reduce`
    - Jalankan minimal 100 iterasi
    - _Kebutuhan: 4.2, 4.3, 4.5_

- [x] 9. Implementasi Chart.js di `js/app.js`
  - [x] 9.1 Implementasikan `initChart()`
    - Ambil konteks canvas: `document.getElementById('expenseChart').getContext('2d')`
    - Buat instance: `chart = new Chart(ctx, { type: 'pie', data: { labels: ['Food', 'Transport', 'Fun'], datasets: [{ data: [0,0,0], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } } } })`
    - Simpan instance ke variabel global `chart`
    - _Kebutuhan: 5.2, 5.4, 5.5, 5.8_

  - [x] 9.2 Implementasikan `updateChart()`
    - Hitung `totals = { Food: 0, Transport: 0, Fun: 0 }` dari iterasi array `expenses`
    - Set `chart.data.datasets[0].data = [totals.Food, totals.Transport, totals.Fun]`
    - Panggil `chart.update()`
    - Pastikan tidak ada error saat semua nilai nol (array kosong)
    - _Kebutuhan: 5.3, 5.6, 5.7_

  - [ ]* 9.3 Tulis property-based test untuk Property 3: Invariant chart
    - **Property 3: Invariant chart — data chart selalu sama dengan agregasi per kategori**
    - **Validates: Kebutuhan 5.3, 5.6**
    - Gunakan generator `expenseArray` — set `expenses` ke array acak, panggil `updateChart()`
    - Verifikasi bahwa `chart.data.datasets[0].data[0]` sama dengan total Food, dst.
    - Jalankan minimal 100 iterasi
    - _Kebutuhan: 5.3, 5.6_

- [x] 10. Implementasi entry point `init()` dan event listeners di `js/app.js`
  - [x] 10.1 Implementasikan fungsi `init()` dan daftarkan di `DOMContentLoaded`
    - `init()` memanggil secara berurutan: `loadFromLocalStorage()` → isi `expenses`, `renderTransactions()`, `updateTotal()`, `initChart()`, `updateChart()`
    - Daftarkan `document.addEventListener('DOMContentLoaded', init)`
    - _Kebutuhan: 3.6, 4.5, 5.2, 6.3_

  - [x] 10.2 Tambahkan event listener pada tombol `#btn-add`
    - Saat diklik: panggil `validateForm()` — jika `true`, ambil nilai field dan panggil `addExpense(name, amount, category)`
    - _Kebutuhan: 1.3, 2.4_

  - [x] 10.3 Tambahkan event listener pada `#transaction-list` (event delegation untuk tombol hapus)
    - Gunakan event delegation: `document.getElementById('transaction-list').addEventListener('click', ...)`
    - Periksa apakah target memiliki class `.btn-delete` — jika ya, ambil `data-index` dan panggil `deleteExpense(index)`
    - _Kebutuhan: 3.4_

- [x] 11. Checkpoint — Pengujian menyeluruh dan pembersihan kode
  - Uji semua skenario validasi: field kosong satu per satu, semua kosong, semua terisi valid
  - Uji alur penambahan transaksi: pastikan daftar, total, dan chart diperbarui seketika
  - Uji alur penghapusan transaksi: pastikan daftar, total, dan chart diperbarui seketika
  - Uji persistensi: tambahkan beberapa transaksi → tutup tab → buka kembali → data harus masih ada
  - Uji tampilan di lebar 320px (mobile) dan ≥ 768px (desktop)
  - Hapus semua `console.log` yang digunakan untuk debugging
  - Pastikan setiap fungsi utama memiliki komentar penjelasan
  - Pastikan folder `.kiro/` tidak terhapus
  - Pastikan semua tugas selesai, tanyakan ke pengguna jika ada pertanyaan

---

## Notes

- Tugas bertanda `*` bersifat opsional dan dapat dilewati untuk iterasi MVP yang lebih cepat
- Setiap tugas merujuk kebutuhan spesifik untuk keterlacakan (traceability)
- Checkpoint memastikan validasi inkremental sebelum melanjutkan ke lapisan berikutnya
- Property-based test menggunakan library **fast-check** yang dapat dimuat via CDN atau dijalankan dengan Node.js
- Setiap property test wajib dijalankan minimal 100 iterasi
- Unit test dan property test bersifat saling melengkapi — property test menguji kebenaran universal, unit test menguji skenario dan kondisi tepi spesifik
- Urutan tugas mencerminkan dependensi nyata: HTML harus ada sebelum CSS bisa diverifikasi secara visual, dan HTML+CSS harus ada sebelum logika JavaScript bisa diintegrasikan

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4", "3.1"] },
    { "id": 4, "tasks": ["3.2", "3.3", "3.4"] },
    { "id": 5, "tasks": ["3.5", "5.1"] },
    { "id": 6, "tasks": ["5.2", "6.1"] },
    { "id": 7, "tasks": ["5.3", "6.2", "8.2"] },
    { "id": 8, "tasks": ["6.3", "7.1", "8.1", "8.3"] },
    { "id": 9, "tasks": ["7.2", "9.1"] },
    { "id": 10, "tasks": ["7.3", "9.2"] },
    { "id": 11, "tasks": ["9.3", "10.1"] },
    { "id": 12, "tasks": ["10.2", "10.3"] }
  ]
}
```
