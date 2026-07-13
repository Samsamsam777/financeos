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
    dashboard: DEFAULT_DASHBOARD,
    transactionsFilterOpen: false
  },
  accounts: [
    { id: "a1", name: "Gemeinschaftskonto", type: "Girokonto", start: 2500 },
    { id: "a2", name: "Kreditkarte", type: "Kreditkarte", start: 0 },
    { id: "a3", name: "Bargeld", type: "Bargeld", start: 100 }
  ],
  categories: DEFAULT_CATEGORIES,
  rules: DEFAULT_RULES,
  transactions: [],
  importDrafts: [],
  recurringTransactions: [],
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


const DEMO_MERCHANTS = [
  ["REWE", "c1", 18, 95],
  ["EDEKA", "c1", 15, 82],
  ["Lidl", "c1", 12, 70],
  ["Spotify", "c6", 10.99, 10.99],
  ["Netflix", "c6", 13.99, 17.99],
  ["Amazon", "c5", 12, 145],
  ["Shell", "c4", 35, 92],
  ["Deutsche Bahn", "c4", 14, 120],
  ["Restaurant", "c3", 22, 86],
  ["Apotheke", "c7", 8, 55],
  ["Kino", "c8", 10, 38]
];

function seededNumber(seedValue) {
  let seed = seedValue % 2147483647;
  if (seed <= 0) seed += 2147483646;
  return () => {
    seed = seed * 16807 % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function createDemoTransactions(accountId, count, seedOffset) {
  const random = seededNumber(4700 + seedOffset);
  const transactions = [];
  const todayDate = new Date();

  for (let index = 0; index < count; index += 1) {
    const merchant = DEMO_MERCHANTS[Math.floor(random() * DEMO_MERCHANTS.length)];
    const [description, categoryId, minimum, maximum] = merchant;
    const date = new Date(todayDate);
    date.setDate(date.getDate() - Math.floor(random() * 180));

    const isIncome = index % 23 === 0;
    const amount = isIncome
      ? 600 + Math.round(random() * 2800)
      : Math.round((minimum + random() * (maximum - minimum)) * 100) / 100;

    transactions.push({
      id: `demo-${accountId}-${index + 1}`,
      createdAt: Date.now() - index * 1000 - seedOffset,
      date: date.toISOString().slice(0, 10),
      type: isIncome ? "income" : "expense",
      amount,
      description: isIncome ? (index % 46 === 0 ? "Gehalt" : "Erstattung") : description,
      originalDescription: isIncome ? "" : description,
      accountId,
      categoryId: isIncome ? "c9" : categoryId,
      person: accountId === "a3" ? "Gemeinsam" : (index % 5 === 0 ? "Partnerin" : "Gemeinsam"),
      status: "done",
      source: "demo"
    });
  }

  return transactions;
}

function isLegacyDemoState(data) {
  if (!Array.isArray(data.transactions) || data.transactions.length > 3) return false;
  const descriptions = new Set(data.transactions.map(item => item.description));
  return descriptions.has("Gehalt") &&
    descriptions.has("REWE Markt") &&
    [...descriptions].some(value => String(value).includes("PAYPAL"));
}

function installExpandedDemoData(data) {
  if (data.settings?.expandedDemoDataInstalled) return data;
  if (!isLegacyDemoState(data)) return data;

  data.transactions = [
    ...createDemoTransactions("a1", 100, 1),
    ...createDemoTransactions("a2", 50, 2),
    ...createDemoTransactions("a3", 30, 3)
  ];
  data.settings.expandedDemoDataInstalled = true;
  return data;
}

function seedExamples(data) {
  data.transactions = [
    ...createDemoTransactions("a1", 100, 1),
    ...createDemoTransactions("a2", 50, 2),
    ...createDemoTransactions("a3", 30, 3)
  ];
  data.settings.expandedDemoDataInstalled = true;
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
  data.settings.transactionsFilterOpen ??= false;

  if (data.settings.dashboard.today && !data.settings.dashboard.summary) {
    data.settings.dashboard.summary = data.settings.dashboard.today;
    delete data.settings.dashboard.today;
  }
  if (Number(data.settings.dashboard.loans?.count) === 2) {
    data.settings.dashboard.loans.count = 3;
  }

  data.accounts ??= [];
  data.categories ??= clone(DEFAULT_CATEGORIES);
  if (!data.categories.some(item => item.id === "c11")) data.categories.push({ id: "c11", name: "Umbuchungen", budget: 0 });
  data.rules = (data.rules ?? []).map(rule => ({
    ...rule,
    id: rule.id ?? makeId()
  }));
  data.importDrafts = (data.importDrafts ?? []).map((draft, index) => ({
    ...draft,
    createdAt: draft.createdAt ?? Date.parse(draft.date) ?? index,
    reviewState: draft.reviewState ?? "ready",
    source: draft.source ?? "import"
  }));
  data.recurringTransactions = (data.recurringTransactions ?? []).map(item => ({
    ...item,
    frequency: item.frequency ?? "monthly",
    startDate: item.startDate ?? `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${String(item.day ?? 1).padStart(2,"0")}`,
    nextDueDate: item.nextDueDate ?? item.startDate ?? `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${String(item.day ?? 1).padStart(2,"0")}`,
    active: item.active !== false
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

  installExpandedDemoData(data);
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
