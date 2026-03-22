const STORAGE_KEYS = {
  users: "expense_users_v1",
  currentUser: "expense_current_user_v1",
  theme: "expense_theme_v1"
};

const CATEGORY_OPTIONS = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other Income"],
  expense: ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Education", "Other Expense"]
};

const COLORS = ["#37d649", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#eab308", "#ef4444"];

const state = {
  mode: "login",
  editingId: null,
  pendingDeleteAction: null,
  pieChart: null,
  lineChart: null,
  users: loadUsers(),
  currentUser: localStorage.getItem(STORAGE_KEYS.currentUser),
  filter: {
    search: "",
    type: "all",
    category: "all",
    month: "",
    sortBy: "date-desc"
  }
};

const refs = {
  authSection: document.getElementById("authSection"),
  authWindow: document.getElementById("authWindow"),
  dashboardSection: document.getElementById("dashboardSection"),
  showLoginBtn: document.getElementById("showLoginBtn"),
  showSignupBtn: document.getElementById("showSignupBtn"),
  loginForm: document.getElementById("loginForm"),
  signupForm: document.getElementById("signupForm"),
  loginUsername: document.getElementById("loginUsername"),
  loginPassword: document.getElementById("loginPassword"),
  signupUsername: document.getElementById("signupUsername"),
  signupPassword: document.getElementById("signupPassword"),
  loginMessage: document.getElementById("loginMessage"),
  signupMessage: document.getElementById("signupMessage"),
  welcomeText: document.getElementById("welcomeText"),
  logoutBtn: document.getElementById("logoutBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  budgetAlert: document.getElementById("budgetAlert"),
  alertText: document.getElementById("alertText"),
  balanceValue: document.getElementById("balanceValue"),
  incomeValue: document.getElementById("incomeValue"),
  expenseValue: document.getElementById("expenseValue"),
  savingsRateValue: document.getElementById("savingsRateValue"),
  transactionForm: document.getElementById("transactionForm"),
  transactionId: document.getElementById("transactionId"),
  formHeading: document.getElementById("formHeading"),
  type: document.getElementById("type"),
  amount: document.getElementById("amount"),
  category: document.getElementById("category"),
  date: document.getElementById("date"),
  description: document.getElementById("description"),
  saveBtn: document.getElementById("saveBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  formMessage: document.getElementById("formMessage"),
  budgetForm: document.getElementById("budgetForm"),
  budgetCategory: document.getElementById("budgetCategory"),
  budgetAmount: document.getElementById("budgetAmount"),
  budgetMessage: document.getElementById("budgetMessage"),
  budgetList: document.getElementById("budgetList"),
  transactionTable: document.getElementById("transactionTable"),
  searchInput: document.getElementById("searchInput"),
  filterType: document.getElementById("filterType"),
  filterCategory: document.getElementById("filterCategory"),
  filterDate: document.getElementById("filterDate"),
  sortBy: document.getElementById("sortBy"),
  exportPdfBtn: document.getElementById("exportPdfBtn"),
  pieChartCanvas: document.getElementById("pieChart"),
  lineChartCanvas: document.getElementById("lineChart"),
  deleteModal: document.getElementById("deleteModal"),
  deleteModalText: document.getElementById("deleteModalText"),
  confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
  cancelDeleteBtn: document.getElementById("cancelDeleteBtn")
};

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || {};
  } catch {
    return {};
  }
}

function persistUsers() {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(state.users));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(value) {
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function setAuthMode(mode) {
  state.mode = mode;
  refs.authWindow.classList.toggle("active", mode === "signup");
  refs.loginMessage.textContent = "";
  refs.signupMessage.textContent = "";
}

function openDeleteModal(type, id) {
  state.pendingDeleteAction = { type, id };
  refs.deleteModalText.textContent = `Are you sure you want to delete this ${type}? This action cannot be undone.`;
  refs.deleteModal.classList.add("active");
}

function closeDeleteModal() {
  refs.deleteModal.classList.remove("active");
  state.pendingDeleteAction = null;
}

function handleConfirmDelete() {
  if (!state.pendingDeleteAction) return;
  const data = getCurrentUserData();
  if (!data) return;

  const { type, id } = state.pendingDeleteAction;
  
  if (type === "transaction") {
    data.transactions = data.transactions.filter((item) => item.id !== id);
  } else if (type === "budget") {
    delete data.budgets[id];
  }
  
  closeDeleteModal();
  refreshAll();
}

function setCategoryOptions(type) {
  const options = CATEGORY_OPTIONS[type];
  refs.category.innerHTML = options.map((c) => `<option value="${c}">${c}</option>`).join("");
}

function setBudgetCategoryOptions() {
  const options = CATEGORY_OPTIONS.expense;
  refs.budgetCategory.innerHTML = [
    '<option value="overall">Overall Spending</option>',
    ...options.map((c) => `<option value="${c}">${c}</option>`)
  ].join("");

  refs.filterCategory.innerHTML = [
    '<option value="all">All Categories</option>',
    ...CATEGORY_OPTIONS.income.map((c) => `<option value="${c}">${c}</option>`),
    ...CATEGORY_OPTIONS.expense.map((c) => `<option value="${c}">${c}</option>`)
  ].join("");
}

function getDefaultUserData() {
  return {
    transactions: [],
    budgets: {},
    createdAt: new Date().toISOString()
  };
}

function getCurrentUserData() {
  if (!state.currentUser || !state.users[state.currentUser]) return null;
  return state.users[state.currentUser].data;
}

function ensureCurrentUserData() {
  if (!state.users[state.currentUser]) {
    state.users[state.currentUser] = {
      password: "",
      data: getDefaultUserData()
    };
  }

  if (!state.users[state.currentUser].data) {
    state.users[state.currentUser].data = getDefaultUserData();
  }
}

function showDashboard() {
  refs.authSection.classList.add("hidden");
  refs.dashboardSection.classList.remove("hidden");
  refs.welcomeText.textContent = `Welcome, ${state.currentUser}`;
  ensureCurrentUserData();
  refreshAll();
}

function showAuth() {
  refs.dashboardSection.classList.add("hidden");
  refs.authSection.classList.remove("hidden");
}

function getFilteredTransactions() {
  const data = getCurrentUserData();
  if (!data) return [];

  let rows = [...data.transactions];

  if (state.filter.search) {
    const needle = state.filter.search.toLowerCase();
    rows = rows.filter((t) => t.description.toLowerCase().includes(needle));
  }

  if (state.filter.type !== "all") {
    rows = rows.filter((t) => t.type === state.filter.type);
  }

  if (state.filter.category !== "all") {
    rows = rows.filter((t) => t.category === state.filter.category);
  }

  if (state.filter.month) {
    rows = rows.filter((t) => t.date.startsWith(state.filter.month));
  }

  switch (state.filter.sortBy) {
    case "date-asc":
      rows.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case "amount-asc":
      rows.sort((a, b) => a.amount - b.amount);
      break;
    case "amount-desc":
      rows.sort((a, b) => b.amount - a.amount);
      break;
    case "date-desc":
    default:
      rows.sort((a, b) => b.date.localeCompare(a.date));
      break;
  }

  return rows;
}

function computeSummary() {
  const data = getCurrentUserData();
  if (!data) {
    return {
      income: 0,
      expense: 0,
      balance: 0,
      savingsRate: 0
    };
  }

  const income = data.transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = data.transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : "0.0";

  return {
    income,
    expense,
    balance,
    savingsRate
  };
}

function renderSummary() {
  const summary = computeSummary();
  refs.balanceValue.textContent = formatCurrency(summary.balance);
  refs.incomeValue.textContent = formatCurrency(summary.income);
  refs.expenseValue.textContent = formatCurrency(summary.expense);
  refs.savingsRateValue.textContent = `${summary.savingsRate}%`;
}

function renderTransactions() {
  const rows = getFilteredTransactions();

  if (rows.length === 0) {
    refs.transactionTable.innerHTML = '<tr><td colspan="6" class="empty-state">No transactions match current filters.</td></tr>';
    return;
  }

  refs.transactionTable.innerHTML = rows
    .map(
      (t) => `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td><span class="type-pill ${t.type}">${t.type}</span></td>
        <td>${t.category}</td>
        <td>${escapeHtml(t.description)}</td>
        <td class="right amount ${t.type}">${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)}</td>
        <td class="right">
          <div class="action-wrap">
            <button class="action-btn" data-action="edit" data-id="${t.id}" type="button" title="Edit">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="action-btn" data-action="delete" data-id="${t.id}" type="button" title="Delete">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </td>
      </tr>
      `
    )
    .join("");
}

function getCategoryExpenseBreakdown() {
  const data = getCurrentUserData();
  if (!data) return {};

  return data.transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
}

function getMonthlyTrend() {
  const data = getCurrentUserData();
  if (!data) return { labels: [], values: [] };

  const map = data.transactions.reduce((acc, t) => {
    const key = t.date.slice(0, 7);
    acc[key] = acc[key] || { income: 0, expense: 0 };
    if (t.type === "income") acc[key].income += t.amount;
    if (t.type === "expense") acc[key].expense += t.amount;
    return acc;
  }, {});

  const labels = Object.keys(map).sort();
  const values = labels.map((label) => map[label].expense);

  return {
    labels: labels.map((l) => {
      const [year, month] = l.split("-");
      return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit"
      });
    }),
    values
  };
}

function renderCharts() {
  const breakdown = getCategoryExpenseBreakdown();
  const pieLabels = Object.keys(breakdown);
  const pieValues = Object.values(breakdown);

  const pieData = pieLabels.length
    ? {
        labels: pieLabels,
        datasets: [
          {
            data: pieValues,
            backgroundColor: pieLabels.map((_, i) => COLORS[i % COLORS.length]),
            borderWidth: 1
          }
        ]
      }
    : {
        labels: ["No expense data"],
        datasets: [{ data: [1], backgroundColor: ["#cbd5e1"] }]
      };

  if (state.pieChart) state.pieChart.destroy();
  state.pieChart = new Chart(refs.pieChartCanvas, {
    type: "pie",
    data: pieData,
    options: {
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  const trend = getMonthlyTrend();
  if (state.lineChart) state.lineChart.destroy();
  state.lineChart = new Chart(refs.lineChartCanvas, {
    type: "line",
    data: {
      labels: trend.labels.length ? trend.labels : ["No Data"],
      datasets: [
        {
          label: "Monthly Expense",
          data: trend.values.length ? trend.values : [0],
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          fill: true,
          tension: 0.34
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderBudgets() {
  const data = getCurrentUserData();
  if (!data) return;

  const entries = Object.entries(data.budgets);
  if (entries.length === 0) {
    refs.budgetList.innerHTML = '<li><span>No budgets set yet.</span></li>';
    return;
  }

  refs.budgetList.innerHTML = entries
    .map(
      ([category, amount]) => `
      <li>
        <span>${category}: ${formatCurrency(amount)}</span>
        <button class="budget-delete" data-budget-key="${category}" type="button" title="Delete budget">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </li>
      `
    )
    .join("");
}

function renderBudgetAlert() {
  const data = getCurrentUserData();
  if (!data) return;

  const expenses = data.transactions.filter((t) => t.type === "expense");
  const breakdown = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const alerts = [];

  Object.entries(data.budgets).forEach(([key, limit]) => {
    if (key === "overall") {
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
      if (limit > 0) {
        const ratio = (totalExpense / limit) * 100;
        if (ratio >= 100) alerts.push(`You exceeded your overall budget by ${formatCurrency(totalExpense - limit)}.`);
        else if (ratio >= 85) alerts.push(`You are close to exceeding your overall budget (${ratio.toFixed(1)}%).`);
      }
      return;
    }

    const spent = breakdown[key] || 0;
    if (limit > 0) {
      const ratio = (spent / limit) * 100;
      if (ratio >= 100) alerts.push(`You exceeded your ${key} budget by ${formatCurrency(spent - limit)}.`);
      else if (ratio >= 85) alerts.push(`You are close to exceeding your ${key} budget (${ratio.toFixed(1)}%).`);
    }
  });

  if (alerts.length === 0) {
    refs.budgetAlert.classList.add("hidden");
    refs.alertText.textContent = "";
    return;
  }

  refs.budgetAlert.classList.remove("hidden");
  refs.alertText.textContent = alerts.join(" ");
}

function resetTransactionForm() {
  refs.transactionForm.reset();
  refs.transactionId.value = "";
  refs.formHeading.textContent = "Add Transaction";
  refs.saveBtn.textContent = "Save Transaction";
  refs.cancelEditBtn.classList.add("hidden");
  state.editingId = null;
  refs.date.value = new Date().toISOString().slice(0, 10);
  setCategoryOptions(refs.type.value);
}

function refreshAll() {
  renderSummary();
  renderTransactions();
  renderBudgets();
  renderBudgetAlert();
  renderCharts();
  persistUsers();
}

function handleAuthSubmit(event, mode) {
  event.preventDefault();

  const isSignup = mode === "signup";
  const username = isSignup ? refs.signupUsername.value.trim() : refs.loginUsername.value.trim();
  const password = isSignup ? refs.signupPassword.value : refs.loginPassword.value;
  const messageRef = isSignup ? refs.signupMessage : refs.loginMessage;

  if (!username || !password) {
    messageRef.textContent = "Please enter valid credentials.";
    return;
  }

  if (isSignup) {
    if (state.users[username]) {
      messageRef.textContent = "Username already exists.";
      return;
    }

    state.users[username] = {
      password,
      data: getDefaultUserData()
    };

    state.currentUser = username;
    localStorage.setItem(STORAGE_KEYS.currentUser, username);
    messageRef.textContent = "Account created successfully.";
    persistUsers();
    showDashboard();
    return;
  }

  const user = state.users[username];
  if (!user || user.password !== password) {
    messageRef.textContent = "Invalid username or password.";
    return;
  }

  state.currentUser = username;
  localStorage.setItem(STORAGE_KEYS.currentUser, username);
  messageRef.textContent = "Login successful.";
  showDashboard();
}

function handleTransactionSubmit(event) {
  event.preventDefault();

  const data = getCurrentUserData();
  if (!data) return;

  const payload = {
    id: refs.transactionId.value || String(Date.now()),
    type: refs.type.value,
    amount: Number(refs.amount.value),
    category: refs.category.value,
    date: refs.date.value,
    description: refs.description.value.trim()
  };

  if (!payload.amount || payload.amount <= 0 || !payload.date || !payload.description) {
    refs.formMessage.textContent = "Please fill all fields with valid values.";
    return;
  }

  if (state.editingId) {
    data.transactions = data.transactions.map((t) => (t.id === state.editingId ? payload : t));
    refs.formMessage.textContent = "Transaction updated.";
  } else {
    data.transactions.push(payload);
    refs.formMessage.textContent = "Transaction added.";
  }

  resetTransactionForm();
  refreshAll();
}

function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  const data = getCurrentUserData();
  if (!data) return;

  const tx = data.transactions.find((item) => item.id === id);
  if (!tx) return;

  if (action === "delete") {
    openDeleteModal("transaction", id);
    return;
  }

  if (action === "edit") {
    state.editingId = id;
    refs.transactionId.value = tx.id;
    refs.type.value = tx.type;
    setCategoryOptions(tx.type);
    refs.amount.value = tx.amount;
    refs.category.value = tx.category;
    refs.date.value = tx.date;
    refs.description.value = tx.description;
    refs.formHeading.textContent = "Edit Transaction";
    refs.saveBtn.textContent = "Update Transaction";
    refs.cancelEditBtn.classList.remove("hidden");
    refs.formMessage.textContent = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function handleBudgetSubmit(event) {
  event.preventDefault();

  const data = getCurrentUserData();
  if (!data) return;

  const key = refs.budgetCategory.value;
  const amount = Number(refs.budgetAmount.value);
  if (amount < 0 || Number.isNaN(amount)) {
    refs.budgetMessage.textContent = "Budget amount must be a valid number.";
    return;
  }

  data.budgets[key] = amount;
  refs.budgetForm.reset();
  refs.budgetMessage.textContent = `Budget set for ${key}.`;
  refreshAll();
}

function handleBudgetListClick(event) {
  const button = event.target.closest("button[data-budget-key]");
  if (!button) return;

  const data = getCurrentUserData();
  if (!data) return;

  const key = button.dataset.budgetKey;
  openDeleteModal("budget", key);
}

function applyFilters() {
  state.filter.search = refs.searchInput.value.trim();
  state.filter.type = refs.filterType.value;
  state.filter.category = refs.filterCategory.value;
  state.filter.month = refs.filterDate.value;
  state.filter.sortBy = refs.sortBy.value;
  renderTransactions();
}

async function handleExportPdf() {
  const reportNode = document.getElementById("reportSection");
  if (!window.jspdf || !window.html2canvas) {
    alert("PDF libraries failed to load. Please check internet connection.");
    return;
  }

  const canvas = await window.html2canvas(reportNode, {
    scale: 2,
    backgroundColor: getComputedStyle(document.body).getPropertyValue("--surface") || "#ffffff"
  });

  const imageData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 10;
  let heightLeft = imgHeight;

  doc.addImage(imageData, "PNG", 10, y, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20;

  while (heightLeft > 0) {
    y = heightLeft - imgHeight + 10;
    doc.addPage();
    doc.addImage(imageData, "PNG", 10, y, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }

  doc.save(`expense-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function applyTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "light";
  document.body.classList.toggle("dark", savedTheme === "dark");
  refs.themeToggleBtn.innerHTML =
    savedTheme === "dark"
      ? '<span class="material-symbols-outlined">dark_mode</span>'
      : '<span class="material-symbols-outlined">light_mode</span>';
}

function toggleTheme() {
  const next = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem(STORAGE_KEYS.theme, next);
  applyTheme();
  renderCharts();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attachEvents() {
  refs.showLoginBtn.addEventListener("click", () => setAuthMode("login"));
  refs.showSignupBtn.addEventListener("click", () => setAuthMode("signup"));
  refs.loginForm.addEventListener("submit", (event) => handleAuthSubmit(event, "login"));
  refs.signupForm.addEventListener("submit", (event) => handleAuthSubmit(event, "signup"));

  refs.type.addEventListener("change", (event) => setCategoryOptions(event.target.value));
  refs.transactionForm.addEventListener("submit", handleTransactionSubmit);
  refs.cancelEditBtn.addEventListener("click", () => {
    resetTransactionForm();
    refs.formMessage.textContent = "Edit canceled.";
  });

  refs.transactionTable.addEventListener("click", handleTableClick);
  refs.budgetForm.addEventListener("submit", handleBudgetSubmit);
  refs.budgetList.addEventListener("click", handleBudgetListClick);

  refs.cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  refs.confirmDeleteBtn.addEventListener("click", handleConfirmDelete);

  refs.searchInput.addEventListener("input", applyFilters);
  refs.filterType.addEventListener("change", applyFilters);
  refs.filterCategory.addEventListener("change", applyFilters);
  refs.filterDate.addEventListener("change", applyFilters);
  refs.sortBy.addEventListener("change", applyFilters);

  refs.exportPdfBtn.addEventListener("click", handleExportPdf);

  refs.logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    state.currentUser = null;
    showAuth();
    setAuthMode("login");
  });

  refs.themeToggleBtn.addEventListener("click", toggleTheme);
}

function seedDemoDataIfEmpty() {
  const data = getCurrentUserData();
  if (!data || data.transactions.length > 0) return;

  const month = new Date();
  const y = month.getFullYear();
  const m = String(month.getMonth() + 1).padStart(2, "0");
  const prev = new Date(y, month.getMonth() - 1, 15);
  const prevYm = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

  data.transactions.push(
    { id: String(Date.now() + 1), type: "income", amount: 4200, category: "Salary", date: `${y}-${m}-01`, description: "Monthly Salary" },
    { id: String(Date.now() + 2), type: "expense", amount: 650, category: "Bills", date: `${y}-${m}-03`, description: "Rent and Utilities" },
    { id: String(Date.now() + 3), type: "expense", amount: 280, category: "Food", date: `${y}-${m}-07`, description: "Groceries and meals" },
    { id: String(Date.now() + 4), type: "expense", amount: 120, category: "Travel", date: `${y}-${m}-09`, description: "Fuel and transport" },
    { id: String(Date.now() + 5), type: "expense", amount: 210, category: "Shopping", date: `${prevYm}-18`, description: "Clothes and essentials" },
    { id: String(Date.now() + 6), type: "income", amount: 800, category: "Freelance", date: `${prevYm}-22`, description: "Client side project" }
  );

  data.budgets = {
    overall: 1500,
    Food: 350,
    Travel: 200
  };
}

function init() {
  applyTheme();
  setBudgetCategoryOptions();
  setCategoryOptions("income");
  refs.date.value = new Date().toISOString().slice(0, 10);
  attachEvents();

  if (state.currentUser && state.users[state.currentUser]) {
    seedDemoDataIfEmpty();
    showDashboard();
  } else {
    showAuth();
    setAuthMode("login");
  }
}

window.addEventListener("DOMContentLoaded", init);
