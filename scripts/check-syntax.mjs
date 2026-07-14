import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

async function collectJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectJavaScriptFiles(target));
    } else if (/\.(?:js|mjs)$/.test(entry.name)) {
      files.push(target);
    }
  }

  return files;
}

const files = [
  ...await collectJavaScriptFiles("src"),
  ...await collectJavaScriptFiles("scripts"),
  "sw.js"
].sort();

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8"
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
}

console.log(`Syntaxprüfung erfolgreich: ${files.length} Dateien`);
