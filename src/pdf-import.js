import * as pdfjsLib from "../vendor/pdfjs/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.mjs";

const DATE_PATTERN = /\b(\d{2})[.\/-](\d{2})[.\/-](\d{2,4})\b/;
const AMOUNT_PATTERN = /(-?\d{1,3}(?:[.\s]\d{3})*,\d{2})\s*(?:EUR|€)?\b/g;

function isoDate(value) {
  const match = String(value).match(DATE_PATTERN);
  if (!match) return "";
  let [, day, month, year] = match;
  if (year.length === 2) year = `20${year}`;
  return `${year}-${month}-${day}`;
}

function amountNumber(value) {
  return Number(
    String(value)
      .replace(/\s/g, "")
      .replace(/\.(?=\d{3}(?:\D|$))/g, "")
      .replace(",", ".")
  );
}

function cleanDescription(line) {
  return String(line)
    .replace(DATE_PATTERN, " ")
    .replace(AMOUNT_PATTERN, " ")
    .replace(/\b(EUR|Soll|Haben|Umsatz|Buchungstag|Valuta)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function groupTextItems(items) {
  const rows = new Map();

  for (const item of items) {
    const y = Math.round(item.transform?.[5] ?? 0);
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y).push(item);
  }

  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, rowItems]) =>
      rowItems
        .sort((a, b) => (a.transform?.[4] ?? 0) - (b.transform?.[4] ?? 0))
        .map(item => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);
}

export async function extractPDFLines(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({
    data: bytes,
    useWorkerFetch: false,
    isEvalSupported: false
  });
  const document = await loadingTask.promise;
  const pages = [];

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push({
        pageNumber,
        lines: groupTextItems(content.items)
      });
      page.cleanup();
    }
  } finally {
    await document.destroy();
    loadingTask.destroy?.();
    bytes.fill(0);
  }

  return pages;
}

export async function clearPDFResources(file) {
  try {
    if (file && typeof file.close === "function") await file.close();
  } catch {}
}
