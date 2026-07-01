# ChurnSense

SaaS retention & churn analytics. Enter your user counts and revenue, and
ChurnSense computes **churn rate, retention rate, and ARPU**, flags a **risk
status**, and generates an **automated insight** on what to do next.

Built for **Hackathon Season 3 — "Build the Loop"**, verified end-to-end with the
[TestSprite CLI](https://github.com/TestSprite/testsprite-cli) against the live
deployment. See [`LOOP.md`](./LOOP.md) for the auto-generated record of the
write → verify → fix → verify cycle.

- **Live:** https://loop-analytics-nine.vercel.app
- **Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS, Recharts, Zod.

## Features

- `POST /api/metrics` — churn/retention/ARPU + risk status from project input (Zod-validated).
- `POST /api/insights` — metrics + an AI insight (provider-agnostic).
- `GET /api/health` — health check.
- Dummy email session gate on the dashboard.

## AI provider (optional, free-friendly)

The insight engine speaks the **OpenAI-compatible** `/chat/completions` contract,
so any provider works. Set three env vars:

```
AI_BASE_URL=https://api.groq.com/openai/v1
AI_API_KEY=your_key
AI_MODEL=llama-3.3-70b-versatile
```

Free providers include Groq, OpenRouter (`:free` models), Google Gemini
(OpenAI-compatible mode), and Mistral. **With no key configured, the app falls
back to a deterministic rule-based insight** — it always builds, deploys, and
passes tests without a paid dependency.

## Local development

```bash
npm install
cp .env.example .env.local   # optional: fill in AI_* to use a real provider
npm run dev
```

## Verification loop (TestSprite)

```bash
node agent-orchestrator.js run    # rerun the banked test, regenerate LOOP.md
node agent-orchestrator.js regen  # rebuild LOOP.md from platform history only
```
