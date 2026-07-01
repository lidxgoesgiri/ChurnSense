# 🔄 LOOP.md — Bukti Siklus Verifikasi TestSprite CLI

Proyek: **ChurnSense / LoopAnalytics** — SaaS metrics API
Hackathon Season 3 · "Build the Loop"

- **Live URL (target):** https://loop-analytics-nine.vercel.app
- **Repo:** https://github.com/lidxgoesgiri/ChurnSense
- **TestSprite project (backend):** `3f03871e-9e3d-4452-9811-ea32aaff6fb8` — akun `lidxgoesgiri`
- **Test:** `b5b10e1a-5f08-4787-b873-d1b22beda16c` — "Metrics API: health, churn calc, and input validation"
- **Dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/b5b10e1a-5f08-4787-b873-d1b22beda16c

## Alur Kerja
`Edit kode` → `git push` → `Vercel auto-redeploy` → `testsprite test rerun --wait` → `baca verdict` → `fix` → ulangi.

Deploy otomatis: repo GitHub terhubung ke Vercel, tiap push ke `main` memicu redeploy produksi. CLI menembak URL live tersebut (bukan localhost).

---

## Catatan mekanik (jujur, untuk presentasi)

- **Backend test** ditulis sebagai Python (`requests`) via `--code-file`. Pada tahap **code-generation** TestSprite meng-adapt kode ke respons app yang sebenarnya (mis. menyelaraskan pesan validasi), lalu **membank** kode itu. Karena itu, `test create` pertama terhadap app yang sehat cenderung langsung **PASS**.
- **Kegagalan autentik** muncul saat **`test rerun`** dijalankan setelah app berubah: rerun me-**replay kode tersimpan** (bukan regenerasi), sehingga menangkap **regresi**. Inilah nilai inti TestSprite — regresi yang tidak disadari agent.
- Deteksi kegagalan 100% otomatis via CLI; **perbaikan kode** dilakukan oleh coding agent (Claude Code) yang membaca failure bundle. Bukan proses "self-healing" tanpa intervensi.

---

## Riwayat Siklus Loop

### [Siklus 1] — 2026-07-01T06:51:44Z · ✅ PASSED (baseline)
- **Run:** `76d29276-0638-41da-8dc8-48276bc277fd`
- **Aksi:** `testsprite test create --type backend --code-file testsprite_tests/metrics_api_test.py --run --wait`
- **Cakupan:** `GET /api/health` (200, status ok); `POST /api/metrics` valid → `churnRate=0.15, retentionRate=0.85, arpu=5`; `totalUsers=0` → 400; field hilang → 400.
- **Verdict:** `passed` — baseline perilaku benar terbank sebagai kontrak.

### [Siklus 2] — 2026-07-01T06:57:35Z · ❌ FAILED (regresi tertangkap)
- **Run:** `f04c6815-af4d-4d05-90d8-50d0430cc40d`
- **Perubahan pemicu:** rumus churn diubah keliru — denominator `totalUsers` → `activeUsers` (commit `462ca8b`), ter-deploy ke produksi.
- **Aksi:** `testsprite test rerun b5b10e1a… --wait`
- **Failure bundle** (`.testsprite/runs/f04c6815…/failure.json`):
  ```json
  { "rootCauseHypothesis": "{'churnRate': 0.1765, 'retentionRate': 0.85, 'arpu': 5, 'riskStatus': 'High'}" }
  ```
- **Root cause:** `churnRate` bergeser `0.15 → 0.1765` (150/850 alih-alih 150/1000); `riskStatus` ikut salah `Medium → High`. Assertion `churnRate == 0.15` gagal.
- **Verdict:** `failed` — suite menangkap regresi yang tidak terlihat dari kode saja.

### [Siklus 3] — 2026-07-01T06:58Z · ✅ PASSED (fix diverifikasi)
- **Run:** `83da31ad-3b16-4b09-823b-7a7c5cafb20d`
- **Fix:** denominator dikembalikan ke `totalUsers` (commit `284b4aa`), ter-deploy ke produksi (`churnRate=0.15` terkonfirmasi live via curl).
- **Aksi:** `testsprite test rerun b5b10e1a… --wait`
- **Verdict:** `passed` — regresi teratasi, kontrak hijau kembali.

---

## Selanjutnya
- [ ] Tambah endpoint `/api/projects` (CRUD, Neon+Drizzle) + test backend-nya.
- [ ] Endpoint `/api/insights` (Claude API) + test.
- [ ] Frontend project TestSprite untuk dashboard UI (browser flow).
- [ ] `.github/workflows/testsprite-ci.yml` — jalankan loop di CI (bonus +5 poin).
