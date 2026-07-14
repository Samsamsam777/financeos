import assert from "node:assert/strict";
import test from "node:test";

import {
  buildImportPreview,
  detectColumns,
  parseAmount,
  parseCSV,
  parseDate
} from "../src/import.js";

test("parseCSV verarbeitet Semikolon, Anführungszeichen und eingebettete Trennzeichen", () => {
  const parsed = parseCSV([
    "Datum;Beschreibung;Betrag",
    "01.07.2026;\"REWE; Markt\";-12,34",
    "02.07.2026;\"Text mit \"\"Zitat\"\"\";1.234,56"
  ].join("\n"));

  assert.equal(parsed.separator, ";");
  assert.equal(parsed.rows[0].record.Beschreibung, "REWE; Markt");
  assert.equal(parsed.rows[1].record.Beschreibung, "Text mit \"Zitat\"");
});

test("detectColumns erkennt gebräuchliche deutsche Banküberschriften", () => {
  assert.deepEqual(
    detectColumns(["Buchungstag", "Verwendungszweck", "Betrag EUR"]),
    {
      date: "Buchungstag",
      description: "Verwendungszweck",
      amount: "Betrag EUR"
    }
  );
});

test("Beträge und Datumswerte werden in ein stabiles Format normalisiert", () => {
  assert.equal(parseAmount("1.234,56 €"), 1234.56);
  assert.equal(parseAmount("-42,10"), -42.1);
  assert.equal(parseDate("31.12.24"), "2024-12-31");
  assert.equal(parseDate("2026-07-14"), "2026-07-14");
  assert.equal(parseDate("kein Datum"), "");
});

test("buildImportPreview erkennt Händler, Kategorie und Duplikat", () => {
  const data = {
    categories: [
      { id: "c1", name: "Lebensmittel" },
      { id: "c10", name: "Später zuordnen" }
    ],
    rules: [{ id: "r1", needle: "REWE", categoryId: "c1" }],
    settings: { people: ["Sam"] },
    transactions: [{
      accountId: "a1",
      date: "2026-07-01",
      amount: 12.34,
      description: "REWE"
    }]
  };
  const parsed = parseCSV([
    "Datum;Beschreibung;Betrag",
    "01.07.2026;REWE Markt;-12,34"
  ].join("\n"));

  const [item] = buildImportPreview({
    parsed,
    columns: detectColumns(parsed.headers),
    accountId: "a1",
    data,
    makeId: () => "import-1"
  });

  assert.equal(item.id, "import-1");
  assert.equal(item.type, "expense");
  assert.equal(item.amount, 12.34);
  assert.equal(item.description, "REWE");
  assert.equal(item.categoryId, "c1");
  assert.equal(item.duplicate, true);
  assert.equal(item.selected, false);
  assert.equal(item.recognition, "recognized");
});

test("ungültige CSV-Zeilen werden nicht vorausgewählt", () => {
  const data = {
    categories: [{ id: "c10", name: "Später zuordnen" }],
    rules: [],
    settings: { people: ["Gemeinsam"] },
    transactions: []
  };
  const parsed = parseCSV("Datum;Beschreibung;Betrag\nnie;Unklar;0,00");
  const [item] = buildImportPreview({
    parsed,
    columns: detectColumns(parsed.headers),
    accountId: "a1",
    data,
    makeId: () => "invalid"
  });

  assert.equal(item.valid, false);
  assert.equal(item.selected, false);
  assert.equal(item.status, "pending");
});
