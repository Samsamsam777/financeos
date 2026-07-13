import { APP_VERSION } from "./constants.js";
import { animateLoanFills, animateNumber, bindPressFeedback, enterPage, haptic, showToast } from "./motion.js";
import { icons, loanIcon } from "./icons.js";
import { detectCategory, euro, loanProgress, today } from "./logic.js";
import {
  createBackup, loadData, makeId, resetData,
  restoreBackup, saveData
} from "./storage.js";
import { closeSheet, esc, field, showSheet } from "./ui.js";
import { createViews } from "./views.js";
import { initPWA, installState, requestInstall } from "./pwa.js";

let data = loadData();
let view = "dashboard";
const viewHistory = [];
let filters = { query: "", account: "", category: "", person: "", sort: "newest" };
let pwaState = installState();
const rootTabs = new Set(["dashboard", "transactions", "budgets", "more"]);
let shellInitialized = false;

const app = document.querySelector("#app");
const getData = () => data;
const category = id => data.categories.find(item => item.id === id);

const views = createViews({
  getData,
  navigate,
  openTransaction,
  openLoan,
  saveDashboard: () => saveData(data),
  getPWAState: () => pwaState
});

function navButton(id, label, icon) {
  return `
    <button data-nav="${id}" class="${view === id ? "active" : ""}">
      <span class="nav-icon">${icon}</span>${label}
    </button>
  `;
}

function initializeShell() {
  if (shellInitialized) return;

  app.innerHTML = `
    <div class="ambient-layer" aria-hidden="true"></div>
    <main class="app">
      <div class="topbar app-header">
        <div class="brand"><h1>FinanceOS</h1></div>
      </div>
      <div id="pageRoot" class="page-host"></div>
    </main>
    <nav class="nav" aria-label="Hauptnavigation">
      <div class="nav-inner">
        ${navButton("dashboard", "Heute", icons.home)}
        ${navButton("transactions", "Buchungen", icons.list)}
        <button class="plus" data-nav="add" aria-label="Neue Buchung">${icons.plus}</button>
        ${navButton("budgets", "Budgets", icons.budget)}
        ${navButton("more", "Mehr", icons.more)}
      </div>
    </nav>
  `;

  shellInitialized = true;
  bindNavigation();
  bindPressFeedback(document.querySelector(".nav"));
  bindHeaderBehavior();
}

function updateShellState() {
  document.querySelectorAll(".nav [data-nav]").forEach(button => {
    const target = button.dataset.nav;
    button.classList.toggle("active", target === view);
  });
}

function renderContent(content) {
  initializeShell();
  const pageRoot = document.querySelector("#pageRoot");
  pageRoot.innerHTML = content;
  updateShellState();

  enterPage(pageRoot);
  bindPressFeedback(pageRoot);
  pageRoot.querySelectorAll("[data-animate-number]").forEach(element => {
    animateNumber(element, Number(element.dataset.animateNumber), value => euro(value));
  });
  animateLoanFills();
}

function goBack() {
  const target = viewHistory.pop() ?? "dashboard";
  view = target;
  haptic("selection");
  document.documentElement.dataset.navigationDirection = "back";
  render();

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function navigate(target, options = {}) {
  if (view === target) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  const previous = view;
  if (!options.replace) viewHistory.push(previous);

  haptic("selection");
  view = target;

  const previousIndex = ["dashboard", "transactions", "budgets", "more"].indexOf(previous);
  const targetIndex = ["dashboard", "transactions", "budgets", "more"].indexOf(target);
  document.documentElement.dataset.navigationDirection =
    targetIndex >= previousIndex ? "forward" : "back";

  render();

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function render() {
  const content = {
    dashboard: views.dashboard,
    transactions: () => views.transactions(filters),
    add: views.addTransaction,
    pending: views.pending,
    budgets: views.budgets,
    loans: views.loans,
    more: views.more,
    manage: views.manage,
    "dashboard-settings": views.dashboardSettings,
    settings: views.settings,
    accounts: views.accounts,
    income: views.income,
    expenses: views.expenses
  }[view]?.() ?? views.more();

  renderContent(content);
  bindView();
}

function bindNavigation(root = document) {
  root.querySelectorAll("[data-nav]").forEach(button => {
    button.onclick = event => {
      const target = button.dataset.nav;
      if (target === "add") {
        event.preventDefault();
        openAddTransactionSheet();
        return;
      }
      navigate(target);
    };
  });

  root.querySelectorAll("[data-open-add]").forEach(button => {
    button.onclick = event => {
      event.preventDefault();
      openAddTransactionSheet();
    };
  });
}

function bindView() {
  document.querySelectorAll("[data-back]").forEach(button => {
    button.onclick = () => goBack();
  });
  bindNavigation(document.querySelector("#pageRoot"));
  document.querySelectorAll("[data-transaction]").forEach(row => {
    row.onclick = event => {
      if (event.target.closest("[data-edit]")) return;
      openTransaction(row.dataset.transaction);
    };
  });

  if (view === "dashboard") bindDashboard();
  if (["transactions","income","expenses"].includes(view)) bindTransactions();
  if (view === "add") bindAddTransaction();
  if (view === "pending") bindPending();
  if (view === "loans") bindLoans();
  if (view === "manage") bindManage();
  if (view === "dashboard-settings") bindDashboardSettings();
  if (view === "settings") bindSettings();

  document.querySelectorAll("[data-install-app]").forEach(button => {
    button.onclick = async () => {
      const result = await requestInstall({
        showIOSHelp: () => showInstallInstructions()
      });
      if (result.status === "accepted") showToast("FinanceOS wird installiert", "success");
      if (result.status === "unavailable") showInstallInstructions();
    };
  });
}

function bindDashboard() {
  document.querySelectorAll("[data-loan]").forEach(element => {
    element.onclick = event => {
      if (event.defaultPrevented) return;
      openLoan(element.dataset.loan);
    };
  });
}

function bindTransactions() {
  const ids = ["filterQuery", "filterAccount", "filterCategory", "filterPerson", "filterSort"];
  const available = ids.map(id => document.querySelector(`#${id}`)).filter(Boolean);

  if (available.length) {
    const update = () => {
      filters = {
        query: document.querySelector("#filterQuery")?.value ?? "",
        account: document.querySelector("#filterAccount")?.value ?? "",
        category: document.querySelector("#filterCategory")?.value ?? "",
        person: document.querySelector("#filterPerson")?.value ?? "",
        sort: document.querySelector("#filterSort")?.value ?? "newest"
      };
      render();
    };

    available.forEach(element => {
      element.onchange = update;
      if (element.id === "filterQuery") element.oninput = update;
    });
  }

  document.querySelectorAll("[data-edit]").forEach(button => {
    button.onclick = () => openTransaction(button.dataset.edit);
  });
}

function openAddTransactionSheet() {
  haptic("selection");
  showSheet(`<div class="entry-sheet">${views.addTransactionSheet()}</div>`);
  haptic("medium");
  bindAddTransaction();
  bindPressFeedback(document.querySelector("#modal"));
  setTimeout(() => document.querySelector('#transactionForm input[name="amount"]')?.focus(), 280);
}

function bindAddTransaction() {
  document.querySelector("#transactionForm").onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const description = form.get("description");
    const categoryId = form.get("categoryId") || detectCategory(data, description);
    data.transactions.push({
      id: makeId(),
      createdAt: Date.now(),
      date: form.get("date"),
      type: form.get("type"),
      amount: Number(form.get("amount")),
      description,
      accountId: form.get("accountId"),
      categoryId,
      person: form.get("person"),
      status: category(categoryId)?.name === "Später zuordnen" ? "pending" : "done"
    });
    saveData(data);
    haptic("success");
    showToast("Buchung gespeichert", "success");
    closeSheet();
    view = "dashboard";
    render();
  };
}

function bindPending() {
  document.querySelectorAll("[data-resolve]").forEach(button => {
    button.onclick = () => resolvePending(button.dataset.resolve);
  });
}

function bindLoans() {
  document.querySelectorAll("[data-loan]").forEach(element => {
    element.onclick = () => openLoan(element.dataset.loan);
  });
}

function bindManage() {
  document.querySelector("#addAccount").onclick = () => editAccount();
  document.querySelector("#addCategory").onclick = () => editCategory();
  document.querySelector("#addRule").onclick = () => editRule();

  document.querySelectorAll("[data-account]").forEach(button => {
    button.onclick = () => editAccount(button.dataset.account);
  });
  document.querySelectorAll("[data-category]").forEach(button => {
    button.onclick = () => editCategory(button.dataset.category);
  });
  document.querySelectorAll("[data-rule]").forEach(button => {
    button.onclick = () => editRule(button.dataset.rule);
  });
}

function bindDashboardSettings() {
  document.querySelector("#saveDashboard").onclick = () => {
    ["pending", "loans", "transactions"].forEach(key => {
      data.settings.dashboard[key].enabled =
        document.querySelector(`[data-enable="${key}"]`).checked;
      data.settings.dashboard[key].order =
        Number(document.querySelector(`[data-order="${key}"]`).value);
      const count = document.querySelector(`[data-count="${key}"]`);
      if (count) {
        const maximum = key === "loans" ? 3 : 20;
        data.settings.dashboard[key].count =
          Math.max(0, Math.min(maximum, Number(count.value) || 0));
      }
    });
    saveData(data);
    haptic("success");
    showToast("Dashboard aktualisiert", "success");
    navigate("dashboard");
  };
}

function bindSettings() {
  document.querySelector("#backupButton").onclick = () => createBackup(data);
  document.querySelector("#restoreInput").onchange = async event => {
    try {
      await restoreBackup(event.target.files[0]);
    } catch (error) {
      alert(error.message);
    }
  };
  document.querySelector("#resetButton").onclick = () => {
    if (confirm("Wirklich alle lokalen Daten zurücksetzen?")) resetData();
  };
}

function openTransaction(id) {
  const transaction = data.transactions.find(item => item.id === id);
  if (!transaction) return;

  showSheet(`
    <h2>Buchung bearbeiten</h2>
    <form id="editTransactionForm" class="form">
      ${field("Datum", `<input name="date" type="date" value="${transaction.date}">`)}
      ${field("Beschreibung", `<input name="description" value="${esc(transaction.description)}">`)}
      ${field("Betrag", `<input name="amount" type="number" step="0.01" value="${transaction.amount}">`)}
      ${field("Konto", `<select name="accountId">${data.accounts.map(item => `<option value="${item.id}" ${item.id === transaction.accountId ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
      ${field("Kategorie", `<select name="categoryId">${data.categories.map(item => `<option value="${item.id}" ${item.id === transaction.categoryId ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
      ${field("Person", `<select name="person">${data.settings.people.map(item => `<option ${item === transaction.person ? "selected" : ""}>${esc(item)}</option>`).join("")}</select>`)}
      <button class="btn primary">Speichern</button>
      <button type="button" class="btn danger ghost" id="deleteTransaction">Löschen</button>
    </form>
  `);

  document.querySelector("#editTransactionForm").onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    Object.assign(transaction, {
      date: form.get("date"),
      description: form.get("description"),
      amount: Number(form.get("amount")),
      accountId: form.get("accountId"),
      categoryId: form.get("categoryId"),
      person: form.get("person"),
      status: category(form.get("categoryId"))?.name === "Später zuordnen" ? "pending" : "done"
    });
    saveData(data);
    haptic("success");
    showToast("Änderungen gespeichert", "success");
    closeSheet();
    render();
  };

  document.querySelector("#deleteTransaction").onclick = () => {
    if (!confirm("Buchung löschen?")) return;
    data.transactions = data.transactions.filter(item => item.id !== id);
    saveData(data);
    haptic("warning");
    showToast("Buchung gelöscht", "warning");
    closeSheet();
    render();
  };
}

function resolvePending(id) {
  const transaction = data.transactions.find(item => item.id === id);
  if (!transaction) return;

  showSheet(`
    <h2>Zuordnen</h2>
    <div class="meta">${esc(transaction.description)} · ${euro(transaction.amount)}</div>
    <form id="resolveForm" class="form">
      ${field("Kategorie", `<select name="categoryId">${data.categories.filter(item => item.name !== "Später zuordnen").map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join("")}</select>`)}
      ${field("Person", `<select name="person">${data.settings.people.map(item => `<option ${item === transaction.person ? "selected" : ""}>${esc(item)}</option>`).join("")}</select>`)}
      <label class="meta"><input type="checkbox" name="learn" checked> Für zukünftige Buchungen merken</label>
      <button class="btn primary">Speichern</button>
    </form>
  `);

  document.querySelector("#resolveForm").onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    transaction.categoryId = form.get("categoryId");
    transaction.person = form.get("person");
    transaction.status = "done";
    if (form.get("learn")) {
      data.rules.push({
        id: makeId(),
        needle: transaction.description.toUpperCase(),
        categoryId: transaction.categoryId
      });
    }
    saveData(data);
    haptic("success");
    showToast("Zuordnung gespeichert", "success");
    closeSheet();
    render();
  };
}

function openLoan(id) {
  showLoanQuickView(id);
}

function showLoanQuickView(id) {
  const loan = data.loans.find(item => item.id === id);
  if (!loan) return;
  const { paid, percent } = loanProgress(loan);

  showSheet(`
    <div style="display:flex;align-items:center;gap:10px">
      <div class="loan-icon">${loanIcon(loan.type)}</div>
      <h2>${esc(loan.name)}</h2>
    </div>
    <div class="card page-list">
      <div class="page-row"><span class="meta">Ursprünglicher Betrag</span><strong>${euro(loan.principal)}</strong></div>
      <div class="page-row"><span class="meta">Restschuld</span><strong>${euro(loan.remaining)}</strong></div>
      <div class="page-row"><span class="meta">Abbezahlt</span><strong>${euro(paid)}</strong></div>
      <div class="page-row"><span class="meta">Getilgt</span><strong>${Math.round(percent)} %</strong></div>
      <div class="page-row"><span class="meta">Monatliche Rate</span><strong>${euro(loan.rate)}</strong></div>
      <div class="page-row"><span class="meta">Zinssatz</span><strong>${loan.interest} %</strong></div>
    </div>
  `);
}

function editAccount(id) {
  const account = id
    ? data.accounts.find(item => item.id === id)
    : { id: makeId(), name: "", type: "Girokonto", start: 0 };

  showSheet(`
    <h2>${id ? "Konto bearbeiten" : "Konto hinzufügen"}</h2>
    <form id="accountForm" class="form">
      ${field("Name", `<input name="name" value="${esc(account.name)}" required>`)}
      ${field("Typ", `<input name="type" value="${esc(account.type)}">`)}
      ${field("Startsaldo", `<input name="start" type="number" step="0.01" value="${account.start}">`)}
      <button class="btn primary">Speichern</button>
      ${id ? '<button type="button" class="btn danger ghost" id="deleteItem">Löschen</button>' : ""}
    </form>
  `);

  document.querySelector("#accountForm").onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    Object.assign(account, {
      name: form.get("name"),
      type: form.get("type"),
      start: Number(form.get("start"))
    });
    if (!id) data.accounts.push(account);
    saveData(data);
    closeSheet();
    render();
  };

  if (id) document.querySelector("#deleteItem").onclick = () => {
    if (data.transactions.some(item => item.accountId === id)) {
      alert("Dieses Konto wird noch von Buchungen verwendet.");
      return;
    }
    data.accounts = data.accounts.filter(item => item.id !== id);
    saveData(data);
    closeSheet();
    render();
  };
}

function editCategory(id) {
  const item = id
    ? data.categories.find(category => category.id === id)
    : { id: makeId(), name: "", budget: 0 };

  showSheet(`
    <h2>${id ? "Kategorie bearbeiten" : "Kategorie hinzufügen"}</h2>
    <form id="categoryForm" class="form">
      ${field("Name", `<input name="name" value="${esc(item.name)}" required>`)}
      ${field("Monatsbudget", `<input name="budget" type="number" step="0.01" value="${item.budget}">`)}
      <button class="btn primary">Speichern</button>
      ${id ? '<button type="button" class="btn danger ghost" id="deleteItem">Löschen</button>' : ""}
    </form>
  `);

  document.querySelector("#categoryForm").onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    item.name = form.get("name");
    item.budget = Number(form.get("budget"));
    if (!id) data.categories.push(item);
    saveData(data);
    closeSheet();
    render();
  };

  if (id) document.querySelector("#deleteItem").onclick = () => {
    if (data.transactions.some(transaction => transaction.categoryId === id) ||
        data.rules.some(rule => rule.categoryId === id)) {
      alert("Diese Kategorie wird noch verwendet.");
      return;
    }
    data.categories = data.categories.filter(category => category.id !== id);
    saveData(data);
    closeSheet();
    render();
  };
}

function editRule(id) {
  const rule = id
    ? data.rules.find(item => item.id === id)
    : { id: makeId(), needle: "", categoryId: data.categories[0]?.id };

  showSheet(`
    <h2>${id ? "Regel bearbeiten" : "Regel hinzufügen"}</h2>
    <form id="ruleForm" class="form">
      ${field("Suchbegriff", `<input name="needle" value="${esc(rule.needle)}" required>`)}
      ${field("Kategorie", `<select name="categoryId">${data.categories.map(item => `<option value="${item.id}" ${item.id === rule.categoryId ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
      <button class="btn primary">Speichern</button>
      ${id ? '<button type="button" class="btn danger ghost" id="deleteItem">Löschen</button>' : ""}
    </form>
  `);

  document.querySelector("#ruleForm").onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    rule.needle = form.get("needle");
    rule.categoryId = form.get("categoryId");
    if (!id) data.rules.push(rule);
    saveData(data);
    closeSheet();
    render();
  };

  if (id) document.querySelector("#deleteItem").onclick = () => {
    data.rules = data.rules.filter(item => item.id !== id);
    saveData(data);
    closeSheet();
    render();
  };
}



function showInstallInstructions() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const content = ios
    ? `
      <div class="install-guide">
        <div class="install-app-icon"><img src="./assets/icons/icon-192.png" alt=""></div>
        <h2>FinanceOS installieren</h2>
        <p>Tippe in Safari unten auf <strong>Teilen</strong> und wähle anschließend <strong>Zum Home-Bildschirm</strong>.</p>
        <div class="install-steps">
          <span>1</span><p>Safari-Menü „Teilen“ öffnen</p>
          <span>2</span><p>„Zum Home-Bildschirm“ auswählen</p>
          <span>3</span><p>Mit „Hinzufügen“ bestätigen</p>
        </div>
      </div>`
    : `
      <div class="install-guide">
        <div class="install-app-icon"><img src="./assets/icons/icon-192.png" alt=""></div>
        <h2>FinanceOS installieren</h2>
        <p>Öffne das Browsermenü und wähle <strong>App installieren</strong> oder <strong>Zum Startbildschirm hinzufügen</strong>.</p>
      </div>`;

  showSheet(content);
}

function bindHeaderBehavior() {
  const header = document.querySelector(".app-header");
  if (!header || header.dataset.scrollBound === "true") return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  header.dataset.scrollBound = "true";
  window.addEventListener("scroll", update, { passive: true });
  update();
}

pwaState = initPWA({
  onStateChange: state => {
    pwaState = state;
    if (view === "more") render();
  }
});

render();

const launchAction = new URLSearchParams(location.search).get("action");
if (launchAction === "add") {
  history.replaceState({}, "", location.pathname);
  setTimeout(() => openAddTransactionSheet(), 180);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(error => {
    console.warn("Service worker registration failed", error);
  });
}
