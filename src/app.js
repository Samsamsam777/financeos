import { APP_VERSION } from "./constants.js";
import { animateLoanFills, animateNumber, bindPressFeedback, enterPage, haptic, showToast } from "./motion.js";
import { icons, loanIcon } from "./icons.js";
import { detectCategory, euro, loanProgress, matchCategoryRule, normalizeMerchant, sortNewest, today, upsertMerchantRule } from "./logic.js";
import {
  createBackup, loadData, makeId, resetData,
  restoreBackup, saveData
} from "./storage.js";
import { closeSheet, esc, field, showSheet } from "./ui.js";
import { createViews } from "./views.js";
import { buildImportPreview, detectColumns, parseCSV } from "./import.js";
import { clearPDFResources, extractPDFLines } from "./pdf-import.js";
import { parseWithRegistry } from "./pdf-parsers.js";
import { consumeSharedPDF } from "./share-target.js";
import { buildScreenshotTransactions, recognizeBankingScreenshot } from "./screenshot-import.js";
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
    "screenshot-import": views.importScreenshot,
    "import-review": views.importReview,
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
  if (view === "screenshot-import") bindScreenshotImport();
  if (view === "import-review") bindImportReviewPage();

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

let activeScreenshotItems = [];

function bindScreenshotImport() {
  const input = document.querySelector("#screenshotImportInput");
  if (!input) return;

  input.onchange = async event => {
    const file = event.target.files?.[0];
    if (file) await processBankingScreenshot(file);
  };
}

async function processBankingScreenshot(file) {
  const workspace = document.querySelector("#screenshotImportWorkspace");
  const accountId = document.querySelector("#screenshotImportAccount")?.value ?? data.accounts[0]?.id;
  if (!workspace || !accountId) return;

  workspace.innerHTML = `
    <div class="card screenshot-processing">
      <span class="pdf-spinner" aria-hidden="true"></span>
      <div>
        <strong>Screenshot wird gelesen</strong>
        <p id="screenshotOCRStatus">OCR wird vorbereitet · 0 %</p>
        <div class="ocr-progress"><span id="screenshotOCRProgress"></span></div>
      </div>
    </div>
  `;

  try {
    const recognition = await recognizeBankingScreenshot(file, message => {
      const percent = Math.max(0, Math.min(100, Math.round(message.progress * 100)));
      const status = document.querySelector("#screenshotOCRStatus");
      const progress = document.querySelector("#screenshotOCRProgress");
      if (status) status.textContent = `Text wird erkannt · ${percent} %`;
      if (progress) progress.style.width = `${percent}%`;
    });

    activeScreenshotItems = buildScreenshotTransactions({
      recognition,
      accountId,
      data,
      makeId
    });

    renderScreenshotPreview(activeScreenshotItems, file.name);
  } catch (error) {
    console.error(error);
    haptic("error");
    workspace.innerHTML = `
      <div class="card empty-state">
        <strong>Screenshot konnte nicht gelesen werden</strong>
        <p>Verwende einen scharfen Screenshot mit gut sichtbaren Händlern, Daten und Beträgen.</p>
        <details class="pdf-error-details">
          <summary>Technische Details</summary>
          <code>${esc(error?.message ?? String(error))}</code>
        </details>
      </div>
    `;
  } finally {
    const input = document.querySelector("#screenshotImportInput");
    if (input) input.value = "";
  }
}

function renderScreenshotPreview(items, fileName) {
  const workspace = document.querySelector("#screenshotImportWorkspace");
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
            <input type="checkbox" data-screenshot-select="${item.id}" ${item.selected ? "checked" : ""} ${item.duplicate ? "disabled" : ""}>
            <span class="import-preview-copy">
              <strong>${esc(item.description)}</strong>
              <small>${esc(item.date)} · ${esc(category(item.categoryId)?.name ?? "Zu prüfen")} · ${item.recognitionConfidence} %</small>
            </span>
            <span class="import-preview-amount ${item.type === "income" ? "positive" : "negative"}">
              ${item.type === "income" ? "+" : "-"}${euro(item.amount)}
            </span>
          </label>
        `).join("") : `
          <div class="empty-state">
            <strong>Keine Buchungen erkannt</strong>
            <p>Der Screenshot muss Händler, Buchungsdatum und Betrag gleichzeitig zeigen.</p>
          </div>
        `}
      </div>

      ${items.length ? '<button class="btn primary" id="confirmScreenshotImport">Ausgewählte Buchungen zur Prüfung übernehmen</button>' : ""}
    </div>
  `;

  document.querySelector("#confirmScreenshotImport")?.addEventListener("click", () => {
    const selectedIds = new Set(
      [...document.querySelectorAll("[data-screenshot-select]:checked")]
        .map(input => input.dataset.screenshotSelect)
    );

    const selectedItems = activeScreenshotItems.filter(item =>
      selectedIds.has(item.id) && !item.duplicate
    );

    if (!selectedItems.length) {
      showToast("Keine Buchungen ausgewählt", "warning");
      return;
    }

    enqueueImportDrafts(selectedItems.map(({ duplicate, selected, recognitionConfidence, ...transaction }) => transaction), {
      source: "screenshot",
      sourceLabel: `Screenshot · ${fileName}`
    });

    activeScreenshotItems.splice(0);
    activeScreenshotItems = [];
    document.querySelector("#screenshotImportWorkspace")?.replaceChildren();

    haptic("success");
    showToast(`${selectedItems.length} Buchungen zur Prüfung übernommen`, "success");
    navigate("transactions");
  });
}

let activePDFFile = null;
let activePDFItems = [];

function enqueueImportDrafts(items, meta = {}) {
  const drafts = items.map(item => ({
    ...item,
    id: item.id ?? makeId(),
    createdAt: item.createdAt ?? Date.now(),
    source: meta.source ?? item.source ?? "import",
    sourceLabel: meta.sourceLabel ?? item.sourceLabel ?? meta.fileName ?? "Import",
    batchId: meta.batchId ?? makeId(),
    reviewState: item.status === "pending" ? "needs_attention" : "ready",
    originalStatus: item.status ?? "done"
  }));
  data.importDrafts ??= [];
  data.importDrafts.push(...drafts);
  saveData(data);
  return drafts;
}

function swapSheet(content, binder) {
  closeSheet();
  setTimeout(() => {
    showSheet(content);
    binder?.();
    bindPressFeedback(document.querySelector("#modal"));
  }, 120);
}

function openCreateHubSheet() {
  haptic("selection");
  showSheet(`
    <div class="create-hub-sheet">
      <div class="sheet-heading create-hub-heading">
        <span class="sheet-icon">${icons.plus}</span>
        <div><h2>Schnellzugriff</h2><p>Kompakt, ohne Scrollen und mit klaren Wegen für Erfassung und Import.</p></div>
      </div>
      <div class="create-hub-grid">
        <button class="create-hub-tile" data-create-action="transaction">
          <span class="create-hub-tile-icon">${icons.plus}</span>
          <strong>Neue Buchung</strong>
          <small>Manuell erfassen</small>
        </button>
        <button class="create-hub-tile" data-create-action="image">
          <span class="create-hub-tile-icon">${icons.image}</span>
          <strong>Bild hochladen</strong>
          <small>Screenshot oder Beleg</small>
        </button>
        <button class="create-hub-tile" data-create-action="pdf">
          <span class="create-hub-tile-icon">${icons.document}</span>
          <strong>Kontoauszug</strong>
          <small>PDF importieren</small>
        </button>
        <button class="create-hub-tile" data-create-action="qr">
          <span class="create-hub-tile-icon">${icons.scan}</span>
          <strong>QR-Code scannen</strong>
          <small>GiroCode & mehr</small>
        </button>
        <button class="create-hub-tile" data-create-action="transfer">
          <span class="create-hub-tile-icon">${icons.transfer}</span>
          <strong>Umbuchung</strong>
          <small>Zwischen Konten</small>
        </button>
        <button class="create-hub-tile" data-create-action="recurring">
          <span class="create-hub-tile-icon">${icons.repeat}</span>
          <strong>Wiederkehrend</strong>
          <small>Vorlage anlegen</small>
        </button>
      </div>
    </div>
  `);
  document.querySelector("#modal .sheet")?.classList.add("sheet-static", "create-hub-modal-sheet");
  bindCreateHubSheet();
  bindPressFeedback(document.querySelector("#modal"));
}

function bindCreateHubSheet() {
  document.querySelectorAll("[data-create-action]").forEach(button => {
    button.onclick = () => {
      const action = button.dataset.createAction;
      if (action === "transaction") return openCompactTransactionSheet();
      if (action === "image") { closeSheet(); navigate("screenshot-import"); return; }
      if (action === "pdf") { closeSheet(); navigate("pdf-import"); return; }
      if (action === "transfer") return openTransferSheet();
      if (action === "recurring") return openRecurringSheet();
      if (action === "qr") return openQRSheet();
    };
  });
}

function openCompactTransactionSheet() {
  swapSheet(`<div class="entry-sheet">${views.addTransactionSheet()}</div>`, () => {
    bindAddTransaction();
    setTimeout(() => document.querySelector('#transactionForm input[name="amount"]')?.focus(), 180);
  });
}

function openTransferSheet() {
  const accountOptions = data.accounts.map(account => `<option value="${account.id}">${esc(account.name)}</option>`).join("");
  swapSheet(`
    <div class="sheet-heading compact-sheet-heading">
      <span class="sheet-icon">${icons.transfer}</span>
      <div><h2>Umbuchung</h2><p>Bewegt Geld zwischen deinen Konten, ohne Budgets oder Monatszahlen zu verfälschen.</p></div>
    </div>
    <div class="sheet-form-card compact-entry-card">
      <form id="transferForm" class="form entry-form entry-form-compact">
        <div class="entry-top-grid">
          ${field("Datum", `<input name="date" type="date" value="${today()}" required>`)}
          ${field("Betrag", `<input name="amount" type="number" step="0.01" placeholder="0,00" required>`)}
        </div>
        <div class="entry-top-grid">
          ${field("Von", `<select name="fromAccountId">${accountOptions}</select>`)}
          ${field("Nach", `<select name="toAccountId">${accountOptions}</select>`)}
        </div>
        ${field("Notiz", `<input name="description" placeholder="z. B. Bargeld abheben">`)}
        <div class="entry-actions compact"><button class="btn primary">Umbuchung speichern</button></div>
      </form>
    </div>
  `, bindTransferForm);
}

function bindTransferForm() {
  const form = document.querySelector("#transferForm");
  if (!form) return;
  form.onsubmit = event => {
    event.preventDefault();
    const values = new FormData(form);
    const fromAccountId = String(values.get("fromAccountId") || "");
    const toAccountId = String(values.get("toAccountId") || "");
    if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
      showToast("Bitte zwei unterschiedliche Konten wählen", "warning");
      return;
    }
    const amount = Number(values.get("amount") || 0);
    const note = String(values.get("description") || "Umbuchung").trim() || "Umbuchung";
    const categoryId = data.categories.find(item => item.id === "c11")?.id ?? data.categories.find(item => item.name === "Umbuchungen")?.id ?? "c10";
    const fromName = data.accounts.find(item => item.id === fromAccountId)?.name ?? "Konto";
    const toName = data.accounts.find(item => item.id === toAccountId)?.name ?? "Konto";
    const createdAt = Date.now();
    data.transactions.push({
      id: makeId(), createdAt, date: values.get("date"), type: "expense", amount,
      description: `${note} → ${toName}`, originalDescription: note, merchantKey: "UMBUCHUNG",
      accountId: fromAccountId, categoryId, person: "Gemeinsam", status: "done", internalTransfer: true, excludeFromAnalytics: true
    });
    data.transactions.push({
      id: makeId(), createdAt: createdAt + 1, date: values.get("date"), type: "income", amount,
      description: `${note} ← ${fromName}`, originalDescription: note, merchantKey: "UMBUCHUNG",
      accountId: toAccountId, categoryId, person: "Gemeinsam", status: "done", internalTransfer: true, excludeFromAnalytics: true
    });
    saveData(data);
    closeSheet();
    render();
    haptic("success");
    showToast("Umbuchung gespeichert", "success");
  };
}

function frequencyLabel(value) {
  return ({ weekly: "Wöchentlich", monthly: "Monatlich", quarterly: "Quartalsweise", yearly: "Jährlich" })[value] ?? "Monatlich";
}

function openRecurringSheet() {
  const accountOptions = data.accounts.map(account => `<option value="${account.id}">${esc(account.name)}</option>`).join("");
  const categoryOptions = data.categories.filter(item => !["c10", "c11"].includes(item.id)).map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join("");
  swapSheet(`
    <div class="sheet-heading compact-sheet-heading">
      <span class="sheet-icon">${icons.repeat}</span>
      <div><h2>Wiederkehrende Buchung</h2><p>Fällige Termine werden automatisch erzeugt, landen aber immer zuerst im Prüfbereich.</p></div>
    </div>
    <div class="sheet-form-card compact-entry-card">
      <form id="recurringForm" class="form entry-form entry-form-compact">
        ${field("Beschreibung", `<input name="description" placeholder="z. B. Miete" required>`)}
        <div class="entry-top-grid">
          ${field("Typ", `<select name="type"><option value="expense">Ausgabe</option><option value="income">Einnahme</option></select>`)}
          ${field("Betrag", `<input name="amount" type="number" step="0.01" placeholder="0,00" required>`)}
        </div>
        <div class="entry-top-grid">
          ${field("Intervall", `<select name="frequency"><option value="weekly">Wöchentlich</option><option value="monthly" selected>Monatlich</option><option value="quarterly">Quartalsweise</option><option value="yearly">Jährlich</option></select>`)}
          ${field("Erster Termin", `<input name="startDate" type="date" value="${today()}" required>`)}
        </div>
        <div class="entry-top-grid">
          ${field("Konto", `<select name="accountId">${accountOptions}</select>`)}
          ${field("Kategorie", `<select name="categoryId">${categoryOptions}</select>`)}
        </div>
        ${field("Person", `<select name="person">${data.settings.people.map(item => `<option>${esc(item)}</option>`).join("")}</select>`)}
        <div class="mobile-share-note"><strong>Kontrolle</strong><span>Auch automatisch fällige Buchungen beeinflussen keine Kontostände oder Budgets, bevor du sie im Prüfbereich bestätigst.</span></div>
        <div class="entry-actions compact"><button class="btn primary">Vorlage speichern</button></div>
      </form>
    </div>
  `, bindRecurringForm);
}

function bindRecurringForm() {
  const form = document.querySelector("#recurringForm");
  if (!form) return;
  form.onsubmit = event => {
    event.preventDefault();
    const values = new FormData(form);
    const startDate = String(values.get("startDate") || today());
    const frequency = String(values.get("frequency") || "monthly");
    data.recurringTransactions ??= [];
    data.recurringTransactions.push({
      id: makeId(),
      createdAt: Date.now(),
      description: String(values.get("description") || "").trim(),
      type: values.get("type"),
      amount: Number(values.get("amount") || 0),
      accountId: values.get("accountId"),
      categoryId: values.get("categoryId"),
      person: values.get("person"),
      frequency,
      startDate,
      nextDueDate: startDate,
      active: true
    });
    evaluateRecurringTransactions();
    saveData(data);
    closeSheet();
    navigate("import-review");
    haptic("success");
    showToast("Wiederkehrende Vorlage gespeichert", "success");
  };
}

function parseLocalDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function advanceRecurringDate(dateString, frequency) {
  const current = parseLocalDate(dateString);
  const originalDay = current.getDate();
  if (frequency === "weekly") current.setDate(current.getDate() + 7);
  else if (frequency === "yearly") current.setFullYear(current.getFullYear() + 1);
  else {
    const months = frequency === "quarterly" ? 3 : 1;
    current.setDate(1);
    current.setMonth(current.getMonth() + months);
    const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    current.setDate(Math.min(originalDay, lastDay));
  }
  return localDateString(current);
}

function evaluateRecurringTransactions() {
  const templates = data.recurringTransactions ?? [];
  if (!templates.length) return 0;
  const todayValue = today();
  const existingKeys = new Set([
    ...(data.importDrafts ?? []).map(item => item.occurrenceKey).filter(Boolean),
    ...(data.transactions ?? []).map(item => item.occurrenceKey).filter(Boolean)
  ]);
  let generated = 0;

  for (const template of templates) {
    if (template.active === false) continue;
    let dueDate = template.nextDueDate || template.startDate || todayValue;
    let safety = 0;
    while (dueDate <= todayValue && safety < 24) {
      const occurrenceKey = `${template.id}:${dueDate}`;
      if (!existingKeys.has(occurrenceKey)) {
        const categoryName = category(template.categoryId)?.name;
        enqueueImportDrafts([{
          id: makeId(),
          createdAt: Date.now() + generated,
          date: dueDate,
          type: template.type,
          amount: Number(template.amount || 0),
          description: template.description,
          originalDescription: template.description,
          merchantKey: normalizeMerchant(template.description).key,
          accountId: template.accountId,
          categoryId: template.categoryId,
          person: template.person,
          status: categoryName === "Später zuordnen" ? "pending" : "done",
          recurringTemplateId: template.id,
          occurrenceKey
        }], {
          source: "recurring",
          sourceLabel: `${frequencyLabel(template.frequency)} · ${template.description}`,
          batchId: `recurring:${template.id}:${dueDate}`
        });
        existingKeys.add(occurrenceKey);
        generated += 1;
      }
      dueDate = advanceRecurringDate(dueDate, template.frequency || "monthly");
      safety += 1;
    }
    template.nextDueDate = dueDate;
  }
  if (generated) saveData(data);
  return generated;
}

function parseEPCQRCode(rawValue) {
  const lines = String(rawValue || "").split(/\r?\n/);
  if (lines[0] !== "BCD") return null;
  const name = lines[5] || "QR-Zahlung";
  const iban = lines[6] || "";
  const amountField = lines[7] || "";
  const remittance = lines[9] || lines[10] || "";
  const amount = Number(String(amountField).replace(/^EUR/i, "").replace(",", "."));
  return { name, iban, amount: Number.isFinite(amount) ? amount : 0, remittance, rawValue };
}

let activeQRStream = null;
let activeQRFrame = 0;
let activeQRScanning = false;

function stopLiveQRScanner() {
  activeQRScanning = false;
  if (activeQRFrame) cancelAnimationFrame(activeQRFrame);
  activeQRFrame = 0;
  activeQRStream?.getTracks?.().forEach(track => track.stop());
  activeQRStream = null;
}

function openQRSheet() {
  swapSheet(`
    <div class="sheet-heading compact-sheet-heading">
      <span class="sheet-icon">${icons.scan}</span>
      <div><h2>QR-Code scannen</h2><p>Live über die Kamera oder alternativ aus einem Bild. Das Ergebnis landet immer im Prüfbereich.</p></div>
    </div>
    <div class="sheet-form-card compact-entry-card qr-live-card">
      <div class="qr-camera-stage">
        <video id="qrVideo" playsinline muted></video>
        <canvas id="qrCanvas" hidden></canvas>
        <div class="qr-viewfinder" aria-hidden="true"></div>
        <div class="qr-camera-placeholder" id="qrCameraPlaceholder">Kamera noch nicht gestartet</div>
      </div>
      <div class="qr-actions">
        <button class="btn primary" type="button" id="startQRScanner">Kamera starten</button>
        <button class="btn ghost" type="button" id="stopQRScanner" hidden>Kamera stoppen</button>
        <label class="btn ghost import-file-button" for="qrImportInput">
          QR-Bild auswählen
          <input id="qrImportInput" type="file" accept="image/*" hidden>
        </label>
      </div>
      <div id="qrImportResult" class="qr-result"></div>
    </div>
  `, bindQRSheet);
}

async function decodeQRCanvas(canvas) {
  if ("BarcodeDetector" in window) {
    try {
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const codes = await detector.detect(canvas);
      if (codes[0]?.rawValue) return codes[0].rawValue;
    } catch {}
  }
  if (typeof window.jsQR === "function") {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    return window.jsQR(image.data, image.width, image.height, { inversionAttempts: "attemptBoth" })?.data ?? "";
  }
  return "";
}

function acceptQRValue(rawValue, sourceLabel) {
  const epc = parseEPCQRCode(rawValue);
  const accountId = data.accounts[0]?.id ?? "";
  if (!epc) {
    const resultNode = document.querySelector("#qrImportResult");
    if (resultNode) resultNode.innerHTML = `<div class="notice">QR erkannt, aber noch kein unterstützter GiroCode. Inhalt: ${esc(rawValue.slice(0, 140))}</div>`;
    return false;
  }
  const categoryId = detectCategory(data, epc.name);
  enqueueImportDrafts([{
    id: makeId(), createdAt: Date.now(), date: today(), type: "expense", amount: epc.amount || 0,
    description: epc.name, originalDescription: epc.remittance || epc.name, merchantKey: normalizeMerchant(epc.name).key,
    accountId, categoryId, person: data.settings.people?.[0] ?? "Gemeinsam", status: epc.amount ? "done" : "pending",
    qrIban: epc.iban, qrRawValue: rawValue
  }], { source: "qr", sourceLabel });
  stopLiveQRScanner();
  closeSheet();
  navigate("import-review");
  haptic("success");
  showToast("QR-Code in den Prüfbereich übernommen", "success");
  return true;
}

async function scanQRFrame() {
  if (!activeQRScanning) return;
  const video = document.querySelector("#qrVideo");
  const canvas = document.querySelector("#qrCanvas");
  if (!video || !canvas || video.readyState < 2) {
    activeQRFrame = requestAnimationFrame(scanQRFrame);
    return;
  }
  const width = video.videoWidth || 720;
  const height = video.videoHeight || 720;
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d", { willReadFrequently: true }).drawImage(video, 0, 0, width, height);
  const rawValue = await decodeQRCanvas(canvas);
  if (rawValue && acceptQRValue(rawValue, "Live-QR-Scanner")) return;
  setTimeout(() => {
    activeQRFrame = requestAnimationFrame(scanQRFrame);
  }, 180);
}

async function startLiveQRScanner() {
  const resultNode = document.querySelector("#qrImportResult");
  const video = document.querySelector("#qrVideo");
  if (!navigator.mediaDevices?.getUserMedia || !video) {
    if (resultNode) resultNode.innerHTML = `<div class="notice">Die Kamera ist in diesem Browser nicht verfügbar. Nutze stattdessen „QR-Bild auswählen“.</div>`;
    return;
  }
  stopLiveQRScanner();
  try {
    activeQRStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
      audio: false
    });
    video.srcObject = activeQRStream;
    await video.play();
    document.querySelector("#qrCameraPlaceholder")?.setAttribute("hidden", "");
    document.querySelector("#startQRScanner")?.setAttribute("hidden", "");
    document.querySelector("#stopQRScanner")?.removeAttribute("hidden");
    activeQRScanning = true;
    activeQRFrame = requestAnimationFrame(scanQRFrame);
    if (resultNode) resultNode.innerHTML = `<div class="notice">Halte den QR-Code ruhig in den Rahmen.</div>`;
  } catch (error) {
    console.error(error);
    if (resultNode) resultNode.innerHTML = `<div class="notice">Kamera konnte nicht geöffnet werden. Prüfe die Berechtigung oder nutze ein QR-Bild.</div>`;
    haptic("error");
  }
}

function bindQRSheet() {
  const modal = document.querySelector("#modal");
  modal?.addEventListener("financeos:sheet-close", stopLiveQRScanner, { once: true });
  document.querySelector("#startQRScanner")?.addEventListener("click", startLiveQRScanner);
  document.querySelector("#stopQRScanner")?.addEventListener("click", () => {
    stopLiveQRScanner();
    document.querySelector("#startQRScanner")?.removeAttribute("hidden");
    document.querySelector("#stopQRScanner")?.setAttribute("hidden", "");
    document.querySelector("#qrCameraPlaceholder")?.removeAttribute("hidden");
  });

  const input = document.querySelector("#qrImportInput");
  if (!input) return;
  input.onchange = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const resultNode = document.querySelector("#qrImportResult");
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d", { willReadFrequently: true }).drawImage(bitmap, 0, 0);
      bitmap.close?.();
      const rawValue = await decodeQRCanvas(canvas);
      canvas.width = 0;
      canvas.height = 0;
      if (!rawValue) throw new Error("Kein QR-Code erkannt");
      acceptQRValue(rawValue, `QR-Bild · ${file.name}`);
    } catch (error) {
      console.error(error);
      if (resultNode) resultNode.innerHTML = `<div class="notice">${esc(error?.message ?? String(error))}</div>`;
      haptic("error");
    }
  };
}

function importDraftRowsMarkup() {
  const drafts = sortNewest(data.importDrafts ?? []);
  if (!drafts.length) return `<div class="empty-state"><strong>Keine importierten Buchungen</strong><p>Neue Importe landen zuerst hier zur Prüfung.</p></div>`;
  return drafts.map(item => `
    <div class="import-review-row ${item.reviewState === "needs_attention" ? "needs-attention" : ""}">
      <label class="import-review-check"><input type="checkbox" data-import-review-select="${item.id}" checked><span></span></label>
      <div class="import-review-copy">
        <strong>${esc(item.description)}</strong>
        <small>${esc(item.date)} · ${esc(category(item.categoryId)?.name ?? "Später zuordnen")} · ${esc(item.sourceLabel ?? item.source ?? "Import")}</small>
      </div>
      <div class="import-review-end">
        <div class="transaction-amount ${item.type === "income" ? "positive" : "negative"}">${item.type === "income" ? "+" : "-"}${euro(item.amount)}</div>
        <div class="import-review-actions">
          <button class="btn ghost small" data-import-review-edit="${item.id}">Bearbeiten</button>
          <button class="btn ghost small danger" data-import-review-discard="${item.id}">Verwerfen</button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderImportReviewSheet() {
  const drafts = data.importDrafts ?? [];
  const ready = drafts.filter(item => item.reviewState !== "needs_attention").length;
  const open = drafts.filter(item => item.reviewState === "needs_attention").length;
  return `
    <div class="sheet-heading compact-sheet-heading">
      <span class="sheet-icon">${icons.document}</span>
      <div><h2>Importierte Buchungen</h2><p>Prüfen, bearbeiten und erst dann verbindlich übernehmen.</p></div>
    </div>
    <div class="import-review-toolbar">
      <div class="import-review-chip"><strong>${drafts.length}</strong><span>Entwürfe</span></div>
      <div class="import-review-chip"><strong>${ready}</strong><span>sicher</span></div>
      <div class="import-review-chip"><strong>${open}</strong><span>offen</span></div>
    </div>
    <div class="sheet-form-card import-review-card">
      <div class="import-review-bulk">
        <button class="btn primary" id="confirmSelectedImports">Ausgewählte bestätigen</button>
        <button class="btn ghost" id="confirmReadyImports">Nur sichere bestätigen</button>
        <button class="btn ghost danger" id="discardAllImports">Alle verwerfen</button>
      </div>
      <div class="import-review-list">${importDraftRowsMarkup()}</div>
    </div>
  `;
}

function openImportReviewSheet() {
  const content = renderImportReviewSheet();
  if (document.querySelector("#modal")) {
    swapSheet(content, bindImportReviewSheet);
    return;
  }
  showSheet(content);
  bindImportReviewSheet();
  bindPressFeedback(document.querySelector("#modal"));
}

function confirmImportDrafts(predicate) {
  const drafts = data.importDrafts ?? [];
  const selected = drafts.filter(predicate);
  if (!selected.length) {
    showToast("Keine Buchungen ausgewählt", "warning");
    return;
  }
  data.transactions.push(...selected.map(item => {
    const { source, sourceLabel, batchId, reviewState, originalStatus, ...transaction } = item;
    return { ...transaction, status: originalStatus === "pending" ? "pending" : (transaction.status ?? "done") };
  }));
  data.importDrafts = drafts.filter(item => !predicate(item));
  saveData(data);
  if (document.querySelector("#modal")) closeSheet();
  view = "transactions";
  render();
  haptic("success");
  showToast(`${selected.length} Buchungen bestätigt`, "success");
}

function discardImportDrafts(predicate) {
  const before = (data.importDrafts ?? []).length;
  data.importDrafts = (data.importDrafts ?? []).filter(item => !predicate(item));
  const removed = before - data.importDrafts.length;
  saveData(data);
  if (!data.importDrafts.length && document.querySelector("#modal")) closeSheet();
  render();
  haptic("warning");
  showToast(`${removed} Buchungen verworfen`, "warning");
}

function openImportDraftEditor(id) {
  const draft = (data.importDrafts ?? []).find(item => item.id === id);
  if (!draft) return;
  swapSheet(`
    <h2>Importierte Buchung bearbeiten</h2>
    <form id="editImportDraftForm" class="form">
      ${field("Datum", `<input name="date" type="date" value="${draft.date}">`)}
      ${field("Beschreibung", `<input name="description" value="${esc(draft.description)}">`)}
      ${field("Betrag", `<input name="amount" type="number" step="0.01" value="${draft.amount}">`)}
      ${field("Konto", `<select name="accountId">${data.accounts.map(item => `<option value="${item.id}" ${item.id === draft.accountId ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
      ${field("Kategorie", `<select name="categoryId">${data.categories.map(item => `<option value="${item.id}" ${item.id === draft.categoryId ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
      ${field("Person", `<select name="person">${data.settings.people.map(item => `<option ${item === draft.person ? "selected" : ""}>${esc(item)}</option>`).join("")}</select>`)}
      <button class="btn primary">Änderungen speichern</button>
      <button type="button" class="btn ghost" id="saveAndConfirmImportDraft">Speichern & bestätigen</button>
    </form>
  `, () => bindImportDraftEditor(draft));
}

function bindImportDraftEditor(draft) {
  const form = document.querySelector("#editImportDraftForm");
  if (!form) return;
  const apply = () => {
    const values = new FormData(form);
    Object.assign(draft, {
      date: values.get("date"),
      description: String(values.get("description") || "").trim(),
      amount: Number(values.get("amount") || 0),
      accountId: values.get("accountId"),
      categoryId: values.get("categoryId"),
      person: values.get("person"),
      reviewState: category(values.get("categoryId"))?.name === "Später zuordnen" ? "needs_attention" : "ready",
      status: category(values.get("categoryId"))?.name === "Später zuordnen" ? "pending" : "done",
      originalStatus: category(values.get("categoryId"))?.name === "Später zuordnen" ? "pending" : "done"
    });
    saveData(data);
  };
  form.onsubmit = event => {
    event.preventDefault();
    apply();
    closeSheet();
    view = "import-review";
    render();
    showToast("Importentwurf gespeichert", "success");
  };
  document.querySelector("#saveAndConfirmImportDraft").onclick = () => {
    apply();
    confirmImportDrafts(item => item.id === draft.id);
  };
}

function bindImportReviewSheet() {
  document.querySelector("#confirmSelectedImports")?.addEventListener("click", () => {
    const selectedIds = new Set([...document.querySelectorAll("[data-import-review-select]:checked")].map(input => input.dataset.importReviewSelect));
    confirmImportDrafts(item => selectedIds.has(item.id));
  });
  document.querySelector("#confirmReadyImports")?.addEventListener("click", () => {
    confirmImportDrafts(item => item.reviewState !== "needs_attention");
  });
  document.querySelector("#discardAllImports")?.addEventListener("click", () => {
    discardImportDrafts(() => true);
  });
  document.querySelectorAll("[data-import-review-edit]").forEach(button => {
    button.onclick = () => openImportDraftEditor(button.dataset.importReviewEdit);
  });
  document.querySelectorAll("[data-import-review-discard]").forEach(button => {
    button.onclick = () => {
      discardImportDrafts(item => item.id === button.dataset.importReviewDiscard);
      if (data.importDrafts?.length) openImportReviewSheet();
    };
  });
}

function bindImportReviewPage() {
  document.querySelector("#confirmSelectedImports")?.addEventListener("click", () => {
    const selectedIds = new Set([...document.querySelectorAll("[data-import-review-select]:checked")].map(input => input.dataset.importReviewSelect));
    confirmImportDrafts(item => selectedIds.has(item.id));
  });
  document.querySelector("#confirmReadyImports")?.addEventListener("click", () => {
    confirmImportDrafts(item => item.reviewState !== "needs_attention");
  });
  document.querySelector("#discardAllImports")?.addEventListener("click", () => {
    discardImportDrafts(() => true);
  });
  document.querySelectorAll("[data-import-review-edit]").forEach(button => {
    button.onclick = () => openImportDraftEditor(button.dataset.importReviewEdit);
  });
  document.querySelectorAll("[data-import-review-discard]").forEach(button => {
    button.onclick = () => discardImportDrafts(item => item.id === button.dataset.importReviewDiscard);
  });
}

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
      <div><strong>Kontoauszug wird analysiert</strong><p>PDF-Typ, Bank und Buchungsstruktur werden lokal erkannt.</p></div>
    </div>
  `;

  try {
    const pages = await extractPDFLines(file);
    const result = parseWithRegistry({
      pages,
      accountId,
      data,
      makeId
    });

    activePDFItems = result.items;

    pages.forEach(page => page.lines.splice(0));
    pages.splice(0);

    if (result.requiresOCR) {
      workspace.innerHTML = `
        <div class="card pdf-diagnostic-card">
          <div class="pdf-diagnostic-head">
            <strong>Bildbasiertes PDF erkannt</strong>
            <span class="diagnostic-badge">OCR erforderlich</span>
          </div>
          <p>Dieser Kontoauszug enthält keinen ausreichend auslesbaren Text. FinanceOS benötigt dafür den kommenden OCR-Importer.</p>
        </div>
      `;
      return;
    }

    renderPDFPreview(activePDFItems, file.name, result);
  } catch (error) {
    console.error(error);
    haptic("error");
    workspace.innerHTML = `
      <div class="card empty-state">
        <strong>PDF konnte nicht gelesen werden</strong>
        <p>Das Dokument konnte technisch nicht geöffnet werden. Prüfe, ob es passwortgeschützt ist, und exportiere es erneut aus der Sparkassen-App.</p>
        <details class="pdf-error-details">
          <summary>Technische Details</summary>
          <code>${esc(error?.message ?? String(error))}</code>
        </details>
      </div>
    `;
  } finally {
    await clearPDFResources(file);
    activePDFFile = null;
    const input = document.querySelector("#pdfImportInput");
    if (input) input.value = "";
  }
}

function renderPDFPreview(items, fileName, result) {
  const workspace = document.querySelector("#pdfImportWorkspace");
  if (!workspace) return;

  const duplicates = items.filter(item => item.duplicate);
  const pending = items.filter(item => item.status === "pending" && !item.duplicate);
  const selected = items.filter(item => item.selected);

  const bankLabels = {
    sparkasse: "Sparkasse",
    ing: "ING",
    dkb: "DKB",
    n26: "N26",
    unknown: "Nicht erkannt"
  };

  workspace.innerHTML = `
    <div class="card pdf-diagnostic-card">
      <div class="pdf-diagnostic-grid">
        <div><span>Bank</span><strong>${bankLabels[result.diagnostic.bank] ?? "Nicht erkannt"}</strong></div>
        <div><span>PDF-Typ</span><strong>${result.diagnostic.pdfType === "table" ? "Tabelle" : "Text"}</strong></div>
        <div><span>Parser</span><strong>${esc(result.parser?.label ?? "Keiner")}</strong></div>
      </div>
    </div>

    <div class="import-summary-grid import-summary-grid-four">
      <div class="card"><span>Neue Buchungen</span><strong>${selected.length}</strong></div>
      <div class="card"><span>Zu prüfen</span><strong>${pending.length}</strong></div>
      <div class="card"><span>Duplikate</span><strong>${duplicates.length}</strong></div>
      <div class="card"><span>Ignoriert</span><strong>${result.parserMeta?.rejectedRows ?? 0}</strong></div>
    </div>

    <div class="card import-preview-card">
      <div class="import-file-summary">
        <strong>${esc(fileName)}</strong>
        <span>${items.length} sichere Buchungen</span>
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
            <p>${result.diagnostic.bank === "sparkasse"
              ? "Der Sparkassen-Auszug wurde erkannt, aber seine Tabellenstruktur weicht vom bisher unterstützten Layout ab."
              : "Der Kontoauszug verwendet möglicherweise ein noch nicht unterstütztes Layout."}</p>
          </div>
        `}
      </div>

      ${items.length ? '<button class="btn primary" id="confirmPDFImport">Ausgewählte Buchungen zur Prüfung übernehmen</button>' : ""}
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

    enqueueImportDrafts(selectedItems.map(({ duplicate, selected, recognized, pageNumber, ...item }) => item), {
      source: "pdf",
      sourceLabel: `Kontoauszug · ${fileName}`
    });

    activePDFItems.splice(0);
    activePDFItems = [];
    document.querySelector("#pdfImportWorkspace").replaceChildren();

    haptic("success");
    showToast(`${selectedItems.length} Buchungen zur Prüfung übernommen`, "success");
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
      <button class="btn primary" id="confirmImport">Ausgewählte Buchungen zur Prüfung übernehmen</button>
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

    enqueueImportDrafts(toImport.map(({ duplicate, valid, selected, recognition, rowNumber, ...transaction }) => transaction), {
      source: "csv",
      sourceLabel: "CSV-Import"
    });
    haptic("success");
    showToast(`${toImport.length} Buchungen zur Prüfung übernommen`, "success");
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
  document.querySelector("[data-toggle-filters]")?.addEventListener("click", () => {
    data.settings.transactionsFilterOpen = !data.settings.transactionsFilterOpen;
    saveData(data);
    render();
  });

  document.querySelector("[data-open-import-review]")?.addEventListener("click", () => {
    navigate("import-review");
  });

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
  openCreateHubSheet();
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
  evaluateRecurringTransactions();
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
