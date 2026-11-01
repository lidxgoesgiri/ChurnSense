# ChurnSense — annotated screen blueprints

Tanggal: 31 Oktober 2026. Semua layout/ukuran di bawah **PROPOSED**, belum mockup/render. Source evidence ada pada kedua audit; warna/type/states mengikuti [design system](CHURN_DESIGN_SYSTEM.md). Referensi dan status verifikasinya lihat [mapping](../research/REFERENCE_TO_SCREEN_MAPPING.md). Hanya dua halaman URL: `/` dan `/dashboard`. Jangan membuat `/settings`, `/projects/:id`, `/login`, atau cohort screen untuk memenuhi blueprint.

## 1. Landing `/`

File verified: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`.

**Urutan desktop:** header brand/How it works/About/theme/Sign in → main hero product statement → sample analysis preview → 3-step workflow → fitur berbasis bukti → filosofi brand ringkas → footer kredit. Max-width1200, gutter32, section gaps64–80px. Hero pada ≥1024 memakai 5/7 grid, gap40: kiri eyebrow “SaaS retention analytics”, H1 “Understand the customers you keep.”, body menjelaskan input aggregate counts dan metrik, primary “Open your dashboard” membuka sign-in existing, secondary anchor “See how it works”. Kanan preview UI yang dibangun dari HTML/CSS lokal, bukan screenshot referensi; label **Illustrative sample — not your data**, fixture total1000/active850/churned150/revenue5000. Preview menampilkan15% churn,85% retention,ARPU$5, dengan caption contoh input. Jangan membuat preview seolah live/fetched dan jangan memakai CTA demo yang mati.

Tiga langkah harus memakai kata konkret: enter counts/import CSV → review metrics → save snapshot and request insight. Bila penyimpanan memerlukan database, copy tidak menjamin selalu tersimpan. Fitur ringkas menjelaskan snapshot history, compare, export, AI/rule-based fallback; buang “owner-scoped encryption”, prediksi churn, dan klaim mengetahui WHY tanpa event data. Anchor About tetap ada tetapi ringkas, bukan empat kartu pengulangan emoji.

**Compact375:** gutter16, header wrap tanpa overlap, nav anchor dapat disederhanakan namun sign-in/theme tetap ada; hero single column, H1max~36px, preview setelah copy/CTA; semua sample numbers muat. **Tablet768:** satu kolom hero lebar baca≤640, preview lebar penuh, workflow bisa3 kolom bila teks cukup. **1440:** max1200, hero side-by-side; tidak ada aurora blur besar. **State:** navigasi keyboard mencapai main#main-content; links anchor benar; image alt logo tepat; no animation loops; preview bukan live region.

Referensi: [Resend](https://resend.com/) untuk proposisi produk→aksi, [ChartMogul](https://chartmogul.com/) untuk metrik beserta konteks; **structural inspiration**, bukan klaim tampilan visual sama. Acceptance: satu H1, main target valid, seluruh klaim bisa ditelusuri ke source, CTA membuka dialog yang usable dengan keyboard.

## 2. Sign-in dialog dalam `/`

File: `src/app/page.tsx`; proposed extracted `src/components/sign-in-dialog.tsx` dan `src/components/ui/dialog.tsx` hanya bila mengurangi coupling dan tidak menambah library.

Panel max400px, padding24, gap16, overlay opaque tint tanpa blur wajib. Header title “Sign in to ChurnSense”, description ringkas, close44px. Body email label/input44/help, inline error, submit full-width44. Fokus awal email; Tab/Shift+Tab tetap modal; Escape/close/backdrop aman kembali ke trigger; named dialog/aria-modal atau native semantics yang setara. Viewport kecil menggunakan max-height dan inner scroll; onscreen keyboard tidak menutupi submit. Email tetap tersimpan selama retry.

**State machine:** closed → editing → submitting → API `success` redirect dashboard **atau** API `pending` menampilkan “Check your inbox” + email + link15min + “Use a different email”. Error400/502/network tetap editing+error dan dapat retry; tombol pending tidak berpura-pura resend bila belum ada endpoint. `/?error=invalid_or_expired_link` harus membuka dialog/menampilkan error yang jelas dan menawarkan pengajuan baru. Query error existing berasal dari verify route, namun landing belum membacanya saat audit.

Default backend mengizinkan instant email session; verifikasi inbox baru aktif jika flag dan provider dikonfigurasi. Jangan menjanjikan magic-link/OTP pada semua mode. Tidak mengubah auth/env pada milestone visual. Tidak ada OTP entry UI karena endpoint OTP yang terpisah belum ditemukan. Produksi dengan instant mode memerlukan keputusan keamanan terpisah sebelum launch.

Referensi: [Resend sign-in](https://resend.com/login) untuk grouping, [Radix dialog contract](https://www.radix-ui.com/primitives/docs/components/dialog) untuk focus/Escape. Uji manual keduanya dengan mocked responses di lingkungan test; audit ini tidak mengirim email.

## 3. Dashboard shell `/dashboard`

Files: `src/components/navbar.tsx`, `src/app/dashboard/dashboard-client.tsx`, `src/app/dashboard/loading.tsx`, `src/components/theme-{provider,toggle}.tsx`, `src/components/command-palette.tsx`.

Atas: topbar brand kiri; command trigger, theme, account/logout kanan. Judul H1 “Retention overview” + subcopy menjelaskan snapshot workspace. Email masuk account context, tidak perlu diulang sebagai blok kosong. Section links “Analyze”, “Results”, “History”, “AI” menggunakan anchor ke section nyata, tanpa route palsu. Command shortcut muncul dalam trigger, menggantikan banner besar. Export dekat ledger/history supaya scope terlihat. Model selector dekat AI; state aiModel tetap satu sumber untuk insight+chat.

Body max1280, padding32 desktop/24tablet/16compact; gap32. Initial history loading menampilkan region skeleton, bukan blank. Page loading memakai ukuran stabil shell/workbench. Error boundary fallback tetap memiliki pesan+recovery. Pada mobile header auto-height dan controls wrap, account action dapat menu accessible; jangan fixed h16 memotong baris kedua. Sticky header tidak menutupi fokus/judul target.

**Context states terpisah:** unauthenticated tetap redirect existing; history initial/loading/empty/error; database503 banner “History unavailable. You can still calculate metrics.” dan retry; calculation error tidak menjadi history error; saving error tidak menghapus metrics. Konfigurasi flag/email/token/DB tidak dipaparkan ke UI.

Referensi: [Linear filters](https://linear.app/docs/filters) untuk scope/selection clarity, [Raycast action panel](https://manual.raycast.com/action-panel) untuk discoverable actions. Nav baru tidak mengimplikasikan fitur baru. Acceptance: pekerjaan utama tersedia tanpa Cmd/Ctrl+K; responsive no document overflow; focus path jelas.

## 4. Analyze — manual + initial result

Files: `project-form.tsx`, `dashboard-client.tsx`, `dashboard-reducer.ts`, `metrics-summary.tsx`.

Desktop≥1200: input rail360px kiri; result canvas kanan minmax0; gap24. Pada1024/tablet seluruh form di atas result; pada compact single column. Header Analyze + manual/batch segmented controls44 tinggi. Manual form project name full-width, empat field dalam2 kolom bila masing-masing≥140px, selain itu1 kolom. Labels tetap terlihat; helper menjelaskan total/active/churned dan revenue USD; action “Calculate metrics”. Native integer/decimal guards tetap, error cross-field terhubung ke field/summary. Jangan menambahkan date-range form karena schema belum punya period.

Initial result: satu empty panel dengan contoh kerja, “Calculate metrics to see your retention snapshot.” tanpa lima kartu kosong yang masing-masing memakan ruang. Submit mempertahankan form; loading satu status dan button disabled. Setelah success, tampil metrics segera, lalu saving status terpisah; tidak menunda hasil sampai DB/AI selesai. Perlu state saving/failed/saved terpisah dari loadingMetrics; copy sukses mengikuti hasil nyata. Jangan mengulang POST analisis sebagai cara retry save tanpa menjelaskan konsekuensi snapshot ganda.

Retention+churn bukan pasangan wajib berjumlah100%: fixture valid1000/800/100 memberi80% retention,10% churn;100 pengguna lain tidak boleh diam-diam dimasukkan ke churn. Aturan bisnis existing sum≤total dipertahankan. “Analysis submitted” timer dihapus/diganti state hasil nyata.

Referensi: [Baremetrics](https://baremetrics.com/) untuk ringkasan→detail dan [ChartMogul](https://chartmogul.com/) untuk konteks metrik; dimensi seluruhnya target internal.

## 5. Analyze — CSV batch

File: `src/components/csv-uploader.tsx`, integrating client/reducer; API existing `/api/upload-csv` tidak diubah.

Area input sama dengan manual agar perpindahan tab tidak meloncat. Visible file button + drag target + limits5MB/500rows + contoh CSV headers sesuai parser (`project_name,total_users,active_users,churned_users,monthly_revenue`). Header CSV snake_case dipetakan ke ProjectInput camelCase oleh parser shared. Exact5MB dan500 data rows diperbolehkan bila data valid; di atas batas ditolak. Sample download hanya bila local file benar ada; `public/sample-churn-data.csv` sudah untracked sebelum audit, jangan overwrite/stage. CSV tidak otomatis disimpan semua ke history.

State: idle→file chosen→uploading→results/partial/errors. Tampilkan filename dan aksi ganti file; parsed summary memisahkan valid rows dan errors. Hasil batch full-width di bawah rail ketika banyak kolom, atau region horizontal scroll bernama pada compact. Valid rows punya “Analyze this row” existing yang berpindah manual dan menjalankan calculate+autosave; label harus menjelaskan bahwa tindakan itu dapat menyimpan snapshot baru. Jangan sekadar menyebut View jika terjadi write.

Partial success menyebut jumlah valid/failed, row number dan penyebab sesuai API; tidak mengklaim semua data berhasil. Max rows/data besar jangan me-render mini-chart per row. Keyboard Enter/Space pada file button, focus ke heading results setelah selesai hanya bila sesuai konteks; error diumumkan ringkas, tidak500 baris live region.

Referensi: [Geist table](https://vercel.com/geist/table) untuk tabel semantik/pagination; [Stripe analytics](https://docs.stripe.com/billing/subscriptions/analytics) untuk pemisahan input/output scope. Responsive usulan, tidak hasil ukur referensi.

## 6. Results — KPI, risk, chart, insight entry

Files: `metrics-summary.tsx`, `animated-metric.tsx`, `anomaly-badge.tsx`, `retention-chart.tsx`, `ai-insight-card.tsx`.

Result header: project name (wrap), “Current calculation”, snapshot timestamp jika memang tersimpan, dan status save. Dua KPI utama churn/retention berdampingan; di bawah3 pendukungARPU/MRR/EstimatedLTV. Compact dua kolom utama, pendukung bisa satu/dua sesuai available width; labels≥12, help reachable, no rainbow stripes. Risk label dekat angka; “Medium”15% sesuai threshold existing, bukan ambang warna desain baru.

LTV null: “Not defined” + “Zero churn in this calculation”; tidak ditampilkan sebagai payout tak terhingga. Revenue currency tetap USD existing, tanpa multi-currency selector palsu. Format rates ×100 hanya di presentation; jangan mengganti value API menjadi percent.

Chart di bawah workbench memakai section full-width, plot target280px desktop/240compact, fixed slot. **Satu snapshot:** active vs churned **counts**, label total dan penjelasan total mungkin menyertakan pengguna di luar keduanya. **≥2 same-name snapshots yang tersedia:** line churn/retention berdasar createdAt, latest10 existing; caption “Latest 10 available saved snapshots” serta loaded-data scope. Jangan menyebut daily/monthly trend bila timestamp hanya waktu penyimpanan. Sama tanggal menampilkan time/tooltip lengkap agar tidak ambigu. Legend + distinct line styles + accessible data equivalent.

Anomaly badge baru setelah `trend` dari insight tersedia pada flow sekarang; jangan menampilkan badge rekaan sejak calculate. Apabila Gemini ingin memindahkan fetch trend, pisahkan task dan jaga kontrak server; UI dapat menyatakan “Generate insight to evaluate trend context” sebelum tersedia. Churn sparkline hanya pada churn (existing), bukan semua KPI tanpa seri nyata.

Referensi: [ChartMogul](https://chartmogul.com/), [Baremetrics](https://baremetrics.com/), [Stripe analytics](https://docs.stripe.com/billing/subscriptions/analytics); struktur chart/context saja, tidak cohort replication.

## 7. Snapshot ledger — retention table + history

Files: `retention-table.tsx`, `projects-history.tsx`, `dashboard-client.tsx`, `dashboard-reducer.ts`, `lib/export.ts`.

Header “Saved snapshots” + loaded count/total + Export label scope. Retention table adalah ledger utama; history/action list dipertahankan sebagai tampilan snapshot actions atau digabung bertahap hanya bila delete tetap tersedia dan seluruh konten existing dipertahankan. Hindari dua panel sama-sama seolah daftar lengkap tetapi dataset berbeda. Nama snapshot + timestamp/id membedakan duplikasi nama.

M1 minimum: client memanfaatkan metadata page/limit/hasMore, tombol load-more/pagination nyata; semua consumer dan export harus jelas **loaded snapshots**. Tombol “Export loaded snapshots (N)” sampai ada implementasi full-export yang benar. Jangan mengklaim all-history walau limit dinaikkan50. Loaded datasets yang digabung harus de-duplicate id, tahan stale response setelah save/delete, dan menjaga sort newest-first. Chart same-name latest10 dari loaded subset berlabel; server insight trend dapat punya scope berbeda, jelaskan.

Desktop table columns existing: Project, Churn, Retention, ARPU, Risk, Date; menambah MRR/LTV kolom tidak wajib. Angka right-aligned/tabular, row min44, column headings semantik. Long name wrap dua baris+full accessible name; date readable. Compact scroll region bernama dengan petunjuk dan minimum~720px table jika diperlukan; page tetap tidak overflow. Alternatif cards boleh hanya bila numeric comparison tetap jelas dan tidak menduplikasi focus controls.

Actions list mempunyai Delete→Confirm/Cancel per row. Pending menahan row sampai DELETE sukses; failure mempertahankan row+retry/cancel; jangan fake undo karena server tidak memiliki restore. Delete current same-name behavior existing dapat reset analysis; jangan mengubah identitas snapshot/project diam-diam. Label empty “Your calculated snapshots will appear here when storage is available.”, bukan “click Save” yang tidak ada.

State: initial skeleton; empty nyata setelah200; loading more mempertahankan rows; errors inline+retry; DB503 tidak menyamar empty. Export hanya data tersedia, tidak kosong diam-diam; unavailable/canceled export punya feedback sesuai event.

Referensi: [Geist table](https://vercel.com/geist/table), [Stripe analytics](https://docs.stripe.com/billing/subscriptions/analytics), [Linear filters](https://linear.app/docs/filters). Jangan tambah search/filter jika hanya bekerja pada subset tanpa menyatakan scope.

## 8. Comparison

File: `src/components/comparison-view.tsx`, source dataset history.

Section setelah ledger atau dalam disclosure bernama, tampil hanya≥2 snapshots sesuai existing. Dua selector A baseline / B comparison, option project+createdAt(+id jika bentrok). Ringkasan “B − A” dekat heading; lima metric rows, kolom A/B/Delta desktop. Compact satu metric block dengan tiga nilai berlabel, bukan tabel mini yang memotong tanda minus.

Contoh: A churn15%, B10% → **−5.00pp, improved**; retention85→90% → **+5.00pp, improved**; ARPU5→4 → **−$1.00, decreased**. Nol “0.00pp — unchanged”. Jangan hanya warna hijau/merah. LTV null/finite → “Not comparable (zero churn)” sesuai konteks, bukan$0 delta. Same snapshot boleh dicegah atau tampil jelas neutral; no fabricated inter-project benchmark. Loaded scope dipakai kedua selector.

Referensi: [Baremetrics](https://baremetrics.com/) overview/detail dan [Geist table](https://vercel.com/geist/table) numeric alignment. Target unit/sign adalah perbaikan data truth, tidak kosmetik.

## 9. AI insight + chat

Files: `ai-insight-card.tsx`, `ai-chat.tsx`, `model-selector.tsx`, `dashboard-client.tsx`.

Di desktop satu section AI setelah results dengan model field, insight full text dan chat berurutan; boleh2kolom jika kedua area min360px. Compact stack, composer tetap terlihat tanpa fixed viewport takeover. Context menampilkan project dan bahwa data aggregate; label limitations jelas tanpa disclaimer panjang. Insight Generate disabled+explanation sampai input tersedia; loading teks indeterminate; success summary/recommendation dan source “AI” atau “Rule-based”; regenerate nyata, bukan auto polling.

JSON insight bukan token stream: tampilkan teks sekaligus atau fade singkat, jangan typewriter yang menunda baca. Chat streaming existing tetap, input tidak terkirim berulang; user/project localStorage scope tetap. Source fallback chat hanya diberi label jika response contract menyediakannya; jangan mengira semua reply text berasal dari AI. Error429/network/provider timeout menyebut retry, draft/error state tidak memusnahkan percakapan. Percakapan lama yang sedang dibaca tidak dipaksa ke bawah setiap token. Announce reply completion, bukan setiap chunk.

Model dropdown dapat native select optgroups tier; label nama/provider terbaca, no cinematic glow. Jangan mengubah whitelist/model IDs atau menebak model populer terbaru. Persistensi selected model existing tetap. Changing project selama stream harus meng-abort/ignore stale result agar jawaban tidak masuk context baru; uji race ini sebelum klaim done.

Referensi: [ChartMogul](https://chartmogul.com/) contextual explanation, [Raycast action panel](https://manual.raycast.com/action-panel) discoverability, [Motion accessibility](https://motion.dev/docs/react-accessibility) reduced-motion behavior. Referensi bukan mandat memakai SDK AI/UI baru.

## 10. Command palette dan overlays pendukung

File: `command-palette.tsx`, sign-in dialog dan model field sesuai sections sebelumnya. Command trigger harus visible pada semua viewport. Panel max560px/margin16, search44, results44, max-height min(420px,60dvh). Search query mempertahankan selected valid0…N−1; empty punya teks dan tidak menjalankan undefined action. Arrow keys/Enter/Escape, focus restore, named dialog dan active selection diumumkan. “Generate AI insight” harus benar-benar generate jika dilabel demikian; jika hanya scroll ke section gunakan “Go to AI insight”. Jangan shortcut logout saat query tak sengaja tanpa selected action yang jelas.

Keyboard equivalent tersedia di nav/buttons biasa. Reduced motion JS scroll auto. Overlay tertutup tidak menyisakan focusable elements/backdrop. Referensi [Raycast](https://manual.raycast.com/action-panel) untuk actions, [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog) untuk modal contract.

## Acceptance lintas screen

Uji375×812,768×1024,1440×900 pada light+dark, 200%zoom, panjang nama/email,0/1/2/>20/>50 snapshots, CSV mixed/500rows, LTVnull, DB503, save/delete failure, auth expired link, AI fallback/stream interruption/reduced motion. Tidak ada angka Lighthouse atau screenshot baseline pada audit ini. Gemini wajib menyimpan bukti implementasi dan menandai gate yang belum teruji; baca [quality gates](../plans/CHURN_QUALITY_GATES.md).
