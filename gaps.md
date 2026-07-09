# ChurnSense — Gap Analysis & Missing Features

> Comprehensive audit of the repository structure, functionality, and architectural gaps as of 2026-07-09 after P0/P1 security hardening and UI modernization.

---

## ✅ What's Already Strong

- **Auth & Security**: Magic-link email verification (flag-gated), centralized middleware gate, distributed rate limiter (Upstash-ready), CSRF protection, HMAC-signed cookies, comprehensive security headers (CSP/HSTS/Referrer/Permissions)
- **Data & Ownership**: Owner-scoped queries, DB-backed insight cache (Neon Postgres), migration files committed
- **CI/CD**: Two-stage pipeline (build+verify), TestSprite integration, deployment via Vercel
- **Analytics Core**: Churn/retention/ARPU/MRR/LTV computation, validation (combined user counts, LTV ∞ when churn=0), anomaly detection, comparison view with visual bars
- **AI Layer**: Multi-model fallback (OpenRouter), deterministic rule-based fallback when all models fail, context sanitization (prompt-injection guard), model whitelist gateway
- **UX**: CSV batch upload → dashboard wiring, delete confirmation, skeleton loaders, dark mode, comparison visualization

---

## 🔴 Architectural & Functional Gaps

### 1. **No Multi-Tenancy / Team Collaboration**
- **Current**: One email = one isolated namespace. No concept of "organization" or "team".
- **Gap**: Users cannot invite teammates to view/edit shared projects. No role-based access (viewer/editor/admin).
- **Impact**: Single-user only; unsuitable for team SaaS use-cases (e.g. agency managing multiple clients).

### 2. **No Persistent Project Timeline / History Tracking**
- **Current**: Saved projects are snapshots with a single `createdAt` timestamp. No versioning.
- **Gap**: No way to track how churn evolved over weeks/months for ONE project. "Project X — Week 1" vs "Project X — Week 2" are stored as separate unlinked rows.
- **Impact**: Users manually create "Acme-Jan", "Acme-Feb" to simulate a timeline. No automated time-series view.

### 3. **CSV Upload Limited to Batch Analysis, Not Incremental Import**
- **Current**: CSV upload analyzes all rows in one shot and shows aggregate. User can pick ONE row to load into the dashboard.
- **Gap**: No way to upload historical CSVs and auto-populate a project's timeline (e.g. "import 12 months of data at once").
- **Impact**: Manual data entry for time-series; CSV is a one-off batch tool, not a historical import pipeline.

### 4. **Insight Cache Has No Invalidation Hooks**
- **Current**: Insight cache has TTL (7 days) but no explicit invalidation when the underlying project data changes (e.g. user edits user counts).
- **Gap**: If a project's metrics are recalculated, the cached insight may be stale until TTL expires or manual re-fetch.
- **Impact**: Subtle: users see old AI insight for updated metrics unless they wait or manually re-generate.

### 5. **No Export Formats Beyond CSV (JSON/PDF Missing)**
- **Current**: `export.ts` outputs CSV only.
- **Gap**: No JSON export (for API integration), no PDF report generation (for stakeholders/investors).
- **Impact**: Users wanting a formatted report must copy-paste from the dashboard.

### 6. **AI Chat Has No Conversation History Persistence**
- **Current**: Chat messages are stored in localStorage, scoped to `project:${projectName}`. Cleared on browser data wipe or switching devices.
- **Gap**: No server-side chat history; no way to resume a conversation from another device or share a chat transcript.
- **Impact**: Ephemeral only; not suitable for audit trails or team handoffs.

### 7. **No Webhook/API for External Integrations**
- **Current**: All interaction is browser-only. No public REST API for third-party tools (Slack, Zapier, Make).
- **Gap**: Cannot auto-sync churn data from a data warehouse (e.g. Snowflake → ChurnSense API → auto-update project).
- **Impact**: Manual upload is the only ingress path.

### 8. **Anomaly Detection Is Backward-Looking Only**
- **Current**: `trend.ts` flags spikes/drops against trailing average but does NOT predict future churn.
- **Gap**: No forecasting model (e.g. "at this churn trajectory, you'll lose X% of users by next quarter").
- **Impact**: Reactive, not proactive. Users see "spike detected" after it happened, no advance warning.

### 9. **No Granular Segment/Cohort Analysis**
- **Current**: Metrics are aggregated across all users. No segmentation by plan tier, signup source, geography, etc.
- **Gap**: Cannot answer "which customer segment has the highest churn?" or "retention by acquisition channel".
- **Impact**: One-size-fits-all dashboard; no drill-down for actionable cohort insights.

### 10. **Rate Limiter & Magic-Link Provisioning Not Auto-Deployed**
- **Current**: Upstash KV & Resend are coded but require manual Vercel Marketplace terms acceptance + env pull.
- **Gap**: Not part of a one-click setup script. New deployments run with fallback (in-memory, instant passwordless).
- **Impact**: Distributed rate limiting & email verification are opt-in manual, not default-on in prod.

---

## 🟡 UX & Polish Gaps

### 11. **No Onboarding Flow / Empty-State Guidance**
- **Current**: User lands on dashboard with no projects → sees "No saved projects yet" text.
- **Gap**: No interactive onboarding tour, no sample project pre-populated, no "Try with demo data" button.
- **Impact**: First-time user hesitates; unclear where to start.

### 12. **Landing Page Lacks Social Proof / Testimonials**
- **Current**: Feature cards, "How it works", logo philosophy. No user quotes, no case studies, no "Trusted by X companies".
- **Gap**: No credibility signals beyond the product description.
- **Impact**: Visitors may perceive it as a side project rather than a production tool.

### 13. **No Mobile-Optimized Dashboard Layout**
- **Current**: Dashboard is responsive but Recharts & comparison table are cramped on mobile.
- **Gap**: No mobile-first chart scaling or vertical layout switch for narrow viewports.
- **Impact**: Usable but not delightful on phones; some elements horizontally scroll.

### 14. **No Keyboard Shortcuts / Command Palette Beyond /dashboard**
- **Current**: Command palette (`Cmd+K`) exists but is dashboard-only and undiscovered.
- **Gap**: No global shortcuts (e.g. `Cmd+K` from landing page, `?` for help, `N` to create project).
- **Impact**: Power users can't navigate quickly; discoverability is low.

### 15. **Error Messages Are Generic, Not Actionable**
- **Current**: "Maaf, terjadi kesalahan" or "Chat failed" — no error codes, no retry guidance, no support link.
- **Gap**: Users don't know if it's their input, a transient network issue, or a backend bug.
- **Impact**: Poor troubleshooting UX; users give up instead of retrying.

---

## 📊 Priority Matrix

| Tier | Gap | Effort | Impact | Recommendation |
|---|---|---|---|---|
| **High** | 1. Multi-tenancy | High | High | Defer to v2 (major model change) |
| **High** | 2. Timeline tracking | Medium | High | High ROI — enables true time-series |
| **High** | 9. Cohort segmentation | High | High | Defer to v2 (requires data model redesign) |
| **Medium** | 3. Incremental CSV import | Medium | Medium | Nice-to-have for power users |
| **Medium** | 7. Webhook/API | High | Medium | Defer unless enterprise demand |
| **Medium** | 8. Churn forecasting | High | Medium | Advanced feature for v2 |
| **Low** | 4. Cache invalidation | Low | Low | Address if users report stale insights |
| **Low** | 5. JSON/PDF export | Low | Medium | Quick win for polished feel |
| **Low** | 6. Chat history persist | Medium | Low | Defer; localStorage sufficient for MVP |
| **Low** | 10. Auto-provision integrations | Low | Low | Document manual flow; acceptable for now |
| **Low** | 11. Onboarding tour | Medium | Medium | High polish, defer to post-launch |
| **Low** | 12. Social proof | Low | Low | Add testimonials after real user feedback |
| **Low** | 13. Mobile dashboard | Medium | Low | Responsive exists; optimize in v1.1 |
| **Low** | 14. Global shortcuts | Low | Low | Nice polish; defer |
| **Low** | 15. Actionable errors | Low | Medium | Quick improvement; add error codes + retry |

---

## 🎯 Recommended Next Steps (Post-Submission)

1. **Activate distributed rate limiter & magic-link** (manual provisioning via Vercel Marketplace).
2. **Add timeline/versioning for one project** (schema: `project_snapshots` table, FK to `projects`).
3. **Improve error messages** (add error codes, retry buttons, link to support).
4. **Export to PDF** (use `@react-pdf/renderer` or Puppeteer for a one-page summary report).
5. **Onboarding tour** (use `react-joyride` or `intro.js` for a 3-step walkthrough).

---

> **Note:** Gaps 1, 7, 8, 9 are v2-tier features requiring architectural rewrites (multi-tenancy, segmentation, forecasting). Current MVP is submission-ready with P0/P1 security closed and core analytics polished.
