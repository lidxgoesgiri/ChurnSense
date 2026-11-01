# ChurnSense — design system untuk Gemini

Tanggal: 31 Oktober 2026. Semua ukuran/nilai baru di sini adalah **PROPOSED target design values**. Source belum diubah. Primary direction: [Retention Workbench](CHURN_VISUAL_DIRECTION.md). Inventaris existing: custom Tailwind v4 + CSS variables, Plus Jakarta Sans, Recharts, `src/components/ui/{button,input,card,badge}.tsx`. Tidak ada Radix/shadcn/icon/motion dependency saat audit.

## Existing → proposed

`src/app/globals.css:7–28` mendefinisikan background/foreground/card/card-border/muted/accent, termasuk indigo accent `#6366f1` / `#818cf8`. `globals.css:187+` menambahkan glass-card dengan blur dan hover translate. `src/app/layout.tsx:2–15` sudah memuat Plus Jakarta Sans 400–800. Variabel `--font-sans: var(--font-sans)` pada theme inline perlu ditelusuri agar alias font tidak menjadi self-reference; gunakan backing variable terpisah bila diperlukan dan verifikasi computed font di browser.

Migrasi semantic tokens bertahap; pertahankan alias lama sampai seluruh pemakai dipindahkan. Jangan sekaligus mengganti semua CSS dengan framework baru. Jangan menambah font untuk sekadar mengikuti referensi.

## Proposed semantic tokens

Contoh ini adalah spesifikasi, **bukan kode yang telah diterapkan**:

```css
:root[data-theme='light'] {
  --cs-bg: #F6F8F6;
  --cs-surface: #FFFFFF;
  --cs-elevated: #FFFFFF;
  --cs-text: #17251E;
  --cs-muted: #526259;
  --cs-primary: #225C43;
  --cs-on-primary: #FFFFFF;
  --cs-accent: #245B78;
  --cs-accent-surface: #E5F1F7;
  --cs-border: #D8E1DB; /* dekoratif; bukan satu-satunya batas input */
  --cs-control-border: #76877C;
  --cs-focus: #225C43;
  --cs-success: #1F6B43;
  --cs-warning: #865400;
  --cs-danger: #B73535;
}
:root[data-theme='dark'] {
  --cs-bg: #0D1712;
  --cs-surface: #14221B;
  --cs-elevated: #1B2D23;
  --cs-text: #EAF2ED;
  --cs-muted: #A2B7A9;
  --cs-primary: #A8D8BA;
  --cs-on-primary: #112219;
  --cs-accent: #A9CDE3;
  --cs-accent-surface: #1A3340;
  --cs-border: #30483A;
  --cs-control-border: #769581;
  --cs-focus: #B2DDC3;
  --cs-success: #A3D5B2;
  --cs-warning: #E9C985;
  --cs-danger: #F1AAAA;
}
/* Alias migrasi: background→cs-bg, foreground→cs-text,
   card→cs-surface, card-border→cs-border,
   muted→cs-muted, accent→cs-primary,
   accent-foreground→cs-on-primary. */
```

Nilai root tanpa data-theme perlu fallback light yang sama. Jangan mengubah default/persistensi ThemeProvider secara diam-diam. Dark/light selection existing tetap berfungsi; kedua mode wajib QA. Tidak ada opacity pada teks penting. Risk state selalu memiliki kata/ikon/label, bukan hue saja. Blue adalah informasi, bukan CTA pesaing green.

### Contrast yang dihitung saat planning

Python skill checker tidak bisa dijalankan karena executable `python.exe` WindowsApps tidak tersedia. Sebagai pengganti, 52 pasangan token opaque dihitung dengan formula luminance sRGB WCAG `(Llighter+0.05)/(Ldarker+0.05)` melalui JavaScript pada sesi ini. Semua 52 memenuhi ambang yang diperiksa; hasil lengkap di [CONTRAST_CHECKS.json](CONTRAST_CHECKS.json). Ini validasi matematis token usulan, **bukan audit rendered aplikasi atau sertifikasi WCAG**.

| Pasangan | Light | Dark | Ambang |
|---|---:|---:|---:|
| Text / surface | 15.91:1 | 14.46:1 | 4.5:1 |
| Muted / surface | 6.46:1 | 7.75:1 | 4.5:1 |
| On-primary / primary | 7.84:1 | 10.42:1 | 4.5:1 |
| Accent / accent-surface | 6.42:1 | 7.87:1 | 4.5:1 |
| Danger / surface | 5.88:1 | 8.69:1 | 4.5:1 |
| Control-border / surface | 3.80:1 | 5.01:1 | 3:1 |
| Focus / surface | 7.84:1 | 11.00:1 | 3:1 |

Jangan menggunakan decorative border untuk membatasi input. Semua overlay, hover/selected backgrounds, series yang saling bersebelahan, opacity/disabled, dan alpha-compositing harus dihitung ulang pada implementasi; 52 pasangan tidak mencakup semua kombinasi UI.

## Type, spacing, grid

| Token/peran | Target |
|---|---|
| Font body/control/headings | Existing Plus Jakarta Sans, system-ui fallback; tidak ada download family baru |
| Numerik | Family sama, tabular-nums; sistem monospace hanya code/ID bila relevan |
| Display landing | `clamp(2.25rem, 4vw, 3.5rem)`, 700, line-height 1.08, tracking -0.03em |
| H1 dashboard | 28/36px desktop, 24/32px mobile, 700 |
| H2 | 20/28px, 600; H3 16/24px, 600 |
| Body | 16/24px; tabel desktop 14/20px; helper/meta minimum 12/18px |
| KPI utama | 36/40px desktop; 28/34px mobile, 600, tabular |
| KPI pendukung | 24/32px, 600 |
| Scale spacing | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px |
| Container landing | max 1200px; gutter 16px compact, 24px tablet, 32px desktop |
| Container dashboard | max 1280px; same gutter; isi tidak dipaksa full ultrawide |
| Breakpoints | <640 compact; 640–1023 intermediate; ≥1024 desktop; dua kolom workbench baru ≥1200 jika available width memadai |
| Workbench | ≥1200: 360px input + minmax(0,1fr) result, gap24; selain itu stack |
| Radius | 6px inline chip; 8px control; 12px panel/dialog; pill hanya status kecil |
| Border/shadow | 1px border; control-border khusus control; shadow hanya popover/dialog, tanpa hover-lift panel statis |

Ukuran tidak boleh mengorbankan long labels atau zoom. Gunakan min-width:0 dan wrapping; page tidak scroll horizontal. Scroll horizontal hanya di region data yang diberi nama dan petunjuk. Layout/focus order tetap sejalan.

## Component anatomy dan interaction contract

| Komponen / existing file | Bagian & target sizing | State / keyboard / a11y |
|---|---|---|
| App shell — navbar.tsx, dashboard-client.tsx | Header min64px (auto-height saat wrap), brand36px, judul/page context, command trigger, account+theme. Model selector ditempatkan dekat section AI dan tetap satu sumber state | Sticky header tidak menutupi focus/anchors; `scroll-margin-top`; section nav link biasa, `aria-current` jika active state benar-benar dilacak. Mobile header dua baris atau menu account yang nyata; tidak ada fixed h64 yang memotong controls |
| Button — ui/button.tsx | Primary/secondary/ghost/destructive; default44px high, compact32–36px hanya desktop dan target minimum terpenuhi; gap8, icon16 | Hover tonal, active press singkat; focus2px offset2; disabled native+teks bila alasannya penting; loading label mempertahankan width, aria-busy; bukan spinner tanpa konteks |
| Input — ui/input.tsx, project-form.tsx | Label14px + help12px + field44px + error12px; border control; padding12 | Validasi field dan cross-field inline; aria-describedby/invalid; native min/step/required tetap. Jangan mengubah integer counts, revenue decimal, atau aturan sum≤total. Jangan reset input setelah gagal |
| Manual/Batch switch | Dua button segmented, min44px; width intrinsic (tidak bergantung translateX6rem) | Pilih `aria-pressed` button group atau tabs lengkap dengan panel IDs/roving keys. Jangan role tab tanpa keyboard model yang sesuai |
| File chooser — csv-uploader.tsx | Visible native file input atau button nyata; drop area sekunder, contoh header, 5MB/500-row limit, file name, progress indeterminate | Enter/Space membuka chooser; drag bukan satu-satunya jalur; valid/invalid/partial errors dekat hasil; aria-live ringkas. Parsing sesuai endpoint, bukan parser baru |
| KPI — metrics-summary.tsx, animated-metric.tsx | Label14, value36/24, unit jelas, help button44 target; churn+retention utama, ARPU/MRR/LTV pendukung | Skeleton ukuran tetap; satu pengumuman final per batch hasil. `null` LTV tampil “Not defined — zero churn”; tidak menjadi $0/angka infinity sebagai hasil uang |
| Risk/anomaly — anomaly-badge.tsx, ui/badge.tsx | Label state+teks penjelas; border/tonal fill secukupnya | Threshold bisnis tidak diubah. Anomaly relatif trailing mean bukan prediction. Tidak ada glow yang mengalahkan nilai |
| Chart — retention-chart.tsx | Header + project/scope + plot target280px desktop/240 compact + legend + data disclosure | Churn line dashed/retention solid dan label, bukan warna saja; tooltip keyboard equivalent/data table; empty0 vs single snapshot bars vs ≥2 trend snapshots. Fixed chart region mengurangi shift; reduced-motion menonaktifkan animasi Recharts |
| Retention table — retention-table.tsx | Caption + scope/count + thead + tbody + pagination; row min44px, numeric right+tabular, name wraps/bounded | th scope; sort hanya jika benar-benar diimplementasikan. Loading berbeda dari empty/error. Mobile scroll region bernama/focusable, project identity tetap terbaca |
| Snapshot history — projects-history.tsx | Nama + timestamp penuh saat perlu + ringkasan + row actions; min64px, mobile stack action | Dua-step confirm delete dipertahankan. Pending per row, error/retry, focus kembali ke row tetangga setelah sukses. Jangan animasikan row hilang sebelum server memastikan sukses |
| Comparison — comparison-view.tsx | Select A/B berlabel project+timestamp, metric/A/B/delta legend, mobile satu metric per baris | Delta B−A eksplisit bertanda +/−; churn/retention **pp**; lower churn better, higher retention/revenue better; zero neutral; null LTV tidak dihitung sebagai0 |
| Insight — ai-insight-card.tsx | Judul, context snapshot, model, generate/regenerate, summary+recommendation+source | Calculating vs awaiting AI vs failure berbeda. Rule-based source jangan diberi label AI-generated. Full text setelah JSON; jangan typewriter buatan/progress palsu |
| Chat — ai-chat.tsx | Header+project context, message log min240/320px, labeled composer44px, Send | Preserve scope user+project and real streaming. Announce completion/error, jangan setiap token. Auto-scroll hanya saat pengguna dekat bawah; tombol jump jika membaca pesan lama. Stream error mempertahankan pesan+retry; no fake typing after done |
| Model — model-selector.tsx | Field label+selected name+tier, ≤320px popup/clamp to viewport; no glow | Prefer native select+optgroup untuk roster sederhana; jika custom wajib selected/expanded, arrows/Home/End/Escape, focus restore. IDs whitelist/store tetap |
| Dialog — page.tsx / proposed ui/dialog.tsx | Title+description+close44+body+actions; max400px signin, viewport margin16, max-height calc(100dvh−32px) | Native dialog atau implementasi lokal teruji: named modal, focus entry/trap/restore, Escape, inert background, scroll lock. Pending email dan expired-link error tidak boleh terhapus diam-diam |
| Command — command-palette.tsx | Search44 + results min44 + no results + shortcut hints; max560px, margin16 | Dialog semantics+focus restore; arrows/Enter/Escape; active item diumumkan. Filter tidak menghasilkan selected=-1 crash. Semua aksi tersedia tanpa shortcut juga |
| Toast/alert — toast.tsx | Success/status singkat; error kritis juga inline; max widthmin(400px,viewport−32px) | role status untuk info, alert untuk error relevan; jangan menduplikasi pengumuman; destructive failure tidak auto-hilang sebagai satu-satunya evidence |
| Skeleton/empty/error — skeleton.tsx,error-boundary.tsx | Shape mengikuti panel akhir; empty menjelaskan aksi; error menjelaskan pemulihan | aria-busy pada region, satu label loading; skeleton decorative; no shimmer reduced motion; retry hanya operasi aman. Jangan sembunyikan fitur DB503 tanpa penjelasan |

GET `/api/projects` sebenarnya menyertakan raw inputs, tetapi tipe client `SavedProject` hanya mengekspos id/nama/tanggal/metrics. Tidak ada dedicated detail/update endpoint atau flow edit existing. Nama row **bukan** link edit palsu. Membuat details/edit memerlukan keputusan scope dan, bila diperlukan, perluasan tipe client yang sesuai response aktual.

## Motion dan performa

- Tokens: fast120ms, feedback180ms, panel180ms, data240ms; easing `cubic-bezier(.2,0,0,1)`. Transform/opacity untuk overlay, bukan reflow width/height dekoratif.
- `prefers-reduced-motion`: CSS dan `matchMedia` di JS harus konsisten; `AnimatedMetric` existing sudah punya guard yang dipertahankan. Instant final values, Recharts `isAnimationActive=false`, scroll behavior auto, no typewriter/float/shimmer.
- Loading tetap menunjukkan aktivitas secara tekstual; jangan memakai pseudo percentage 5→92% yang tidak berasal dari pekerjaan riil.
- Target LCP≤2.5s, INP≤200ms, CLS≤0.1 adalah **target**, belum hasil ukur. INP lapangan perlu data interaksi yang cukup; synthetic interaction bukan bukti p75 field INP.
- Gunakan existing `next/image`, fixed dimensions logo, self-hosted next/font, reserver chart bounds. Tidak ada mandatory new UI/icon/motion library. Jika ingin lazy load chart/chat, ukur dampaknya dahulu dan jangan memecah alur hanya untuk skor.
- Hindari perubahan API/schema/database selama migrasi visual. Penanganan pagination/error boleh perubahan client yang terisolasi sesuai implementation plan.

## Referensi implementasi, dependency, dan hak aset

[Geist typography](https://vercel.com/geist/typography) dan [table](https://vercel.com/geist/table) untuk anatomy data/type; [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog) untuk kontrak focus; [Motion accessibility](https://motion.dev/docs/react-accessibility) untuk reduced motion. Referensi bukan mandat install. Bila menyalin **kode** open source, Gemini harus membuka LICENSE pada version/commit yang dipakai serta mencatat URL/atribusi. Plan default memakai kode lokal, tanpa menyalin kode/aset/font baru. Dokumentasi perilaku dapat dipakai sebagai pedoman implementasi sendiri. Jangan mengekstrak source privat/minified, logo, atau paid screenshot referensi.
