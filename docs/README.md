# ChurnSense — paket audit dan rencana Gemini

Disusun 31 Oktober 2026 (Asia/Jakarta). App/git root: `C:\Churn\loop-analytics`. Scope fase ini: audit, riset, desain dan rencana; **source aplikasi tidak diubah**.

Mulai dari [GEMINI_MASTER_EXECUTION_PROMPT.md](plans/GEMINI_MASTER_EXECUTION_PROMPT.md) untuk prompt siap salin. Detail urutan/task/file/acceptance ada di [CHURN_GEMINI_IMPLEMENTATION_PLAN.md](plans/CHURN_GEMINI_IMPLEMENTATION_PLAN.md).

| Dokumen | Isi |
|---|---|
| [Project audit](audits/CHURN_PROJECT_AUDIT.md) | Identitas produk, arsitektur, route/API, invariants, evidence, baseline checks |
| [UI/UX audit](audits/CHURN_UIUX_AUDIT.md) | Temuan severity, state inventory, AI-slop matrix, prioritas |
| [Web references](research/WEB_DESIGN_REFERENCES.md) | 8 produk + 3 sumber komponen; exact URL/section/tanggal/status/lisensi |
| [Reference mapping](research/REFERENCE_TO_SCREEN_MAPPING.md) | Pola referensi→surface nyata; detail adaptasi dan kompleksitas |
| [Visual direction](design/CHURN_VISUAL_DIRECTION.md) | 3 alternatif dan pilihan Retention Workbench |
| [Design system](design/CHURN_DESIGN_SYSTEM.md) | Tokens, typography, responsive, component anatomy, interaction/motion |
| [Screen blueprints](design/CHURN_SCREEN_BLUEPRINTS.md) | Annotated layout per route/section/state |
| [Implementation plan](plans/CHURN_GEMINI_IMPLEMENTATION_PLAN.md) | Milestones, task IDs, file scope, acceptance, verification, rollback |
| [Quality gates](plans/CHURN_QUALITY_GATES.md) | Kriteria data/UX/a11y/responsive/performance/regression |
| [Gemini master prompt](plans/GEMINI_MASTER_EXECUTION_PROMPT.md) | Konteks dan kontrak eksekusi yang siap salin |
| [Contrast evidence](design/CONTRAST_CHECKS.json) | 52 pasangan token usulan, dihitung matematis; bukan rendered WCAG pass |

Baseline kode: lint PASS, typecheck non-incremental PASS, 37 tests PASS; build belum dijalankan. Dokumen lama/LOOP tidak dipakai sebagai hasil test terkini. Ada file pengguna untracked `public/sample-churn-data.csv` sebelum audit; tetap dipertahankan.

Batas bukti: riset web memverifikasi konten/IA/dokumentasi. Screenshot, visual terkini, motion dan responsive referensi belum diverifikasi. Teks landing deployment dibaca lewat browser AX; SHA parity dan dashboard authenticated belum diuji. Screenshot tertahan timeout origin approval review. Semua nilai desain baru adalah proposal. Gemini wajib membuktikan implementasi melalui quality gates; jangan membaca planning sebagai bukti redesign sudah selesai.
