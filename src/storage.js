import {
  STORAGE_KEY, DEFAULT_DASHBOARD, DEFAULT_PEOPLE,
  DEFAULT_CATEGORIES, DEFAULT_RULES
} from "./constants.js";

export const makeId = () =>
  crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const clone = value => JSON.parse(JSON.stringify(value));

const seed = {
  settings: {
    currency: "EUR",
    people: DEFAULT_PEOPLE,
    dashboard: DEFAULT_DASHBOARD
  },
  accounts: [
    { id: "a1", name: "Gemeinschaftskonto", type: "Girokonto", start: 2500 },
    { id: "a2", name: "Kreditkarte", type: "Kreditkarte", start: 0 },
    { id: "a3", name: "Bargeld", type: "Bargeld", start: 100 }
  ],
  categories: DEFAULT_CATEGORIES,
  rules: DEFAULT_RULES,
  transactions: [],
  loans: [
    {
      id: "l1",
      name: "Autokredit",
      type: "auto",
      principal: 25000,
      remaining: 14382,
      rate: 420,
      interest: 4.2
    },
    {
      id: "l2",
      name: "Hauskredit",
      type: "home",
      principal: 280000,
      remaining: 251400,
      rate: 1450,
      interest: 3.1
    },
    {
      id: "l3",
      name: "Konsumkredit",
      type: "consumer",
      principal: 8000,
      remaining: 6120,
      rate: 210,
      interest: 6.4
    }
  ]
};

function seedExamples(data) {
  const date = new Date().toISOString().slice(0, 10);
  data.transactions = [
    {
      id: makeId(), createdAt: Date.now() - 2000, date, type: "income",
      amount: 3200, description: "Gehalt", accountId: "a1",
      categoryId: "c9", person: "Gemeinsam", status: "done"
    },
    {
      id: makeId(), createdAt: Date.now() - 1000, date, type: "expense",
      amount: 74.60, description: "REWE Markt", accountId: "a1",
      categoryId: "c1", person: "Gemeinsam", status: "done"
    },
    {
      id: makeId(), createdAt: Date.now(), date, type: "expense",
      amount: 47.90, description: "PAYPAL *M32H8KD", accountId: "a1",
      categoryId: "c10", person: "Unklar", status: "pending"
    }
  ];
}

function migrate(data) {
  data.settings ??= {};
  data.settings.currency ??= "EUR";
  data.settings.people ??= clone(DEFAULT_PEOPLE);
  data.settings.dashboard ??= clone(DEFAULT_DASHBOARD);
  data.settings.entryPreferences ??= {
    accountId: data.accounts?.[0]?.id ?? "",
    person: data.settings.people?.[0] ?? ""
  };

  if (data.settings.dashboard.today && !data.settings.dashboard.summary) {
    data.settings.dashboard.summary = data.settings.dashboard.today;
    delete data.settings.dashboard.today;
  }
  if (Number(data.settings.dashboard.loans?.count) === 2) {
    data.settings.dashboard.loans.count = 3;
  }

  data.accounts ??= [];
  data.categories ??= clone(DEFAULT_CATEGORIES);
  data.rules = (data.rules ?? []).map(rule => ({
    ...rule,
    id: rule.id ?? makeId()
  }));
  data.transactions = (data.transactions ?? []).map((transaction, index) => ({
    ...transaction,
    createdAt: transaction.createdAt ?? Date.parse(transaction.date) ?? index
  }));
  data.loans = (data.loans ?? []).map(loan => ({
    ...loan,
    type: loan.name === "Konsumkredit"
      ? "consumer"
      : (loan.type ?? inferLoanType(loan.name))
  }));

  if (data.loans.length === 1 && data.loans[0]?.id === "l1") {
    data.loans.push(
      {
        id: "l2",
        name: "Hauskredit",
        type: "home",
        principal: 280000,
        remaining: 251400,
        rate: 1450,
        interest: 3.1
      },
      {
        id: "l3",
        name: "Konsumkredit",
        type: "consumer",
        principal: 8000,
        remaining: 6120,
        rate: 210,
        interest: 6.4
      }
    );
  }

  return data;
}

function inferLoanType(name = "") {
  const value = name.toLowerCase();
  if (value.includes("auto") || value.includes("fahrzeug")) return "auto";
  if (value.includes("haus") || value.includes("immobil") || value.includes("wohnung")) return "home";
  if (value.includes("stud")) return "education";
  if (value.includes("motorrad")) return "motorcycle";
  if (value.includes("boot")) return "boat";
  if (value.includes("konsum") || value.includes("privat")) return "consumer";
  if (value.includes("karte")) return "card";
  return "generic";
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (error) {
    console.error("FinanceOS storage read failed", error);
  }

  const data = clone(seed);
  seedExamples(data);
  saveData(data);
  return data;
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

export function createBackup(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `financeos-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function restoreBackup(file) {
  const parsed = JSON.parse(await file.text());
  if (!Array.isArray(parsed.accounts) || !Array.isArray(parsed.transactions)) {
    throw new Error("Ungültiges FinanceOS-Backup");
  }
  saveData(migrate(parsed));
  location.reload();
}
