// Cross-platform, Node-version-independent test runner.
//
// `node --test "src/**/*.test.ts"` only works where the runner expands globs
// itself (Node 21+). On CI's Node 20 the glob is passed through literally, no
// files match, and the step crashes in seconds. Here we enumerate the *.test.ts
// files in JS and hand explicit paths to `node --test`, which every supported
// Node version accepts.
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function findTestFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      out.push(...findTestFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      out.push(full);
    }
  }
  return out;
}

const files = findTestFiles('src');
if (files.length === 0) {
  console.error('No *.test.ts files found under src/');
  process.exit(1);
}

const res = spawnSync(
  process.execPath,
  ['--import', 'tsx', '--test', ...files],
  { stdio: 'inherit' }
);
process.exit(res.status ?? 1);
