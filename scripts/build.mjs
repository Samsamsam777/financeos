import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const RUNTIME_ENTRIES = [
  "BUILD_INFO.json",
  "assets",
  "index.html",
  "manifest.webmanifest",
  "src",
  "sw.js",
  "vendor"
];

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

function relativeFile(file) {
  return path.relative(DIST, file).split(path.sep).join("/");
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

for (const entry of RUNTIME_ENTRIES) {
  await cp(path.join(ROOT, entry), path.join(DIST, entry), {
    recursive: true,
    preserveTimestamps: true
  });
}

const packageJson = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8"));
const files = (await collectFiles(DIST)).sort((left, right) =>
  relativeFile(left).localeCompare(relativeFile(right))
);

const manifestFiles = [];
let totalBytes = 0;

for (const file of files) {
  const content = await readFile(file);
  const metadata = await stat(file);
  totalBytes += metadata.size;
  manifestFiles.push({
    path: relativeFile(file),
    bytes: metadata.size,
    sha256: createHash("sha256").update(content).digest("hex")
  });
}

const manifest = {
  schemaVersion: 1,
  product: "FinanceOS",
  version: packageJson.version,
  entryPoint: "index.html",
  totalBytes,
  files: manifestFiles
};

await writeFile(
  path.join(DIST, "build-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);

console.log(
  `Build erfolgreich: ${manifestFiles.length} Dateien, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`
);
