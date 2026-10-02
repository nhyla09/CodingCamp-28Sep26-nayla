# Dokumen Desain: Expense & Budget Visualizer

## Overview

**Expense & Budget Visualizer** adalah aplikasi web client-side yang dibangun tanpa server backend. Pengguna dapat mencatat, menghapus, dan memvisualisasikan pengeluaran pribadi melalui antarmuka yang sederhana dan responsif.

Aplikasi ini dibangun menggunakan tiga file utama:

| File | Peran |
|---|---|
| `index.html` | Struktur halaman dan elemen UI |
| `css/style.css` | Seluruh gaya tampilan (mobile-first) |
| `js/app.js` | Seluruh logika aplikasi (Vanilla JavaScript) |

Library eksternal satu-satunya adalah **Chart.js** yang dimuat via CDN — tidak ada framework JavaScript atau CSS lain yang digunakan.

---

## Architecture

### Pola Arsitektur

Aplikasi menggunakan pola **Event-Driven Single-Page Application** tanpa routing. Semua interaksi pengguna mengubah satu sumber kebenaran (array `expenses` di memori), yang kemudian disinkronkan ke tiga lapisan output:

1. **DOM** — daftar transaksi dan total pengeluaran dirender ulang
2. **Chart.js** — pie chart diperbarui via `chart.update()`
3. **Local Storage** — array diserialisasi ke JSON dan disimpan

### Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         PENGGUNA                                │
│                            │                                    │
│               ┌────────────▼────────────┐                       │
│               │      index.html         │                       │
│               │   (UI / Tampilan)       │                       │
│               └────────────┬────────────┘                       │
│                            │ Event (klik, submit)               │
│               ┌────────────▼────────────┐                       │
│               │       js/app.js         │                       │
│               │   (Logika Aplikasi)     │                       │
│               │                         │                       │
│               │  Array: expenses[]      │                       │
│               │  (Sumber Kebenaran)     │                       │
│               └──┬──────────┬──────────┬┘                       │
│                  │          │          │                         │
│         ┌────────▼──┐  ┌────▼────┐  ┌─▼──────────────┐         │
│         │    DOM    │  │Chart.js │  │ Local Storage  │         │
│         │ (daftar + │  │(pie     │  │ key:"expenses" │         │
│         │  total)   │  │ chart)  │  │ format: JSON   │         │
│         └───────────┘  └─────────┘  └────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Alur Data Utama

```
Pengguna isi form → klik "Tambah"
        │
        ▼
validateForm() ──► gagal? ──► showError() → berhenti
        │ sukses
        ▼
addExpense(name, amount, category)
        │
        ├──► saveToLocalStorage()   [sinkron ke storage]
        ├──► renderTransactions()   [perbarui DOM daftar]
        ├──► updateTotal()          [perbarui DOM total]
        ├──► updateChart()          [perbarui pie chart]
        └──► reset form fields

Pengguna klik "Hapus" pada baris ke-i
        │
        ▼
deleteExpense(i)
        │
        ├──► saveToLocalStorage()
        ├──► renderTransactions()
        ├──► updateTotal()
        └──► updateChart()

Halaman pertama kali dimuat (DOMContentLoaded)
        │
        ▼
init()
        │
        ├──► loadFromLocalStorage() → isi array expenses[]
        ├──► renderTransactions()
        ├──► updateTotal()
        └──► initChart() → updateChart()
```

---

## Components and Interfaces

### Komponen UI (HTML)

#### 1. Formulir Input Transaksi (`#expense-form`)

Berisi tiga field input dan satu tombol aksi:

| Elemen | ID / Name | Tipe | Keterangan |
|---|---|---|---|
| Field nama item | `#item-name` | `<input type="text">` | Teks bebas |
| Pesan error nama | `#error-item-name` | `<span>` | Kosong saat valid |
| Field jumlah | `#item-amount` | `<input type="number">` | Harus > 0 |
| Pesan error jumlah | `#error-item-amount` | `<span>` | Kosong saat valid |
| Dropdown kategori | `#item-category` | `<select>` | Food / Transport / Fun |
| Pesan error kategori | `#error-item-category` | `<span>` | Kosong saat valid |
| Tombol tambah | `#btn-add` | `<button type="button">` | Memicu validasi |

#### 2. Ringkasan Total (`#total-display`)

Satu elemen teks yang menampilkan total pengeluaran dalam format Rupiah. Diperbarui setiap kali transaksi berubah.

#### 3. Daftar Transaksi (`#transaction-list`)

Elemen `<ul>` atau `<div>` yang berisi satu baris (`<li>`) per transaksi. Jika kosong, menampilkan teks "Belum ada transaksi".

Setiap baris mengandung:
- Nama item
- Jumlah dalam format `Rp X.XXX`
- Kategori
- Tombol "Hapus" dengan `data-index` yang menyimpan posisi transaksi di array

#### 4. Pie Chart (`#expenseChart`)

Elemen `<canvas>` yang dikelola sepenuhnya oleh Chart.js. Tidak ada interaksi langsung dengan Canvas 2D API.

### Antarmuka Fungsi JavaScript

Semua fungsi dideklarasikan di scope global dalam `js/app.js`.

```
┌──────────────────────────────────────────────────────────────┐
│                         js/app.js                            │
│                                                              │
│  State Global:                                               │
│    let expenses = []      ← array transaksi di memori        │
│    let chart = null       ← instance Chart.js                │
│                                                              │
│  Entry Point:                                                │
│    init()                 ← dipanggil saat DOMContentLoaded  │
│                                                              │
│  Validasi:                                                   │
│    validateForm() → bool                                     │
│    showError(fieldId, message) → void                        │
│    clearErrors() → void                                      │
│                                                              │
│  Manajemen Transaksi:                                        │
│    addExpense(name, amount, category) → void                 │
│    deleteExpense(index) → void                               │
│                                                              │
│  Render DOM:                                                 │
│    renderTransactions() → void                               │
│    updateTotal() → void                                      │
│                                                              │
│  Persistensi:                                                │
│    saveToLocalStorage() → void                               │
│    loadFromLocalStorage() → array                            │
│                                                              │
│  Visualisasi:                                                │
│    initChart() → void                                        │
│    updateChart() → void                                      │
│                                                              │
│  Utilitas:                                                   │
│    formatRupiah(amount) → string                             │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Struktur Objek Transaksi

```javascript
{
  id: number,        // timestamp unik: Date.now()
  name: string,      // nama item, tidak boleh kosong/whitespace
  amount: number,    // jumlah dalam Rupiah, harus > 0
  category: string   // 'Food' | 'Transport' | 'Fun'
}
```

**Contoh:**
```javascript
{
  id: 1700000000000,
  name: "Makan Siang",
  amount: 25000,
  category: "Food"
}
```

### State Global

```javascript
// Array transaksi — sumber kebenaran utama aplikasi
let expenses = [];

// Instance Chart.js — dibuat sekali oleh initChart(), diperbarui oleh updateChart()
let chart = null;
```

### Format Local Storage

- **Kunci:** `"expenses"`
- **Nilai:** string JSON dari array transaksi
- **Contoh nilai tersimpan:**
  ```json
  [{"id":1700000000000,"name":"Makan Siang","amount":25000,"category":"Food"}]
  ```
- **Saat pertama kali (kunci tidak ada):** `loadFromLocalStorage()` mengembalikan `[]`

### Diagram Alur Data Transaksi

```
Formulir Input
      │
      ▼ (validateForm)
  Input Valid?
   ├── TIDAK → tampilkan error, hentikan
   └── YA    ──────────────────────────────────────────────────┐
                                                               │
                                                               ▼
                                               addExpense(name, amount, category)
                                                               │
                                          ┌────────────────────┤
                                          │                    │
                                          ▼                    ▼
                                  expenses.push({})    saveToLocalStorage()
                                          │
                              ┌───────────┼───────────┐
                              │           │           │
                              ▼           ▼           ▼
                     renderTransactions() updateTotal() updateChart()
```

---

## Desain Komponen Detail

### Desain HTML (`index.html`)

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense & Budget Visualizer</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header>
    <h1>Expense & Budget Visualizer</h1>
  </header>

  <main class="container">

    <!-- Kolom Kiri: Form + Daftar + Total -->
    <section class="left-panel">

      <!-- Total Pengeluaran -->
      <div class="total-section">
        <h2>Total Pengeluaran</h2>
        <p id="total-display">Rp 0</p>
      </div>

      <!-- Formulir Input -->
      <div class="form-section">
        <h2>Tambah Transaksi</h2>
        <div class="form-group">
          <label for="item-name">Nama Item</label>
          <input type="text" id="item-name" placeholder="Contoh: Makan Siang">
          <span class="error-message" id="error-item-name"></span>
        </div>
        <div class="form-group">
          <label for="item-amount">Jumlah (Rp)</label>
          <input type="number" id="item-amount" placeholder="Contoh: 25000" min="1">
          <span class="error-message" id="error-item-amount"></span>
        </div>
        <div class="form-group">
          <label for="item-category">Kategori</label>
          <select id="item-category">
            <option value="">-- Pilih Kategori --</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Fun">Fun</option>
          </select>
          <span class="error-message" id="error-item-category"></span>
        </div>
        <button id="btn-add" type="button">Tambah</button>
      </div>

      <!-- Daftar Transaksi -->
      <div class="list-section">
        <h2>Daftar Transaksi</h2>
        <ul id="transaction-list">
          <!-- Diisi oleh renderTransactions() -->
        </ul>
      </div>

    </section>

    <!-- Kolom Kanan: Pie Chart -->
    <section class="right-panel">
      <h2>Distribusi Pengeluaran</h2>
      <canvas id="expenseChart"></canvas>
    </section>

  </main>

  <!-- Chart.js harus dimuat SEBELUM app.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="js/app.js"></script>

</body>
</html>
```

### Desain CSS (`css/style.css`)

**Pendekatan:** Mobile-first. Gaya dasar ditulis untuk layar kecil (≥ 320px), kemudian ditambahkan media query untuk layar ≥ 768px.

```
Breakpoint tunggal: @media (min-width: 768px)
  - Mobile  (< 768px): .container { flex-direction: column }
  - Desktop (≥ 768px): .container { flex-direction: row }
```

**Struktur CSS:**

```
/* 1. Reset dan Base */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #f5f5f5; color: #333; }

/* 2. Layout Utama */
.container {
  display: flex;
  flex-direction: column;   ← mobile: satu kolom
  gap: 1rem;
  padding: 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* 3. Panel */
.left-panel  { width: 100%; }
.right-panel { width: 100%; }

/* 4. Form */
.form-group { display: flex; flex-direction: column; margin-bottom: 0.75rem; }
input, select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
button#btn-add { width: 100%; padding: 0.75rem; background: #4CAF50; color: white; }

/* 5. Error Message */
.error-message { color: #e53935; font-size: 0.85rem; min-height: 1.2rem; }

/* 6. Transaction List */
#transaction-list { list-style: none; }
#transaction-list li { display: flex; justify-content: space-between; ... }
.btn-delete { background: #e53935; color: white; ... }

/* 7. Total */
#total-display { font-size: 1.5rem; font-weight: bold; color: #1a237e; }

/* 8. Responsif — Desktop */
@media (min-width: 768px) {
  .container { flex-direction: row; }
  .left-panel  { flex: 1; }
  .right-panel { flex: 1; }
}
```

### Desain JavaScript (`js/app.js`)

#### Pseudocode Setiap Fungsi

---

**`init()`** — entry point, dipanggil satu kali saat DOMContentLoaded

```
fungsi init():
  expenses ← loadFromLocalStorage()
  renderTransactions()
  updateTotal()
  initChart()
  updateChart()
  daftarkan event listener pada tombol #btn-add → panggil handleAddExpense()
  daftarkan event listener pada #transaction-list (event delegation) →
    jika klik pada .btn-delete → ambil data-index → panggil deleteExpense(index)
```

---

**`validateForm()`** → boolean

```
fungsi validateForm():
  isValid ← true
  clearErrors()

  name  ← nilai #item-name, di-trim()
  amount ← nilai numerik #item-amount
  category ← nilai #item-category

  jika name kosong atau hanya whitespace:
    showError('item-name', 'Nama item wajib diisi')
    isValid ← false

  jika amount kosong ATAU amount ≤ 0:
    showError('item-amount', 'Jumlah wajib diisi dan harus lebih dari 0')
    isValid ← false

  jika category kosong:
    showError('item-category', 'Kategori wajib dipilih')
    isValid ← false

  kembalikan isValid
```

---

**`showError(fieldId, message)`** → void

```
fungsi showError(fieldId, message):
  elemen ← document.getElementById('error-' + fieldId)
  elemen.textContent ← message
```

---

**`clearErrors()`** → void

```
fungsi clearErrors():
  untuk setiap elemen dengan class .error-message:
    elemen.textContent ← ''
```

---

**`addExpense(name, amount, category)`** → void

```
fungsi addExpense(name, amount, category):
  transaksi baru ← { id: Date.now(), name, amount: Number(amount), category }
  expenses.push(transaksi baru)
  saveToLocalStorage()
  renderTransactions()
  updateTotal()
  updateChart()
  reset semua field form ke nilai awal
  clearErrors()
```

---

**`deleteExpense(index)`** → void

```
fungsi deleteExpense(index):
  expenses.splice(index, 1)
  saveToLocalStorage()
  renderTransactions()
  updateTotal()
  updateChart()
```

---

**`renderTransactions()`** → void

```
fungsi renderTransactions():
  list ← document.getElementById('transaction-list')
  list.innerHTML ← ''

  jika expenses.length === 0:
    list.innerHTML ← '<li class="empty-state">Belum ada transaksi</li>'
    kembalikan

  untuk setiap expenses[i]:
    buat elemen <li> berisi:
      - span: expenses[i].name
      - span: formatRupiah(expenses[i].amount)
      - span: expenses[i].category
      - button.btn-delete dengan data-index="i": teks "Hapus"
    tambahkan <li> ke list
```

---

**`updateTotal()`** → void

```
fungsi updateTotal():
  total ← jumlah semua expenses[i].amount (reduce)
  document.getElementById('total-display').textContent ← formatRupiah(total)
```

---

**`saveToLocalStorage()`** → void

```
fungsi saveToLocalStorage():
  localStorage.setItem('expenses', JSON.stringify(expenses))
```

---

**`loadFromLocalStorage()`** → array

```
fungsi loadFromLocalStorage():
  data ← localStorage.getItem('expenses')
  jika data null:
    kembalikan []
  kembalikan JSON.parse(data)
```

---

**`initChart()`** → void

```
fungsi initChart():
  ctx ← document.getElementById('expenseChart').getContext('2d')
  chart ← new Chart(ctx, {
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
  })
```

---

**`updateChart()`** → void

```
fungsi updateChart():
  totals ← { Food: 0, Transport: 0, Fun: 0 }
  untuk setiap expenses[i]:
    totals[expenses[i].category] += expenses[i].amount

  chart.data.datasets[0].data ← [totals.Food, totals.Transport, totals.Fun]
  chart.update()
```

---

**`formatRupiah(amount)`** → string

```
fungsi formatRupiah(amount):
  kembalikan 'Rp ' + amount.toLocaleString('id-ID')
```

---

## Correctness Properties

*Properti adalah karakteristik atau perilaku yang harus berlaku benar di semua eksekusi valid sistem — pada dasarnya, pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi secara otomatis.*

---

### Property 1: Validasi menolak semua input tidak valid tanpa menyimpan data

*Untuk sembarang* kombinasi input di mana setidaknya satu field tidak valid (nama kosong/whitespace, jumlah ≤ 0, atau kategori kosong), pemanggilan proses tambah transaksi tidak boleh mengubah array `expenses` maupun isi `localStorage["expenses"]`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

---

### Property 2: Invariant total — total selalu sama dengan jumlah semua amount

*Untuk sembarang* kondisi array `expenses` (setelah penambahan, penghapusan, maupun pemuatan dari Local Storage), nilai yang ditampilkan oleh `updateTotal()` harus selalu sama persis dengan hasil `expenses.reduce((sum, e) => sum + e.amount, 0)`.

**Validates: Requirements 4.2, 4.3, 4.5**

---

### Property 3: Invariant chart — data chart selalu sama dengan agregasi per kategori

*Untuk sembarang* kondisi array `expenses`, setelah `updateChart()` dipanggil, nilai `chart.data.datasets[0].data` harus selalu berupa `[totalFood, totalTransport, totalFun]` yang dihitung langsung dari array `expenses` pada saat itu.

**Validates: Requirements 5.3, 5.6**

---

### Property 4: Round-trip serialisasi Local Storage

*Untuk sembarang* array transaksi valid (termasuk array kosong, array dengan satu elemen, dan array dengan banyak elemen dari berbagai kategori), operasi `saveToLocalStorage()` diikuti `loadFromLocalStorage()` harus menghasilkan array yang identik secara nilai dengan array awal.

**Validates: Requirements 6.5, 6.1, 6.2, 6.3**

---

### Property 5: Hapus menghilangkan transaksi secara permanen

*Untuk sembarang* array `expenses` dengan panjang ≥ 1 dan sembarang indeks valid `i`, setelah `deleteExpense(i)` dipanggil:
1. `expenses.length` berkurang tepat 1
2. Transaksi dengan `id` yang sama tidak boleh ditemukan di `expenses` maupun di data yang tersimpan di `localStorage["expenses"]`
3. Daftar yang dirender di DOM tidak boleh mengandung baris untuk transaksi tersebut

**Validates: Requirements 3.4, 6.2**

---

## Error Handling

### Validasi Input

| Kondisi Error | Pesan yang Ditampilkan | Lokasi |
|---|---|---|
| Nama item kosong atau hanya whitespace | "Nama item wajib diisi" | Di bawah `#item-name` |
| Jumlah kosong atau ≤ 0 | "Jumlah wajib diisi dan harus lebih dari 0" | Di bawah `#item-amount` |
| Kategori tidak dipilih | "Kategori wajib dipilih" | Di bawah `#item-category` |

**Perilaku saat error:**
- Semua pesan error yang relevan ditampilkan sekaligus (tidak berhenti di error pertama)
- Proses penyimpanan transaksi dihentikan sepenuhnya
- Setelah submit berhasil, semua pesan error dihapus via `clearErrors()`

### Local Storage

| Kondisi | Penanganan |
|---|---|
| Kunci `"expenses"` tidak ada | `loadFromLocalStorage()` mengembalikan `[]` — tidak ada error |
| Data JSON rusak (corrupt) | Dibungkus `try/catch` — jika gagal parse, kembalikan `[]` |
| Local Storage penuh (`QuotaExceededError`) | Bisa ditambahkan `try/catch` di `saveToLocalStorage()` — tampilkan peringatan sederhana |

### Chart.js

| Kondisi | Penanganan |
|---|---|
| Semua nilai kategori nol | `updateChart()` mengisi `[0, 0, 0]` — Chart.js menampilkan chart kosong tanpa error |
| `initChart()` belum dipanggil tapi `updateChart()` dipanggil | Tidak akan terjadi karena urutan panggilan di `init()` menjamin `initChart()` selalu duluan |

---

## Testing Strategy

### Pendekatan Pengujian Ganda

Aplikasi ini menggunakan dua lapisan pengujian yang saling melengkapi:

1. **Unit test berbasis contoh** — menguji skenario spesifik, kondisi tepi, dan perilaku konkret
2. **Property-based test** — menguji properti universal yang harus berlaku untuk semua input

### Library Property-Based Testing

Karena proyek menggunakan Vanilla JavaScript tanpa build system, pengujian dilakukan dengan mengekstrak fungsi murni ke modul yang dapat diuji secara terpisah, menggunakan library **[fast-check](https://fast-check.dev/)** (dapat dimuat via CDN atau Node.js untuk pengujian).

Setiap property test dikonfigurasi dengan **minimal 100 iterasi**.

### Unit Test (Berbasis Contoh)

| Skenario | Yang Diverifikasi |
|---|---|
| Form kosong sepenuhnya | Tiga pesan error muncul, tidak ada transaksi tersimpan |
| Hanya nama kosong | Pesan error hanya di field nama |
| Jumlah = 0 | Pesan error jumlah muncul |
| Kategori tidak dipilih | Pesan error kategori muncul |
| Input valid lengkap | Transaksi muncul di daftar, total diperbarui, chart diperbarui |
| Hapus satu-satunya transaksi | Daftar menampilkan "Belum ada transaksi", total = Rp 0 |
| LocalStorage kosong saat load | `loadFromLocalStorage()` mengembalikan `[]` |
| Array kosong di chart | `chart.data.datasets[0].data = [0, 0, 0]`, tidak ada error |
| Format Rupiah | `formatRupiah(25000)` → `"Rp 25.000"` |
| Format Rupiah nol | `formatRupiah(0)` → `"Rp 0"` |

### Property-Based Test

| ID Properti | Judul | Konfigurasi Tag |
|---|---|---|
| Properti 1 | Validasi menolak semua input tidak valid | `Feature: expense-budget-visualizer, Property 1: Validasi menolak semua input tidak valid tanpa menyimpan data` |
| Properti 2 | Invariant total | `Feature: expense-budget-visualizer, Property 2: Total selalu sama dengan jumlah semua amount` |
| Properti 3 | Invariant chart | `Feature: expense-budget-visualizer, Property 3: Data chart selalu sama dengan agregasi per kategori` |
| Properti 4 | Round-trip Local Storage | `Feature: expense-budget-visualizer, Property 4: Round-trip serialisasi Local Storage` |
| Properti 5 | Hapus permanen | `Feature: expense-budget-visualizer, Property 5: Hapus menghilangkan transaksi secara permanen` |

**Strategi generator untuk fast-check:**

```javascript
// Generator transaksi valid
const validExpense = fc.record({
  id:       fc.integer({ min: 1 }),
  name:     fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  amount:   fc.integer({ min: 1, max: 10_000_000 }),
  category: fc.constantFrom('Food', 'Transport', 'Fun')
});

// Generator array transaksi valid (termasuk array kosong)
const expenseArray = fc.array(validExpense);

// Generator input tidak valid untuk Properti 1
const invalidName     = fc.string().filter(s => s.trim().length === 0); // kosong/whitespace
const invalidAmount   = fc.oneof(fc.constant(0), fc.integer({ max: 0 }));
const invalidCategory = fc.constant('');
```

### Pengujian Responsif (Manual)

| Ukuran Viewport | Yang Diverifikasi |
|---|---|
| 320px (mobile minimum) | Satu kolom, semua konten terbaca |
| 375px (iPhone SE) | Tata letak satu kolom |
| 768px (breakpoint) | Mulai dua kolom |
| 1024px (desktop) | Dua kolom proporsional |

### Daftar Periksa Sebelum Submission

- [ ] Semua skenario validasi berjalan benar
- [ ] Tambah dan hapus transaksi memperbarui total dan chart
- [ ] Data tetap ada setelah tutup dan buka ulang peramban
- [ ] Tidak ada `console.log` tersisa
- [ ] Folder `.kiro/` tidak terhapus
- [ ] Tidak ada file CSS atau JS tambahan selain yang ditentukan
- [ ] Chart.js dimuat via CDN sebelum `app.js`
- [ ] Tampilan rapi di 320px dan 768px+
