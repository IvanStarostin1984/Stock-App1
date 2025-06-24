import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const file = path.join(__dirname, '..', 'NOTES.md');

async function main() {
  const text = await fs.readFile(file, 'utf8');
  const lines = text.split(/\r?\n/);
  // find first non-empty line
  const firstLine = lines.find(line => line.trim().length);
  const headingRegex = /^## (\d{4}-\d{2}-\d{2}) PR #/;
  if (!firstLine || !headingRegex.test(firstLine)) {
    console.error('First line must start with "## YYYY-MM-DD PR #"');
    process.exit(1);
  }

  let prevDate;
  for (const [i, line] of lines.entries()) {
    const m = line.match(headingRegex);
    if (m) {
      const date = m[1];
      if (prevDate && date > prevDate) {
        console.error(`Entry at line ${i + 1} not in reverse chronological order: ${date} after ${prevDate}`);
        process.exit(1);
      }
      prevDate = date;
    }
  }
  console.log('NOTES.md entries are in correct order.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
