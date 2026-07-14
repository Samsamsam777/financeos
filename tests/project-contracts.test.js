import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fromRoot = (...parts) => path.join(root, ...parts);

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(target));
    else files.push(target);
  }
  return files;
}

function localPath(reference) {
  return reference.split(/[?#]/, 1)[0].replace(/^\.\//, "");
}

test("verbindliche Projektdokumente sind vollständig vorhanden", async () => {
  const required = [
    "README.md",
    "00_PROJECT_WORKFLOW.md",
    "01_AI_CONTEXT.md",
    "02_PRODUCT.md",
    "03_ARCHITECTURE.md",
    "04_DESIGN_GUIDE.md",
    "05_ENGINEERING.md",
    "06_BACKLOG.md",
    "07_DECISIONS.md",
    "08_ROADMAP.md",
    "09_CHANGELOG.md",
    "10_GLOSSARY.md",
    "11_NAMING_CONVENTIONS.md",
    "12_SECURITY.md",
    "13_TESTING.md",
    "14_PERFORMANCE.md",
    "15_RELEASE_PROCESS.md",
    "16_DAILY_LOG.md"
  ];

  for (const file of required) {
    assert.equal(await exists(fromRoot("docs", file)), true, `${file} fehlt`);
  }
});

test("Repository-Metadaten und Buildskripte sind standardisiert", async () => {
  for (const file of [".editorconfig", ".gitattributes", ".gitignore", ".nvmrc", "README.md"]) {
    assert.equal(await exists(fromRoot(file)), true, `${file} fehlt`);
  }

  const packageJson = JSON.parse(await readFile(fromRoot("package.json"), "utf8"));
  const packageLock = JSON.parse(await readFile(fromRoot("package-lock.json"), "utf8"));

  assert.equal(packageLock.packages[""].version, packageJson.version);
  assert.equal(packageJson.engines.node, ">=24");
  assert.equal(packageJson.scripts.build, "npm run check && npm run build:artifact");
  assert.equal(await exists(fromRoot("scripts", "build.mjs")), true);
});

test("alle lokalen ES-Modulimporte zeigen auf vorhandene Dateien", async () => {
  const files = (await collectFiles(fromRoot("src")))
    .filter(file => file.endsWith(".js"));

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const references = [
      ...source.matchAll(/(?:from\s+|import\s*)["'](\.{1,2}\/[^"']+)["']/g)
    ].map(match => match[1]);

    for (const reference of references) {
      const target = path.resolve(path.dirname(file), localPath(reference));
      assert.equal(await exists(target), true, `${path.relative(root, file)} -> ${reference}`);
    }
  }
});

test("HTML und Manifest referenzieren nur vorhandene lokale Assets", async () => {
  const html = await readFile(fromRoot("index.html"), "utf8");
  const htmlAssets = [...html.matchAll(/(?:href|src)="(\.\/[^"#]+)"/g)]
    .map(match => localPath(match[1]));

  const manifest = JSON.parse(await readFile(fromRoot("manifest.webmanifest"), "utf8"));
  const manifestAssets = [
    ...manifest.icons.map(icon => localPath(icon.src)),
    ...manifest.shortcuts.flatMap(shortcut => shortcut.icons ?? []).map(icon => localPath(icon.src))
  ];

  for (const asset of [...htmlAssets, ...manifestAssets]) {
    assert.equal(await exists(fromRoot(asset)), true, `${asset} fehlt`);
  }
});

test("alle vorinstallierten Service-Worker-Assets existieren", async () => {
  const source = await readFile(fromRoot("sw.js"), "utf8");
  const block = source.match(/const ASSETS = \[([\s\S]*?)\];/)?.[1] ?? "";
  const assets = [...block.matchAll(/"(\.\/[^"\n]+)"/g)]
    .map(match => localPath(match[1]))
    .filter(Boolean);

  assert.ok(assets.length > 0, "Service-Worker-Assetliste wurde nicht gefunden");
  for (const asset of assets) {
    assert.equal(await exists(fromRoot(asset)), true, `${asset} fehlt`);
  }
});

test("App-, Paket-, HTML- und Service-Worker-Version sind konsistent", async () => {
  const packageJson = JSON.parse(await readFile(fromRoot("package.json"), "utf8"));
  const buildInfo = JSON.parse(await readFile(fromRoot("BUILD_INFO.json"), "utf8"));
  const constants = await readFile(fromRoot("src/constants.js"), "utf8");
  const html = await readFile(fromRoot("index.html"), "utf8");
  const serviceWorker = await readFile(fromRoot("sw.js"), "utf8");
  const version = buildInfo.version;

  assert.equal(packageJson.version, version);
  assert.match(constants, new RegExp(`APP_VERSION = ["']${version.replaceAll(".", "\\.")}["']`));
  assert.ok(html.includes(`src/app.js?v=${version}`));
  assert.ok(serviceWorker.includes(`src/app.js?v=${version}`));
  assert.ok(serviceWorker.includes(`financeos-v${version.replaceAll(".", "-")}`));
});
