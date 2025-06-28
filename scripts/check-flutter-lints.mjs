import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(__dirname, '..');

const ignoreDirs = new Set(['node_modules', '.git', '.dart_tool', 'generated-dart', 'generated-ts', 'build']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!ignoreDirs.has(e.name)) {
        files.push(...await walk(full));
      }
    } else if (e.isFile() && e.name === 'pubspec.yaml') {
      files.push(full);
    }
  }
  return files;
}

async function includesFlutterLints(file, seen = new Set()) {
  if (seen.has(file)) return false;
  seen.add(file);
  let text;
  try {
    text = await fs.readFile(file, 'utf8');
  } catch {
    return false;
  }
  if (text.includes('package:flutter_lints/flutter.yaml')) {
    return true;
  }
  const m = text.match(/^\s*include:\s*(.+)$/m);
  if (m) {
    let include = m[1].trim().replace(/^['"]|['"]$/g, '');
    if (include.startsWith('package:flutter_lints')) {
      return true;
    }
    if (!include.startsWith('package:')) {
      const next = path.resolve(path.dirname(file), include);
      return includesFlutterLints(next, seen);
    }
  }
  return false;
}

async function hasFlutterLintsDev(pubspec) {
  const text = await fs.readFile(pubspec, 'utf8');
  const lines = text.split(/\r?\n/);
  let inDev = false;
  for (const line of lines) {
    if (/^dev_dependencies:\s*$/.test(line)) {
      inDev = true;
      continue;
    }
    if (inDev) {
      if (/^\S/.test(line)) break;
      const m = line.match(/^\s*(\S+):/);
      if (m && m[1] === 'flutter_lints') return true;
    }
  }
  return false;
}

(async () => {
  const pubspecs = await walk(root);
  const problems = [];
  for (const spec of pubspecs) {
    const dir = path.dirname(spec);
    const analysis = path.join(dir, 'analysis_options.yaml');
    if (await includesFlutterLints(analysis)) {
      if (!await hasFlutterLintsDev(spec)) {
        problems.push(`${spec} missing flutter_lints dev dependency`);
      }
    }
  }
  if (problems.length) {
    console.error('flutter_lints dependency check failed:');
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  } else {
    console.log('Flutter lints dependencies are correct.');
  }
})();
