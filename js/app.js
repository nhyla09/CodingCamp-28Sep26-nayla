/* js/app.js — Expense & Budget Visualizer */

/**
 * Array transaksi pengeluaran — sumber kebenaran utama aplikasi.
 * Setiap elemen memiliki struktur: { id, name, amount, category }
 * @type {Array<{id: number, name: string, amount: number, category: string}>}
 */
let expenses = [];

/**
 * Instance Chart.js untuk pie chart.
 * Dibuat sekali oleh initChart(), diperbarui oleh updateChart().
 * @type {Chart|null}
 */
let chart = null;

/**
 * Memformat angka menjadi string mata uang Rupiah.
 * Contoh: formatRupiah(25000) → "Rp 25.000"
 * @param {number} amount - Jumlah dalam Rupiah
 * @returns {string} String berformat "Rp X.XXX"
 */
function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Menyimpan array expenses ke Local Storage dalam format JSON.
 * Kunci yang digunakan: 'expenses'
 * @returns {void}
 */
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

/**
 * Memuat array expenses dari Local Storage.
 * Mengembalikan array kosong jika kunci tidak ditemukan atau data rusak.
 * @returns {Array} Array transaksi yang tersimpan, atau [] jika tidak ada/error
 */
function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem('expenses');
    if (data === null) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

/**
 * Menampilkan pesan error di bawah field yang ditentukan.
 * @param {string} fieldId - ID field yang error (tanpa prefix 'error-')
 * @param {string} message - Pesan error yang akan ditampilkan
 * @returns {void}
 */
function showError(fieldId, message) {
  const el = document.getElementById('error-' + fieldId);
  if (el) el.textContent = message;
}

/**
 * Menghapus semua pesan error dari tampilan.
 * Iterasi seluruh elemen .error-message dan kosongkan textContent.
 * @returns {void}
 */
function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(function(el) {
    el.textContent = '';
  });
}

/**
 * Menghitung total pengeluaran dan memperbarui tampilan di DOM.
 * Total dihitung dari semua amount di array expenses menggunakan reduce.
 * @returns {void}
 */
function updateTotal() {
  const total = expenses.reduce(function(sum, e) { return sum + e.amount; }, 0);
  document.getElementById('total-display').textContent = formatRupiah(total);
}

/**
 * Memvalidasi semua field formulir input.
 * Mengumpulkan semua error sebelum mengembalikan hasil — tidak berhenti di error pertama.
 * @returns {boolean} true jika semua field valid, false jika ada yang tidak valid
 */
function validateForm() {
  let isValid = true;
  clearErrors();

  const name = document.getElementById('item-name').value.trim();
  const amount = parseFloat(document.getElementById('item-amount').value);
  const category = document.getElementById('item-category').value;

  if (name === '') {
    showError('item-name', 'Nama item wajib diisi');
    isValid = false;
  }

  if (!document.getElementById('item-amount').value || amount <= 0 || isNaN(amount)) {
    showError('item-amount', 'Jumlah wajib diisi dan harus lebih dari 0');
    isValid = false;
  }

  if (category === '') {
    showError('item-category', 'Kategori wajib dipilih');
    isValid = false;
  }

  return isValid;
}

/**
 * Menambahkan transaksi baru ke array expenses dan memperbarui seluruh tampilan.
 * @param {string} name - Nama item pengeluaran
 * @param {number|string} amount - Jumlah pengeluaran dalam Rupiah
 * @param {string} category - Kategori: 'Food', 'Transport', atau 'Fun'
 * @returns {void}
 */
function addExpense(name, amount, category) {
  const newExpense = {
    id: Date.now(),
    name: name,
    amount: Number(amount),
    category: category
  };
  expenses.push(newExpense);

  saveToLocalStorage();
  renderTransactions();
  updateTotal();
  updateChart();

  // Reset form ke kondisi awal
  document.getElementById('item-name').value = '';
  document.getElementById('item-amount').value = '';
  document.getElementById('item-category').value = '';
  clearErrors();
}

/**
 * Merender ulang seluruh daftar transaksi ke DOM.
 * Menampilkan teks empty state jika tidak ada transaksi.
 * @returns {void}
 */
function renderTransactions() {
  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  if (expenses.length === 0) {
    list.innerHTML = '<li class="empty-state">Belum ada transaksi</li>';
    return;
  }

  expenses.forEach(function(expense, index) {
    const li = document.createElement('li');
    li.innerHTML =
      '<span class="transaction-name">' + expense.name + '</span>' +
      '<span class="transaction-amount">' + formatRupiah(expense.amount) + '</span>' +
      '<span class="transaction-category">' + expense.category + '</span>' +
      '<button class="btn-delete" data-index="' + index + '">Hapus</button>';
    list.appendChild(li);
  });
}

/**
 * Membuat instance Chart.js untuk pie chart pengeluaran.
 * Dipanggil sekali saat halaman pertama kali dimuat.
 * Instance disimpan ke variabel global `chart` untuk diperbarui oleh updateChart().
 * @returns {void}
 */
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

/**
 * Menghapus transaksi berdasarkan indeksnya dari array expenses.
 * Memperbarui Local Storage, DOM, total, dan chart setelah penghapusan.
 * @param {number} index - Indeks transaksi di array expenses yang akan dihapus
 * @returns {void}
 */
function deleteExpense(index) {
  expenses.splice(index, 1);

  saveToLocalStorage();
  renderTransactions();
  updateTotal();
  updateChart();
}

/**
 * Memperbarui data pie chart berdasarkan total pengeluaran per kategori.
 * Menghitung ulang total Food, Transport, dan Fun dari array expenses,
 * lalu memperbarui data chart dan merender ulang.
 * Aman dipanggil saat array kosong — mengisi chart dengan nilai nol.
 * @returns {void}
 */
function updateChart() {
  const totals = { Food: 0, Transport: 0, Fun: 0 };
  expenses.forEach(function(e) {
    if (totals.hasOwnProperty(e.category)) {
      totals[e.category] += e.amount;
    }
  });

  chart.data.datasets[0].data = [totals.Food, totals.Transport, totals.Fun];
  chart.update();
}

/**
 * Fungsi inisialisasi aplikasi — entry point utama.
 * Memuat data dari Local Storage, merender tampilan awal, dan membuat chart.
 * Dipanggil saat DOM selesai dimuat.
 * @returns {void}
 */
function init() {
  // Muat data dari Local Storage ke array expenses
  expenses = loadFromLocalStorage();

  // Render ulang seluruh tampilan berdasarkan data yang dimuat
  renderTransactions();
  updateTotal();
  initChart();
  updateChart();

  // Event listener untuk tombol "Tambah"
  document.getElementById('btn-add').addEventListener('click', function() {
    if (validateForm()) {
      const name = document.getElementById('item-name').value.trim();
      const amount = document.getElementById('item-amount').value;
      const category = document.getElementById('item-category').value;
      addExpense(name, amount, category);
    }
  });

  // Event delegation untuk tombol "Hapus" di daftar transaksi
  document.getElementById('transaction-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      deleteExpense(index);
    }
  });
}

// Daftarkan init() untuk dijalankan setelah DOM selesai dimuat
document.addEventListener('DOMContentLoaded', init);
