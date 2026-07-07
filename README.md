<div align="center">

# 📊 ChurnSense

### Smart SaaS Retention & Churn Analytics

Turn raw user counts into churn, retention, ARPU, MRR, and LTV metrics —
then get **automated AI insights** on what to do next.

**🌐 Live:** [loop-analytics-nine.vercel.app](https://loop-analytics-nine.vercel.app) · **📦 Repo:** [github.com/lidxgoesgiri/ChurnSense](https://github.com/lidxgoesgiri/ChurnSense)

_Hackathon Season 3: "Build the Loop" — organized by [**TestSprite**](https://www.testsprite.com)_

</div>

---

## 👤 Author

**Ida Bagus Giri Krisnabhawa** — _Creator & Lead Developer_
GitHub: [@lidxgoesgiri](https://github.com/lidxgoesgiri)

The entire architecture, backend & frontend implementation, AI integration, and the
TestSprite verification methodology in this project were designed and built by him.

---

## 🎯 Overview

ChurnSense is a SaaS retention analytics dashboard that computes core business
metrics from simple user counts, visualizes them interactively, and layers an AI
engine on top for narrative insights and interactive chat. It is built around a
philosophy of **continuous verification**: every backend change is automatically
tested by the TestSprite CLI against the live deployment.

The app remains **fully functional without any API key** — when no AI provider is
configured, insights are produced by a deterministic rule-based engine as a graceful
fallback.

---

## 🌿 Logo & Philosophy

<img src="./public/churn.jpg" alt="ChurnSense logo" width="120" align="right" />

The ChurnSense logo depicts a **healthy seedling growing straight out of a rising
bar chart** — a visual promise that retention grows from data-driven decisions.

- **🌱 Seedling (healthy growth)** — the start of a healthy customer lifecycle; a business growing dynamically.
- **📊 Bar-chart foundation (data-driven growth)** — leaves and stem sprout directly from a rising bar chart: growth is supported by accurate, data-backed decisions.
- **🎨 Sage Green & Pastel Blue** — a soft, natural palette that feels calm, professional, and clean.
- **🤝 Friendly & minimalist** — gentle soft curves keep the platform approachable for every user.

<details>
<summary><strong>🇮🇩 Filosofi Logo (Bahasa Indonesia)</strong></summary>

Logo ChurnSense menggambarkan sebuah **tunas yang tumbuh langsung dari grafik batang
yang naik** — retensi yang sehat lahir dari pertumbuhan yang ditopang data.

- **🌱 Tunas & Seedling (Pertumbuhan Sehat)** — melambangkan bisnis yang tumbuh dinamis; awal dari siklus hidup pelanggan (*customer lifecycle*) yang sehat.
- **📊 Pondasi Grafik Batang (Data-Driven Growth)** — daun dan batang tumbuh langsung dari diagram batang yang naik: pertumbuhan bisnis ditopang keputusan berbasis data yang akurat.
- **🎨 Sage Green & Pastel Blue** — palet warna natural yang lembut, menenangkan, profesional, dan bersih.
- **🤝 Ramah & Minimalis** — sudut-sudut melengkung lembut memberi kesan *approachable* bagi setiap pengguna.

</details>

---

## 🔐 Passwordless Authentication

ChurnSense uses a **passwordless, email-first sign-in** — the same modern pattern
users know from Vercel and Slack. There are **no passwords to store, leak, or reset**.

- **How it works:** you enter your email and receive a secure magic link / OTP token;
  a verified email establishes the session.
- **Tamper-evident sessions:** the session is an **HMAC-SHA256 signed, httpOnly cookie**
  (`COOKIE_SECRET`). A forged or modified cookie fails signature verification and is rejected.
- **Production-safe by design:** `COOKIE_SECRET` (≥32 chars) is **required in production** —
  the app refuses to boot without it, so no deployment can fall back to a shared/public key.
- **Defense in depth:** a centralized auth gate (`src/proxy.ts`) denies every route by default
  unless it is explicitly public, and mutating endpoints are CSRF-protected.

---

## ✨ Key Features

### 📈 Advanced SaaS Analytics
- **Core metrics:** Churn Rate, Retention Rate, ARPU, **MRR** (Monthly Recurring Revenue), **Estimated LTV** (ARPU ÷ churn), and **Risk Status** (Low/Medium/High).
- **Moving-average churn anomaly detection** — compares the latest period against the project's own trailing moving average, then surfaces an automatic "spike"/"drop" badge with the deviation (not a static threshold).
- **Interactive trend charts** (Recharts): a Churn % vs Retention % line over time once a project has ≥2 snapshots, plus mini **sparklines** on each metric card.
- **Comparison mode** — compare two projects side-by-side with per-metric deltas colored better/worse.

### 📥 Batch CSV Analytics
- **Drag-and-drop CSV upload** with preview, automatic separator detection (`,`/`;`), and BOM handling.
- **Robust CSV parser** — supports quoted fields containing commas (`"Acme, Inc."`) and escaped quotes.
- **Batch aggregation** + cross-row anomaly detection, _partial success_ reporting (valid vs failed rows), a 5MB file-size cap, and a 500-row limit.
- **CSV export** — download a report of all saved projects with one click.

### 🤖 AI Layer (OpenRouter)
- **AI Insight** — summary + recommendation + risk level as structured JSON, with a **rule-based fallback** when the provider fails or times out.
- **Live token streaming chat** — AI replies appear word-by-word (SSE → plain-text stream) with a graceful non-stream fallback; the chat is aware of the current project context.
- **Multi-model selector** — the OpenRouter roster is grouped by _tier_ (🟣 Premium / 🔵 Strong / 🟢 Fast) with a **cinematic border-glow** matching the selected model's tier. Default: **Nemotron 3 Ultra 550B** (top tier).
- **Whitelist gateway** — non-whitelisted models are **rejected** (`400 Invalid or unauthorized AI model requested`) to prevent model/prompt injection.
- **Cross-model fallback** — if a model returns an empty reply, the server automatically tries other chat-capable models before falling back to the rule-based engine.

### 🎨 Cinematic Dark Mode & Premium UI
- **Cinematic dark mode** driven by a `data-theme` attribute (custom Tailwind variant) — deep dark palette, radial-glow background, smooth transitions, and an animated rotating toggle.
- **Glassmorphism** throughout (blurred cards + thin borders + hover-lift), **toast notifications**, **skeleton loaders** (shimmer), and a chat **typing indicator**.
- **Command palette** (`Cmd/Ctrl+K`) for quick navigation.
- **Micro-interactions:** staggered entry animations, "counting" metric number transitions, a tab slide-indicator, delete animation, per-metric explanation tooltips, and chart entry animations.
- **Interactive landing page** — floating aurora orbs, an animated gradient wordmark, and feature cards.

### 🔒 Security
- **Signed sessions** — the `cs_session` cookie is signed with **HMAC-SHA256** (`COOKIE_SECRET`), `Secure` in production, `httpOnly`, `SameSite=lax`. Forged cookies are rejected.
- **Auth gate** on all data/AI routes (401 without a valid session).
- **CSRF protection** via an `X-Requested-With` header on mutating routes (403 without it).
- **Rate limiting** (insights/chat), **request body-size limit** (413), **chat message-length limit** (400), and **security headers** (`X-Content-Type-Options`, `X-Frame-Options`).

### ♿ Accessibility & Resilience
- Skip-to-content link, `aria-live` on animated metrics, a consistent focus ring, and `prefers-reduced-motion` support.
- A React **Error Boundary** — an AI failure/timeout never blanks the dashboard.
- **Mobile responsive**, plus **graceful DB degradation** (a clean 503 when `DATABASE_URL` is absent).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) · React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 (CSS-first) · custom UI components |
| **Database** | Neon (serverless Postgres) via **Drizzle ORM** |
| **Validation** | Zod (schema at every endpoint) |
| **Charts** | Recharts |
| **AI** | OpenRouter (OpenAI-compatible `/chat/completions` endpoint) |
| **Testing** | TestSprite CLI (Python backend + real-browser frontend plans) |
| **Hosting/CI** | Vercel (auto-deploy) + GitHub Actions |

---

## 🔄 Data Flow

```
                    ┌─────────────────────────────────────────────┐
   Manual input ──► │  Form / Batch CSV (drag-and-drop)           │
                    └───────────────┬─────────────────────────────┘
                                    │  Zod validation
                                    ▼
             ┌──────────────────────────────────────────┐
             │  POST /api/metrics                        │  compute churn, retention,
             │  → calculateSaaSMetrics()                 │  ARPU, MRR, LTV, risk
             └───────────────┬──────────────────────────┘
                             │
         ┌───────────────────┼───────────────────────────┐
         ▼                   ▼                            ▼
┌──────────────────┐ ┌───────────────────┐   ┌──────────────────────────────┐
│ POST /api/projects│ │ POST /api/insights│   │ POST /api/chat (stream)       │
│ persist to Neon   │ │ metrics + trend   │   │ token streaming, context-aware│
│ (Drizzle ORM)     │ │ history + AI      │   │ + cross-model fallback        │
└─────────┬────────┘ └─────────┬─────────┘   └──────────────────────────────┘
          │                    │
          ▼                    ▼
   ┌───────────────────────────────────────────────────┐
   │  Dashboard: metric cards, trend chart, sparklines, │
   │  anomaly badge, comparison, history, AI chat       │
   └───────────────────────────────────────────────────┘
```

**Persistence & trend:** each analysis can be saved to Neon; `loadTrend()` pulls the
same project's churn history to give the AI layer historical context and to power the
trend chart and anomaly detection.

---

## 🧪 TestSprite Methodology — `write ➔ verify ➔ fix ➔ verify`

The heart of the "Build the Loop" project: **every backend change is automatically
verified** by the TestSprite CLI against the live deployment, never localhost.

```
 Edit code ─► git push ─► Vercel auto-redeploy ─► wait for SHA match (/api/health)
     ▲                                                        │
     │                                                        ▼
     └──── fix (agent reads failure bundle) ◄──── testsprite test run --wait
                                                  (read verdict: ✅ / ❌)
```

- **Failure detection is fully automated** via the CLI; the **code fix is made by the coding agent** reading the failure bundle — this is not self-healing without intervention (per the brief's honesty note).
- **`LOOP.md` is auto-generated** by `agent-orchestrator.js` from TestSprite platform data (`test list` + `test result --history`) — every `testId`, `runId`, verdict, and timestamp is pulled directly from the platform, **not hand-written**.
- **CI (GitHub Actions)** — `.github/workflows/testsprite-ci.yml` waits for the matching deployed commit, then runs `testsprite test run --all` as the verification gate.

### 📋 Test coverage
- **13 backend tests** (Python) — data validity, JSON schema, status codes: auth & cookie signing, model whitelist, metrics + body-size, edge cases (missing field, negative, decimals), pagination + MRR/LTV, CRUD delete, advanced CSV, insight cache, chat, and more.
- **4 frontend tests** (real browser) — the core flow (login → calculate → insight), AI chat query, dark mode toggle, and comparison + export.

### 🩹 Tactical note: backend error handling & verification mitigation
It was found that **TestSprite backend verdicts via the CLI are not always reliable** —
results can be "sticky", or the test code can be _regenerated_ by TestSprite's AI so its
assertions drift from the original intent (e.g. expecting `200` when the contract is `400`).
Mitigations applied:

1. **Direct HTTP probes as the authoritative gate** — each backend fix is verified with a direct `curl` against the live URL (status code, schema, message) as the source of truth, not just the CLI verdict.
2. **Real-browser frontend tests** are used for UI verification, which proved consistent (with video recordings).
3. **`LOOP.md` is regenerated from platform data**, never hand-edited, so the cycle record stays authentic.

**A real cycle (recorded in `LOOP.md`):** the _AI model whitelist_ — TestSprite caught
that an unauthorized model was being **silently accepted** (`❌ FAILED: expected 400, got 200`),
which was then fixed to a safe `400` rejection → **✅ PASSED**.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (optional — the app runs even without keys)
cp .env.example .env.local
#   fill in the variables below

# 3. (optional) push the schema to Neon
npm run db:push

# 4. Start the dev server
npm run dev        # http://localhost:3000
```

Other commands: `npm run build` · `npm run start` · `npm run lint` · `npm run db:studio`

### 🔑 Environment Variables

| Variable | Required? | Description |
|---|---|---|
| `AI_API_KEY` | optional | AI provider key (e.g. OpenRouter). Empty → rule-based fallback. |
| `AI_BASE_URL` | optional | OpenAI-compatible endpoint, e.g. `https://openrouter.ai/api/v1`. |
| `AI_MODEL` | optional | Default model (fallback when no roster model is selected). |
| `DATABASE_URL` | optional | Neon Postgres (`postgres://…`). Empty → persistence disabled (clean 503). |
| `COOKIE_SECRET` | **required in prod** | HMAC secret (≥32 chars) for signing the session cookie. The app refuses to boot in production without it. |
| `HEALTH_TOKEN` | optional | Bearer token gating `/api/health/internal`. Unset → that endpoint is open (local dev). |

> ⚠️ Never commit `.env.local` or any API key to Git.

---

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/login` · `/logout` | POST | Passwordless email session: set/clear the HMAC-signed cookie |
| `/api/metrics` | POST | Compute SaaS metrics from input (auth) |
| `/api/insights` | POST | Metrics + trend + AI insight (auth, cache, whitelist, CSRF) |
| `/api/chat` | POST | AI chat, supports `stream:true` (auth, whitelist, CSRF) |
| `/api/projects` | GET/POST/DELETE | Neon persistence, owner-scoped: list (paginated), save, delete (auth + CSRF) |
| `/api/upload-csv` | POST | Batch CSV: parse, validate, aggregate (auth + CSRF) |
| `/api/health` | GET | Public liveness — returns `{status:"ok"}` only |
| `/api/health/internal` | GET | Commit SHA + DB/AI status — gated by `HEALTH_TOKEN` |

---

## 📁 Project Structure

```
loop-analytics/
├── src/
│   ├── app/
│   │   ├── api/            # 8 routes: metrics, insights, chat, projects, upload-csv, auth, health
│   │   ├── dashboard/      # dashboard-client (useReducer) + reducer
│   │   ├── page.tsx        # interactive landing page
│   │   ├── layout.tsx      # ThemeProvider + ToastProvider + skip link
│   │   └── globals.css     # design tokens, dark mode, animation kit, glass
│   ├── components/         # navbar, metric cards, charts, chat, model-selector, toast, skeleton, …
│   ├── lib/                # analytics, trend, ai-insight, ai-provider, models, validation,
│   │   │                   #   auth, rate-limit, insight-cache, csv-parser, export, format
│   │   └── db/             # Drizzle schema + Neon connection
│   └── types/
├── testsprite_tests/       # backend tests (Python) + frontend plans (JSON)
├── agent-orchestrator.js   # loop driver + LOOP.md generator
├── LOOP.md                 # TestSprite verification record (auto-generated)
└── .github/workflows/      # testsprite-ci.yml
```

---

## 🗺️ Roadmap & Vision

Features **not yet** built (long-term vision, stated honestly):

- Predictive churn modeling with a real time-series model (needs large historical data).
- Cohort retention heatmap (Amplitude/Mixpanel-style).
- Multi-user real-time collaboration (WebSocket/Realtime).
- A full design-token system for multi-brand / white-label theming.

---

## 🏆 Hackathon & Acknowledgements

Built for **Hackathon Season 3: "Build the Loop"**, organized by
[**TestSprite**](https://www.testsprite.com) — whose CLI powers the continuous
`write → verify → fix → verify` loop at the core of this project (see [`LOOP.md`](./LOOP.md)).

---

## 📜 License

Built for Hackathon Season 3 "Build the Loop" (organized by TestSprite).
© 2026 **Ida Bagus Giri Krisnabhawa**.

<div align="center">

_Built with ❤️ and a continuous TestSprite verification loop._

</div>
