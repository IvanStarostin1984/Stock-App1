import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(__dirname, '..');
const packagesDir = path.join(root, 'packages');
const webSrc = path.join(root, 'web-app/src');

async function collectTsFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectTsFiles(res));
    } else if (res.endsWith('.ts')) {
      files.push(res);
    }
  }
  return files;
}

function expectedPrefix(file) {
  const rel = path.relative(path.dirname(file), webSrc);
  return rel.replace(/\\/g, '/');
}

function checkFile(file, content) {
  const regex = /from ['"](\.\.\/[^'"]*web-app\/src\/[^'"]*)['"]/g;
  const errors = [];
  let match;
  while ((match = regex.exec(content))) {
    const importPath = match[1];
    const exp = expectedPrefix(file);
    if (!importPath.startsWith(exp)) {
      errors.push(`${file}: expected '${exp}/...' but found '${importPath}'`);
    }
  }
  return errors;
}

(async () => {
  const tsFiles = await collectTsFiles(packagesDir);
  let errors = [];
  for (const file of tsFiles) {
    const text = await fs.readFile(file, 'utf8');
    errors.push(...checkFile(file, text));
  }
  if (errors.length) {
    console.error('Incorrect import paths detected:');
    for (const e of errors) console.error('  ' + e);
    process.exit(1);
  } else {
    console.log('All package import paths are correct.');
  }
})();
