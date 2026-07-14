import assert from "node:assert/strict";
import test from "node:test";

import { classifyPDF, parseWithRegistry, selectParser } from "../src/pdf-parsers.js";

const data = {
  categories: [
    { id: "c1", name: "Lebensmittel" },
    { id: "c10", name: "Später zuordnen" }
  ],
  rules: [{ id: "r1", needle: "REWE", categoryId: "c1" }],
  settings: { people: ["Sam"] },
  transactions: []
};

test("classifyPDF unterscheidet Text-, Tabellen- und Bild-PDFs", () => {
  assert.equal(classifyPDF([{ pageNumber: 1, lines: ["Ein ausreichend langer Kontoauszugstext ohne erkennbare Buchungszeile"] }]).pdfType, "text");
  assert.equal(classifyPDF([{ pageNumber: 1, lines: ["01.07.2026 REWE MARKT BERLIN FILIALE -12,34 EUR"] }]).pdfType, "table");
  assert.equal(classifyPDF([{ pageNumber: 1, lines: [""] }]).pdfType, "image");
});

test("selectParser wählt keinen Parser für Bild-PDFs", () => {
  assert.equal(selectParser({ pdfType: "image", bank: "unknown" }), null);
});

test("parseWithRegistry erzeugt kontrollierte Importentwürfe", () => {
  const result = parseWithRegistry({
    pages: [{ pageNumber: 1, lines: ["01.07.2026 REWE MARKT BERLIN FILIALE -12,34 EUR"] }],
    accountId: "a1",
    data,
    makeId: () => "pdf-1"
  });

  assert.equal(result.parser.id, "generic-table");
  assert.equal(result.requiresOCR, false);
  assert.equal(result.items.length, 1);
  assert.deepEqual(
    {
      id: result.items[0].id,
      date: result.items[0].date,
      type: result.items[0].type,
      amount: result.items[0].amount,
      description: result.items[0].description,
      categoryId: result.items[0].categoryId,
      selected: result.items[0].selected
    },
    {
      id: "pdf-1",
      date: "2026-07-01",
      type: "expense",
      amount: 12.34,
      description: "REWE",
      categoryId: "c1",
      selected: true
    }
  );
});

test("parseWithRegistry fordert OCR für inhaltslose Bild-PDFs", () => {
  const result = parseWithRegistry({
    pages: [{ pageNumber: 1, lines: [] }],
    accountId: "a1",
    data,
    makeId: () => "unused"
  });

  assert.equal(result.parser, null);
  assert.equal(result.requiresOCR, true);
  assert.deepEqual(result.items, []);
});
