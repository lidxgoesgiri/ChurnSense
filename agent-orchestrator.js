#!/usr/bin/env node
/**
 * agent-orchestrator.js — TestSprite loop driver + LOOP.md generator.
 *
 * LOOP.md is NOT hand-written. This script regenerates it entirely from the
 * TestSprite platform's own run history (`testsprite test result --history`)
 * plus the failure bundles the CLI produces on red runs. Every runId, verdict,
 * and timestamp in LOOP.md is therefore a verifiable platform fact.
 *
 * Usage:
 *   node agent-orchestrator.js run     # rerun the banked test, then regen LOOP.md
 *   node agent-orchestrator.js regen   # just rebuild LOOP.md from platform history
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

function cfg() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function sh(cmd, allowFail = false) {
  try {
    return { code: 0, out: execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    if (!allowFail) throw e;
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}

// Pull the fenced JSON object out of mixed CLI stdout (advisories precede it).
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

// One live loop iteration: rerun the banked test to a terminal verdict.
function runLoop(testId) {
  console.log(`🔄 Rerunning test ${testId} against the live app...`);
  const r = sh(
    `testsprite test rerun ${testId} --wait --timeout 600 --output json`,
    true
  );
  const json = extractJson(r.out);
  const status = json && json.status ? json.status : 'unknown';
  console.log(`   verdict: ${status} (exit ${r.code})`);
  if (status === 'failed' && json && json.runId) {
    // Pull the self-consistent failure bundle for the agent to reason over.
    fs.mkdirSync(RUNS_DIR, { recursive: true });
    sh(`testsprite test artifact get ${json.runId} --out ${path.join(RUNS_DIR, json.runId)}/`, true);
  }
  return json;
}

// Read a failed run's root-cause hypothesis from its downloaded bundle.
function failureHypothesis(runId) {
  const f = path.join(RUNS_DIR, runId, 'failure.json');
  if (!fs.existsSync(f)) {
    // Try to fetch it on demand.
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

function history(testId) {
  const r = sh(`testsprite test result ${testId} --history --output json`, true);
  const json = extractJson(r.out);
  return json && Array.isArray(json.runs) ? json.runs : [];
}

function generateLoopMd(c, runs) {
  const dash = `https://www.testsprite.com/dashboard/tests/${c.projectId}/test/${c.testId}`;
  const chrono = [...runs].reverse(); // oldest first
  const emoji = (s) => (s === 'passed' ? '✅ PASSED' : s === 'failed' ? '❌ FAILED' : `⚠️ ${s.toUpperCase()}`);

  const lines = [];
  lines.push('# 🔄 LOOP.md — Bukti Siklus Verifikasi TestSprite CLI');
  lines.push('');
  lines.push('> **Auto-generated** oleh `agent-orchestrator.js` dari riwayat run TestSprite.');
  lines.push('> Setiap runId, verdict, dan timestamp di bawah ditarik langsung dari platform');
  lines.push('> (`testsprite test result --history`) — bukan ditulis tangan.');
  lines.push('');
  lines.push('| | |');
  lines.push('|---|---|');
  lines.push(`| Proyek | **${c.projectName}** (backend) |`);
  lines.push(`| Live URL (target) | ${c.targetUrl} |`);
  lines.push(`| Repo | ${c.repo} |`);
  lines.push(`| TestSprite project | \`${c.projectId}\` |`);
  lines.push(`| Test | \`${c.testId}\` |`);
  lines.push(`| Dashboard | ${dash} |`);
  lines.push(`| Total run tercatat | ${chrono.length} |`);
  lines.push('');
  lines.push('## Alur Kerja');
  lines.push('`Edit kode` → `git push` → `Vercel auto-redeploy` → `testsprite test rerun --wait` → `baca verdict` → `fix` → ulangi.');
  lines.push('');
  lines.push('CLI menembak URL live (bukan localhost). Deteksi kegagalan 100% otomatis via CLI;');
  lines.push('perbaikan kode dilakukan coding agent yang membaca failure bundle — bukan self-healing tanpa intervensi.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Riwayat Siklus Loop');
  lines.push('');

  chrono.forEach((run, i) => {
    lines.push(`### [Run ${i + 1}] — ${run.finishedAt || run.createdAt} · ${emoji(run.status)}`);
    lines.push(`- **runId:** \`${run.runId}\``);
    lines.push(`- **source:** ${run.source || 'cli'}`);
    if (run.status === 'failed') {
      const h = failureHypothesis(run.runId);
      if (h) {
        lines.push('- **Failure bundle — rootCauseHypothesis:**');
        lines.push('  ```json');
        lines.push('  ' + h);
        lines.push('  ```');
      }
    }
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push(`_Regenerated at ${new Date().toISOString()} · HEAD ${gitHead()}_`);
  lines.push('');
  return lines.join('\n');
}

function main() {
  const mode = process.argv[2] || 'regen';
  const c = cfg();
  if (!c.testId) {
    console.error('config.json has no testId — create a test first.');
    process.exit(2);
  }

  if (mode === 'run') {
    runLoop(c.testId);
  } else if (mode !== 'regen') {
    console.error(`unknown mode "${mode}" — use "run" or "regen".`);
    process.exit(2);
  }

  const runs = history(c.testId);
  fs.writeFileSync(LOOP_PATH, generateLoopMd(c, runs));
  console.log(`📝 LOOP.md regenerated from ${runs.length} platform run(s).`);
}

main();
