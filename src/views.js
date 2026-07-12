import { APP_VERSION } from "./constants.js";
import { icons, loanIcon, merchantVisual } from "./icons.js";
import {
  accountBalance, euro, filterTransactions, loanProgress,
  monthKey, monthSummary, sortNewest, today, totalBalance
} from "./logic.js";
import { esc, field } from "./ui.js";

export function createViews(context) {
  const { getData, navigate, openTransaction, openLoan, saveDashboard } = context;
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
          <div class="merchant-icon ${visual.className}">${esc(visual.mark)}</div>
          <div class="transaction-copy">
            <strong>${esc(transaction.description)}</strong>
            <div class="meta">${esc(category(transaction.categoryId)?.name ?? "—")} · ${esc(account(transaction.accountId)?.name ?? "—")}</div>
          </div>
        </div>
        <div class="transaction-amount ${amountClass}">
          ${transaction.type === "income" ? "+" : "-"}${euro(transaction.amount)}
          ${editable ? `<div><button class="btn ghost" data-edit="${transaction.id}">Bearbeiten</button></div>` : ""}
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
        const oldestPending = sortNewest(pending).at(-1);
        const oldestLabel = oldestPending
          ? new Date(oldestPending.date + "T00:00:00").toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})
          : "—";
        return `
        <section class="dashboard-module">
          <div class="section-title"><h2 class="section-heading">Zu prüfen</h2><span class="small">${oldestPending ? `seit ${oldestLabel}` : "nichts offen"}</span></div>
          <button class="card pending-card pending-action" data-nav="pending">
            <div class="pending-row">
              <div class="pending-left">
                <div class="pending-icon">${icons.pending}</div>
                <span class="pending-copy"><strong>Unklare Buchungen</strong><span class="meta">Später zuordnen</span></span>
              </div>
              <span class="pending-count" aria-label="${pending.length} offene Zuordnungen">${pending.length}</span>
            </div>
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

    return `
      <section class="dashboard-module">
        <div class="section-title">
          <h2 class="section-heading">Kredite</h2>
          <button class="section-link" data-nav="loans">Alle Kredite →</button>
        </div>
        <div class="loan-list">
          ${loans.map(loan => {
            const { percent } = loanProgress(loan);
            const visualEnd = Math.min(100, percent + 4);
            return `
              <div class="card loan-strip" data-loan="${loan.id}" style="--loan-progress:${percent}%;--loan-visual-end:${visualEnd}%">
                <div class="loan-fill"></div>
                <div class="loan-content">
                  <div class="loan-icon">${loanIcon(loan.type)}</div>
                  <div class="loan-name">${esc(loan.name)}</div>
                  <div class="loan-percent">${Math.round(percent)} %</div>
                </div>
              </div>
            `;
          }).join("")}
          ${hiddenCount ? `<button class="loan-more" data-nav="loans">+${hiddenCount} weitere →</button>` : ""}
        </div>
      </section>
    `;
  }

  function transactionPreview(count = 6) {
    const transactions = sortNewest(data().transactions).slice(0, Math.max(0, Number(count)));
    if (!transactions.length) return "";

    return `
      <section class="dashboard-module">
        <div class="section-title"><h2 class="section-heading">Letzte Buchungen</h2><button class="section-link" data-nav="transactions">Alle Buchungen →</button></div>
        <div class="card transaction-list">${transactions.map(item => transactionRow(item)).join("")}</div>
      </section>
    `;
  }

  function transactions(filters) {
    const items = filterTransactions(data(), filters);
    return `
      <div class="section-title"><h2>Buchungen</h2><button class="btn primary" data-nav="add">＋ Neu</button></div>
      <div class="card page-card filters">
        <div class="form">
          ${field("Suche", `<input id="filterQuery" value="${esc(filters.query)}" placeholder="Händler, Kategorie oder Betrag">`)}
          <div class="grid two">
            ${field("Konto", `<select id="filterAccount"><option value="">Alle</option>${data().accounts.map(item => `<option value="${item.id}" ${filters.account === item.id ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
            ${field("Kategorie", `<select id="filterCategory"><option value="">Alle</option>${data().categories.map(item => `<option value="${item.id}" ${filters.category === item.id ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select>`)}
            ${field("Person", `<select id="filterPerson"><option value="">Alle</option>${data().settings.people.map(item => `<option ${filters.person === item ? "selected" : ""}>${esc(item)}</option>`).join("")}</select>`)}
            ${field("Sortierung", `<select id="filterSort"><option value="newest">Neueste zuerst</option><option value="amount-desc" ${filters.sort === "amount-desc" ? "selected" : ""}>Betrag absteigend</option><option value="amount-asc" ${filters.sort === "amount-asc" ? "selected" : ""}>Betrag aufsteigend</option></select>`)}
          </div>
        </div>
      </div>
      <div class="card transaction-list">${items.length ? items.map(item => transactionRow(item, true)).join("") : '<div class="empty">Keine Treffer</div>'}</div>
    `;
  }

  function addTransaction() {
    return `
      <div class="section-title"><h2>Neue Buchung</h2></div>
      <div class="card page-card">
        <form id="transactionForm" class="form">
          ${field("Datum", `<input name="date" type="date" value="${today()}" required>`)}
          ${field("Typ", `<select name="type"><option value="expense">Ausgabe</option><option value="income">Einnahme</option></select>`)}
          ${field("Betrag", `<input name="amount" type="number" inputmode="decimal" step="0.01" placeholder="0,00" required>`)}
          ${field("Beschreibung", `<input name="description" placeholder="z. B. REWE Markt" required>`)}
          ${field("Konto", `<select name="accountId">${data().accounts.map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join("")}</select>`)}
          ${field("Kategorie", `<select name="categoryId"><option value="">Automatisch erkennen</option>${data().categories.map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join("")}</select>`)}
          ${field("Person (optional)", `<select name="person">${data().settings.people.map(item => `<option>${esc(item)}</option>`).join("")}</select>`)}
          <button class="btn primary">Buchung speichern</button>
        </form>
      </div>
    `;
  }

  function pending() {
    const items = sortNewest(data().transactions.filter(item => item.status === "pending"));
    return `
      <div class="section-title"><h2>Später zuordnen</h2><span class="count-badge">${items.length}</span></div>
      <div class="card page-list">
        ${items.length ? items.map(item => `
          <div class="page-row">
            <div><strong>${esc(item.description)}</strong><div class="meta">${euro(item.amount)} · ${esc(item.person)}</div></div>
            <button class="btn ghost" data-resolve="${item.id}">Zuordnen</button>
          </div>
        `).join("") : '<div class="empty">Alles erledigt</div>'}
      </div>
    `;
  }

  function budgets() {
    const key = monthKey(today());
    const transactions = data().transactions.filter(item =>
      monthKey(item.date) === key && item.type === "expense"
    );

    return `
      <div class="section-title"><h2>Budgets</h2><span class="small">${key}</span></div>
      <div class="card page-list">
        ${data().categories.filter(item => item.budget > 0).map(item => {
          const used = transactions
            .filter(transaction => transaction.categoryId === item.id)
            .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
          const percent = Math.min(100, item.budget ? used / item.budget * 100 : 0);
          return `
            <div class="page-row">
              <div style="flex:1">
                <strong>${esc(item.name)}</strong>
                <div class="meta">${euro(used)} von ${euro(item.budget)}</div>
                <div class="progress"><span style="width:${percent}%"></span></div>
              </div>
              <div>${Math.round(percent)} %</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function loans() {
    return `
      <div class="section-title"><h2 class="section-heading">Kredite</h2></div>
      <div class="card page-list">
        ${data().loans.map(loan => {
          const { paid, percent } = loanProgress(loan);
          return `
            <div class="page-row" data-loan="${loan.id}">
              <div style="display:flex;align-items:center;gap:10px">
                <div class="loan-icon">${loanIcon(loan.type)}</div>
                <div><strong>${esc(loan.name)}</strong><div class="meta">${euro(paid)} abbezahlt · ${Math.round(percent)} %</div></div>
              </div>
              <strong>${euro(loan.remaining)}</strong>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function more() {
    return `
      <div class="section-title"><h2>Mehr</h2></div>
      <div class="grid">
        <button class="card btn" data-nav="dashboard-settings">Dashboard anpassen</button>
        <button class="card btn" data-nav="pending">Später zuordnen</button>
        <button class="card btn" data-nav="loans">Kredite</button>
        <button class="card btn" data-nav="manage">Konten, Kategorien & Regeln</button>
        <button class="card btn" data-nav="settings">Einstellungen & Backup</button>
      </div>
    `;
  }

  function manage() {
    return `
      <div class="section-title"><h2>Konten</h2><button class="btn primary" id="addAccount">＋</button></div>
      <div class="card page-list">${data().accounts.map(item => `<div class="page-row"><div><strong>${esc(item.name)}</strong><div class="meta">${euro(item.start)} Startsaldo</div></div><button class="btn ghost" data-account="${item.id}">Bearbeiten</button></div>`).join("")}</div>
      <div class="section-title"><h2>Kategorien</h2><button class="btn primary" id="addCategory">＋</button></div>
      <div class="card page-list">${data().categories.map(item => `<div class="page-row"><div><strong>${esc(item.name)}</strong><div class="meta">Budget ${euro(item.budget)}</div></div><button class="btn ghost" data-category="${item.id}">Bearbeiten</button></div>`).join("")}</div>
      <div class="section-title"><h2>Händlerregeln</h2><button class="btn primary" id="addRule">＋</button></div>
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
      <div class="section-title"><h2>Dashboard anpassen</h2></div>
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
      <div class="section-title"><h2>Einstellungen & Daten</h2></div>
      <div class="card page-card form">
        <button class="btn primary" id="backupButton">Backup erstellen</button>
        <label class="btn ghost" style="text-align:center">Backup wiederherstellen<input id="restoreInput" type="file" accept="application/json" hidden></label>
        <button class="btn danger ghost" id="resetButton">Beispieldaten zurücksetzen</button>
        <div class="notice">FinanceOS ${APP_VERSION} · Backups auf dem iPhone über „In Dateien sichern“ in iCloud Drive ablegen.</div>
      </div>
    `;
  }


  function accounts() {
    return `
      <div class="section-title"><h2>Konten</h2></div>
      <div class="card page-list">
        ${data().accounts.map(item => `
          <div class="page-row">
            <div><strong>${esc(item.name)}</strong><div class="meta">${esc(item.type)}</div></div>
            <strong>${euro(accountBalance(data(), item.id))}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  function income() {
    const items = sortNewest(data().transactions.filter(item => item.type === "income"));
    return `
      <div class="section-title"><h2>Einnahmen</h2></div>
      <div class="card transaction-list">
        ${items.length ? items.map(item => transactionRow(item, true)).join("") : '<div class="empty">Keine Einnahmen</div>'}
      </div>
    `;
  }

  function expenses() {
    const items = sortNewest(data().transactions.filter(item => item.type === "expense"));
    return `
      <div class="section-title"><h2>Ausgaben</h2></div>
      <div class="card transaction-list">
        ${items.length ? items.map(item => transactionRow(item, true)).join("") : '<div class="empty">Keine Ausgaben</div>'}
      </div>
    `;
  }

  return {
    dashboard, transactions, addTransaction, pending, budgets,
    loans, more, manage, dashboardSettings, settings,
    accounts, income, expenses, transactionRow
  };
}
