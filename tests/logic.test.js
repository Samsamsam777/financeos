import assert from "node:assert/strict";
import test from "node:test";

import {
  accountBalance,
  filterTransactions,
  loanProgress,
  matchCategoryRule,
  monthSummary,
  normalizeMerchant,
  sortNewest,
  totalBalance,
  upsertMerchantRule
} from "../src/logic.js";

const baseData = () => ({
  accounts: [
    { id: "a1", start: 100 },
    { id: "a2", start: 50 }
  ],
  categories: [
    { id: "c1", name: "Lebensmittel" },
    { id: "c10", name: "Später zuordnen" }
  ],
  rules: [{ id: "r1", needle: "REWE", categoryId: "c1" }],
  transactions: [
    {
      id: "t1",
      accountId: "a1",
      date: "2026-07-01",
      createdAt: 1,
      type: "income",
      amount: 40,
      description: "Gehalt",
      categoryId: "c1",
      person: "Sam"
    },
    {
      id: "t2",
      accountId: "a1",
      date: "2026-07-02",
      createdAt: 2,
      type: "expense",
      amount: 25,
      description: "REWE Markt",
      categoryId: "c1",
      person: "Sam"
    },
    {
      id: "t3",
      accountId: "a2",
      date: "2026-06-30",
      createdAt: 3,
      type: "expense",
      amount: 10,
      description: "Alt",
      categoryId: "c10",
      person: "Gemeinsam"
    }
  ]
});

test("accountBalance berücksichtigt Startsaldo, Einnahmen und Ausgaben", () => {
  const data = baseData();
  assert.equal(accountBalance(data, "a1"), 115);
  assert.equal(accountBalance(data, "a2"), 40);
});

test("totalBalance aggregiert alle Konten", () => {
  assert.equal(totalBalance(baseData()), 155);
});

test("monthSummary ignoriert ausgeschlossene Buchungen", () => {
  const data = baseData();
  data.transactions.push({
    id: "t4",
    accountId: "a1",
    date: "2026-07-03",
    type: "expense",
    amount: 999,
    excludeFromAnalytics: true
  });

  assert.deepEqual(monthSummary(data, "2026-07"), {
    income: 40,
    expense: 25,
    available: 15,
    savingsRate: 0.375
  });
});

test("sortNewest nutzt createdAt als stabilen zweiten Schlüssel", () => {
  const items = [
    { id: "old", date: "2026-07-01", createdAt: 1 },
    { id: "new", date: "2026-07-01", createdAt: 2 },
    { id: "latest-date", date: "2026-07-02", createdAt: 0 }
  ];

  assert.deepEqual(sortNewest(items).map(item => item.id), [
    "latest-date",
    "new",
    "old"
  ]);
  assert.equal(items[0].id, "old");
});

test("filterTransactions kombiniert Suche, Konto und Sortierung", () => {
  const result = filterTransactions(baseData(), {
    query: "lebens",
    account: "a1",
    category: "",
    person: "Sam",
    sort: "amount-desc"
  });

  assert.deepEqual(result.map(item => item.id), ["t1", "t2"]);
});

test("loanProgress begrenzt den Fortschritt auf 0 bis 100", () => {
  assert.deepEqual(loanProgress({ principal: 1000, remaining: 250 }), {
    paid: 750,
    percent: 75
  });
  assert.equal(loanProgress({ principal: 1000, remaining: -50 }).percent, 100);
  assert.equal(loanProgress({ principal: 1000, remaining: 1200 }).percent, 0);
});

test("normalizeMerchant entfernt Bankmetadaten und verwendet bekannte Händler", () => {
  assert.deepEqual(
    normalizeMerchant("LASTSCHRIFT REWE TERMINAL 12345 IBAN DE001234"),
    { raw: "LASTSCHRIFT REWE TERMINAL 12345 IBAN DE001234", canonical: "REWE", key: "REWE" }
  );
});

test("Regeln werden über den normalisierten Händler gefunden und aktualisiert", () => {
  const data = baseData();
  const match = matchCategoryRule(data, "Kartenzahlung REWE Markt");
  assert.equal(match.categoryId, "c1");
  assert.equal(match.matched, true);

  upsertMerchantRule(data, "REWE Markt", "c10", () => "new-rule");
  assert.equal(data.rules.length, 1);
  assert.equal(data.rules[0].categoryId, "c10");
});
