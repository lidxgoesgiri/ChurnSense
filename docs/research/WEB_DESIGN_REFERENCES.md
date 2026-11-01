# Referensi web untuk redesign ChurnSense

Tanggal pemeriksaan: **31 Oktober 2026, Asia/Jakarta**. Fase: riset dan planning; tidak ada source aplikasi yang diubah oleh dokumen ini.

Keputusan implementasi final mengikuti [design system](../design/CHURN_DESIGN_SYSTEM.md), [screen blueprints](../design/CHURN_SCREEN_BLUEPRINTS.md), dan [mapping referensi](REFERENCE_TO_SCREEN_MAPPING.md). Kandidat eksplorasi yang tidak dipilih bukan scope tambahan untuk Gemini.

## Batas bukti

- **Verified — content/IA:** URL di bawah berhasil dibuka melalui web tool dan bagian yang disebutkan dibaca. Ini membuktikan isi dan pola yang dijelaskan dokumentasi publik, bukan keberhasilan interaksi aplikasi privat.
- **Inferred — design fit:** keputusan adaptasi ke ChurnSense adalah penilaian desain dari kebutuhan produk dan inventory repository. Penilaian ini dibedakan dari perilaku produk referensi.
- **Not Yet Verified — visual/runtime:** screenshot website referensi, ukuran aktual, warna aktual, font aktual, animasi berjalan, responsive aktual, keyboard journey, dan aplikasi setelah login belum diverifikasi. Percobaan membuka Linear melalui browser berakhir timeout. Tidak ada screenshot yang dihasilkan atau diklaim.
- Semua ukuran, proporsi, dan durasi yang diusulkan untuk ChurnSense adalah **target design values**, bukan pengukuran website referensi. Kategori visual di bawah berarti kandidat untuk pemeriksaan visual lanjutan, bukan sertifikasi kualitas visual terkini.
- Halaman marketing dapat memuat mock data. Tidak ada angka, prediksi, testimonial, atau klaim hasil bisnis mereka yang boleh dipindahkan menjadi data ChurnSense.

## Delapan produk utama dan cakupan

| ID | Produk | Kategori utama | URL dan bagian yang dibaca | Bukti saat ini | Confidence penggunaan |
| --- | --- | --- | --- | --- | --- |
| R01 | ChartMogul | UX / information architecture | [Home](https://chartmogul.com/): AI answer, chart title, timeframe; [cohort analysis](https://help.chartmogul.com/article/161-cohort-analysis): tabel, istilah, export | Content/IA verified; visual unverified | Tinggi untuk konteks analytics; rendah untuk fidelity visual |
| R02 | Baremetrics | UX / information architecture | [Subscription metrics](https://baremetrics.com/features/metrics); [home](https://baremetrics.com/): Control Center, Dashboard, comparison context | Content/IA verified; demo privat tidak diuji | Tinggi untuk overview → detail |
| R03 | Stripe | UX / information architecture | [Billing Analytics](https://docs.stripe.com/billing/subscriptions/analytics): Explore, chart + table, export; [Billing](https://stripe.com/billing): product explanation | Dokumentasi primer verified; dashboard akun tidak dibuka | Tinggi untuk hierarchy chart/table/export |
| R04 | Linear | Visual / layout / hierarchy kandidat | [Home](https://linear.app/): product sections, embedded issue interface; [Filters](https://linear.app/docs/filters): applied filters, result update, URL state | Content/IA verified; visual/browser timeout | Tinggi untuk pola filter; sedang untuk direction |
| R05 | Vercel Geist | Visual / typography / component craft kandidat | [Typography](https://vercel.com/geist/typography): heading, label, copy roles; [Table](https://vercel.com/geist/table): semantic and numeric presentation | Spesifikasi primer verified; render unverified | Tinggi untuk sistem komponen |
| R06 | Resend | Visual / composition kandidat | [Home](https://resend.com/): product explanation and concrete interface examples; [login](https://resend.com/login): title, grouped inputs, actions | Content hierarchy verified; rendered composition unverified | Sedang untuk landing/login |
| R07 | Raycast | Microinteraction / keyboard | [Action Panel](https://manual.raycast.com/action-panel): primary action, grouped actions, search, shortcut hints, Escape; [home](https://www.raycast.com/): keyboard-first product language | Interaction contract dari manual verified; real application belum diuji | Tinggi untuk command palette behavior |
| R08 | Framer | Responsive design / motion kandidat | [Home](https://www.framer.com/): canvas preview, desktop/tablet examples, breakpoint editing descriptions | Konten responsive tooling verified; viewport dan motion aktual unverified | Sedang untuk responsive planning; rendah untuk motion fidelity |

Tiga referensi UX, tiga kandidat visual, dan dua referensi interaksi/responsive tercakup. **Pemeriksaan visual seluruh referensi tetap menjadi pekerjaan QA sebelum klaim close visual match.** Referensi komponen tambahan di bagian akhir memberi kontrak interaksi yang lebih konkret daripada meniru animasi marketing.

## R01 — ChartMogul: angka selalu membawa konteks

**Diperiksa:** homepage menampilkan pertanyaan analitik, jawaban, judul visualisasi, dan periode. Dokumentasi cohort menjelaskan tabel, arti nilai, drill-down, dan export. [Sumber home](https://chartmogul.com/), [sumber cohort](https://help.chartmogul.com/article/161-cohort-analysis).

**Kekuatan UX yang dapat dibuktikan:** narasi ditempatkan bersama konteks data yang dijelaskan; definisi tabel tersedia. Kekuatan warna, spacing, dan motion belum diperiksa secara visual.

**Adaptasi ChurnSense — Inferred/proposed:** `ai-insight-card.tsx` harus menunjukkan project aktif dan konteks snapshot, kemudian ringkasan, risiko, dan rekomendasi. `retention-chart.tsx` menampilkan jumlah snapshot dan timestamp penyimpanan yang tersedia; sediakan tabel nilai sebagai alternatif chart. `createdAt` bukan periode bisnis: jangan menambahkan date-range/period filter atau menyebut titik sebagai cohort. Untuk satu snapshot, jelaskan tren belum tersedia. Jangan membuat plot atau riwayat sintetis agar chart terlihat penuh.

**Jangan disalin:** identitas, aset, angka demo, prediksi ARR, cohort heatmap, atau fitur CRM. ChurnSense tidak memiliki event/cohort dataset yang setara. **Tingkat kemiripan:** interaction/information hierarchy match; bukan replika analytics engine. **Confidence:** tinggi untuk pola konteks, rendah untuk ukuran visual.

## R02 — Baremetrics: overview untuk scanning, detail untuk diagnosis

**Diperiksa:** halaman metrics dan home membedakan Control Center, dashboard, serta analisis perubahan dari bulan sebelumnya. [Sumber metrics](https://baremetrics.com/features/metrics), [sumber home](https://baremetrics.com/).

**Kekuatan UX:** pemisahan ringkasan dan diagnosis sesuai pekerjaan pengguna SaaS. Live demo ditautkan, tetapi interaksinya belum diuji. Warna, chart geometry, dan density aktual belum terverifikasi.

**Adaptasi ChurnSense — proposed:** dahulukan churn/retention/risk, kemudian revenue metrics; letakkan tren dan AI setelah ringkasan. History tetap daftar snapshot dengan project name yang jelas. Comparison harus menyebut project/snapshot A dan B sebelum delta. Nilai lebih rendah pada churn berarti membaik; delta numerik saja tidak cukup menjelaskan arah baik/buruk.

**Jangan disalin:** benchmark pesaing, payment recovery, cancellation survey, target growth, atau segmentasi customer yang datanya belum ada. **Tingkat kemiripan:** close structural match pada overview → detail, setelah visual checkpoint; targetnya bukan menyalin seluruh dashboard Baremetrics. **Confidence:** tinggi untuk IA, visual rendah.

## R03 — Stripe: chart, data pendukung, dan cakupan export

**Diperiksa:** dokumentasi Billing Analytics menjelaskan Explore, chart dengan tabel di bawahnya, filter/grouping di atas, serta perbedaan export summary dan underlying rows. [Sumber primer](https://docs.stripe.com/billing/subscriptions/analytics).

**Kekuatan UX:** kontrol ditempatkan bersama data yang dipengaruhinya dan export memiliki cakupan yang dapat dijelaskan. Dashboard setelah login serta bentuk visual terbarunya tidak diperiksa.

**Adaptasi ChurnSense — proposed:** hasil analisis memiliki urutan context header → summary → trend → exact values. Label export harus sesuai implementasi sebenarnya: seluruh snapshot, subset yang dimuat, atau hasil CSV; jangan menjanjikan “semua data” bila hanya halaman aktif. Comparison menggunakan satu tabel metric dengan kolom A/B/delta, lalu penjelasan arah delta secara tekstual.

**Jangan disalin:** definisi MRR Stripe ke fungsi ChurnSense, konfigurasi billing, currency engine, transaksi, atau subscription lifecycle. Perbedaan model data harus dipertahankan. **Tingkat kemiripan:** hierarchy/interaction match. **Confidence:** tinggi pada kontrak dokumen; visual unverified.

## R04 — Linear: konteks kerja tetap terlihat saat memfilter

**Diperiksa:** homepage memuat representasi antarmuka dan urutan product workflows. Dokumentasi filter menjelaskan pemilihan kriteria, hasil yang berubah, serta filter utama di URL. [Home](https://linear.app/), [Filters](https://linear.app/docs/filters).

**Kekuatan UX:** filter adalah bagian dari view, bukan langkah terpisah. Visual hierarchy dan tipografi terkini masih kandidat; browser render timeout.

**Adaptasi ChurnSense — proposed:** baseline history toolbar menampilkan jumlah/scope hasil serta pagination yang sesuai API. Pencarian nama, filter, clear, dan URL state adalah **opsional/deferred**, bukan fitur existing atau pekerjaan wajib baseline. Jika kelak ditambahkan, selaraskan cakupan loaded/global, reset pagination saat filter berubah, dan batasi URL ke state non-sensitif tanpa data analisis/email. Pada mobile toolbar wrap tanpa menyusutkan target sentuh.

**Jangan disalin:** issue workflow, AI filtering, project-management labels, logo, dan typography proprietary. **Tingkat kemiripan:** interaction match dan typographic inspiration setelah render review, bukan menyalin homepage. **Confidence:** tinggi pada filter contract; visual sedang/rendah.

## R05 — Vercel Geist: presisi melalui roles dan alignment

**Diperiksa:** typography memisahkan heading, button, label, copy; table memakai semantic HTML, numeric alignment, sortable headers dan empty/pagination guidance. [Typography](https://vercel.com/geist/typography), [Table](https://vercel.com/geist/table).

**Kekuatan yang terverifikasi:** type roles dan anatomy dapat diterjemahkan menjadi tokens dan komponen. Ini bukan bukti bahwa ChurnSense perlu menggunakan font atau komponen internal Vercel.

**Adaptasi ChurnSense — proposed:** pertahankan Plus Jakarta yang sudah ada, atur hierarchy peran, `tabular-nums` untuk nilai, header tabel singkat, text alignment konsisten, dan tombol sort yang punya nama/state. Tampilkan empty state bermakna; nilai tidak tersedia berbeda dari nol. Proposed row height 48–56 px, control 40–44 px, body 14–16 px; angka ini bukan hasil ukur Geist.

**Jangan disalin:** Vercel brand, ikon/logo, grid dekoratif dominan, atau mengimpor package internal yang belum diverifikasi akses/lisensinya. **Tingkat kemiripan:** component anatomy match; font tetap milik produk. **Confidence:** tinggi untuk spesifikasi; visual unverified.

## R06 — Resend: satu tugas utama pada permukaan login

**Diperiksa:** home menjelaskan produk dengan contoh antarmuka/SDK; login mengelompokkan title, input, action, dan jalur pendukung. [Home](https://resend.com/), [Login](https://resend.com/login).

**Kekuatan IA:** form inti mudah dibedakan dari informasi pendukung dalam struktur konten. Tata letak spasial, background, warna, dan motion belum diinspeksi melalui screenshot.

**Adaptasi ChurnSense — proposed:** landing memiliki satu CTA sign-in yang jelas, penjelasan input → metrik → insight, dan preview hasil berlabel contoh. Sign-in mengikuti respons aktual: instant `success` menuju dashboard atau `pending` magic link bila verification/provider aktif. Label email, pending/error, expired-link recovery, dan retry dekat form mempertahankan email. Tidak ada OTP entry atau endpoint resend terpisah; pengajuan ulang hanya melalui submit existing sesuai state dan batas API.

**Jangan disalin:** password, login Google/GitHub, Terms acceptance, email delivery claims, aset, atau merek Resend. Login ChurnSense harus mengikuti passwordless flow yang ditemukan pada source, bukan pilihan Resend. **Tingkat kemiripan:** focused form hierarchy; visual inspiration belum divalidasi. **Confidence:** sedang.

## R07 — Raycast: command palette berfungsi sebagai shortcut

**Diperiksa:** manual Action Panel menjelaskan primary action, kelompok tindakan, pencarian, shortcut, dan Escape. [Manual](https://manual.raycast.com/action-panel); konteks produk [home](https://www.raycast.com/).

**Kekuatan interaksi:** pengguna dapat menemukan tindakan dan mempelajari shortcut lewat hint. Tidak dilakukan pengujian keyboard pada aplikasi Raycast.

**Adaptasi ChurnSense — proposed:** `command-palette.tsx` hanya menawarkan aksi nyata seperti fokus form, CSV, history, dan theme bila tersedia. Buka lewat tombol terlihat atau Ctrl/Cmd+K; input mendapat focus; ArrowUp/Down memilih; Enter mengeksekusi; Escape menutup; focus kembali ke trigger. Empty query dan no-result diberi pesan berbeda. Pastikan modal focus containment, accessible name, serta background inert.

**Jangan disalin:** semua shortcut native, extension ecosystem, window manager, AI agent tools, atau glow marketing. **Tingkat kemiripan:** interaction match dengan adaptasi web/dialog, bukan native launcher. **Confidence:** tinggi untuk manual; runtime aplikasi belum diuji.

## R08 — Framer: responsive dirancang sebagai komposisi tersendiri

**Diperiksa:** home menyertakan canvas/interface previews serta contoh Desktop dan Tablet, dengan deskripsi pengeditan breakpoint. [Sumber](https://www.framer.com/).

**Kekuatan yang terverifikasi:** responsive diperlakukan sebagai bagian dari workflow desain. Detail aktual reflow, scroll, hover, easing, dan durasi pada website belum diverifikasi. URL bantuan reduced-motion yang dicoba tidak dapat diakses; tidak dipakai sebagai bukti.

**Adaptasi ChurnSense — proposed:** final workbench pada desktop cukup lebar memakai input rail 360 px dan hasil fleksibel, lalu chart full-width dan section AI terpisah. Tablet/mobile mengalir satu kolom: input → metrik → chart → AI. Container dashboard target 1.280 px; detail akhir mengikuti design system. Jangan mengecilkan tabel menjadi font mini. Gunakan scroll lokal untuk tabel, legend wrap, dialog mengikuti viewport/keyboard. Validasi 375×812, 768×1024, 1440×900 dengan konten panjang.

**Jangan disalin:** website-builder canvas, 3D ticker, agent features, atau layout media-heavy. **Tingkat kemiripan:** responsive planning inspiration; tidak ada motion fidelity claim. **Confidence:** sedang/rendah; Motion/Radix di bawah menjadi kontrak implementasi yang lebih kuat.

## Referensi komponen/interaksi tambahan

| ID | Sumber primer yang diperiksa | Hal yang terverifikasi | Adaptasi ChurnSense yang diusulkan | Batasan |
| --- | --- | --- | --- | --- |
| R09 | [shadcn Data Table](https://ui.shadcn.com/docs/components/base/data-table) | Contoh sorting, filtering, row actions, pagination, visibility | Anatomy toolbar → table → pager untuk history; semantic controls di komponen yang sudah ada | Docs terkini memakai dependency tambahan; bukan perintah instalasi atau migrasi ke TanStack/Base UI |
| R10 | [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) | Dialog anatomy, Title/Description, keyboard Tab/Shift+Tab, Escape dan restore focus | Acceptance contract untuk login, confirmation, command palette dan model selection bila modal | Reimplementasi dengan primitives existing/native dahulu; tidak otomatis menambah Radix |
| R11 | [Motion Accessibility](https://motion.dev/docs/react-accessibility) | Reduced-motion guidance, transform besar dapat diganti opacity, parallax/video dibatasi | CSS reduced-motion: hentikan orbs/count-up/lift yang tidak perlu; feedback loading tetap ada | Tidak perlu memasang Motion untuk transisi CSS; animasi referensi tidak diamati langsung |

## Keputusan komparatif untuk ChurnSense — proposed

| Kebutuhan nyata | Pilihan paling relevan | Alasan | Alternatif yang tidak diprioritaskan |
| --- | --- | --- | --- |
| Memahami hasil churn/retention | ChartMogul + Baremetrics | Domain dan urutan overview/detail sesuai data produk | Landing agency/Web3 tidak membantu membaca metrik |
| Membandingkan snapshot dan export | Stripe + Geist | Hubungan chart/table dan cakupan data jelas | Visual chart kompleks tanpa data pendukung |
| Menemukan snapshot | Linear filter pattern + shadcn anatomy | View context, result count dan pager; query/filter opsional setelah scope data selaras | Advanced filter builder/AI filter menambah scope |
| Form login dan input analisis | Resend hierarchy + Radix interaction contract | Fokus tugas dan feedback verifikasi | Menambah password/social auth tanpa kebutuhan |
| Shortcut dan overlay | Raycast + Radix | Discovery dan keyboard behavior terdokumentasi | Launcher native dan animasi dekoratif |
| Mobile serta motion | Framer sebagai kandidat komposisi; Motion docs sebagai kontrak | Rencana reflow per surface dan reduced-motion eksplisit | Menyalin scroll spectacle/3D ke analytics |

Direction yang didukung: **Product-Led Minimalism dengan aksen Editorial Precision**. Gunakan typographic hierarchy, data alignment, dan context rail sebagai craft; sage/blue tetap mengikuti identitas ChurnSense. Pemilihan ini adalah inference desain, bukan hasil user testing. Lebar container, type scale, palette, radius, dan timing final terdapat di dokumen design system sebagai proposal yang perlu diuji.

## Hak penggunaan, lisensi, dependency, dan trade-off

1. Website produk di atas dipakai sebagai referensi pola. Jangan mengambil logo, copy, foto, illustration, proprietary fonts, private code, atau bundle minified. Ketersediaan publik tidak menyatakan hak penggunaan aset. Jangan menampilkan afiliasi brand.
2. Bila source terbuka dipakai, catat versi/commit dan pertahankan notice yang diwajibkan. License repository yang dibaca: [shadcn MIT](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md), [Radix MIT](https://github.com/radix-ui/primitives/blob/main/LICENSE), [Motion MIT](https://github.com/motiondivision/motion/blob/main/LICENSE.md). Verifikasi ulang file/versi tepat saat implementasi; ini bukan pemeriksaan lisensi seluruh rantai dependency.
3. [Geist font license](https://github.com/vercel/geist-font/blob/main/LICENSE.txt) menyatakan SIL OFL 1.1, tetapi font baru **tidak direkomendasikan** pada baseline ini. Pertahankan font existing; tidak perlu network/font payload tambahan demi meniru referensi.
4. Baseline plan memakai React, CSS/Tailwind dan primitives existing. shadcn/TanStack/Radix/Motion tidak ditambahkan secara default. Library overlay hanya dipertimbangkan bila focus/keyboard contract tak dapat dipenuhi dengan komponen existing/native; dokumentasikan alternatif, biaya bundle yang benar-benar diukur, API change, dan migration scope.
5. Tidak ada ukuran bundle atau performance score yang diukur dalam riset ini. Jangan menyatakan library “ringan” tanpa membandingkan output build yang sama. CSS opacity/transform dan native elements adalah pilihan awal untuk mengurangi pekerjaan migrasi.

## Pekerjaan verifikasi yang masih terbuka

- Ambil screenshot referensi terpilih bila browser capture tersedia; catat tanggal, viewport, URL, section, state. Jangan menandai kandidat sebagai visual-verified hanya karena URL terbuka.
- Periksa layout desktop/mobile dan keyboard flow referensi tanpa membuat akun baru atau mengirim data pengguna.
- Sebelum close structural match, pilih satu section spesifik yang benar-benar terlihat dan tentukan adaptasi untuk konten ChurnSense. Target ukuran tetap proposal sampai diukur.
- Bandingkan hasil Gemini dengan blueprint ChurnSense; referensi mendukung keputusan, bukan alasan mengubah formula, auth, API, persistence, atau fitur.

