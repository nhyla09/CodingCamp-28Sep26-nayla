/* js/app.js — Expense & Budget Visualizer */

/**
 * Array transaksi pengeluaran — sumber kebenaran utama aplikasi.
 * Setiap elemen memiliki struktur: { id, name, amount, category }
 * @type {Array<{id: number, name: string, amount: number, category: string}>}
 */
let expenses = [];
let categories = ['Food', 'Transport', 'Fun'];
let chart = null;
let currentFilter = 'all';
let currentSort = 'default';
let spendingLimit = 0;

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

function saveSpendingLimit() {
  localStorage.setItem('spendingLimit', spendingLimit);
}

function loadSpendingLimit() {
  const savedLimit = localStorage.getItem('spendingLimit');

  if (savedLimit === null) {
    return 0;
  }

  const limit = Number(savedLimit);

  if (isNaN(limit) || limit < 0) {
    return 0;
  }

  return limit;
}

function updateLimitStatus() {
  const statusElement = document.getElementById('limit-status');

  if (!statusElement) return;

  if (spendingLimit === 0) {
    statusElement.textContent = 'Belum ada batas pengeluaran';
    return;
  }

  const filteredExpenses = getFilteredExpenses();

  const total = filteredExpenses.reduce(function(sum, expense) {
    return sum + expense.amount;
  }, 0);

  const remaining = spendingLimit - total;

  if (remaining < 0) {
    statusElement.textContent =
      'Batas pengeluaran terlampaui sebesar ' + formatRupiah(Math.abs(remaining));
  } else {
    statusElement.textContent =
      'Sisa batas pengeluaran: ' + formatRupiah(remaining);
  }
}

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function loadCategories() {
  try {
    const data = localStorage.getItem('categories');

    if (data === null) {
      return ['Food', 'Transport', 'Fun'];
    }

    const loadedCategories = JSON.parse(data);

    if (Array.isArray(loadedCategories) && loadedCategories.length > 0) {
      return loadedCategories;
    }

    return ['Food', 'Transport', 'Fun'];
  } catch (e) {
    return ['Food', 'Transport', 'Fun'];
  }
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

    const loadedExpenses = JSON.parse(data);

    if (!Array.isArray(loadedExpenses)) return [];

    return loadedExpenses.map(function(expense) {
      if (!expense.date) {
        expense.date = new Date(expense.id).toISOString().slice(0, 7);
      }

      return expense;
    });
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

function renderCategoryOptions() {
  const select = document.getElementById('item-category');

  if (!select) return;

  select.innerHTML = '<option value="">Pilih kategori</option>';

  categories.forEach(function(category) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function getFilteredExpenses() {
  if (currentFilter === 'all') {
    return expenses;
  }

  return expenses.filter(function(expense) {
    return expense.date === currentFilter;
  });
}

function getSortedExpenses() {
  const filteredExpenses = getFilteredExpenses();

  if (currentSort === 'amount-desc') {
    return filteredExpenses.slice().sort(function(a, b) {
      return b.amount - a.amount;
    });
  }

  if (currentSort === 'amount-asc') {
    return filteredExpenses.slice().sort(function(a, b) {
      return a.amount - b.amount;
    });
  }

  if (currentSort === 'category') {
    return filteredExpenses.slice().sort(function(a, b) {
      return a.category.localeCompare(b.category);
    });
  }

  return filteredExpenses;
}

function renderMonthFilter() {
  const select = document.getElementById('month-filter');

  if (!select) return;

  const months = [];

  expenses.forEach(function(expense) {
    if (expense.date && !months.includes(expense.date)) {
      months.push(expense.date);
    }
  });

  months.sort().reverse();

  select.innerHTML = '<option value="all">Semua Bulan</option>';

  months.forEach(function(month) {
    const option = document.createElement('option');

    option.value = month;

    const parts = month.split('-');
    const year = parts[0];
    const monthNumber = Number(parts[1]);

    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];

    option.textContent = monthNames[monthNumber - 1] + ' ' + year;

    select.appendChild(option);
  });

  select.value = currentFilter;
}

/**
 * Menghitung total pengeluaran dan memperbarui tampilan di DOM.
 * Total dihitung dari semua amount di array expenses menggunakan reduce.
 * @returns {void}
 */
function updateTotal() {
  const filteredExpenses = getFilteredExpenses();

  const total = filteredExpenses.reduce(function(sum, e) {
    return sum + e.amount;
  }, 0);

  document.getElementById('total-display').textContent = formatRupiah(total);
  updateLimitStatus();
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
  category: category,
  date: new Date().toISOString().slice(0, 7)
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

  const sortedExpenses = getSortedExpenses();

  if (sortedExpenses.length === 0) {
    list.innerHTML = '<li class="empty-state">Belum ada transaksi</li>';
    return;
  }

  sortedExpenses.forEach(function(expense, index) {
    const li = document.createElement('li');

    li.innerHTML =
      '<span class="transaction-name">' + expense.name + '</span>' +
      '<span class="transaction-amount">' + formatRupiah(expense.amount) + '</span>' +
      '<span class="transaction-category">' + expense.category + '</span>' +
      '<button class="btn-delete" data-id="' + expense.id + '">Hapus</button>';

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

  const chartTextColor = document.body.classList.contains('dark-mode')
    ? '#f3f4f6'
    : '#333';

  chart = new Chart(ctx, {
    type: 'pie',

    data: {
      labels: categories,
      datasets: [{
        data: categories.map(function() {
          return 0;
        }),
        backgroundColor: generateChartColors(categories.length)
      }]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: chartTextColor
          }
        }
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
function deleteExpense(id) {
  expenses = expenses.filter(function(expense) {
    return expense.id !== id;
  });

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
  const filteredExpenses = getFilteredExpenses();
  const totals = {};

  categories.forEach(function(category) {
    totals[category] = 0;
  });

  filteredExpenses.forEach(function(expense) {
    if (totals.hasOwnProperty(expense.category)) {
      totals[expense.category] += expense.amount;
    }
  });

  chart.data.labels = categories;
  chart.data.datasets[0].data = categories.map(function(category) {
    return totals[category];
  });

  chart.data.datasets[0].backgroundColor = generateChartColors(categories.length);

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
  categories = loadCategories();
  spendingLimit = loadSpendingLimit();

  const currentTheme = loadTheme();
  updateThemeButton(currentTheme);

  renderCategoryOptions();
  renderMonthFilter();

  function addCategory() {
  const input = document.getElementById('custom-category');
  const categoryName = input.value.trim();

  const errorElement = document.getElementById('error-custom-category');

  if (errorElement) {
    errorElement.textContent = '';
  }

  if (categoryName === '') {
    if (errorElement) {
      errorElement.textContent = 'Nama kategori wajib diisi';
    }
    return;
  }

  const categoryExists = categories.some(function(category) {
    return category.toLowerCase() === categoryName.toLowerCase();
  });

  if (categoryExists) {
    if (errorElement) {
      errorElement.textContent = 'Kategori tersebut sudah ada';
    }
    return;
  }

  categories.push(categoryName);
  saveCategories();
  renderCategoryOptions();

  document.getElementById('item-category').value = categoryName;
  input.value = '';

  if (errorElement) {
    errorElement.textContent = '';
  }

  updateChart();
}

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

  document.getElementById('btn-theme').addEventListener('click', function() {
  toggleTheme();
});

  document.getElementById('btn-add-category').addEventListener('click', function() {
  addCategory();
});

document.getElementById('btn-save-limit').addEventListener('click', function() {
  const input = document.getElementById('spending-limit');
  const value = Number(input.value);

  if (value < 0 || isNaN(value)) {
    return;
  }

  spendingLimit = value;
  saveSpendingLimit();
  updateLimitStatus();
  input.value = spendingLimit;
});

document.getElementById('month-filter').addEventListener('change', function() {
  currentFilter = this.value;
  renderTransactions();
  updateTotal();
  updateChart();
});

document.getElementById('sort-select').addEventListener('change', function() {
  currentSort = this.value;
  renderTransactions();
});

  // Event delegation untuk tombol "Hapus" di daftar transaksi
  document.getElementById('transaction-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
      const id = Number(e.target.getAttribute('data-id'));
      deleteExpense(id);
    }
  });
}

// Daftarkan init() untuk dijalankan setelah DOM selesai dimuat
document.addEventListener('DOMContentLoaded', init);

function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    return 'dark';
  }

  document.body.classList.remove('dark-mode');
  return 'light';
}

function updateThemeButton(theme) {
  const button = document.getElementById('btn-theme');

  if (!button) return;

  if (theme === 'dark') {
    button.textContent = '☀️ Light Mode';
  } else {
    button.textContent = '🌙 Dark Mode';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  const theme = isDark ? 'dark' : 'light';

  saveTheme(theme);
  updateThemeButton(theme);

  if (chart) {
    chart.options.plugins.legend.labels.color = isDark
      ? '#f3f4f6'
      : '#333';

    chart.update();
  }
}

function generateChartColors(count) {
  const colors = [];

  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 / count) * i);
    colors.push('hsl(' + hue + ', 70%, 60%)');
  }

  return colors;
}
