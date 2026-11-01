# ChurnSense — quality gates untuk Gemini

Tanggal: 31 Oktober 2026 (Asia/Jakarta). Companion: [implementation plan](CHURN_GEMINI_IMPLEMENTATION_PLAN.md). **Semua implementation gates di bawah berstatus Pending pada saat planning, kecuali fakta source yang disebut eksplisit. Target bukan hasil pengukuran.**

## Cara memakai gate

Setiap task yang selesai harus menunjuk gate terkait beserta evidence. Gunakan status `Pass`, `Fail`, `Pending`, `Blocked`, atau `N/A` dengan alasan. `N/A` hanya untuk kriteria yang benar-benar tidak berlaku, bukan karena tool unavailable. Cantumkan SHA/local changed-state, tanggal/timezone, command/exit code, URL, theme, viewport, fixture dan hasil observasi. Screenshot yang hanya dibuat tetapi belum dilihat bukan visual pass.

P1 correctness, broken journey, aksesibilitas primary action, data scope yang menyesatkan, dan source changes tak berizin menghalangi milestone selesai. Tidak boleh menutupi failure dengan rating estetika rata-rata. Audit source yang baik tidak membuktikan UI runtime lulus.

## Gate matrix dan traceability

| Gate | Applies to task | Kriteria utama | Evidence minimum | Status awal |
| --- | --- | --- | --- | --- |
| G0 Baseline/scope | M0-01, semua task, M6-02 | root/working tree/invariant dipahami; source user terlindungi | git status/diff dan source contracts | Pending bagi Gemini; source baseline tercatat di audits |
| G1 Data truth | M1-01/03, M4-01/02/03, M5-01 | angka, unit, null, pagination, snapshot/export scope benar | golden fixtures + browser/API/table/export comparison lokal | Pending |
| G2 Async outcomes | M1-02/05, M4-01/02, M5-02 | loading/empty/error/unavailable/success terpisah | network response fixtures + UI evidence | Pending |
| G3 Keyboard/overlays | M1-04/05, M3-01/02, M5-01/02 | seluruh task penting operable tanpa pointer | recorded manual keyboard sequence + focus observations | Pending |
| G4 Business regression | M1, M4, M5 | autosave append-only, owner/CSRF/auth/AI contracts terjaga | focused tests dan local controlled flows | Pending |
| G5 Tokens/contrast | M2-01/02, M3–M6 | semantic consistent, dua tema, contrast | measured actual color pairs dan screenshot review | Pending |
| G6 Responsive/content | M3–M6 | viewports, long content, zoom, touch, overflow | rendered screenshots yang ditinjau + viewport/DOM notes | Pending |
| G7 Semantics/readability | M2–M6 | labels, headings, data alternatives, units | DOM/accessibility tree + screen reader sampling | Pending |
| G8 Motion/AI context | M5-02, M6-01 | reduced-motion JS/CSS, truthful streaming/context | media query test + controlled slow response/project switch | Pending |
| G9 Engineering/performance | M6-02 dan affected milestones | checks lulus, no avoidable regressions, CWV targets assessed | command logs, measured method/version/results | Pending |
| G10 Reference/asset/handoff | M6-02 | design decisions traceable; asset rights; honest completion | reference mappings, changed-file list, validation document | Pending |

## G0 — baseline dan change isolation

- [ ] Gemini memverifikasi root `C:/Churn/loop-analytics`, branch/SHA, instructions yang berlaku dan `git status --short` sebelum edit.
- [ ] Existing untracked `public/sample-churn-data.csv` tidak dihapus/diubah tanpa kebutuhan task. `docs/` planning tidak dikira source yang perlu dibersihkan.
- [ ] Tidak ada package install, schema migration, production mutation/deploy atau env change yang disisipkan demi redesign.
- [ ] Target yang proposed/new ditandai sebagai file baru; file yang sudah berubah setelah audit dibaca ulang sebelum patch.
- [ ] Hanya `/` dan `/dashboard` menjadi page routes; nav tidak menunjuk halaman/fitur fiktif.
- [ ] Setiap task diff memuat files yang diperlukan dan tidak mencakup accidental secret/build/vendor artifacts.

## G1 — fixture angka, unit, scope dan ekspor

Fakta rumus diverifikasi dari `src/lib/analytics.ts:11–31`, input dari `src/lib/validation.ts`, export dari `src/lib/export.ts:21–35`. Nilai expected berikut dihitung dari kontrak tersebut; **belum merupakan hasil eksekusi runtime**.

| Fixture | Input / kondisi | Expected yang harus diperiksa |
| --- | --- | --- |
| F1 golden | name `Acme`; total1000, active850, churned150, revenue5000 | churn .15→15%; retention .85→85%; ARPU$5; MRR$5000; Est.LTV$33.33; risk **Medium** karena High hanya >15% |
| F2 zero churn | total1000, active1000, churned0, revenue5000 | churn0%, retention100%, ARPU5, MRR5000, LTV **null**; UI diberi explanation, CSV LTV kosong, delta null em dash |
| F3 partial segments | total1000, active700, churned100, revenue5000 | valid; retention70%, churn10%; tidak dipaksa berjumlah100% |
| F4 invalid counts | total0; total decimal; active+churned>total; negative | ditolak dengan feedback yang dapat dipulihkan; tidak ada success feedback atau autosave palsu |
| F5 rate delta | A baseline churn15%, B comparison10%; kemudian swap | B−A = −5.0 **pp** (improved); swap +5.0pp; equality0; better/worse sesuai lowerIsBetter |
| F6 money delta | A baseline ARPU7, B comparison5; equality; null LTV salah satu | −$2.00 atau signed monetary convention konsisten;0 neutral; null tidak dibandingkan numerik |
| F7 pagination | 0/1/20/21/43 owner-scoped snapshots, page20 | count/total/hasMore benar; 21 dan43 dapat diakses; no duplicate ids; failed load-more tidak menghapus rows sebelumnya |
| F8 snapshot identity | ≥2 snapshots nama sama, tanggal hari sama; proyek lain lebih baru | compare membedakan id/timestamp; chart matching nama proyek dan scope loaded, bukan semua account/time series rekaan |
| F9 export | quoted comma/newline/quote dalam projectName, null LTV;20 dari43 loaded | CSV escaping sesuai kontrak, count sama dengan scope, label/filename tidak menyatakan semua43 bila hanya20; no extra save |
| F10 dense inputs | very large allowed numbers, project name panjang, unicode | layout tidak menghilangkan sign/unit/value; validasi mengikuti schema aktual, bukan arbitrary frontend max |

- [ ] UI, chart tooltip, table dan export menunjuk nilai serta snapshot scope yang sama atau perbedaannya dijelaskan.
- [ ] MRR tetap monthlyRevenue, ARPU memakai totalUsers, LTV memakai churnRate yang dibulatkan sesuai engine; jangan mengubah engine untuk menyamakan mockup.
- [ ] Same-name save tetap insert snapshot baru; warning duplicate name diberi konteks, bukan error update.
- [ ] Chart satu snapshot tetap bar active/churned; tidak menampilkan fake curve. Bila history ≥2, label menyebut snapshot scope dan subset maksimal10 bila dipakai.
- [ ] Client tidak menganggap `history.length` sebagai total seluruh account. Loaded dataset diberi count dan aksi load-more; export/compare/trend scope explicit.

## G2 — state matrix dan recovery

| Flow | Required states | Failure cases | Pass condition |
| --- | --- | --- | --- |
| Login | idle, invalid, loading, pending email, instant success, error |400,502,offline | pending response saja menampilkan sent; invalid tidak mengaku verified; retry/change-email jelas |
| Calculate | empty, editing, validating, pending, success, invalid/error |400,401,network/500 | final outcome mengikuti request, old result diberi konteks; tidak ada timer success palsu |
| Persistence | saving, saved, failed, unavailable, ambiguous response |401,403,500,503,offline-after-POST | calculation tetap terbaca; failure persisten; tidak auto-retry POST ambigu yang menggandakan snapshot |
| History | initial loading, empty success, filled, loading-more, page error, unavailable |401,500,503,timeout | failure bukan empty; loaded rows dipertahankan; Load more retry tidak duplicate |
| CSV | no file, drag-over, chosen, preview, analyzing, full/partial success, failure |wrong type,>5MB,>500 rows,bad headers,invalid row | valid/failed rows eksplisit; row errors sesuai1-based data index; sample dan browse usable |
| Delete | unarmed, confirm/cancel, pending, success, failed |404,401,403,500,offline | failure row tetap ada; success saja menghapus; focus berpindah terkontrol |
| Insight | prerequisite disabled, idle, generating, success AI/rule-based, error |429,timeout,provider unavailable | source jujur; fallback tetap berfungsi; loading bukan fake determinate percent |
| Chat | disabled no context, greeting, sending, streaming, complete, error, clear |429,stream interrupted,project switch,storage blocked | message/context tidak bercampur; failed reply recoverable; scroll user dihormati |

Screenshot harus menyertakan paling sedikit satu calculate-success/save-failure case, satu DB503 case, CSV partial-success dan AI fallback. Gunakan controlled local fixtures/mocking yang tidak menulis produksi; fixture harus diberi label saat digunakan sebagai demo.

## G3 — keyboard, focus dan overlay

- [ ] Landing skip link menuju main yang ada dan dapat difokuskan; dashboard/loading target konsisten.
- [ ] Sign-in: Enter/Space pada trigger → fokus email → Tab/Shift+Tab tetap di modal → Escape/close → fokus kembali trigger. Background tidak aktif; scroll lock dibersihkan.
- [ ] Form errors tertaut pada field/summary; fokus error membantu perbaikan; tak ada aria-label yang menghapus label visible yang penting.
- [ ] CSV browse aktif via Enter/Space; hidden input bukan satu-satunya jalur; sample download, analyze, dan Use row reachable.
- [ ] Segmented manual/batch memberi selected state melalui semantics yang benar; jika memakai tablist, arrow-key dan tabpanel relationship lengkap.
- [ ] Command palette memiliki visible trigger dan Cmd/Ctrl+K; selected result diumumkan; arrows/Enter/Escape/no-result berfungsi; command label sesuai action.
- [ ] Model dapat dipilih tanpa pointer; current value/provider tidak tersembunyi dari assistive technology ketika label mobile pendek.
- [ ] Delete confirmation dan cancel reachable; pending tidak dapat dikirim berulang; setelah success fokus ke item/heading yang berguna.
- [ ] Sticky nav tidak menutup focus ring/anchor; focus visible kontras; keyboard order mengikuti reading order.
- [ ] UI paling kritis dapat diselesaikan tanpa tooltip hover-only, custom drag-only atau precise cursor.

## G4 — kontrak bisnis dan keamanan tetap kompatibel

- [ ] Calculate → autosave mempertahankan append-only semantics, hanya satu POST per submit valid; duplicate-name snapshot tidak di-upsert.
- [ ] Owner-scoped reads/deletes dan CSRF guards tetap pada server; client tidak menganggap hidden UI sebagai authorization.
- [ ] Email mode pending vs instant diuji dengan controlled responses, tanpa mengubah env untuk menyenangkan screenshot.
- [ ] AI model whitelist IDs dan provider fallback tetap kompatibel; selected-model styling tidak mengubah request payload.
- [ ] Parser CSV shared dipakai preview dan backend; BOM, comma/semicolon, quoted comma/escaped quote/multiline tetap dipahami.
- [ ] Chat key per-user+project dan max50 persistence dipertahankan; no real credentials/private dataset pada captures.
- [ ] Hasil tidak diklaim predictive/causal/cohort; dates labelled saved snapshots, bukan reporting period fiktif.
- [ ] Changes pada reducer adalah minimal dan punya behavioral tests bila menambah pagination/status handling; tidak ada broad architecture rewrite.

Existing `npm run test` mencakup library tests yang ada; audit ini tidak mengklaim UI browser coverage otomatis tersedia. TestSprite Python/plan files bukan bukti tests dijalankan saat ini. Jangan menjalankan backend suites terhadap live production untuk memenuhi checklist ini.

## G5 — design tokens, contrast dan consistency

- [ ] Proposed values diterapkan melalui semantic roles; token existing/proposed tidak tertukar; data source tidak memakai warna dekoratif sebagai makna tunggal.
- [ ] Plus Jakarta Sans tetap digunakan; numeric rows memakai tabular alignment; text scale label minimal terbaca sesuai blueprint, bukan 10px metadata kritis.
- [ ] Light dan dark masing-masing diuji pada canvas/surface/elevated/overlay, primary/secondary/disabled/error/focus states.
- [ ] Teks normal target contrast ≥4.5:1; teks besar ≥3:1; meaningful controls/focus/icons boundary ≥3:1 bila berlaku. Ukur hasil komposit alpha terhadap background aktual.
- [ ] Failure tidak diselesaikan dengan label `decorative` untuk teks/status penting. Warna risk disertai text/symbol.
- [ ] Static cards tidak hover-lift/cursor clickable; radius/border/elevation/control heights konsisten; glow/rainbow/orbs yang tidak melayani tugas dihilangkan.
- [ ] Logo brand existing dipertahankan dan tidak diekstrak/diganti dengan aset brand referensi.

Catat color pair, ratio, threshold, theme dan element. Satu pasangan lulus tidak membuktikan seluruh WCAG2.2AA. Disabled text dapat punya pengecualian contrast, tetapi alasan dan usability tetap diperiksa.

## G6 — mandatory viewport, content dan touch matrix

| Viewport | Theme | Required surfaces | Content extreme |
| --- | --- | --- | --- |
|375×812|light+dark|landing, modal, manual, CSV preview/result, metrics/chart, history/compare, chat/model/commands|long name/email, software keyboard, row errors|
|768×1024|light+dark|semua critical surfaces|dense result table, two long compare names, inline delete confirmation|
|1440×900|light+dark|semua critical surfaces|43 snapshots paginated, long insight/chat, loading/error variants|
|320px width dan200% zoom bila berlaku|kedua tema sampling|nav, form, primary actions, dialog|text enlargement, long unbroken label|

- [ ] Tidak ada page-level horizontal scroll, clipping, overlap atau unreachable action. Intentional data region horizontal scroll dibatasi, diberi petunjuk dan accessible name.
- [ ] Compact layout dipilih sadar: form single column saat dibutuhkan, metadata membungkus, actions tetap terbaca; bukan seluruh desktop dikecilkan.
- [ ] Touch preferred44×44px; below24px minimum gagal kecuali applicable spacing/exception benar-benar diperiksa dan dicatat. Visual glyph kecil bisa punya clickable area lebih besar.
- [ ] Dialog punya max-height/scroll dan submit tetap dapat dicapai dengan keyboard virtual. Close dan critical error tidak keluar viewport.
- [ ] Navbar tidak memaksa fixed64px ketika controls wrapping; sticky offsets dan anchor scroll aman.
- [ ] Loading/success/error layout tidak menggeser posisi kontrol utama secara tak perlu.

Untuk setiap capture catat URL, viewport CSS pixels, device scale bila diketahui, theme, fixture/state dan observasi. Bukti viewport hanya yang benar-benar dirender. AX/text snapshot bukan screenshot review.

## G7 — semantics dan informasi dapat dipahami

- [ ] H1/page title, section headings dan landmarks mengikuti hierarchy; sign-in/AI log/dialog punya accessible name.
- [ ] Inputs punya visible labels, units, descriptions dan errors; required/disabled/busy/expanded/selected diumumkan sesuai native/ARIA pattern.
- [ ] Chart punya project/scope/title/units/legend dan data fallback yang sama; status tidak hanya red/green. Tabel memiliki headers/caption bila membantu.
- [ ] KPI explanation tersedia via focus/touch, bukan title hover saja. Counter animasi tidak mengumumkan setiap frame.
- [ ] CSV preview header adalah th/thead yang semantik (gunakan `thead`, bukan hanya row bold); row action menyebut project; errors menyebut row yang sama dengan API.
- [ ] Chat log dapat dibaca berurutan dengan author/context; announcement cukup ringkas, bukan setiap token dibacakan keras.
- [ ] Copy tidak menjanjikan encryption/ownership verification/predictive diagnosis yang tidak dibuktikan server.
- [ ] Screen reader sampling primary journey dicatat perangkat/browser/tool; automated scan tidak menggantikan manual flow.

## G8 — motion dan context AI

- [ ] `prefers-reduced-motion` mematikan/menyingkat CSS dan JS motion: smooth scroll, chart animation, typewriter dan counter. Akses nilai final tidak menunggu animasi.
- [ ] Fake streaming insight JSON diganti immediate result; cursor hanya saat stream aktual berlangsung dan berhenti ketika selesai.
- [ ] Pending tetap memberi status text bila loading animation dimatikan.
- [ ] Project switch saat request berlangsung tidak menaruh reply ke project lain; late request diabaikan/diabort secara eksplisit.
- [ ] Clear chat saat streaming di-disable dengan alasan atau membatalkan stream dulu; replace-last tidak menimpa greeting/history konteks lain.
- [ ] Pengguna yang scroll ke atas tidak terus ditarik ke bawah; ada Jump to latest bila perlu.
- [ ] Tidak ada scroll hijacking, heavy3D, perpetual float/orb/glow atau animation yang menghalangi input.

## G9 — engineering dan performance

Sumber primer diperiksa 31 Oktober 2026: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) untuk kriteria aksesibilitas yang berlaku, [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) untuk keyboard/focus, dan [Google Web Vitals](https://web.dev/articles/vitals) untuk LCP/INP/CLS beserta penilaian p75 yang dipisah mobile/desktop. Pemeriksaan sumber bukan bukti aplikasi memenuhi target.

- [ ] Jalankan `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` sesuai plan, rekam exit code dan output relevan. Jangan mempublikasikan secret values pada error logs.
- [ ] Baseline failure yang sudah ada dipisahkan dari regression; blocked build tidak dipalsukan sebagai pass. Jangan menambah dependency supaya tool tersedia tanpa alasan/otorisasi task.
- [ ] Browser console/network tidak memperlihatkan UI-breaking errors, hydration mismatch, unexpected failed API requests atau font loading regressions.
- [ ] Target: LCP≤2.5s, INP≤200ms, CLS≤0.1 pada kondisi pengukuran yang sesuai. **Ini target, belum hasil.**
- [ ] Rekam tool/version, environment, route, dataset, auth, device/network/cache settings dan run count. Bandingkan baseline dan after yang setara.
- [ ] Bedakan Lighthouse/lab metric dari real-user field metric. Tidak ada klaim INP field pass bila tidak ada sample interaksi/field data yang sesuai; TBT bukan INP.
- [ ] Image dimensions dan async chart/skeleton space ditetapkan; font display/loading tidak menambah avoidable shifts; no gratuitous animation dependency/heavy asset.
- [ ] Jalankan unit test meaningful untuk data/status formatter/reducer yang berubah, bukan snapshot CSS yang hanya mengikuti implementation.

## G10 — referensi, rights dan completion report

- [ ] Setiap keputusan besar memiliki mapping reference→screen→adaptation→task; status text/AX/visual verification dipisahkan.
- [ ] Saat visual reference belum bisa dilihat, tanda `Not Yet Verified` tetap ada; jangan mengklaim close reproduction/pixel parity dari nama produk.
- [ ] Aset milik ChurnSense atau punya lisensi yang sesuai; komponen open source mencatat source/license/attribution bila digunakan; no copied brand identities/private/minified source.
- [ ] Final validation document menyebut files changed, before/after behavior, commands dengan hasil, viewport screenshots yang benar-benar ditinjau, gate statuses, known gaps dan rollback scope.
- [ ] Belum selesai jika applicable gate masih Fail/Pending/Blocked. Boleh melaporkan milestone parsial dengan batas jelas, bukan complete palsu.

## Template evidence per milestone

```markdown
Milestone / task IDs:
Date/time (Asia/Jakarta):
Root / SHA / working-tree summary:
Files changed:
Before → after behavior:
Data fixtures:
Commands + exit codes:
Browser URL / tool:
Viewport / theme / states:
Screenshot paths + observations:
Keyboard / screen reader / contrast evidence:
Performance method + actual results (or Not Yet Verified):
G0–G10 statuses + evidence:
Known gaps / blocker:
Rollback patch/commit scope:
```

Source-backed findings dari audit bukan resolved sebelum behavior baru diverifikasi. Jangan mengisi template dengan `Pass` tanpa observasi konkret.

## Baseline source saat audit, bukan gate redesign

Project audit mencatat `npm test` (37 pass, 0 failed, 0 skipped), `npm run lint` (exit 0), dan `node node_modules/typescript/bin/tsc --noEmit --incremental false` (exit 0). Build, browser authenticated, multi-viewport visual, screen reader dan performance belum diverifikasi. Jalankan ulang checks yang relevan setelah perubahan Gemini; seluruh implementation gates di atas tetap Pending sampai ada evidence untuk source hasil redesign.

Chat tanpa provider mengembalikan setup JSON; provider yang sudah dikonfigurasi tetapi gagal mempunyai rule-based fallback. Kedua kondisi harus diuji sebagai state berbeda, bukan disatukan menjadi klaim fallback otomatis pada semua mode.
