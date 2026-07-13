import { createWorker, PSM } from "../vendor/tesseract/tesseract.esm.min.js";
import { matchCategoryRule, normalizeMerchant } from "./logic.js";

const AMOUNT_PATTERN = /([+\-−–]?)\s*(\d{1,3}(?:[.\s]\d{3})*,\d{2})\s*€/;
const ISO_DATE_PATTERN = /\b(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2})?\b/;
const DE_DATE_PATTERN = /\b(\d{2})[.\/-](\d{2})[.\/-](\d{2,4})\b/;

const META_PATTERNS = [
  /^FINANCEOS$/i,
  /^HEUTE$/i,
  /^GESTERN$/i,
  /^KONTOSTAND/i,
  /^BUCHUNGEN$/i,
  /^DEBITK\./i,
  /^KREDITK\./i,
  /^GIROKARTE/i,
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/,
  /^\d{2}[.\/-]\d{2}[.\/-]\d{2,4}/,
  /^[+\-−–]?\s*\d+[.,]\d{2}\s*€?$/
];

function parseTSV(tsv = "") {
  const rows = String(tsv).trim().split(/\r?\n/);
  if (rows.length < 2) return [];

  const headers = rows[0].split("\t");
  const index = Object.fromEntries(headers.map((name, i) => [name, i]));
  const groups = new Map();

  for (const rawRow of rows.slice(1)) {
    const columns = rawRow.split("\t");
    if (columns.length < headers.length) continue;

    const text = columns[index.text]?.trim();
    const confidence = Number(columns[index.conf] ?? -1);
    if (!text || confidence < 20) continue;

    const key = [
      columns[index.page_num],
      columns[index.block_num],
      columns[index.par_num],
      columns[index.line_num]
    ].join(":");

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({
      text,
      confidence,
      left: Number(columns[index.left] ?? 0),
      top: Number(columns[index.top] ?? 0),
      width: Number(columns[index.width] ?? 0),
      height: Number(columns[index.height] ?? 0)
    });
  }

  return [...groups.values()]
    .map(words => {
      const sorted = words.sort((a, b) => a.left - b.left);
      const left = Math.min(...sorted.map(word => word.left));
      const top = Math.min(...sorted.map(word => word.top));
      const right = Math.max(...sorted.map(word => word.left + word.width));
      const bottom = Math.max(...sorted.map(word => word.top + word.height));

      return {
        text: sorted.map(word => word.text).join(" ").replace(/\s+/g, " ").trim(),
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
        confidence: sorted.reduce((sum, word) => sum + word.confidence, 0) / sorted.length
      };
    })
    .filter(line => line.text)
    .sort((a, b) => a.top - b.top || a.left - b.left);
}

function parseDate(text = "") {
  const iso = String(text).match(ISO_DATE_PATTERN);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const german = String(text).match(DE_DATE_PATTERN);
  if (german) {
    let [, day, month, year] = german;
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }

  return "";
}

function isMetaLine(text = "") {
  const value = String(text).trim();
  return !value || META_PATTERNS.some(pattern => pattern.test(value));
}

function parseAmount(text = "") {
  const match = String(text).match(AMOUNT_PATTERN);
  if (!match) return null;

  const sign = match[1];
  const value = Number(match[2].replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(value)) return null;

  return {
    amount: Math.abs(value),
    type: sign === "+" ? "income" : "expense"
  };
}

function findMerchantLine(lines, amountLine, imageWidth) {
  const candidates = lines.filter(line => {
    if (line.top >= amountLine.top + amountLine.height * 0.4) return false;
    const distance = amountLine.top - line.bottom;
    if (distance < -12 || distance > 260) return false;
    if (line.left > imageWidth * 0.78) return false;
    if (isMetaLine(line.text)) return false;
    if (parseAmount(line.text)) return false;
    return line.text.length >= 2;
  });

  return candidates
    .sort((a, b) => {
      const distanceA = amountLine.top - a.bottom;
      const distanceB = amountLine.top - b.bottom;
      const scoreA = distanceA - Math.min(a.height, 40) * 1.5;
      const scoreB = distanceB - Math.min(b.height, 40) * 1.5;
      return scoreA - scoreB;
    })[0] ?? null;
}

function findDate(lines, merchantLine, amountLine) {
  const candidates = lines.filter(line => {
    if (line.top < merchantLine.top - 10) return false;
    if (line.top > amountLine.bottom + 20) return false;
    return Boolean(parseDate(line.text));
  });

  return candidates
    .sort((a, b) => Math.abs(a.top - merchantLine.bottom) - Math.abs(b.top - merchantLine.bottom))
    .map(line => parseDate(line.text))
    .find(Boolean) ?? "";
}

function preprocessBitmap(bitmap) {
  const targetWidth = Math.min(2200, Math.max(bitmap.width, 1500));
  const scale = targetWidth / bitmap.width;
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(bitmap, 0, 0, width, height);

  const image = context.getImageData(0, 0, width, height);
  const pixels = image.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const luminance = pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114;
    const inverted = 255 - luminance;
    const contrasted = Math.max(0, Math.min(255, (inverted - 128) * 1.35 + 128));

    pixels[index] = contrasted;
    pixels[index + 1] = contrasted;
    pixels[index + 2] = contrasted;
    pixels[index + 3] = 255;
  }

  context.putImageData(image, 0, 0);
  return canvas;
}

export async function recognizeBankingScreenshot(file, onProgress = () => {}) {
  let bitmap = null;
  let canvas = null;
  let worker = null;

  try {
    bitmap = await createImageBitmap(file);
    canvas = preprocessBitmap(bitmap);
    bitmap.close();
    bitmap = null;

    worker = await createWorker(["deu", "eng"], 1, {
      workerPath: "./vendor/tesseract/worker.min.js",
      corePath: "./vendor/tesseract/core",
      langPath: "./vendor/tesseract/lang-data",
      cacheMethod: "none",
      workerBlobURL: false,
      logger: message => {
        const progress = Number(message.progress ?? 0);
        onProgress({
          status: message.status ?? "recognizing text",
          progress: Number.isFinite(progress) ? progress : 0
        });
      }
    });

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      preserve_interword_spaces: "1"
    });

    const result = await worker.recognize(
      canvas,
      {},
      { text: true, tsv: true }
    );

    return {
      lines: parseTSV(result.data.tsv),
      width: canvas.width,
      height: canvas.height
    };
  } finally {
    try { await worker?.terminate(); } catch {}
    try { bitmap?.close(); } catch {}

    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}

export function buildScreenshotTransactions({
  recognition,
  accountId,
  data,
  makeId
}) {
  const existingKeys = new Set(
    (data.transactions ?? []).map(item =>
      [
        item.accountId,
        item.date,
        Number(item.amount).toFixed(2),
        String(item.description ?? "").toUpperCase()
      ].join("|")
    )
  );

  const amountLines = recognition.lines.filter(line =>
    parseAmount(line.text) &&
    (line.left > recognition.width * 0.50 || line.text.trim().endsWith("€"))
  );

  const items = [];
  const seen = new Set();

  for (const amountLine of amountLines) {
    const parsedAmount = parseAmount(amountLine.text);
    const merchantLine = findMerchantLine(recognition.lines, amountLine, recognition.width);
    if (!parsedAmount || !merchantLine) continue;

    const date = findDate(recognition.lines, merchantLine, amountLine);
    if (!date) continue;

    const merchant = normalizeMerchant(merchantLine.text);
    const description = merchant.canonical || merchantLine.text;
    const match = matchCategoryRule(data, description);
    const fallback = data.categories.find(item => item.name === "Später zuordnen")?.id ?? "";
    const categoryId = match.categoryId || fallback;

    const localKey = [date, parsedAmount.amount.toFixed(2), description.toUpperCase()].join("|");
    if (seen.has(localKey)) continue;
    seen.add(localKey);

    const duplicateKey = [
      accountId,
      date,
      parsedAmount.amount.toFixed(2),
      description.toUpperCase()
    ].join("|");

    const duplicate = existingKeys.has(duplicateKey);

    items.push({
      id: makeId(),
      createdAt: Date.now() + items.length,
      date,
      type: parsedAmount.type,
      amount: parsedAmount.amount,
      description,
      originalDescription: merchantLine.text,
      merchantKey: merchant.key,
      accountId,
      categoryId,
      person: data.settings.people?.[0] ?? "Gemeinsam",
      status: data.categories.find(item => item.id === categoryId)?.name === "Später zuordnen"
        ? "pending"
        : "done",
      duplicate,
      selected: !duplicate,
      recognitionConfidence: Math.round((merchantLine.confidence + amountLine.confidence) / 2)
    });
  }

  recognition.lines.splice(0);
  return items;
}
