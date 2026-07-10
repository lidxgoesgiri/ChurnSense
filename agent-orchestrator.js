#!/usr/bin/env node
/**
 * agent-orchestrator.js - TestSprite loop driver + LOOP.md generator.
 *
 * LOOP.md is regenerated from TestSprite platform data: test list, each test's
 * run history (`testsprite test result --history`), and failure bundles for red
 * runs. Failure detection is automated via the CLI; code fixes are made by the
 * coding agent reading the failure bundle.
 *
 * Usage:
 *   node agent-orchestrator.js run
 *   node agent-orchestrator.js regen
 */
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, '.testsprite', 'config.json');
const LOOP_PATH = path.join(ROOT, 'LOOP.md');
const RUNS_DIR = path.join(ROOT, '.testsprite', 'runs');

const cfg = () => JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

function normalizeCmd(cmd) {
  if (process.platform === 'win32' && cmd.startsWith('testsprite ')) {
    return `testsprite.cmd ${cmd.slice('testsprite '.length)}`;
  }
  return cmd;
}

function sh(cmd, allowFail = false) {
  try {
    return {
      code: 0,
      out: execSync(normalizeCmd(cmd), {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    };
  } catch (e) {
    if (!allowFail) throw e;
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}

function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function gitHead() {
  const r = sh('git rev-parse --short HEAD', true);
  return r.code === 0 ? r.out.trim() : 'unknown';
}

function listBackendTests(projectId) {
  const r = sh(`testsprite test list --project ${projectId} --output json`, true);
  const json = extractJson(r.out);
  const items = json && Array.isArray(json.items) ? json.items : [];
  return items.filter((t) => t.type === 'backend');
}

function history(testId) {
  const r = sh(`testsprite test result ${testId} --history --output json`, true);
  const json = extractJson(r.out);
  return json && Array.isArray(json.runs) ? json.runs : [];
}

function rerun(testId) {
  const r = sh(`testsprite test rerun ${testId} --wait --timeout 600 --output json`, true);
  const json = extractJson(r.out);
  const status = json && json.status ? json.status : 'unknown';
  if (status === 'failed' && json && json.runId) {
    fs.mkdirSync(RUNS_DIR, { recursive: true });
    sh(`testsprite test artifact get ${json.runId} --out ${path.join(RUNS_DIR, json.runId)}/`, true);
  }
  return status;
}

function failureHypothesis(runId) {
  const f = path.join(RUNS_DIR, runId, 'failure.json');
  if (!fs.existsSync(f)) {
    fs.mkdirSync(RUNS_DIR, { recursive: true });
    sh(`testsprite test artifact get ${runId} --out ${path.join(RUNS_DIR, runId)}/`, true);
  }
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, 'utf-8')).rootCauseHypothesis || null;
  } catch {
    return null;
  }
}

const pass = '\u2705 PASSED';
const fail = '\u274c FAILED';
const warn = '\u26a0\ufe0f';
const arrow = '\u2192';
const dash = '\u2014';
const dot = '\u00b7';
const loopIcon = '\ud83d\udd04';
const noteIcon = '\ud83d\udcdd';

const emoji = (s) =>
  s === 'passed' ? pass : s === 'failed' ? fail : `${warn} ${String(s).toUpperCase()}`;

function generateLoopMd(c, tests) {
  const L = [];
  const totalRuns = tests.reduce((n, t) => n + t.runs.length, 0);

  L.push(`# ${loopIcon} LOOP.md ${dash} TestSprite Verification Record`);
  L.push('');
  L.push('> **Auto-generated** by `agent-orchestrator.js` from TestSprite platform data.');
  L.push('> Every testId, runId, verdict, and timestamp below is pulled directly from the');
  L.push(`> platform (\`test list\` + \`test result --history\`) ${dash} none of it is hand-written.`);
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| Project | **${c.projectName}** (backend) |`);
  L.push(`| Live URL (target) | ${c.targetUrl} |`);
  L.push(`| Repo | ${c.repo} |`);
  L.push(`| TestSprite project | \`${c.projectId}\` |`);
  L.push(`| Banked tests | ${tests.length} |`);
  L.push(`| Total runs recorded | ${totalRuns} |`);
  L.push('');
  L.push('## Loop');
  L.push(`\`Edit code\` ${arrow} \`git push\` ${arrow} \`Vercel auto-redeploy\` ${arrow} \`testsprite test rerun --wait\` ${arrow} \`read verdict\` ${arrow} \`fix\` ${arrow} repeat.`);
  L.push('');
  L.push('The CLI runs against the live URL (never localhost). Failure detection is fully');
  L.push('automated via the CLI; the code fix is made by the coding agent reading the failure');
  L.push(`bundle ${dash} this is not self-healing without intervention.`);
  L.push('');
  L.push('---');
  L.push('');

  tests.forEach((t) => {
    L.push(`## Test ${dash} ${t.name}`);
    L.push(`- **testId:** \`${t.id}\` ${dot} priority ${t.priority || 'n/a'} ${dot} latest: ${emoji(t.status)}`);
    L.push(`- **dashboard:** https://www.testsprite.com/dashboard/tests/${c.projectId}/test/${t.id}`);
    L.push('');
    const chrono = [...t.runs].reverse();
    if (chrono.length === 0) {
      L.push('_No runs recorded yet._');
      L.push('');
      return;
    }
    chrono.forEach((run, i) => {
      L.push(`### Run ${i + 1} ${dash} ${run.finishedAt || run.createdAt} ${dot} ${emoji(run.status)}`);
      L.push(`- runId: \`${run.runId}\` (source: ${run.source || 'cli'})`);
      if (run.status === 'failed') {
        const h = failureHypothesis(run.runId);
        if (h) {
          L.push(`- failure bundle ${dash} rootCauseHypothesis:`);
          L.push('  ```json');
          L.push('  ' + h);
          L.push('  ```');
        }
      }
      L.push('');
    });
  });

  L.push('---');
  L.push('');
  L.push(`_Regenerated at ${new Date().toISOString()} ${dot} HEAD ${gitHead()}_`);
  L.push('');
  return L.join('\n');
}

function main() {
  const mode = process.argv[2] || 'regen';
  const c = cfg();
  if (!c.projectId) {
    console.error('config.json has no projectId.');
    process.exit(2);
  }

  let tests = listBackendTests(c.projectId);
  if (tests.length === 0) {
    console.error('No backend tests returned by TestSprite CLI; aborting to avoid overwriting LOOP.md with empty data.');
    process.exit(1);
  }

  if (mode === 'run') {
    for (const t of tests) {
      process.stdout.write(`${loopIcon} rerun ${t.name} ... `);
      const status = rerun(t.id);
      console.log(status);
    }
  } else if (mode !== 'regen') {
    console.error(`unknown mode "${mode}" ${dash} use "run" or "regen".`);
    process.exit(2);
  }

  tests = listBackendTests(c.projectId).map((t) => ({ ...t, runs: history(t.id) }));
  if (tests.length === 0) {
    console.error('No backend tests returned after rerun; aborting to avoid overwriting LOOP.md with empty data.');
    process.exit(1);
  }
  fs.writeFileSync(LOOP_PATH, generateLoopMd(c, tests));
  const totalRuns = tests.reduce((n, t) => n + t.runs.length, 0);
  console.log(`${noteIcon} LOOP.md regenerated: ${tests.length} test(s), ${totalRuns} run(s).`);
}

main();