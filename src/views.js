import { APP_VERSION } from "./constants.js";
import { categoryIcon, icons, loanIcon, merchantVisual } from "./icons.js";
import {
  accountBalance, euro, filterTransactions, loanProgress,
  monthKey, monthSummary, sortNewest, today, totalBalance
} from "./logic.js";
import { esc, field } from "./ui.js";
import { emptyState, groupedCard, privacyNote, sectionHeader } from "./components/components.js";

export function createViews(context) {
  const { getData, navigate, openTransaction, openLoan, saveDashboard, getPWAState } = context;
  const data = () => getData();
  const category = id => data().categories.find(item => item.id === id);
  const account = id => data().accounts.find(item => item.id === id);

  function transactionRow(transaction, editable = false) {
    const visual = merchantVisual(transaction.description, transaction.type);
    const amountClass = transaction.status === "pending"
      ? "pending"
      : transaction.type === "income" ? "positive" : "negative";

    return `
      <div class="transaction-row" data-transaction="${transaction.id}">
        <div class="transaction-left">
          <div class="merchant-icon ${visual.className}">${visual.html ? visual.mark : esc(visual.mark)}</div>
          <div class="transaction-copy">
            <strong>${esc(transaction.description)}</strong>
            <div class="meta">${esc(category(transaction.categoryId)?.name ?? "—")} · ${esc(account(transaction.accountId)?.name ?? "—")}</div>
          </div>
        </div>
        <div class="transaction-end">
          <div class="transaction-amount ${amountClass}">
            ${transaction.type === "income" ? "+" : "-"}${euro(transaction.amount)}
          </div>
          ${editable ? `<button class="row-edit" data-edit="${transaction.id}" aria-label="Buchung bearbeiten">${icons.edit}</button>` : `<span class="row-chevron">${icons.chevron}</span>`}
        </div>
      </div>
    `;
  }

  function dashboard() {
    const current = data();
    const dashboardConfig = current.settings.dashboard;
    const summary = monthSummary(current);
    const balance = totalBalance(current);
    const pending = current.transactions.filter(item => item.status === "pending");

    const modules = {
      balance: () => `
        <section class="dashboard-module hero-module">
          <button class="card hero hero-button" data-nav="accounts">
            <div class="hero-row">
              <div class="hero-icon">${icons.wallet}</div>
              <div class="hero-copy">
                <div class="hero-label">Gesamtkontostand</div>
                <div class="hero-value ${balance > 0 ? "positive" : balance < 0 ? "negative" : ""}" data-animate-number="${balance}">${euro(balance)}</div>
                <div class="hero-sub"><span>Verfügbar diesen Monat</span><strong>${euro(summary.available)}</strong></div>
              </div>
            </div>
          </button>
        </section>
      `,
      summary: () => `
        <section class="dashboard-module summary-module">
          <div class="card summary-card">
            <button class="summary-item summary-action" data-nav="income">
              <div class="metric-head"><div class="metric-icon income">${icons.income}</div><div class="metric-label">Einnahmen</div></div>
              <div class="metric-value" data-animate-number="${summary.income}">${euro(summary.income)}</div>
            </button>
            <div class="summary-divider" aria-hidden="true"></div>
            <button class="summary-item summary-action" data-nav="expenses">
              <div class="metric-head"><div class="metric-icon expense">${icons.expense}</div><div class="metric-label">Ausgaben</div></div>
              <div class="metric-value" data-animate-number="${summary.expense}">${euro(summary.expense)}</div>
            </button>
          </div>
        </section>
      `,
      pending: () => {
        if (!pending.length) return "";
        const oldestPending = sortNewest(pending).at(-1);
        const oldestLabel = oldestPending
          ? new Date(`${oldestPending.date}T00:00:00`).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })
          : null;

        return `
          <section class="dashboard-module pending-module">
            <button class="card pending-bar" data-nav="pending">
              <span class="pending-icon">${icons.pending}</span>
              <span class="pending-label">Zu prüfen</span>
              <span class="pending-count">${pending.length}</span>
              <span class="pending-date">${oldestLabel ? `seit ${oldestLabel}` : "nichts offen"}</span>
              <span class="row-chevron">${icons.chevron}</span>
            </button>
          </section>
        `;
      },
      loans: () => loanPreview(dashboardConfig.loans.count),
      transactions: () => transactionPreview(dashboardConfig.transactions.count)
    };

    const fixed = modules.balance() + modules.summary();
    const configurable = ["pending", "loans", "transactions"]
      .filter(key => dashboardConfig[key]?.enabled !== false)
      .sort((a, b) => Number(dashboardConfig[a]?.order || 99) - Number(dashboardConfig[b]?.order || 99))
      .map(key => modules[key]?.() ?? "")
      .join("");

    const customize = `
      <section class="dashboard-module dashboard-customize">
        <button class="card customize-card" data-nav="dashboard-settings">
          <span class="customize-icon">${icons.arrange}</span>
          <span>Anpassen</span>
        </button>
      </section>
    `;

    return fixed + configurable + customize;
  }

  function loanPreview(count = 3) {
    const allLoans = [...data().loans]
      .sort((a, b) => Number(b.remaining) - Number(a.remaining));
    const requested = Math.max(0, Number(count) || 0);
    const visibleCount = Math.min(3, requested || 3);
    const loans = allLoans.slice(0, visibleCount);
    const hiddenCount = Math.max(0, allLoans.length - loans.length);

    if (!loans.length) return "";

    const rows = loans.map(loan => {
      const { percent } = loanProgress(loan);
      return `
        <button class="grouped-row loan-row" data-loan="${loan.id}">
          <span class="grouped-icon loan-symbol">${loanIcon(loan.type)}</span>
          <span class="grouped-main">
            <span class="grouped-title">${esc(loan.name)}</span>
            <span class="slim-progress" aria-hidden="true">
              <span class="slim-progress-fill" style="--row-progress:${percent}%"></span>
            </span>
          </span>
          <span class="grouped-values">
            <strong>${euro(loan.remaining)}</strong>
          </span>
          <span class="row-chevron">${icons.chevron}</span>
        </button>
      `;
    }).join("");

    const more = hiddenCount
      ? `<button class="grouped-more" data-nav="loans">+${hiddenCount} weitere Kredite <span class="row-chevron">${icons.chevron}</span></button>`
      : "";

    return `
      <section class="dashboard-module">
        ${sectionHeader({ title: "Kredite", action: `Alle anzeigen ${icons.chevron}`, actionTarget: "loans" })}
        ${groupedCard(rows + more, "loan-group")}
      </section>
    `;
  }

  function transactionPreview(count = 6) {
    const transactions = sortNewest(data().transactions).slice(0, Math.max(0, Number(count)));
    if (!transactions.length) return "";

    return `
      <section class="dashboard-module">
        ${sectionHeader({ title: "Letzte Buchungen", action: `Alle anzeigen ${icons.chevron}`, actionTarget: "transactions" })}
        <div class="card transaction-list">${transactions.map(item => transactionRow(item)).join("")}</div>
      </section>
    `;
  }

  function transactions(filters) {
    const items = filterTransactions(data(), filters);
    return `
      <div class="section-title transactions-heading">
        <h2 class="page-heading">Buchungen</h2>
        <button class="btn primary compact-new" data-open-add>${icons.plus}<span>Neu</span></button>
      </div>
      <div class="card page-card filters">
        <div class="filters-title"><span>${icons.search}</span><strong>Filtern</strong></div>
        <div class="form">
          ${field("Suche", `<input id="filterQuery" value="${esc(filters.query)}" placeholder="Händler, Kategorie oder Betrag">`)}
          <div class="grid two">
            ${field("Konto", `<select id="filterAccount"><option value="">Alle</option>${data().accounts.map(item => `<option value="${item.id}" ${filters.account === item.id ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
            ${field("Kategorie", `<select id="filterCategory"><option value="">Alle</option>${data().categories.map(item => `<option value="${item.id}" ${filters.category === item.id ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
            <label class="learn-rule-row"><input type="checkbox" name="learnRule" checked><span><strong>Zuordnung merken</strong><small>Für denselben Händler künftig automatisch verwenden.</small></span></label>
        ${field("Person", `<select id="filterPerson"><option value="">Alle</option>${data().settings.people.map(item => `<option ${filters.person === item ? "selected" : ""}>${esc(item)}</option>`).join("")}</select>`)}
            ${field("Sortierung", `<select id="filterSort"><option value="newest">Neueste zuerst</option><option value="amount-desc" ${filters.sort === "amount-desc" ? "selected" : ""}>Betrag absteigend</option><option value="amount-asc" ${filters.sort === "amount-asc" ? "selected" : ""}>Betrag aufsteigend</option></select>`)}
          </div>
        </div>
      </div>
      <div class="card transaction-list">${items.length ? items.map(item => transactionRow(item, true)).join("") : emptyState({
        title: "Keine Buchungen gefunden",
        text: "Passe die Filter an oder erfasse eine neue Buchung.",
        action: "Neue Buchung",
        actionTarget: "add",
        icon: icons.search
      })}</div>
    `;
  }

  function transactionFormMarkup() {
    const preferences = data().settings.entryPreferences ?? {};
    const selectedAccount = preferences.accountId ?? data().accounts[0]?.id ?? "";
    const selectedPerson = preferences.person ?? data().settings.people[0] ?? "";
    return `
      <form id="transactionForm" class="form entry-form" autocomplete="off">
        ${field("Datum", `<input name="date" type="date" value="${today()}" required>`)}
        <div class="form-grid-two">
          ${field("Typ", `<select name="type"><option value="expense">Ausgabe</option><option value="income">Einnahme</option></select>`)}
          ${field("Betrag", `<input name="amount" type="number" inputmode="decimal" enterkeyhint="next" step="0.01" placeholder="0,00" required autofocus>`)}
        </div>
        ${field("Beschreibung", `<input name="description" enterkeyhint="next" placeholder="z. B. PAYPAL *REWE Markt" required>`)}
        <div class="recognition-status" id="recognitionStatus"><span class="recognition-dot"></span><span>Händler und Kategorie werden automatisch erkannt.</span></div>
        ${field("Konto", `<select name="accountId">${data().accounts.map(item => `<option value="${item.id}" ${item.id === selectedAccount ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
        ${field("Kategorie", `<select name="categoryId" id="transactionCategory"><option value="">Automatisch erkennen</option>${data().categories.map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join("")}</select>`)}
        <label class="learn-rule-row"><input type="checkbox" name="learnRule" checked><span><strong>Zuordnung merken</strong><small>Für denselben Händler künftig automatisch verwenden.</small></span></label>
        ${field("Person", `<select name="person">${data().settings.people.map(item => `<option ${item === selectedPerson ? "selected" : ""}>${esc(item)}</option>`).join("")}</select>`)}
        <div class="entry-actions"><button class="btn primary">Buchung speichern</button></div>
      </form>
    `;
  }

  function addTransaction() {
    return `
      <div class="entry-screen">
        <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Neue Buchung</h2>
      </div>
      <div class="section-title page-title-spacer"></div>
        <div class="card page-card entry-card">${transactionFormMarkup()}</div>
      </div>
    `;
  }

  function addTransactionSheet() {
    return `
      <div class="sheet-heading">
        <span class="sheet-icon">${icons.plus}</span>
        <div><h2>Neue Buchung</h2><p>Ausgabe oder Einnahme erfassen</p></div>
      </div>
      <div class="sheet-form-card">${transactionFormMarkup()}</div>
    `;
  }

  function pending() {
    const items = sortNewest(data().transactions.filter(item => item.status === "pending"));
    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Zu prüfen</h2>
      </div>
      <div class="section-title page-title-spacer"><span class="count-badge">${items.length}</span></div>
      <div class="card page-list">
        ${items.length ? items.map(item => `
          <div class="page-row">
            <div><strong>${esc(item.description)}</strong><div class="meta">${euro(item.amount)} · ${esc(item.person)}</div></div>
            <button class="btn ghost" data-resolve="${item.id}">Zuordnen</button>
          </div>
        `).join("") : emptyState({
          title: "Alles zugeordnet",
          text: "Aktuell wartet keine Buchung auf eine Kategorie.",
          icon: icons.pending
        })}
      </div>
    `;
  }

  function budgets() {
    const key = monthKey(today());
    const transactions = data().transactions.filter(item =>
      monthKey(item.date) === key && item.type === "expense"
    );

    const items = data().categories
      .filter(item => item.budget > 0)
      .map(item => {
        const used = transactions
          .filter(transaction => transaction.categoryId === item.id)
          .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        const percent = Math.max(0, item.budget ? used / item.budget * 100 : 0);
        return { ...item, used, percent };
      })
      .sort((a, b) => b.percent - a.percent);

    const rows = items.map(item => `
      <button class="grouped-row budget-row" data-budget="${item.id}">
        <span class="grouped-icon budget-symbol">${categoryIcon(item.name)}</span>
        <span class="grouped-main">
          <span class="grouped-title">${esc(item.name)}</span>
          <span class="grouped-meta">${euro(item.used)} von ${euro(item.budget)}</span>
          <span class="slim-progress" aria-hidden="true">
            <span class="slim-progress-fill" style="--row-progress:${Math.min(100, item.percent)}%"></span>
          </span>
        </span>
        <span class="grouped-values">
          <strong>${euro(Math.max(0, item.budget - item.used))}</strong>
        </span>
        <span class="row-chevron">${icons.chevron}</span>
      </button>
    `).join("");

    return `
      ${sectionHeader({ title: "Budgets", context: key })}
      ${items.length ? groupedCard(rows, "budget-group") : emptyState({
        title: "Keine Budgets eingerichtet",
        text: "Lege Kategorien mit Monatsbudget an.",
        action: "Kategorien verwalten",
        actionTarget: "manage",
        icon: icons.budget
      })}
    `;
  }

  function loans() {
    const cards = [...data().loans]
      .sort((a, b) => Number(b.remaining) - Number(a.remaining))
      .map(loan => {
        const { paid, percent } = loanProgress(loan);
        const initial = Number(loan.initial || loan.amount || 0);
        const remaining = Number(loan.remaining || 0);
        const monthlyRate = Number(loan.rate || loan.monthlyRate || 0);
        const interest = Number(loan.interest || loan.interestRate || 0);
        const term = Number(loan.term || loan.months || 0);

        const meta = [
          monthlyRate > 0 ? `Rate ${euro(monthlyRate)}` : "",
          interest > 0 ? `${interest.toLocaleString("de-DE", { maximumFractionDigits: 2 })} % Zins` : "",
          term > 0 ? `${term} Monate` : ""
        ].filter(Boolean);

        return `
          <article class="card loan-overview-card" data-loan="${loan.id}">
            <div class="loan-overview-head">
              <span class="loan-overview-icon">${loanIcon(loan.type)}</span>
              <div class="loan-overview-title">
                <h3>${esc(loan.name)}</h3>
                <p>${esc(loan.type || "Kredit")}</p>
              </div>
              <div class="loan-overview-remaining">
                <span>Restschuld</span>
                <strong>${euro(remaining)}</strong>
              </div>
            </div>

            <div class="loan-overview-grid">
              <div>
                <span>Abbezahlt</span>
                <strong>${euro(paid)}</strong>
              </div>
              <div>
                <span>Fortschritt</span>
                <strong>${Math.round(percent)} %</strong>
              </div>
              ${initial > 0 ? `
                <div>
                  <span>Ursprünglich</span>
                  <strong>${euro(initial)}</strong>
                </div>
              ` : ""}
              ${meta.map((item, index) => `
                <div>
                  <span>${index === 0 && monthlyRate > 0 ? "Monatliche Rate" : index === 1 && interest > 0 ? "Zinssatz" : "Laufzeit"}</span>
                  <strong>${item.replace(/^Rate /, "").replace(/ Zins$/, "")}</strong>
                </div>
              `).join("")}
            </div>

            <div class="loan-overview-progress" aria-label="${Math.round(percent)} Prozent abbezahlt">
              <span class="slim-progress">
                <span class="slim-progress-fill" style="--row-progress:${Math.max(0, Math.min(100, percent))}%"></span>
              </span>
            </div>
          </article>
        `;
      }).join("");

    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Kredite</h2>
      </div>
      <div class="loan-overview-list">
        ${cards || emptyState({
          title: "Keine Kredite vorhanden",
          text: "Neue Kredite werden später hier zusammengefasst.",
          icon: icons.wallet
        })}
      </div>
    `;
  }

  function more() {
    const install = getPWAState?.() ?? { standalone: false };
    const rows = [
      ["dashboard-settings", "Dashboard anpassen", icons.arrange],
      ["pdf-import", "Kontoauszug importieren", icons.document ?? icons.upload],
      ["pending", "Später zuordnen", icons.pending],
      ["loans", "Kredite", icons.wallet],
      ["manage", "Konten, Kategorien & Regeln", icons.list],
      ["settings", "Einstellungen & Backup", icons.backup]
    ].map(([target, label, icon]) => `
      <button class="settings-row" data-nav="${target}">
        <span class="settings-icon">${icon ?? icons.list}</span>
        <span class="settings-label">${label}</span>
        <span class="row-chevron">${icons.chevron}</span>
      </button>
    `).join("");

    return `
      <div class="section-title"><h2 class="page-heading">Mehr</h2></div>
      ${!install.standalone ? `
        <button class="card install-card" data-install-app>
          <span class="install-card-icon"><img src="./assets/icons/icon-96.png" alt=""></span>
          <span class="install-card-copy"><strong>FinanceOS installieren</strong><small>Wie eine echte App auf dem Startbildschirm</small></span>
          <span class="row-chevron">${icons.chevron}</span>
        </button>
      ` : ""}
      <div class="card grouped-card settings-group">${rows}</div>
    `;
  }

  function importStatement() {
    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Kontoauszug importieren</h2>
      </div>

      <div class="card pdf-import-card">
        <div class="import-intro">
          <span class="import-icon">${icons.document ?? icons.upload}</span>
          <div>
            <strong>PDF-Kontoauszug</strong>
            <p>FinanceOS liest Buchungen lokal aus dem Dokument und zeigt vor dem Speichern eine Vorschau.</p>
          </div>
        </div>

        <div class="form">
          ${field("Zielkonto", `
            <select id="pdfImportAccount">
              ${data().accounts.map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join("")}
            </select>
          `)}

          <label class="btn primary import-file-button" for="pdfImportInput">
            Kontoauszug auswählen
            <input id="pdfImportInput" type="file" accept="application/pdf,.pdf" hidden>
          </label>
        </div>

        <div class="mobile-share-note">
          <strong>iPhone</strong>
          <span>In der Sparkassen-App „In Dateien sichern“ wählen und das PDF anschließend hier auswählen.</span>
        </div>
        <div class="mobile-share-note">
          <strong>Android</strong>
          <span>Bei installierter FinanceOS-App kann das PDF direkt über „Teilen → FinanceOS“ übergeben werden.</span>
        </div>

        ${privacyNote("Das PDF wird nur im Arbeitsspeicher verarbeitet und nach der Analyse verworfen.")}
      </div>

      <div id="pdfImportWorkspace"></div>
    `;
  }

  function importTransactions() {
    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Buchungen importieren</h2>
      </div>

      <div class="card import-card">
        <div class="import-intro">
          <span class="import-icon">${icons.upload ?? icons.restore}</span>
          <div>
            <strong>CSV-Datei auswählen</strong>
            <p>FinanceOS erkennt Datum, Beschreibung, Betrag und Kategorien automatisch.</p>
          </div>
        </div>

        <label class="btn primary import-file-button" for="csvImportInput">
          CSV-Datei auswählen
          <input id="csvImportInput" type="file" accept=".csv,text/csv,text/plain" hidden>
        </label>

        <div class="privacy-note">
          <span aria-hidden="true">✓</span>
          <span>Die Datei wird ausschließlich auf diesem Gerät verarbeitet.</span>
        </div>
      </div>

      <div id="importWorkspace"></div>
    `;
  }

  function manage() {
    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Konten</h2>
      </div>
      <div class="section-title page-title-spacer"><button class="btn primary" id="addAccount">＋</button></div>
      <div class="card page-list">${data().accounts.map(item => `<div class="page-row"><div><strong>${esc(item.name)}</strong><div class="meta">${euro(item.start)} Startsaldo</div></div><button class="btn ghost" data-account="${item.id}">Bearbeiten</button></div>`).join("")}</div>
      <div class="section-title"><h2 class="section-heading">Kategorien</h2><button class="btn primary" id="addCategory">＋</button></div>
      <div class="card page-list">${data().categories.map(item => `<div class="page-row"><div><strong>${esc(item.name)}</strong><div class="meta">Budget ${euro(item.budget)}</div></div><button class="btn ghost" data-category="${item.id}">Bearbeiten</button></div>`).join("")}</div>
      <div class="section-title"><h2 class="section-heading">Händlerregeln</h2><button class="btn primary" id="addRule">＋</button></div>
      <div class="card page-list">${data().rules.map(item => `<div class="page-row"><div><strong>${esc(item.needle)}</strong><div class="meta">→ ${esc(category(item.categoryId)?.name ?? "—")}</div></div><button class="btn ghost" data-rule="${item.id}">Bearbeiten</button></div>`).join("")}</div>
    `;
  }

  function dashboardSettings() {
    const config = data().settings.dashboard;
    const labels = {
      pending: "Zu prüfen",
      loans: "Kredite",
      transactions: "Letzte Buchungen"
    };
    const keys = Object.keys(labels);

    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Dashboard anpassen</h2>
      </div>
      <div class="section-title page-title-spacer"></div>
      <div class="card page-card form">
        <div class="notice">
          Gesamtkontostand sowie Einnahmen und Ausgaben bleiben immer oben.
          Die Module darunter können ausgeblendet und neu geordnet werden.
        </div>
        ${keys.map(key => `
          <div class="dashboard-config-row">
            <div>
              <strong>${labels[key]}</strong>
              ${["loans","transactions"].includes(key) ? '<div class="meta">Anzahl sichtbarer Einträge</div>' : ""}
            </div>
            <div class="config-controls">
              <input class="toggle" type="checkbox" data-enable="${key}" ${config[key].enabled !== false ? "checked" : ""}>
              ${["loans","transactions"].includes(key)
                ? `<input type="number" min="0" max="${key === "loans" ? 3 : 20}" value="${config[key].count ?? 0}" data-count="${key}">`
                : ""}
              <select data-order="${key}">
                ${[1,2,3].map(number => `<option value="${number}" ${Number(config[key].order) === number ? "selected" : ""}>${number}</option>`).join("")}
              </select>
            </div>
          </div>
        `).join("")}
        <button class="btn primary" id="saveDashboard">Speichern</button>
      </div>
    `;
  }

  function settings() {
    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Einstellungen & Daten</h2>
      </div>

      <div class="card grouped-card settings-group settings-actions">
        <button class="settings-row" id="backupButton">
          <span class="settings-icon">${icons.download}</span>
          <span class="settings-copy">
            <strong>Backup erstellen</strong>
            <small>Lokale Finanzdaten als Datei sichern</small>
          </span>
          <span class="row-chevron">${icons.chevron}</span>
        </button>

        <label class="settings-row settings-file-row" for="restoreInput">
          <span class="settings-icon">${icons.restore}</span>
          <span class="settings-copy">
            <strong>Backup wiederherstellen</strong>
            <small>Eine FinanceOS-Sicherung importieren</small>
          </span>
          <span class="row-chevron">${icons.chevron}</span>
          <input id="restoreInput" type="file" accept="application/json" hidden>
        </label>

        <button class="settings-row settings-danger-row" id="resetButton">
          <span class="settings-icon">${icons.reset}</span>
          <span class="settings-copy">
            <strong>Beispieldaten zurücksetzen</strong>
            <small>Lokale Daten auf den Ausgangszustand setzen</small>
          </span>
          <span class="row-chevron">${icons.chevron}</span>
        </button>
      </div>

      ${privacyNote("Daten bleiben auf diesem Gerät. Keine Anmeldung erforderlich.")}
      <div class="notice settings-version">
        FinanceOS ${APP_VERSION} · Backups werden lokal erstellt und nur von dir weitergegeben.
      </div>
    `;
  }


  function accounts() {
    const rows = data().accounts.map(item => `
      <button class="account-row" data-account-open="${item.id}">
        <span class="account-row-icon">${icons.wallet}</span>
        <span class="account-row-copy">
          <strong>${esc(item.name)}</strong>
          <small>${esc(item.type)}</small>
        </span>
        <span class="account-row-balance">${euro(accountBalance(data(), item.id))}</span>
        <span class="row-chevron">${icons.chevron}</span>
      </button>
    `).join("");

    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Konten</h2>
      </div>
      <div class="card account-list">
        ${rows || '<div class="empty">Keine Konten vorhanden</div>'}
      </div>
    `;
  }

  function accountDetail(accountId) {
    const currentAccount = account(accountId);
    if (!currentAccount) {
      return `
        <div class="page-header">
          <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
          <h2 class="page-heading">Konto</h2>
        </div>
        <div class="card empty">Konto nicht gefunden</div>
      `;
    }

    const items = sortNewest(
      data().transactions.filter(item => item.accountId === currentAccount.id)
    );
    const incomeTotal = items
      .filter(item => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const expenseTotal = items
      .filter(item => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const balance = accountBalance(data(), currentAccount.id);

    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">${esc(currentAccount.name)}</h2>
      </div>

      <section class="card account-detail-hero">
        <div class="account-detail-icon">${icons.wallet}</div>
        <div class="account-detail-copy">
          <span>${esc(currentAccount.type)}</span>
          <strong class="${balance > 0 ? "positive" : balance < 0 ? "negative" : ""}">${euro(balance)}</strong>
          <small>Aktueller Kontostand</small>
        </div>
      </section>

      <section class="card account-detail-summary">
        <div>
          <span>Einnahmen</span>
          <strong class="positive">${euro(incomeTotal)}</strong>
        </div>
        <div class="account-detail-divider"></div>
        <div>
          <span>Ausgaben</span>
          <strong class="negative">${euro(expenseTotal)}</strong>
        </div>
      </section>

      <div class="section-title">
        <h2 class="section-heading">Buchungen</h2>
        <span class="section-context">${items.length}</span>
      </div>

      <div class="card transaction-list account-transaction-list">
        ${items.length
          ? items.map(item => transactionRow(item, true)).join("")
          : '<div class="empty">Noch keine Buchungen auf diesem Konto</div>'}
      </div>
    `;
  }

  function income() {
    const items = sortNewest(data().transactions.filter(item => item.type === "income"));
    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Einnahmen</h2>
      </div>
      <div class="section-title page-title-spacer"></div>
      <div class="card transaction-list">
        ${items.length ? items.map(item => transactionRow(item, true)).join("") : '<div class="empty">Keine Einnahmen</div>'}
      </div>
    `;
  }

  function expenses() {
    const items = sortNewest(data().transactions.filter(item => item.type === "expense"));
    return `
      <div class="page-header">
        <button class="back-button" data-back aria-label="Zurück">${icons.back}</button>
        <h2 class="page-heading">Ausgaben</h2>
      </div>
      <div class="section-title page-title-spacer"></div>
      <div class="card transaction-list">
        ${items.length ? items.map(item => transactionRow(item, true)).join("") : '<div class="empty">Keine Ausgaben</div>'}
      </div>
    `;
  }

  return {
    dashboard, transactions, addTransaction, pending, budgets,
    loans, more, importStatement, importTransactions, manage, dashboardSettings, settings,
    accounts, accountDetail, income, expenses, addTransactionSheet, transactionRow
  };
}
