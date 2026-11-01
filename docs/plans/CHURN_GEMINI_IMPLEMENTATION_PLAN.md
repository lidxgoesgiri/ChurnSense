# ChurnSense — rencana implementasi untuk Gemini

Disusun 31 Oktober 2026 (Asia/Jakarta). Root eksekusi: `C:/Churn/loop-analytics`. **Dokumen ini adalah rencana; source aplikasi belum diubah dan redesign belum diimplementasikan. Checks baseline source yang tercatat tidak membuktikan gate redesign lulus.**

## Konteks dan urutan baca

ChurnSense menghitung retention/churn/revenue metrics dari agregat pengguna dan revenue, menyimpan snapshot per owner, lalu menyediakan grafik, insight dan chat. Repository aktual memakai Next.js 16.2.9, React 19.2.4, TypeScript, Tailwind v4, Recharts, Drizzle/Neon, dan Zod. Semua detail harus dicek ulang terhadap repository ketika Gemini mulai bekerja.

Baca berurutan: [project audit](../audits/CHURN_PROJECT_AUDIT.md), [UI/UX audit](../audits/CHURN_UIUX_AUDIT.md), [web references](../research/WEB_DESIGN_REFERENCES.md), [mapping](../research/REFERENCE_TO_SCREEN_MAPPING.md), [visual direction](../design/CHURN_VISUAL_DIRECTION.md), [design system](../design/CHURN_DESIGN_SYSTEM.md), [screen blueprints](../design/CHURN_SCREEN_BLUEPRINTS.md), rencana ini, [quality gates](CHURN_QUALITY_GATES.md), lalu [master execution prompt](GEMINI_MASTER_EXECUTION_PROMPT.md).

Arah utama: **Product-Led Minimalism**, dengan hierarchy **Editorial Precision**. Pertahankan Plus Jakarta Sans, logo tunas/bar chart dan hubungan sage/pastel blue, light/dark mode, serta stack yang sudah tersedia. Warna/ukuran di spesifikasi merupakan **proposed target values**, bukan pengukuran referensi. Tidak ada dependency baru yang diperlukan oleh baseline plan ini.

Status bukti: **Verified** = source dibaca; **Inferred** = kesimpulan desain/risiko; **Not Yet Verified** = pengujian belum dilakukan. Public landing deployment dapat dibaca sebagai konten oleh root audit, tetapi tidak membuktikan kesamaan SHA lokal atau tampilan multi-viewport. Visual referensi yang belum dilihat screenshot-nya tidak boleh disebut close pixel match.

## Batas implementasi dan invariant

1. Tetap dua page routes: `/` dan `/dashboard`. Analyze, CSV, history, compare, insight dan chat adalah section/state dashboard; jangan membuat route Settings, Billing, Customers, Cohorts, atau Onboarding yang belum ada.
2. `ProjectInput` tetap projectName, totalUsers, activeUsers, churnedUsers, monthlyRevenue. Rasio churn/retention di API tetap 0–1. Jangan mengganti penyebut ARPU dari totalUsers menjadi activeUsers.
3. `totalUsers > 0`; user counts integer nonnegative; active + churned boleh **lebih kecil** dari total, tidak boleh lebih besar. Jangan memaksa retention = 100% − churn bila input menyisakan kategori lain.
4. `estimatedLtv === null` pada churn nol tetap null. Target UI menampilkan `Not defined · no churn`, ekspor tetap cell kosong sesuai kontrak. Jangan mengarang estimasi nol/infinity numerik atau menampilkan infinity sebagai hasil uang.
5. Calculate saat DB tersedia tetap autosave append-only snapshot. Nama yang sama membuat entry baru dengan warning; bukan update/upsert. Jangan menambah tombol Save yang menyebabkan snapshot ganda.
6. GET projects default 20, maksimal 50 per request, dengan metadata total/page/limit/hasMore (`src/app/api/projects/route.ts:31–69`). Pilihan minimum plan: incremental `Load more` dalam batch 20, count loaded/total, dan scope eksplisit untuk table/compare/chart/export. Jangan menyebut data yang baru dimuat sebagai seluruh history.
7. Snapshot tanggal `createdAt` bukan periode bisnis yang dimasukkan user. Tren pada chart berasal dari matching projectName, maksimal 10 loaded snapshots saat ini; insight server dapat memakai jendela history berbeda. Labelkan scope; jangan menyatakan full-history atau monthly cohort.
8. Pertahankan owner scoping, session cookie, CSRF headers yang berlaku, whitelist model, AI fallback, payload caps dan parser shared. Jangan menyalin auth/session ke localStorage.
9. Login dapat langsung memberi session atau `pending:true` bergantung konfigurasi. Jangan mengubah AUTH_REQUIRE_VERIFICATION/email provider/env untuk menyesuaikan mockup. Copy umum harus sesuai kedua mode; “link telah dikirim” hanya setelah response pending.
10. Hindari rewrite, schema migration, dependency additions, deployment, dan production data mutations. Perubahan API/config di luar task yang disebut memerlukan keputusan scope terpisah; lanjutkan task lain yang independen.

## Referensi yang boleh dipakai dan batasnya

Sumber tunggal status pengecekan dan exact section berada pada dokumen riset. URL resmi di bawah menjadi sumber pola/kontrak, bukan bukti semua screenshot atau responsive behavior sudah diverifikasi:

- [Linear](https://linear.app/) untuk hierarchy navigasi/metadata dan density yang terkendali.
- [Vercel Design / Geist](https://vercel.com/geist) untuk semantic surfaces dan control anatomy.
- [Stripe](https://stripe.com/) untuk hierarchy informasi finansial dan product explanation; jangan membawa kompleksitas payment product ke ChurnSense.
- [Raycast](https://www.raycast.com/) untuk command affordance dan compact interaction.
- [Resend](https://resend.com/) untuk sign-in/transactional feedback yang ringkas.
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) untuk perilaku overlay, bukan instruksi memasang Radix.
- [WAI-ARIA dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) dan [tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) untuk kontrak keyboard.

Jangan mengambil logo, copy brand, foto, ilustrasi proprietary, source privat/minified, atau aset yang tidak punya hak penggunaan. Reimplementasikan pattern dengan source proyek sendiri. Jika nanti komponen open source memang dibutuhkan, catat URL, lisensi, attribution, alasan, ukuran bundle dan alternatif; itu bukan dependency yang telah disetujui oleh plan ini.

## Roadmap dan dependency

| Milestone | Priority | Outcome konkret | Dependency | Exit gate |
| --- | --- | --- | --- | --- |
| M0 | P0 planning prerequisite | Baseline repository, scope, state/data contracts dan evidence boundary terkunci | — | G0 |
| M1 | P1 correctness | Data scope, status request, angka perbandingan, form outcome, keyboard/overlay dan copy auth jujur | M0 | G1–G4 |
| M2 | P1 foundations | Tokens light/dark dan primitives konsisten; font dipertahankan | M1 | G5 |
| M3 | P1 core structure | Shell, landing dan sign-in mendukung produk nyata | M2 | G3,G5,G6 |
| M4 | P1 core flow | Manual/CSV → metrics/chart bekerja dengan hierarchy baru | M3 | G1,G2,G4,G6,G7 |
| M5 | P2 supporting flow | Snapshot ledger, compare, insight/chat/model/commands lengkap | M4 | G1–G4,G6–G8 |
| M6 | P2 polish + P3 validation | Motion, responsive, a11y, regression dan performance evidence | M5 | G0–G10 |

Kerjakan satu task atau vertical slice kecil, verifikasi, lalu lanjut. Jangan mengerjakan M2–M6 untuk menghindari masalah correctness M1. Jika ditemukan blocker nyata P0 seperti kehilangan data atau kebocoran owner, hentikan flow terdampak dan selesaikan/replan sebelum visual polish; temuan audit UI belum membuktikan P0 runtime.

## Kontrak commands dan evidence

Semua commands dijalankan dari root aplikasi. **Daftar ini bukan hasil run.**

| Code | Command / metode | Kapan | Batas |
| --- | --- | --- | --- |
| C0 | `git status --short`, `git diff --stat`, `git diff -- <files task>`; baca package.json/source aktual | Awal/akhir tiap task | Jangan stage/reset/discard perubahan user |
| C1 | `npm run lint` lalu `npm run typecheck` | Setiap task TypeScript/CSS terintegrasi | Catat output/exit code; failure baseline dipisahkan dari regression |
| C2 | `npm run test` | M1 perubahan state/format/data; akhir milestone dan final | Script aktual `scripts/run-tests.mjs` memakai Node dengan `--import tsx`; verifikasi dependency yang tersedia, jangan otomatis memasang runtime baru |
| C3 | `npm run build` | Setelah vertical slice terintegrasi dan final | Bisa memerlukan env valid dan font network; catat blocker, jangan menampilkan values atau mengarang pass |
| C4 | Browser lokal dengan existing installed tools; mulai `npm run dev` hanya pada fase implementasi | Visual/keyboard/state QA | Gunakan fixture/local non-produksi; catat URL, SHA, theme, viewport, state, screenshot |
| C5 | Periksa Network/console/DOM dan manual keyboard/screen reader sesuai gates | Affected task | Automated scanner tidak menggantikan pengujian alur |

M0 tidak menjalankan build/install/migration/POST. Pada audit source, agen project audit menjalankan `npm test` (37 pass, 0 failed, 0 skipped), `npm run lint` (exit 0), dan `node node_modules/typescript/bin/tsc --noEmit --incremental false` (exit 0). Ini baseline source lama; build belum dijalankan. C1–C5 tetap harus diterapkan Gemini pada perubahan yang dibuat. `npm run ci` adalah gabungan lint/typecheck/test/build yang ada; jangan menjalankan berulang tanpa perubahan setelah checks yang sama lulus.

## Task per milestone

### M0 — baseline tanpa perubahan source

**M0-01 · P0 prerequisite · Konfirmasi konteks, working tree dan kesiapan evidence**

- **Goal/problem:** cegah Gemini menjalankan rencana terhadap root/SHA/data environment yang berbeda tanpa menyadarinya.
- **Files verified untuk dibaca:** `package.json`, `README.md`, `src/app/page.tsx`, `src/app/dashboard/{page.tsx,dashboard-client.tsx,dashboard-reducer.ts}`, `src/app/api/projects/route.ts`, `src/lib/{analytics.ts,validation.ts,auth.ts,env.ts}`, `src/types/index.ts`, `scripts/run-tests.mjs`, dan semua dokumen blueprint. Periksa AGENTS.md yang berlaku bila muncul pada checkout terbaru. Jangan baca isi `.env*` untuk laporan.
- **Dependencies:** tidak ada.
- **Steps:** rekam root/SHA/status; pisahkan perubahan user; petakan dua route dan named sections; catat ketersediaan browser/deps/DB tanpa values; cocokkan file yang hendak diedit; buat daftar baseline pending. Status audit awal: untracked `public/sample-churn-data.csv` milik konteks sebelum audit dan `docs/` hasil planning.
- **References:** project audit dan UI audit; UI belum dinilai pixel parity.
- **Acceptance:** daftar source targets cocok; tidak ada file user dihapus; local runtime vs deployment dibedakan; belum ada klaim test pass. **Verification:** C0 + read-only file inspection. **Risk:** source bergeser sejak audit. **Rollback:** tidak ada source change; koreksi dokumen task sebelum implementasi.

### M1 — correctness dan akses alur terlebih dahulu

**M1-01 · P1 · Nyatakan dan kelola pagination/scope history**

- **Problem:** client memanggil `/api/projects` sekali lalu mengabaikan total/page/limit/hasMore; chart, compare, history dan export memakai subset 20 sebagai seolah lengkap.
- **Files verified untuk edit:** `src/app/dashboard/dashboard-client.tsx`, `src/app/dashboard/dashboard-reducer.ts`, `src/components/{projects-history.tsx,retention-table.tsx,comparison-view.tsx,retention-chart.tsx,navbar.tsx}`, `src/lib/export.ts` hanya bila filename/scope perlu disesuaikan. `src/app/api/projects/route.ts` dibaca sebagai kontrak; perubahan server tidak diperlukan baseline.
- **Dependencies:** M0-01. **References:** Linear density; Stripe financial information; mapping history/chart/export.
- **Steps:** tambah state metadata page/limit/total/hasMore/loadingMore terpisah; fetch eksplisit page=1&limit=20; `Load more` mengambil next page hanya sekali, dedupe by snapshot id; tandai count “20 of 43 snapshots loaded”; expose scope “Loaded snapshots” pada chart/compare/export; reload page 1 setelah autosave/delete lalu reset metadata secara konsisten; abaikan late response dari request generasi sebelumnya. Jangan hanya menaikkan limit menjadi50 lalu menyebut masalah selesai.
- **Acceptance:** fixture 0/1/20/21/43 rows dapat diakses melalui Load more; final hasMore=false menghentikan kontrol; retry halaman gagal tidak menduplikasi rows; export count sama dengan rows yang secara eksplisit dipilih scope loaded; filter project chart tidak mengarang missing history; 401/503 bukan empty success. Jika produk meminta export seluruh account/full project history, buat task terpisah dengan fetching/snapshot consistency contract; jangan mengklaim sudah ada.
- **Verification:** C0,C1,C2; C4/C5 fixture pagination dan concurrent response. **Meaningful test proposed:** `src/app/dashboard/dashboard-reducer.test.ts` **baru**, hanya untuk state contract pagination/reset/stale response yang benar-benar ditambahkan; belum ada file ini saat audit.
- **Risk:** paging offset bergeser bila save/delete saat load-more; gunakan request generation dan reset setelah mutation; jelaskan data bukan snapshot transaksi lintas fetch. **Rollback:** kembalikan hanya patch task/commit milik Gemini; jangan menghapus data tersimpan. Bila rollback mengembalikan truncation, tandai gate gagal dan jangan klaim complete.

**M1-02 · P1 · Pisahkan kalkulasi, persistence, history dan delete outcomes**

- **Problem:** history/save/delete failures silent; DB503 menyembunyikan sections; form timer menampilkan submitted tanpa outcome.
- **Files edit:** `src/app/dashboard/{dashboard-client.tsx,dashboard-reducer.ts}`, `src/components/{project-form.tsx,projects-history.tsx,retention-table.tsx,toast.tsx}`. **Dependencies:** M1-01.
- **Steps:** tambah status lokal eksplisit untuk calculate/saving/saved/save-error/history-error/unavailable/deleting; gunakan hasil request untuk success; validasi field dan API errors ditautkan label/id; pertahankan metrics bila save gagal dan beri “Calculated; not saved”; DB503 memunculkan mode persistence unavailable dengan retry read, bukan hilang diam-diam; delete confirm menunggu response, menampilkan failure dan menjaga row; sesi401 menawarkan kembali sign-in dengan warning state belum tersimpan. Jangan otomatis mengulang POST setelah network uncertainty karena append-only dapat menggandakan snapshot.
- **Acceptance:** error tidak tampil sebagai empty; tidak ada success saat calculate gagal; calculate sukses + save500 mempertahankan angka dan error persistence; 503 masih mengizinkan calculate/fallback yang didukung; confirmation focus kembali ke row berikut/section; klik double tidak menambah mutation ganda. Retry save harus menjelaskan snapshot baru dan hanya atas aksi user; jika hasil POST ambigu, refresh history sebelum menyarankan retry.
- **References:** Resend concise feedback, Geist alert anatomy, audit UX-04/05/17. **Verification:** C0–C2,C4/C5 dengan mocked/local failures 401/403/429/500/503/offline; tests state outcomes yang bermakna. **Risk:** mengubah autosave atau menghapus hasil valid; hindari broad reducer rewrite. **Rollback:** revert patch task dan dokumentasikan unresolved status; tidak ada DB rollback/migration.

**M1-03 · P1 · Koreksi delta, nilai null dan konteks metrik**

- **Problem:** compare menghapus tanda minus dan menggunakan simbol persen untuk selisih rate; konteks snapshot tidak jelas.
- **Files edit:** `src/components/comparison-view.tsx`; `src/lib/format.ts` hanya bila formatter reusable diperlukan; `src/components/metrics-summary.tsx` untuk penjelasan null/units; `src/lib/export.ts` dibaca untuk regression. **Dependencies:** M0-01, lalu integrasi M1-01.
- **Steps:** format signed B−A (A baseline, B comparison); percentage-point delta untuk churn/retention; uang memakai dollar dan format konsisten; equality neutral; null delta em dash + alasan; tambahkan teks B−A dan meaning better/worse, tidak hanya warna. Tampilkan project+timestamp pada kedua pemilih agar dua snapshot nama sama dapat dibedakan.
- **Acceptance:** A15/B10 → −5.0 pp churn (improved), swap → +5.0 pp; ARPU A7/B5 → −$2.00 atau format sign yang konsisten; equality0; LTV null tidak menjadi0/NaN; risk fixture15% tetap Medium; formula API tak berubah. **References:** Stripe/Geist untuk numeric hierarchy, audit UX-03. **Verification:** C0–C2,C4; proposed `src/lib/format.test.ts` **baru bila formatter baru dibuat**, uji kasus outcome bukan markup.
- **Risk:** interpretasi rate versus pp; jangan memakai absolute delta sebagai hasil. **Rollback:** task patch; formula `src/lib/analytics.ts` tetap tidak disentuh.

**M1-04 · P1 · Keyboard upload dan overlay lifecycle**

- **Problem:** drop zone tidak aktif via keyboard; sign-in/palette/dropdown custom belum lengkap fokus/semantics.
- **Files edit:** `src/components/{csv-uploader.tsx,command-palette.tsx,model-selector.tsx}`, `src/app/page.tsx`; **proposed file baru:** `src/components/ui/dialog.tsx` jika primitive dibutuhkan. Jangan berpura-pura file dialog sudah ada. **Dependencies:** M0-01. **References:** WAI dialog/tabs patterns, Radix Dialog behavior only.
- **Steps:** browse memakai button native; pertahankan drop handler. Dialog diberi nama, fokus awal/containment/restore, Escape, inert background, scroll lock bersih, max-height viewport. Palette memakai dialog lifecycle dan selected-result announcements; model selector utamakan native select/optgroup tanpa deps. Error punya role/association tepat. Mobile modal menghindari keyboard menutupi submit.
- **Acceptance:** Tab/Shift+Tab/Enter/Space/Escape menyelesaikan upload dan sign-in modal; fokus tak lolos ke background; close memulihkan trigger; open/close berulang tidak meninggalkan lock/listener; model bisa dipilih tanpa pointer; no-result palette diumumkan. **Verification:** C0,C1,C4/C5; manual keyboard adalah evidence wajib. **Risk:** nested overlay dan z-index; satu modal aktif, gunakan fallback native semantics. **Rollback:** revert task patch, tidak memasang/removing package.

**M1-05 · P1 · Copy dan mode autentikasi sesuai kontrak aktual**

- **Problem:** copy menjanjikan magic link/OTP pada semua mode serta encryption/causal diagnosis tanpa bukti.
- **Files edit:** `src/app/page.tsx`; `src/app/layout.tsx` untuk landmark/metadata jika dibutuhkan; `README.md` hanya bila copy petunjuk auth terbukti perlu sinkronisasi dan scope dokumentasi dicatat. `src/app/api/auth/login/route.ts`, `src/lib/{email.ts,env.ts}` **read-only baseline**.
- **Dependencies:** M1-04 untuk dialog final. **Steps:** gunakan entry copy netral “Continue with email”; render inbox/15-minute expiry hanya berdasarkan pending response; success langsung menuju dashboard; error field announced; tambah landing main#main-content; ganti “owner-scoped encryption” dengan data isolation yang benar-benar didukung; insight sebagai suggestions based on aggregate metrics, bukan sebab pasti churn. Jangan ubah env atau kebijakan auth.
- **Acceptance:** instant dan pending mocked response menghasilkan UI yang sesuai; failure502 tidak mengaku email terkirim; skip link bekerja; expired/invalid link punya recovery yang tersedia di kontrak server, tanpa route rekaan; semua klaim teknis dapat ditelusuri. **References:** Resend form clarity, audit UX-07/08. **Verification:** C0,C1,C4/C5 dengan fixture response; jangan kirim email produksi. **Risk:** menyamakan email syntactic validation dengan ownership verification. **Rollback:** patch copy/landmark saja; konfigurasi tetap untouched.

### M2 — foundations

**M2-01 · P1 · Semantic tokens dua tema dan type scale**

- **Goal/problem:** ganti indigo/rainbow/glass berulang dengan sistem brand data-first yang terukur.
- **Files edit:** `src/app/globals.css`, `src/app/layout.tsx` hanya konfigurasi roles bila perlu, `src/components/{theme-provider.tsx,theme-toggle.tsx}`. **Dependencies:** M1 selesai. **References:** Geist semantic surfaces; visual-direction dan design-system lokal.
- **Steps:** petakan existing tokens ke proposed semantic tokens; retain Plus Jakarta Sans/weights yang perlu; text/data roles, spacing/grid/radius/border/elevation dan motion tokens; opaque surface untuk data; blur terbatas overlay/nav bila terbukti membantu; validate persisted theme light/dark dengan fallback aman. Jangan menambah font download/deps.
- **Acceptance:** semua critical foreground/background/control pairs lulus contrast pada light/dark; existing theme preference tetap terbaca; CSS token migration tidak menampilkan light flash/undefined variable; metric data tabular; tidak ada glass-card hover lift pada static data. **Verification:** C0,C1,C3,C4/C5, contrast evidence G5. **Risk:** CSS-first Tailwind mapping/theme specificity. **Rollback:** revert token patch lengkap dengan consumers pada satu slice; jangan menyisakan mixed tokens.

**M2-02 · P1 · Primitives dan anatomy states**

- **Files edit:** existing `src/components/ui/{button.tsx,input.tsx,card.tsx,badge.tsx,index.ts}`, `src/components/{skeleton.tsx,toast.tsx}`; proposed dialog dari M1-04 bila dibuat. **Dependencies:** M2-01.
- **Steps:** terapkan ukuran/button variants/field hints/errors/focus/disabled/loading dari design system; native semantic elements; target sentuh preferred44px; jangan mengecilkan action <24px tanpa exception terbukti. Skeleton meniru layout final, decorative hidden dengan busy label pada region; toast informative, error recoverable persisten.
- **Acceptance:** varian button konsisten; loading tidak mengubah width/label accessibility; input punya label/description/error ids; cards statis tidak terlihat clickable; component API sederhana dan sesuai kebutuhan screens. **References:** Geist components, WAI semantics. **Verification:** C0,C1,C4/C5 two themes; tidak perlu test markup/warna yang sekadar mencerminkan implementasi. **Risk:** primitives ada tetapi consumer masih inline; migrasi bertahap per slice. **Rollback:** consumer+primitive patch task secara atomik.

### M3 — shell, landing dan sign-in

**M3-01 · P1 · Dashboard shell dan navigasi section nyata**

- **Files edit:** `src/components/navbar.tsx`, `src/app/dashboard/{dashboard-client.tsx,loading.tsx}`, `src/components/command-palette.tsx`. **Dependencies:** M2-02.
- **Steps:** hierarchy title/context/actions; nav ke Analyze, Snapshots/Compare, Insight/Chat sebagai anchors/state di `/dashboard`; visible command trigger; export scope loaded; model selector dekat konteks AI bila cocok; compact nav collapse/wrap secara intrinsic, tidak fixed-height multi-row; landmarks/header/skip target konsisten; loading sesuai shell baru.
- **Acceptance:** semua controls punya fungsi; tak ada nav dummy/settings; title+project/snapshot context jelas; tab order sesuai reading order; 375px dapat mencapai export/model/sign-out; sticky header tidak menutup anchor/focus; long email/project tidak meluap. **References:** Linear IA, Raycast commands, mapping shell. **Verification:** C0,C1,C4/C5 G6. **Risk:** kehilangan akses controls saat mobile collapse. **Rollback:** shell patch; reducer/data contract tidak dirombak untuk layout.

**M3-02 · P1 · Landing proof-first dan sign-in final**

- **Files edit:** `src/app/page.tsx`, `src/app/globals.css` hanya page-local pattern; proposed `src/components/landing-product-preview.tsx` **baru opsional** bila preview terlalu kompleks dalam page. **Dependencies:** M1-05,M2-02.
- **Steps:** headline menjelaskan pekerjaan; satu primary CTA; product proof dengan fixture berlabel sample, input→hasil→next-step; ringkas process dan capability section; hapus repeated floating logo/orbs/rainbow headline/copy hiperbolis; preserve brand logo existing; modal memakai primitive M1; jangan fetch private/live data untuk public preview.
- **Acceptance:** visitor memahami input dan output tanpa jargon backend; angka preview berasal fixture benar, label `Example` terlihat; CTA membuka auth yang berfungsi; pending/error/sent tetap lengkap; main landmark; no invented customer/testimonial/pricing/features. **References:** Stripe product explanation, Linear typography, Resend entry clarity, mapping landing. **Verification:** C0,C1,C3,C4/C5 viewport/theme matrix. **Risk:** demo preview disangka data live atau fitur cohort; label explicit. **Rollback:** task slice, simpan copy yang benar pada rollback visual.

### M4 — alur analisis utama

**M4-01 · P1 · Manual entry dan hasil utama**

- **Files edit:** `src/components/{project-form.tsx,metrics-summary.tsx,animated-metric.tsx,anomaly-badge.tsx}`, `src/app/dashboard/dashboard-client.tsx`. **Dependencies:** M3-01,M1-02/03.
- **Steps:** kelompokkan project/context, user counts, revenue; hints active/churned tidak perlu exhaustive total; single column compact, grid lebih lebar; churn/retention dominan, revenue secondary; risk textual; use exact existing formulas; expose successful result context dan saving status; explainer dapat diakses focus/touch; final semantic values tidak menunggu counter.
- **Acceptance:** fixture golden sesuai G1; invalid total0/decimal counts/sum>total diberi error tepat; no API formula change; stale result diberi status saat recalculation; nilai panjang tidak clipped; risk tidak hanya warna; null LTV dijelaskan. **References:** Stripe numeric hierarchy, Geist inputs, mapping KPI/form. **Verification:** C0–C4/C5 G1,G2,G5–G7. **Risk:** UI normalization projectName berbeda dari backend trimmed name; gunakan canonical response bila tersedia tanpa mengganti identity semantics. **Rollback:** component/state slice; jangan reset history.

**M4-02 · P1 · CSV progressive disclosure dan partial success**

- **Files edit:** `src/components/csv-uploader.tsx`; `src/app/dashboard/dashboard-client.tsx` hanya promotion handler; `src/lib/csv-parser.ts`, `src/app/api/upload-csv/route.ts` **dibaca**, parser/api tidak perlu diganti.
- **Dependencies:** M1-04,M4-01. **Steps:** browse/drop → filename/size/preview → Analyze → valid/failed aggregate/result rows; pre-read size/format feedback, 5MB/500rows limits sesuai API; thead/th/caption; row errors 1-based data-row index; per-row `Use {projectName}`; keep quote/BOM/separator/multiline parser parity. Compact data scroll intentional; selected filename wrap.
- **Acceptance:** quoted comma/escaped quote/BOM/semicolon/multiline preview sama dengan server; file tepat5MiB (5×1024×1024bytes) dan tepat500 data rows diperbolehkan bila schema valid, di atas salah satu batas ditolak dengan alasan; partial success tidak disebut entire failure; Use row meneruskan validated input dan existing calculate→autosave flow satu kali; switching manual/CSV tidak mengaku input tersimpan jika state memang unmounted.
- **References:** Geist table/input anatomy, mapping CSV. **Verification:** C0–C2,C4/C5 with existing `src/lib/csv-parser.test.ts` plus local fixtures, G1/G7. **Risk:** file besar diparse sebelum limit atau duplicate promotion; disable action saat pending. **Rollback:** component patch; preserve shared parser.

**M4-03 · P1 · Chart yang benar dan mudah dibaca**

- **Files edit:** `src/components/retention-chart.tsx`, `src/components/metrics-summary.tsx`, `src/components/retention-table.tsx` bila menyediakan linked data fallback. **Dependencies:** M1-01,M4-01.
- **Steps:** title project dan loaded snapshot/date scope; single snapshot bars tetap; ≥2 matching snapshots line; annotate last10 subset bila berlaku; preserve raw source in accessible table; series distinguishable melalui label/pattern bukan red/green saja; no fake smoothing/interpolation claims; chart motion respect media query.
- **Acceptance:** chart+fallback table angka/range sama; available20 global bukan full per-project history; empty/missing history punya aksi yang jujur; timestamp sama hari tetap dibedakan bila perlu; 0/large values dan mobile ticks usable. **References:** data-heavy reference mapping; WAI label principles. **Verification:** C0,C1,C4/C5 G1,G5–G7. **Risk:** grafik tampak kronologis harian untuk snapshot ad hoc; label `Saved snapshots`, bukan cohort. **Rollback:** chart patch; jangan mengganti saved data.

### M5 — snapshot ledger, compare dan AI

**M5-01 · P2 · Satukan fungsi history tanpa kehilangan deletion/paging/compare**

- **Files edit:** `src/components/{retention-table.tsx,projects-history.tsx,comparison-view.tsx}`, `src/app/dashboard/dashboard-client.tsx`, `src/lib/export.ts` hanya presentasi/scope bila perlu. **Dependencies:** M1-01/02/03,M4.
- **Steps:** pilih satu snapshot ledger dengan metrics+timestamp+actions atau dua view yang punya fungsi berbeda; hindari render duplikat informasi sama; preserve delete confirmation + error; compare two unique snapshot IDs, named same-project entries tetap dapat dibedakan; provide prerequisite state bila <2; paging footer count/Load more; export current loaded scope jelas.
- **Acceptance:** seluruh kemampuan lama tetap dapat dicapai; perbandingan tidak berasumsi unique projectName; same-ID comparison dicegah atau equality dijelaskan; delete failed tetap visible; deletion snapshot aktif tidak memunculkan data stale; export cell escaping/null tetap sesuai G1. **References:** Linear dense rows, Geist tables, Stripe numeric deltas. **Verification:** C0–C4/C5 G1–G4,G6,G7. **Risk:** menghapus history component padahal handler dipakai tempat lain; cari imports sebelum retirement. **Rollback:** hanya patches/commit task; tidak memakai `git reset --hard`/clean.

**M5-02 · P2 · Insight dan chat dengan context/async state jelas**

- **Files edit:** `src/components/{ai-insight-card.tsx,ai-chat.tsx,model-selector.tsx}`, `src/app/dashboard/dashboard-client.tsx` bila passing context/handlers; `src/lib/models.ts` hanya bila metadata UI perlu dipisahkan tanpa mengubah whitelist.
- **Dependencies:** M1-04,M4,M5-01. **Steps:** header menyebut context project/snapshot dan model; keep rule-based source label; full summary displayed after JSON complete, loading indeterminate berlabel bukan fake92% progress; chat waiting/streaming/complete/error distinct; role log dengan label dan announce completion ringkas; preserve last50 per-user+project storage, handle storage failure; bind request pada context asal dan abort/ignore late responses; clear disabled saat streaming atau cancel dulu; preserve reader scroll dengan Jump to latest. Model selector keyboard lengkap, no tier glow.
- **Acceptance:** no-context disabled menjelaskan langkah; provider tidak dikonfigurasi menampilkan setup response JSON; provider dikonfigurasi tetapi semua model gagal tetap rule-based fallback; request error429/timeout/stream interruption recoverable tanpa duplicate send; switching project saat stream tidak mencampur conversation; model whitelist unchanged; summary bukan fabricated token stream; clearing tidak membuat replaceLast menimpa greeting; long response wraps both themes.
- **References:** Raycast compact interactions, Resend async clarity, WAI dialog/selection behavior; mapping AI. **Verification:** C0–C4/C5 G2,G3,G7,G8; jangan melakukan real paid AI calls untuk setiap screenshot, gunakan controlled fixture. **Risk:** request/context/storage race; test focused on outcomes, no new chat architecture or history API. **Rollback:** per component/context slice; jangan menghapus user chat storage global.

### M6 — polish dan release evidence

**M6-01 · P2 · Motion, responsive dan content extremes**

- **Files edit:** `src/app/globals.css`, `src/components/{animated-metric.tsx,ai-insight-card.tsx,ai-chat.tsx,retention-chart.tsx,navbar.tsx,toast.tsx}` hanya affected behavior; per-screen fixes sesuai blueprint.
- **Dependencies:** M5. **Steps:** remove persistent float/glow/cursor; pointer hover only on actionable elements; durations/easing tokens; JS scroll/chart/typewriter respect reduced-motion; focus/anchor sticky offset; compact layout/table affordance; validate 200% zoom dan long content.
- **Acceptance:** tidak ada animasi continuous tanpa tujuan; reduced-motion tidak hanya CSS; no horizontal page overflow pada mandatory matrix; intentional table region usable; primary actions visible on software keyboard; no settled values announced tiap frame. **References:** design-system motion spec, Raycast interaction examples bila visual telah diverifikasi; tidak mengklaim imitation yang belum dilihat. **Verification:** C0,C1,C4/C5 G5–G8. **Risk:** menghilangkan useful loading status bersama animasi; pertahankan status text. **Rollback:** polish-only patch, jangan rollback correctness M1.

**M6-02 · P3 validation · Regression, performance dan handoff final**

- **Files edit/create:** dokumentasi evidence **proposed baru** `docs/qa/CHURN_REDESIGN_VALIDATION.md` dan screenshots di `docs/qa/evidence/` bila diizinkan untuk disimpan; source hanya bila regression ditemukan dan task fix dicatat. **Dependencies:** semua task di atas.
- **Steps:** jalankan C1,C2,C3 satu final pass setelah changes selesai; render required views/themes/states, keyboard journey, contrast pairs; monitor console/network; ukur LCP/CLS lab dengan metodologi/tool/version/cache/network tercatat dan INP melalui interaksi/lapangan yang sesuai; compare hierarchy against verified reference captures, bukan homepage ingatan; audit working tree dan changed files; record known gaps.
- **Acceptance:** semua applicable gates pass dengan evidence; checks yang tidak berjalan blocked/pending dengan alasan, bukan assumed; tidak ada source lain tersentuh; tidak ada fabricated live data/screenshots/tests; final lists files changed, before/after, command outcomes, viewport screenshots, remaining limits. **References:** semua blueprint dan [quality gates](CHURN_QUALITY_GATES.md).
- **Verification:** C0–C5,G0–G10. **Risk:** network/env/font membatasi build/perf atau screenshots tak tersedia. Selesaikan checks independen, dokumentasikan blocker; jangan deploy/install/migrate untuk memaksa pass. **Rollback:** revert hanya milestone commit yang menyebabkan regression; bila belum commit, apply inverse scoped patch yang memperhitungkan perubahan user. Jangan menyentuh DB/data/secrets.

## Prompt kontrol per milestone

Gunakan format ini bersama master prompt, satu milestone pada satu waktu:

> Kerjakan hanya Mx dan task IDs [daftar]. Baca ulang target files dan git status. Sebelum edit, nyatakan acceptance criteria dan data invariants yang terdampak. Terapkan satu slice kecil, pertahankan fitur/flow yang tercatat, lalu jalankan commands yang relevan dan browser QA yang tersedia. Laporkan file changed, before/after behavior, bukti, dan gaps. Bila file/kontrak aktual berbeda dari plan, revisi task berdasar evidence sebelum melanjutkan edit besar. Jangan mengaku complete sebelum exit gate terpenuhi.

## Keputusan terbuka yang tidak boleh diasumsikan selesai

- Full account export/full project trend di luar loaded pagination scope memerlukan kontrak tersendiri. Baseline plan memperbaiki akses halaman dan kejujuran scope, tidak menjanjikan server aggregate endpoint yang belum ada.
- Kebijakan autentikasi produksi dan email verification merupakan keputusan produk/security terpisah; perubahan UI tidak memberi izin mengganti konfigurasi.
- Screenshot referensi dan aplikasi multi-viewport belum otomatis tersedia dari text/AX read. Verifikasi visual diperlukan sebelum menyebut close structural/visual reproduction tercapai.
- Baseline `npm test` 37 pass, lint exit0 dan typecheck non-incremental exit0 tercatat di project audit. Build, browser authenticated dan performance belum dijalankan dalam audit ini. Node/env/network dapat memengaruhi commands; laporkan hasil sesungguhnya saat Gemini menjalankan implementasi.
