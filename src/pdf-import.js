import * as pdfjsLib from "../vendor/pdfjs/pdf.mjs?v=4.8.4";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.mjs?v=4.8.4";

function groupTextItems(items) {
  const rows = new Map();

  for (const item of items) {
    const x = Number(item.transform?.[4] ?? 0);
    const y = Number(item.transform?.[5] ?? 0);
    const roundedY = Math.round(y * 2) / 2;

    if (!rows.has(roundedY)) rows.set(roundedY, []);
    rows.get(roundedY).push({
      text: String(item.str ?? "").trim(),
      x,
      y
    });
  }

  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([y, rowItems]) => {
      const sorted = rowItems
        .filter(item => item.text)
        .sort((a, b) => a.x - b.x);

      return {
        y,
        items: sorted,
        text: sorted
          .map(item => item.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
      };
    })
    .filter(row => row.text);
}

function isIOSWebKit() {
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const touchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/i.test(userAgent) || touchMac;
}

async function readFreshBytes(file) {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

async function openDocument(file, disableWorker) {
  const bytes = await readFreshBytes(file);

  const loadingTask = pdfjsLib.getDocument({
    data: bytes,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    disableWorker
  });

  try {
    const document = await loadingTask.promise;
    return { loadingTask, document };
  } catch (error) {
    try { loadingTask.destroy?.(); } catch {}
    throw error;
  }
}

async function loadDocument(file) {
  // Safari/iOS has repeatedly detached worker buffers during fallback.
  // Use the stable main-thread parser immediately on those devices.
  if (isIOSWebKit()) {
    return openDocument(file, true);
  }

  try {
    return await openDocument(file, false);
  } catch (workerError) {
    console.warn("FinanceOS PDF worker fallback", workerError);
    // Read the physical File again. No ArrayBuffer or Uint8Array is reused.
    return openDocument(file, true);
  }
}

export async function extractPDFLines(file) {
  let loadingTask = null;
  let document = null;
  const pages = [];

  try {
    const opened = await loadDocument(file);
    loadingTask = opened.loadingTask;
    document = opened.document;

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent({
        includeMarkedContent: false,
        disableNormalization: false
      });

      const rows = groupTextItems(content.items);

      pages.push({
        pageNumber,
        rows,
        lines: rows.map(row => row.text)
      });

      page.cleanup();
    }

    return pages;
  } finally {
    try { await document?.destroy(); } catch {}
    try { loadingTask?.destroy?.(); } catch {}
  }
}

export async function clearPDFResources(file) {
  try {
    if (file && typeof file.close === "function") await file.close();
  } catch {}
}
