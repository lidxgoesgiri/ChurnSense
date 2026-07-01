#!/usr/bin/env node
/**
 * agent-orchestrator.js — TestSprite loop driver + LOOP.md generator.
 *
 * LOOP.md is NOT hand-written. This script regenerates it entirely from the
 * TestSprite platform's own data — the project's test list, each test's run
 * history (`testsprite test result --history`), and the failure bundles the CLI
 * produces on red runs. Every testId, runId, verdict, and timestamp in LOOP.md
 * is therefore a verifiable platform fact.
 *
 * Usage:
 *   node agent-orchestrator.js run     # rerun every backend test, then regen LOOP.md
 *   node agent-orchestrator.js regen   # just rebuild LOOP.md from platform data
 *
 * Honesty note (Rule 4 / Rule 16): failure detection is 100% automated via the
 * CLI; the code fix itself is done by the coding agent reading the failure
 * bundle. This is not "self-healing" without intervention.
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

function sh(cmd, allowFail = false) {
  try {
    return { code: 0, out: execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    if (!allowFail) throw e;
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}

// Pull the JSON object out of mixed CLI stdout (advisory lines precede it).
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

// Rerun one test to a terminal verdict; pull the bundle if it goes red.
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

const emoji = (s) =>
  s === 'passed' ? '✅ PASSED' : s === 'failed' ? '❌ FAILED' : `⚠️ ${String(s).toUpperCase()}`;

function generateLoopMd(c, tests) {
  const L = [];
  const totalRuns = tests.reduce((n, t) => n + t.runs.length, 0);

  L.push('# 🔄 LOOP.md — TestSprite Verification Record');
  L.push('');
  L.push('> **Auto-generated** by `agent-orchestrator.js` from TestSprite platform data.');
  L.push('> Every testId, runId, verdict, and timestamp below is pulled directly from the');
  L.push('> platform (`test list` + `test result --history`) — none of it is hand-written.');
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
  L.push('`Edit code` → `git push` → `Vercel auto-redeploy` → `testsprite test rerun --wait` → `read verdict` → `fix` → repeat.');
  L.push('');
  L.push('The CLI runs against the live URL (never localhost). Failure detection is fully');
  L.push('automated via the CLI; the code fix is made by the coding agent reading the failure');
  L.push('bundle — this is not self-healing without intervention.');
  L.push('');
  L.push('---');
  L.push('');

  tests.forEach((t) => {
    L.push(`## Test — ${t.name}`);
    L.push(`- **testId:** \`${t.id}\` · priority ${t.priority || 'n/a'} · latest: ${emoji(t.status)}`);
    L.push(`- **dashboard:** https://www.testsprite.com/dashboard/tests/${c.projectId}/test/${t.id}`);
    L.push('');
    const chrono = [...t.runs].reverse(); // oldest first
    if (chrono.length === 0) {
      L.push('_No runs recorded yet._');
      L.push('');
      return;
    }
    chrono.forEach((run, i) => {
      L.push(`### Run ${i + 1} — ${run.finishedAt || run.createdAt} · ${emoji(run.status)}`);
      L.push(`- runId: \`${run.runId}\` (source: ${run.source || 'cli'})`);
      if (run.status === 'failed') {
        const h = failureHypothesis(run.runId);
        if (h) {
          L.push('- failure bundle — rootCauseHypothesis:');
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
  L.push(`_Regenerated at ${new Date().toISOString()} · HEAD ${gitHead()}_`);
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

  if (mode === 'run') {
    for (const t of tests) {
      process.stdout.write(`🔄 rerun ${t.name} … `);
      const status = rerun(t.id);
      console.log(status);
    }
  } else if (mode !== 'regen') {
    console.error(`unknown mode "${mode}" — use "run" or "regen".`);
    process.exit(2);
  }

  // Re-list (statuses may have changed) and attach run history.
  tests = listBackendTests(c.projectId).map((t) => ({ ...t, runs: history(t.id) }));
  fs.writeFileSync(LOOP_PATH, generateLoopMd(c, tests));
  const totalRuns = tests.reduce((n, t) => n + t.runs.length, 0);
  console.log(`📝 LOOP.md regenerated: ${tests.length} test(s), ${totalRuns} run(s).`);
}

main();
