import { APP_VERSION } from "./constants.js";
import { animateLoanFills, animateNumber, bindPressFeedback, enterPage, haptic, showToast } from "./motion.js";
import { icons, loanIcon } from "./icons.js";
import { detectCategory, euro, loanProgress, matchCategoryRule, normalizeMerchant, today, upsertMerchantRule } from "./logic.js";
import {
  createBackup, loadData, makeId, resetData,
  restoreBackup, saveData
} from "./storage.js";
import { closeSheet, esc, field, showSheet } from "./ui.js";
import { createViews } from "./views.js";
import { buildImportPreview, detectColumns, parseCSV } from "./import.js";
import { clearPDFResources, extractPDFLines, parseStatementPages } from "./pdf-import.js";
import { consumeSharedPDF } from "./share-target.js";
import { initPWA, installState, requestInstall } from "./pwa.js";

let data = loadData();
let view = "dashboard";
const viewHistory = [];
let filters = { query: "", account: "", category: "", person: "", sort: "newest" };
let pwaState = installState();
let selectedAccountId = null;
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
    import: views.importTransactions,
    "pdf-import": views.importStatement,
    manage: views.manage,
    "dashboard-settings": views.dashboardSettings,
    settings: views.settings,
    accounts: views.accounts,
    "account-detail": () => views.accountDetail(selectedAccountId),
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
  if (view === "accounts") bindAccounts();
  if (view === "import") bindImport();
  if (view === "pdf-import") bindPDFImport();

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

let activePDFFile = null;
let activePDFItems = [];

function bindPDFImport() {
  const input = document.querySelector("#pdfImportInput");
  if (!input) return;

  input.onchange = async event => {
    const file = event.target.files?.[0];
    if (file) await processPDFStatement(file);
  };
}

async function processPDFStatement(file) {
  const workspace = document.querySelector("#pdfImportWorkspace");
  const accountId = document.querySelector("#pdfImportAccount")?.value ?? data.accounts[0]?.id;
  if (!workspace || !accountId) return;

  activePDFFile = file;
  workspace.innerHTML = `
    <div class="card pdf-processing">
      <span class="pdf-spinner" aria-hidden="true"></span>
      <div><strong>Kontoauszug wird analysiert</strong><p>Text und Buchungszeilen werden lokal verarbeitet.</p></div>
    </div>
  `;

  try {
    const pages = await extractPDFLines(file);
    activePDFItems = parseStatementPages({
      pages,
      accountId,
      data,
      makeId
    });

    pages.forEach(page => page.lines.splice(0));
    pages.splice(0);

    renderPDFPreview(activePDFItems, file.name);
  } catch (error) {
    console.error(error);
    haptic("error");
    workspace.innerHTML = `
      <div class="card empty-state">
        <strong>PDF konnte nicht gelesen werden</strong>
        <p>Manche Kontoauszüge enthalten nur Bilder oder ein unbekanntes Tabellenformat. Ein OCR-Import folgt als nächster Schritt.</p>
      </div>
    `;
  } finally {
    await clearPDFResources(file);
    activePDFFile = null;
    const input = document.querySelector("#pdfImportInput");
    if (input) input.value = "";
  }
}

function renderPDFPreview(items, fileName) {
  const workspace = document.querySelector("#pdfImportWorkspace");
  if (!workspace) return;

  const duplicates = items.filter(item => item.duplicate);
  const pending = items.filter(item => item.status === "pending" && !item.duplicate);
  const selected = items.filter(item => item.selected);

  workspace.innerHTML = `
    <div class="import-summary-grid">
      <div class="card"><span>Neue Buchungen</span><strong>${selected.length}</strong></div>
      <div class="card"><span>Zu prüfen</span><strong>${pending.length}</strong></div>
      <div class="card"><span>Duplikate</span><strong>${duplicates.length}</strong></div>
    </div>

    <div class="card import-preview-card">
      <div class="import-file-summary">
        <strong>${esc(fileName)}</strong>
        <span>${items.length} Buchungen erkannt</span>
      </div>

      <div class="import-preview-list">
        ${items.length ? items.map(item => `
          <label class="import-preview-row ${item.duplicate ? "is-muted" : ""}">
            <input type="checkbox" data-pdf-select="${item.id}" ${item.selected ? "checked" : ""} ${item.duplicate ? "disabled" : ""}>
            <span class="import-preview-copy">
              <strong>${esc(item.description)}</strong>
              <small>${esc(item.date)} · ${esc(category(item.categoryId)?.name ?? "Zu prüfen")}</small>
            </span>
            <span class="import-preview-amount ${item.type === "income" ? "positive" : "negative"}">
              ${item.type === "income" ? "+" : "-"}${euro(item.amount)}
            </span>
          </label>
        `).join("") : `
          <div class="empty-state">
            <strong>Keine Buchungszeilen erkannt</strong>
            <p>Der Kontoauszug verwendet möglicherweise ein bildbasiertes oder noch nicht unterstütztes Layout.</p>
          </div>
        `}
      </div>

      ${items.length ? '<button class="btn primary" id="confirmPDFImport">Ausgewählte Buchungen importieren</button>' : ""}
    </div>
  `;

  document.querySelector("#confirmPDFImport")?.addEventListener("click", async () => {
    const selectedIds = new Set(
      [...document.querySelectorAll("[data-pdf-select]:checked")]
        .map(input => input.dataset.pdfSelect)
    );

    const selectedItems = activePDFItems.filter(item =>
      selectedIds.has(item.id) && !item.duplicate
    );

    if (!selectedItems.length) {
      showToast("Keine Buchungen ausgewählt", "warning");
      return;
    }

    data.transactions.push(...selectedItems.map(({ duplicate, selected, recognized, pageNumber, ...item }) => item));
    saveData(data);

    activePDFItems.splice(0);
    activePDFItems = [];
    document.querySelector("#pdfImportWorkspace").replaceChildren();

    haptic("success");
    showToast(`${selectedItems.length} Buchungen importiert`, "success");
    navigate("transactions");
  });
}

async function openSharedPDFIfPresent() {
  if (!new URLSearchParams(location.search).has("shared-pdf")) return;
  history.replaceState({}, "", location.pathname);
  const file = await consumeSharedPDF();
  if (!file) return;

  view = "pdf-import";
  render();
  requestAnimationFrame(() => processPDFStatement(file));
}

function bindImport() {
  const fileInput = document.querySelector("#csvImportInput");
  if (!fileInput) return;

  fileInput.onchange = async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      const columns = detectColumns(parsed.headers);
      renderImportSetup(parsed, columns, file.name);
    } catch (error) {
      haptic("error");
      showToast(error.message || "CSV-Datei konnte nicht gelesen werden", "error");
    }
  };
}

function renderImportSetup(parsed, detectedColumns, fileName) {
  const workspace = document.querySelector("#importWorkspace");
  if (!workspace) return;

  const columnOptions = (selected, allowEmpty = false) => `
    ${allowEmpty ? '<option value="">Nicht vorhanden</option>' : ""}
    ${parsed.headers.map(header => `
      <option value="${esc(header)}" ${header === selected ? "selected" : ""}>${esc(header)}</option>
    `).join("")}
  `;

  workspace.innerHTML = `
    <div class="card import-setup-card">
      <div class="import-file-summary">
        <strong>${esc(fileName)}</strong>
        <span>${parsed.rows.length} Zeilen erkannt</span>
      </div>

      <div class="form">
        ${field("Zielkonto", `
          <select id="importAccount">
            ${data.accounts.map(account => `<option value="${account.id}">${esc(account.name)}</option>`).join("")}
          </select>
        `)}

        <div class="grid two">
          ${field("Datum", `<select id="importDateColumn">${columnOptions(detectedColumns.date)}</select>`)}
          ${field("Beschreibung", `<select id="importDescriptionColumn">${columnOptions(detectedColumns.description)}</select>`)}
          ${field("Betrag", `<select id="importAmountColumn">${columnOptions(detectedColumns.amount, true)}</select>`)}
          ${field("Soll", `<select id="importDebitColumn">${columnOptions(detectedColumns.debit, true)}</select>`)}
          ${field("Haben", `<select id="importCreditColumn">${columnOptions(detectedColumns.credit, true)}</select>`)}
          ${field("Typ", `<select id="importTypeColumn">${columnOptions(detectedColumns.type, true)}</select>`)}
        </div>

        <button class="btn primary" id="buildImportPreview">Vorschau erstellen</button>
      </div>
    </div>
  `;

  document.querySelector("#buildImportPreview").onclick = () => {
    const columns = {
      date: document.querySelector("#importDateColumn").value,
      description: document.querySelector("#importDescriptionColumn").value,
      amount: document.querySelector("#importAmountColumn").value,
      debit: document.querySelector("#importDebitColumn").value,
      credit: document.querySelector("#importCreditColumn").value,
      type: document.querySelector("#importTypeColumn").value
    };

    const preview = buildImportPreview({
      parsed,
      columns,
      accountId: document.querySelector("#importAccount").value,
      data,
      makeId
    });

    renderImportPreview(preview);
  };
}

function renderImportPreview(items) {
  const workspace = document.querySelector("#importWorkspace");
  if (!workspace) return;

  const valid = items.filter(item => item.valid);
  const duplicates = valid.filter(item => item.duplicate);
  const unresolved = valid.filter(item => item.status === "pending" && !item.duplicate);
  const selected = valid.filter(item => item.selected);

  const rows = items.slice(0, 80).map(item => {
    const categoryName = category(item.categoryId)?.name ?? "Nicht erkannt";
    const state = !item.valid
      ? "Ungültig"
      : item.duplicate
        ? "Duplikat"
        : item.status === "pending"
          ? "Zu prüfen"
          : categoryName;

    return `
      <label class="import-preview-row ${!item.valid || item.duplicate ? "is-muted" : ""}">
        <input type="checkbox" data-import-select="${item.id}" ${item.selected ? "checked" : ""} ${!item.valid || item.duplicate ? "disabled" : ""}>
        <span class="import-preview-copy">
          <strong>${esc(item.description)}</strong>
          <small>${esc(item.date || "Kein Datum")} · ${esc(state)}</small>
        </span>
        <span class="import-preview-amount ${item.type === "income" ? "positive" : "negative"}">
          ${item.type === "income" ? "+" : "-"}${euro(item.amount)}
        </span>
      </label>
    `;
  }).join("");

  workspace.innerHTML = `
    <div class="import-summary-grid">
      <div class="card"><span>Neue Buchungen</span><strong>${selected.length}</strong></div>
      <div class="card"><span>Zu prüfen</span><strong>${unresolved.length}</strong></div>
      <div class="card"><span>Duplikate</span><strong>${duplicates.length}</strong></div>
    </div>

    <div class="card import-preview-card">
      <div class="section-title import-preview-title">
        <h2 class="section-heading">Vorschau</h2>
        <span class="section-context">${items.length}</span>
      </div>
      <div class="import-preview-list">${rows}</div>
      ${items.length > 80 ? `<div class="notice">Es werden die ersten 80 Zeilen angezeigt. Importiert werden alle ausgewählten Buchungen.</div>` : ""}
      <button class="btn primary" id="confirmImport">Ausgewählte Buchungen importieren</button>
    </div>
  `;

  document.querySelector("#confirmImport").onclick = () => {
    const selectedIds = new Set(
      [...document.querySelectorAll("[data-import-select]:checked")]
        .map(input => input.dataset.importSelect)
    );

    const toImport = items.filter(item =>
      item.valid && !item.duplicate &&
      (selectedIds.has(item.id) || (items.length > 80 && item.selected))
    );

    if (!toImport.length) {
      showToast("Keine Buchungen ausgewählt", "warning");
      return;
    }

    data.transactions.push(...toImport.map(({ duplicate, valid, selected, recognition, rowNumber, ...transaction }) => transaction));
    saveData(data);
    haptic("success");
    showToast(`${toImport.length} Buchungen importiert`, "success");
    navigate("transactions");
  };
}

function bindAccounts() {
  document.querySelectorAll("[data-account-open]").forEach(button => {
    button.onclick = () => {
      selectedAccountId = button.dataset.accountOpen;
      navigate("account-detail");
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
  const formElement = document.querySelector("#transactionForm");
  if (!formElement) return;
  const amountInput = formElement.elements.amount;
  const descriptionInput = formElement.elements.description;
  const categorySelect = formElement.elements.categoryId;
  const status = document.querySelector("#recognitionStatus");
  requestAnimationFrame(() => amountInput?.focus({ preventScroll: true }));

  const updateRecognition = () => {
    const description = String(descriptionInput?.value || "").trim();
    if (!description) {
      status.className = "recognition-status";
      status.innerHTML = '<span class="recognition-dot"></span><span>Händler und Kategorie werden automatisch erkannt.</span>';
      return;
    }
    const match = matchCategoryRule(data, description);
    const merchant = match.merchant.canonical || description;
    const matchedCategory = category(match.categoryId);
    if (match.matched && matchedCategory) {
      if (!categorySelect.value) categorySelect.value = match.categoryId;
      status.className = "recognition-status recognition-success";
      status.innerHTML = `<span class="recognition-dot"></span><span><strong>${esc(merchant)}</strong> erkannt · ${esc(matchedCategory.name)}</span>`;
    } else {
      status.className = "recognition-status recognition-pending";
      status.innerHTML = `<span class="recognition-dot"></span><span><strong>${esc(merchant)}</strong> erkannt · Kategorie auswählen</span>`;
    }
  };
  descriptionInput?.addEventListener("input", updateRecognition);
  categorySelect?.addEventListener("change", updateRecognition);

  formElement.onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const original = String(form.get("description") || "").trim();
    const merchant = normalizeMerchant(original);
    const categoryId = form.get("categoryId") || detectCategory(data, original);
    const transaction = {
      id: makeId(), createdAt: Date.now(), date: form.get("date"), type: form.get("type"),
      amount: Number(form.get("amount")), description: merchant.canonical || original,
      originalDescription: original, merchantKey: merchant.key, accountId: form.get("accountId"),
      categoryId, person: form.get("person"),
      status: category(categoryId)?.name === "Später zuordnen" ? "pending" : "done"
    };
    if (form.get("learnRule") && categoryId) upsertMerchantRule(data, original, categoryId, makeId);
    data.transactions.push(transaction);
    data.settings.entryPreferences = { accountId: transaction.accountId, person: transaction.person };
    saveData(data);
    haptic("success"); closeSheet(); view = "dashboard"; render();
    showToast("Buchung gespeichert", "success", { actionLabel: "Rückgängig", onAction: () => {
      data.transactions = data.transactions.filter(item => item.id !== transaction.id); saveData(data); render();
    }});
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
    const index = data.transactions.findIndex(item => item.id === id);
    if (index < 0) return;
    const removed = data.transactions[index];
    data.transactions.splice(index, 1);
    saveData(data);
    haptic("warning");
    closeSheet();
    render();
    showToast("Buchung gelöscht", "warning", {
      actionLabel: "Rückgängig",
      onAction: () => {
        data.transactions.splice(index, 0, removed);
        saveData(data);
        haptic("light");
        render();
      }
    });
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

window.addEventListener("offline", () => {
  document.documentElement.classList.add("is-offline");
  showToast("Offline verfügbar", "neutral", { duration: 2400 });
});
window.addEventListener("online", () => {
  document.documentElement.classList.remove("is-offline");
  showToast("Verbindung wiederhergestellt", "success", { duration: 2200 });
});
document.documentElement.classList.toggle("is-offline", !navigator.onLine);

try {
  render();
} catch (error) {
  console.error("FinanceOS start failed", error);
  app.innerHTML = `<div class="startup-error"><strong>FinanceOS konnte nicht gestartet werden.</strong><p>Bitte Seite neu laden. Deine lokalen Daten bleiben erhalten.</p><button onclick="location.reload()">Neu laden</button></div>`;
}

openSharedPDFIfPresent().catch(error => console.error(error));

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
