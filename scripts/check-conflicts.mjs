import fs from "fs/promises";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(__dirname, "..");
const ignoreDirs = new Set([
  ".git",
  "node_modules",
  "coverage",
  ".dart_tool",
  "generated-ts",
  "generated-dart",
]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        files.push(...(await walk(full)));
      }
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function checkFile(file, text) {
  const lines = text.split(/\r?\n/);
  const matches = [];
  for (const [i, line] of lines.entries()) {
    if (
      line.startsWith("<<<<<<<") ||
      line.startsWith("=======") ||
      line.startsWith(">>>>>>>")
    ) {
      matches.push(`${file}:${i + 1}`);
    }
  }
  return matches;
}

(async () => {
  const files = await walk(root);
  const problems = [];
  for (const file of files) {
    try {
      const text = await fs.readFile(file, "utf8");
      problems.push(...checkFile(file, text));
    } catch {
      // ignore binary files
    }
  }
  if (problems.length) {
    console.error("Merge conflict markers found:");
    for (const p of problems) console.error("  " + p);
    process.exit(1);
  } else {
    console.log("No merge conflict markers found.");
  }
})();
