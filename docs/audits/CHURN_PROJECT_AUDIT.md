# ChurnSense — audit produk dan arsitektur

Tanggal inspeksi: **31 Oktober 2026 (Asia/Jakarta)**. Root aplikasi: `C:\Churn\loop-analytics`; workspace induk `C:\Churn` bukan repository Git. Baseline HEAD: `73013892873161f4ef1bbcc8a91bbf88b9cc16b0`. Dokumen ini adalah bahan rencana implementasi Gemini; audit tidak mengubah source aplikasi, dependency, database, atau konfigurasi deployment.

## Batas bukti dan cara membaca

- **Verified — source:** dibaca langsung dari file pada baseline di atas; bukan klaim perilaku produksi sudah diuji.
- **Verified — command:** command dijalankan dalam audit ini, dengan hasil dicantumkan di bawah.
- **Inferred:** kesimpulan produk atau dampak yang diturunkan dari source dan masih perlu validasi pengguna/runtime.
- **Not Yet Verified:** dashboard terautentikasi, browser keyboard journey, viewport, screenshot, deployed SHA, AI provider nyata, email delivery, koneksi database, Lighthouse/CWV.
- Root coordinator memeriksa teks landing publik `https://loop-analytics-nine.vercel.app/`; parity dengan commit lokal belum diketahui. Halaman produksi tidak menjadi bukti dashboard lokal.
- Tidak ada server lokal pada rentang port 3000–3010 ketika pemeriksaan dilakukan. Audit tidak memulai server atau memasang software. Akses browser screenshot memerlukan persetujuan origin yang tidak terselesaikan pada sesi ini. Audit tetap selesai sebagai audit berbasis source dengan batas runtime jelas.

Penelusuran `AGENTS.md` di workspace/repository dan pemeriksaan ancestor oleh coordinator tidak menemukan instruksi proyek tambahan. `README.md`, `LOOP.md`, `.github/workflows/testsprite-ci.yml`, manifest, source, dan tests dibaca sebagai bukti; hasil historis dalam `LOOP.md` tidak dianggap hasil pengujian baru. File `.env.local` tidak dibaca. Status awal hanya `?? public/sample-churn-data.csv`; file pengguna ini harus dipertahankan. Dokumentasi baru berada di `docs/`.

## Produk dan pengguna

**Verified:** ChurnSense adalah aplikasi analitik retensi SaaS berbasis snapshot manual/CSV, bukan layanan prediksi churn berbasis model statistik dan bukan produk crypto. Dua page route nyata adalah `/` dan `/dashboard`. Dashboard menghitung churn, retention, ARPU, MRR, estimated LTV, serta risiko; menyimpan snapshot; menampilkan chart/table/history/comparison; menghasilkan insight dan chat berbantuan AI. Bukti: `src/app/dashboard/dashboard-client.tsx:6`, `src/lib/analytics.ts:11`, `src/types/index.ts:1`.

**Inferred:** pengguna utama adalah founder/operator SaaS dan analis yang ingin mengubah hitungan user/revenue menjadi keputusan retensi. Belum ada riset pengguna, persona tervalidasi, data penggunaan, atau kebutuhan enterprise yang ditemukan.

Pekerjaan utama dan kontrak perjalanan:

1. Landing → sign-in email → dashboard. Ada jalur instant-session dan jalur magic link; tampilan harus mencerminkan mode aktual.
2. Isi nama proyek, total/active/churned users dan monthly revenue → calculate → hasil numerik → autosave best-effort jika database tersedia.
3. Generate insight setelah analisis → insight AI atau rule-based dengan provenance jelas; trend/anomaly dapat tersedia jika ada history.
4. Upload CSV → preview → batch analyze → partial success/error → pilih satu row valid → jalankan analisis tunggal dan autosave menurut kontrak yang sama.
5. Baca snapshot/trend, bandingkan dua snapshot, export data, atau hapus satu snapshot dengan konfirmasi.
6. Chat memiliki context proyek aktif; riwayat percakapan disimpan lokal per email dan nama proyek. Backend chat menerima pertanyaan saat ini dan context, bukan seluruh conversation history (`src/components/ai-chat.tsx:25`, `src/app/api/chat/route.ts:135`). Jangan menjanjikan memory percakapan server yang belum ada.

## Stack dan struktur aktual

Versi berikut berasal dari manifest, sehingga rentang dependency tidak sama dengan verifikasi versi produksi.

| Lapisan | Kondisi Verified | Bukti |
| --- | --- | --- |
| Framework | Next.js `16.2.9`, App Router; React/React DOM `19.2.4` | `package.json:20`; `src/app/layout.tsx:1` |
| Bahasa | TypeScript `^5`, strict, alias `@/* → ./src/*` | `tsconfig.json:1` |
| Styling | Tailwind CSS v4 CSS-first; CSS global + utilitas + inline styles | `src/app/globals.css:1`; `postcss.config.mjs` |
| UI kit | 4 primitive custom (button/input/card/badge); 23 TSX component files termasuk primitive; tanpa Radix/shadcn/icon/motion library terdaftar | `src/components/ui/`; `package.json` |
| Typography/theme | Plus Jakarta Sans melalui `next/font/google`; light/dark custom, dark default, localStorage | `src/app/layout.tsx:2`; `src/components/theme-provider.tsx:15` |
| Charts | Recharts `^3.9.1` | `src/components/retention-chart.tsx:3` |
| State | React useReducer dashboard; useState/useEffect per fitur; tanpa global store/data-fetching library | `src/app/dashboard/dashboard-reducer.ts:7`; `dashboard-client.tsx:27` |
| Backend/data | Route handlers Next; Zod `^4.4.3`; Drizzle `^0.45.2`; Neon serverless `^1.1.0` | `package.json`; `src/lib/db/index.ts:1` |
| AI | REST chat-completions compatible, model whitelist, fallback/circuit breaker, streaming text | `src/lib/ai-provider.ts:29`; `src/app/api/chat/route.ts:140` |
| Auth/email | Signed httpOnly cookie; instant email flow default, conditional magic link; Resend REST optional | `src/lib/auth.ts:90`; `src/app/api/auth/login/route.ts:10`; `src/lib/email.ts:6` |
| Tests | 6 `*.test.ts` files / 37 unit tests; 13 Python TestSprite files; 4 frontend plan JSON | `src/lib/`; `testsprite_tests/`; `scripts/run-tests.mjs:26` |
| CI | npm ci/lint/typecheck/test/build; live verify waits deployed SHA then TestSprite | `.github/workflows/testsprite-ci.yml:15`, `:46` |

Source berisi 69 file termasuk assets. Tidak ada React Query, Zustand, auth SDK, chart rewrite, atau motion dependency yang perlu diperkenalkan untuk redesign dasar.

```text
src/app/page.tsx                       landing + sign-in modal
src/app/dashboard/page.tsx             server auth gate
src/app/dashboard/dashboard-client.tsx orchestration + section layout
src/app/dashboard/dashboard-reducer.ts state transitions
src/app/api/*/route.ts                 auth/metrics/insights/chat/projects/upload/health
src/components/                       UI feature components + 4 primitives
src/lib/                              domain formulas/CSV/trend/provider/auth/data/export
src/lib/db/                           lazy database + schema
src/types/index.ts                    input, metrics, batch contracts
drizzle/                              SQL migrations; tidak dijalankan saat audit
scripts/run-tests.mjs                  unit runner
testsprite_tests/                      remote API tests + frontend plans
```

## Inventaris screen dan state

Severity P0 = menghentikan journey/keamanan/data kritis; P1 = hambatan besar; P2 = kejelasan/konsistensi; P3 = polish. Semua subview di bawah tetap berada pada dua page route nyata; jangan menciptakan URL settings/onboarding/projects seolah sudah tersedia.

| Route/state | Tujuan | Komponen utama | Pola sekarang | Masalah utama | Severity | Evidence | Verifikasi |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Menjelaskan produk dan membuka sign-in | Home, ThemeToggle, feature/stat sections | Long marketing page, centered hero, cards | Dominasi marketing/dekorasi dibanding bukti analitik; ulasan visual terpisah | P2 | `src/app/page.tsx:157`, `:184`, `:199` | Source |
| `/` sign-in open/loading/error/pending | Membuka session atau meminta magic link | Inline modal + email form | Modal di route yang sama | Error magic-link redirect belum dipetakan ke recovery UI; modal semantics perlu audit | P1 | `src/app/page.tsx:93`, `:314`; `src/app/api/auth/verify/route.ts:13` | Source; delivery belum diuji |
| `/dashboard` unauthenticated | Menjaga data hanya untuk session | Server page + proxy | Redirect `/` | Kontrak ini wajib dipertahankan | — | `src/app/dashboard/page.tsx:6`; `src/proxy.ts:54` | Source |
| `/dashboard` route loading | Memberi indikasi data/page sedang dimuat | loading.tsx, Skeleton | Skeleton workbench | Ukuran skeleton harus mengikuti redesign agar tidak bergeser | P2 | `src/app/dashboard/loading.tsx:8` | Source |
| `/dashboard` manual/initial | Mengisi lima field dan menghitung | ProjectForm, metrics empty, insight disabled | Dua kolom pada lg, vertikal pada mobile | Tidak ada heading page; feedback save/history perlu diperjelas | P1 | `dashboard-client.tsx:190`, `:204`, `:252`; `src/components/project-form.tsx:26` | Source |
| `/dashboard` result | Memahami enam metric, chart dan insight | MetricsSummary, RetentionChart, AnomalyBadge | Banyak panel kaca | Chart/history hanya newest20 records di client; trend server bisa beda cakupan | P1 | `dashboard-client.tsx:37`, `:159`, `:269`; `retention-chart.tsx:34` | Source |
| `/dashboard` batch/preview/result | Analisis file banyak row | CsvUploader | Upload zone + preview/result table | Subset valid/failed harus tetap jelas; pilih row memicu autosave | P1 | `dashboard-client.tsx:228`; `src/components/csv-uploader.tsx:71`; `api/upload-csv/route.ts:118` | Source |
| `/dashboard` insight | Rekomendasi dan risk narrative | AIInsightCard | Inline panel | Provenance AI/mock harus tampak; history/trend cache berbeda dari nilai saat ini mungkin terjadi | P2 | `src/components/ai-insight-card.tsx:47`; `api/insights/route.ts:82` | Source |
| `/dashboard` chat | Pertanyaan tentang proyek aktif | AIChat, model selector | Inline transcript/composer | Local history bukan server conversation; stream error/proyek berganti perlu regression | P1 | `src/components/ai-chat.tsx:40`; `api/chat/route.ts:135`, `:203` | Source |
| `/dashboard` retention table | Membaca snapshot tersimpan | RetentionTable | Horizontal table | Tidak ada pagination UI meskipun API paginated | P1 | `dashboard-client.tsx:273`; `src/components/retention-table.tsx:36` | Source |
| `/dashboard` compare | Membandingkan dua snapshot | ComparisonView | Dua select + metric table | Negative delta kehilangan minus; beda persen perlu ditulis pp | P1 | `src/components/comparison-view.tsx:85`, `:101` | Source |
| `/dashboard` saved history/delete | Menelusuri/hapus snapshot | ProjectsHistory | List, two-step inline confirmation | Empty copy menyebut tombol save manual yang tidak ada; delete gagal diam-diam | P1 | `src/components/projects-history.tsx:60`; `dashboard-client.tsx:138` | Source |
| `/dashboard` DB-unavailable/history-error | Analisis saat persistence tidak tersedia | reducer + conditional sections | Beberapa bagian disembunyikan | 503 tak diberi banner; error history non503 tampak seperti kosong | P1 | `dashboard-client.tsx:37`, `:274`, `:286` | Source |
| Shared light/dark, palette, navbar/toast | Navigasi dan feedback lintas halaman | ThemeProvider, Navbar, CommandPalette, Toast | Custom primitives | Semantics/focus dan theme storage failures perlu regression | P1/P2 | `src/components/command-palette.tsx`; `src/components/theme-provider.tsx:20`; `src/components/toast.tsx` | Source |

## Inventaris API lengkap

Ada **10 endpoint path / 12 method handler**, bukan 8 route sebagaimana ringkasan README lama.

| Path | Method | Gate dan kontrak penting | Bukti source |
| --- | --- | --- | --- |
| `/api/auth/login` | POST | Public; email valid. Session instant default; `pending` jika verification aktif + provider ada; 502 jika email gagal | `src/app/api/auth/login/route.ts:17` |
| `/api/auth/verify` | GET | Public; signed token TTL15m; redirect dashboard + cookie atau `/?error=invalid_or_expired_link` | `src/app/api/auth/verify/route.ts:8` |
| `/api/auth/logout` | POST | Proxy session + origin CSRF; expire cookie | `src/app/api/auth/logout/route.ts:7` |
| `/api/metrics` | POST | Session; capped JSON50KB; Zod; 200 metrics/400 invalid/413 oversized/415 nonJSON; tidak persist | `src/app/api/metrics/route.ts:7`; `src/lib/auth.ts:163` |
| `/api/projects` | GET | Session; owner-scoped; `page`, `limit` default20/max50; returns total/hasMore | `src/app/api/projects/route.ts:26` |
| `/api/projects` | POST | Session + strict custom CSRF; append new snapshot, same-name warning, 201 | `src/app/api/projects/route.ts:77` |
| `/api/projects` | DELETE | Session + strict custom CSRF; owner-scoped numeric id; 404 if absent/not owned | `src/app/api/projects/route.ts:142` |
| `/api/insights` | POST | Session + origin CSRF;40/min session+IP; whitelist model; owner history; cached insight TTL5m | `src/app/api/insights/route.ts:44` |
| `/api/chat` | POST | Session + origin CSRF;20/min; message max2000 chars; whitelist; text stream or JSON reply | `src/app/api/chat/route.ts:90` |
| `/api/upload-csv` | POST | Session + strict CSRF; multipart field `file`, CSV<=5MB, max500 data rows; partial success accepted; no DB persistence here | `src/app/api/upload-csv/route.ts:30` |
| `/api/health` | GET | Public coarse liveness only | `src/app/api/health/route.ts:6` |
| `/api/health/internal` | GET | Public proxy allowlist but bearer gate IF HEALTH_TOKEN configured; DB SELECT1 and commit/provider status | `src/app/api/health/internal/route.ts:12` |

## Domain invariants untuk Gemini

1. `totalUsers` integer >0; active/churned integer >=0 dan masing-masing tidak melebihi total; `active+churned <= total`. Tidak wajib sama dengan total: jangan gunakan `retention=1-churn` atau pie yang mengklaim dua segmen mencakup seluruh populasi. `monthlyRevenue >=0`, desimal diizinkan (`src/lib/validation.ts:3`).
2. Churn=`churned/total`, retention=`active/total`, keduanya fraction dibulatkan4 desimal; ARPU=`revenue/total` dibulatkan2; MRR=`monthlyRevenue`; LTV=`ARPU/churn`, **null ketika churn0**. High jika churn **>15%**, Medium jika **>5%**, sisanya Low (`src/lib/analytics.ts:16`). Display `%` kalikan100 satu kali; delta ratio ditampilkan percentage points.
3. Schema menyimpan row snapshot append-only, ownerEmail+projectName mengelompokkan trend; tidak ada entity project terpisah, edit endpoint, tanggal observation input, subscription currency, cohort atau billing connector (`src/lib/db/schema.ts:12`). `createdAt` adalah waktu simpan, bukan periode billing yang diberikan user. Jangan beri filter periode yang menyiratkan data belum dimiliki.
4. `/api/projects` POST selalu insert; same-name hanya warning, bukan konflik. Analisis tunggal otomatis mencoba save setelah calculate. Batch analyze sendiri tidak menyimpan semua row; memilih row menjalankan analisis+save satu row (`dashboard-client.tsx:61`, `:228`). Copy harus mengatakan ini.
5. History sort newest-first; chart memilih same-name, sort ascending, mengambil10 terakhir dari data client yang sudah dimuat (`retention-chart.tsx:34`). Anomaly trend server menggunakan hingga3 prior snapshot terakhir, threshold absolute0.05; tidak boleh disebut predictive churn atau statistical confidence (`src/lib/trend.ts:21`).
6. Batch averages adalah rata-rata sederhana per row/proyek, bukan weighted-user averages. Total revenue dijumlah; anomaly membandingkan churn row dengan semua peer row (`src/lib/batch-analytics.ts:26`).
7. `estimatedLtv:null` bukan nol; raw contract harus tetap null walau UI mengganti simbol infinity dengan label “Not estimated · zero churn”. Export sekarang mengeluarkan sel kosong untuk null (`src/lib/export.ts:30`).
8. Semua data projects/insight cache milik owner session. Custom header mutasi strict adalah `X-Requested-With: ChurnSense`; AI/logout memakai origin check yang juga menerima header ini (`src/lib/auth.ts:116`, `:131`). Jangan menghapus gate demi mempermudah UI.
9. Chat localStorage key mencakup email+nama proyek; max50 pesan lokal; selected model disimpan lokal dan tetap divalidasi whitelist backend. Source roster bukan bukti provider availability saat ini (`src/components/ai-chat.tsx:25`, `:61`; `src/lib/models.ts:14`).
10. Tanpa DB, calculation tetap ada tetapi persistence503. Tanpa AI provider, insight memakai deterministic mock; chat mengembalikan pesan setup JSON, sedangkan rule-based chat fallback berlaku ketika provider terkonfigurasi gagal (`src/app/api/chat/route.ts:124`, `:217`). Jangan menyatukan state yang berbeda ini dalam copy.

## Temuan engineering terprioritas

| ID | Severity / status | Evidence | Dampak dan rencana | Effort / risiko |
| --- | --- | --- | --- | --- |
| ENG-01 | P1 Verified source; P0 sebelum public real-user rollout | `api/auth/login/route.ts:10`, `:52` | Any valid email dapat memperoleh session default. Owner scoping tidak membuktikan kepemilikan inbox. Audit tidak mengubah auth. Gemini harus menjaga UX dua mode, mengoreksi klaim login; hardening auth adalah pekerjaan terpisah sebelum produksi sensitif, dengan test config/missing-provider | M / tinggi |
| ENG-02 | P1 Verified source | `dashboard-client.tsx:37`; `api/projects/route.ts:31` | API paginated tetapi client membuang total/hasMore dan tidak meminta page berikutnya. History/chart/comparison/export secara diam-diam hanya newest20. Gunakan paging UI dan explicit loaded/total; export harus berlabel scope atau mengambil seluruh halaman secara terkontrol | M / sedang |
| ENG-03 | P1 Verified source | `comparison-view.tsx:85`, `:101` | Negative diff source A−B kehilangan minus akibat Math.abs; churn/retention beda2 poin tertulis2% ambigu. Target redesign: formatter bertanda +/− dan pp dengan label “B minus A (A baseline)”; ubah convention/labels/better-worse bersama-sama; setara nol netral | S / rendah |
| ENG-04 | P1 Verified source | `dashboard-client.tsx:49`, `:91`, `:147`, `:154` | Gagal history/save/delete selain503 dibuang. User melihat kosong atau mengira tersimpan. Pisahkan calculate/save/history/delete status dengan retry yang tidak menghitung+insert ulang tanpa sengaja | M / sedang |
| ENG-05 | P1 Inferred race risk dari source | `dashboard-reducer.ts:66`, `:78`; `dashboard-client.tsx:102`; `ai-chat.tsx:99` | Async response tak diberi request identity. Switching input/proyek saat insight/chat lama berjalan perlu diuji; gunakan cancellation/request-id pada milestone behavior tanpa mengubah formula | M / sedang |
| ENG-06 | P2 Verified source | `validation.ts:5`; `db/schema.ts:19`; `api/upload-csv/route.ts:99` | CSV memberi batas name255, manual schema hanya min1. Nama manual>255 lolos calculate lalu dapat gagal save. Selaraskan validasi UI/schema dengan batas DB pada task terpisah, preserve data | S / sedang |
| ENG-07 | P2 Inferred cache freshness risk | `insight-cache.ts:24`; `api/insights/route.ts:82` | Cache key input+model+owner tidak mencakup trend history. Snapshot baru dapat mengubah trend namun insight lama TTL5m tetap dipakai. Jangan klaim “fresh historical analysis” tanpa timestamp; kaji invalidasi terpisah | M / sedang |
| ENG-08 | P2 Verified source | `src/lib/export.ts:4` | CSV hanya quotes delimiter, tak menetralkan leading formula chars pada nama proyek. Perlu uji spreadsheet-formula injection sebelum memperluas export; jangan mengimpor payload berbahaya untuk audit ini | S / sedang |
| ENG-09 | P2 Verified source | `scripts/run-tests.mjs:34`; `package.json`; `package-lock.json:4080` | Runner mengimpor tsx yang tersedia transitif dari drizzle-kit. Tes sekarang lulus, tetapi dapat rapuh jika toolchain berubah; deklarasi direct dependency hanya jika milestone maintenance disetujui | S / rendah |
| ENG-10 | P2 Verified source / runtime belum diuji | `src/lib/models.ts:52`; `theme-provider.tsx:20` | localStorage read/write beberapa lokasi tanpa try/catch, berpotensi gagal pada restricted storage; default SSR model vs client preference juga perlu cek hydration | S / sedang |

Tidak ada klaim dead code atau dependency vulnerability tanpa analisis callgraph/advisory. Repeated glass styles dan inline SVG adalah sinyal untuk konsolidasi desain, bukan bukti fungsi tidak terpakai. Jangan menjalankan rewrite backend pada milestone visual.

## Baseline checks aktual

Command dijalankan dari `C:\Churn\loop-analytics` tanpa install, database call, email, atau live API mutation:

| Command | Hasil sesi ini | Batas |
| --- | --- | --- |
| `git status --short` | Awal hanya untracked `public/sample-churn-data.csv` | Sesudah penulisan dokumen muncul `?? docs/`; jangan hapus file awal |
| `node --version` | `v24.11.1` | CI workflow memakai Node20; parity belum diuji |
| `npm test` | **PASS:37 tests,0 failed,0 skipped** | 6 file unit; tidak membuktikan E2E, DB, email, model aktual, responsive |
| `npm run lint` | **PASS, exit0** | Tidak menilai visual/runtime |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | **PASS, exit0** | Mematikan incremental agar tidak menulis tsbuildinfo; bukan production build |
| `npm run build` | **Not run** | Audit tidak menghasilkan build artifact |
| TestSprite / Python live suite | **Not run** | Dapat menulis record/mengirim request eksternal; butuh test deployment/data tersendiri |
| Lighthouse / CWV / browser viewport | **Not run** | Jangan menyalin skor historis sebagai baseline baru |

CI `build` job memakai npm ci/lint/typecheck/test/build, lalu live verify hanya push/workflow_dispatch (`.github/workflows/testsprite-ci.yml:15`, `:46`). Tidak ada test browser lokal Playwright terdaftar sebagai direct dependency. JSON frontend plans adalah rencana remote-test, bukan test lokal yang otomatis telah berjalan. Sebagian Python live test melakukan create/delete: jangan menjalankannya terhadap data pengguna untuk mengejar checklist UI.

## QA contract dan risiko terbuka

Setiap milestone Gemini harus memelihara 37 unit tests, lint dan typecheck, lalu build pada fase implementasi yang diotorisasi. Buat test yang berarti untuk perubahan behavior (pagination/delta/async/state/validation); tidak perlu snapshot test yang sekadar menyalin markup.

Runtime acceptance wajib dilakukan di deployment preview/local yang tepat dengan data sintetis: login instant dan verification mode; manual valid/invalid; autosave sukses/gagal; CSV valid/partial/all-invalid/oversized; dua snapshot same-name; >=21 snapshot dan paging/export; zero churn/null LTV; equal/negative deltas; DB503; AI fallback; chat streaming interruption; delete success/error; keyboard overlays; 375/768/1440px, light/dark dan reduced-motion. Jangan klaim gate ini lulus hanya karena unit tests pass.

Hal yang belum diketahui: konfigurasi mode auth produksi; kesetaraan deployment dengan HEAD; koneksi DB/AI/email; dataset/target user yang tervalidasi; browser support requirement; lisensi menyeluruh seluruh aset; a11y runtime/CWV. Logo lokal boleh dipertahankan, tetapi keberadaan aset bukan bukti lisensi aset pihak ketiga. Detail visual dan mapping referensi ada pada dokumen audit UI/UX, research, design, serta implementation plan yang menyertai audit ini.
