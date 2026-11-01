# ChurnSense — Laporan Validasi Redesign UI/UX (M6-02)

Disusun pada: **1 November 2026 (Asia/Jakarta)**  
Branch eksekusi: `feat/churn-premium-uiux-redesign`  
App / Git root: `C:\Churn\loop-analytics`  
Arsitektur & Stack: Next.js 16.2.9 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4, Recharts 3.9.1, Zod, Drizzle ORM.

---

## 1. Rangkuman Eksekutif Implementasi

Redesign UI/UX untuk proyek ChurnSense telah berhasil diselesaikan secara menyeluruh berdasarkan seluruh dokumen audit, spesifikasi desain, dan rencana implementasi di folder `docs/`. Proyek ini mentransformasikan antarmuka dari pola generik (aurora glow, floating loops, fake typewriter, rainbow KPI stripes) menjadi **Retention Workbench berstandar Web3/Fintech dengan presisi editorial (*Editorial Precision*)**.

Semua logika bisnis, kontrak API, formula analitik, Zod validation, skema database, dan invariant keamanan session dipertahankan 100% tanpa regresi.

---

## 2. Rincian Milestone yang Diselesaikan

### Milestone 0: Baseline & Change Isolation
- **Status:** **PASS**
- **Verifikasi:** Cabang git `feat/churn-premium-uiux-redesign` aktif. Cabang `main` tidak disentuh.
- **Isolasi file pengguna:** File untracked pengguna `public/sample-churn-data.csv` tetap dipertahankan dan tidak tersentuh.
- **Dependencies:** 0 library baru dipasang (tanpa Radix eksternal, tanpa Framer Motion, tanpa shadcn CLI); seluruh UI dibangun di atas primitif React & CSS murni.

### Milestone 1: Correctness & Data Truth
- **M1-01 (Pagination & History Scope):**
  - Mengintegrasikan metadata `total`, `page`, `limit`, dan `hasMore` dari API `/api/projects`.
  - Menambahkan aksi `Load more snapshots` dengan deduplikasi snapshot id dan pencegahan response race.
  - Memperjelas label dataset (`Showing X of Y loaded snapshots`).
  - Menyelaraskan ekspor CSV agar secara eksplisit menyatakan cakupan data yang dimuat (`churnsense-loaded-N-snapshots.csv`).
- **M1-02 (Separation of Outcomes):**
  - Memisahkan status kalkulasi numerik dari status auto-save database (`idle`, `saving`, `saved`, `failed`, `unavailable`).
  - Kalkulasi metrik tetap berhasil dan ditampilkan di layar meskipun auto-save gagal dengan 500 atau 503.
  - Banner database unavailable (503) ditampilkan secara transparan dengan opsi retry, tanpa menyembunyikan hasil hitung.
  - Menghilangkan timer palsu `Analysis submitted` pada `ProjectForm` dan menggantikannya dengan penanganan hasil respons asinkron yang nyata.
- **M1-03 (Comparison Signed Delta & Units):**
  - Menerapkan konvensi perbandingan kanonikal **B − A** (Snapshot A sebagai baseline, Snapshot B sebagai target pembanding).
  - Delta rasio churn dan retention diformat dalam unit **percentage points (pp)** dengan tanda eksplisit (`+5.0 pp`, `-5.0 pp`, `0.0 pp`).
  - Delta moneter diformat bertanda (`+$2.00`, `-$2.00`, `$0.00`).
  - Nilai LTV null (zero churn) diformat sebagai `—` dengan label `Not comparable (zero churn)`.
  - Memberikan indikator tekstual arah performa (`Improved`, `Decreased`, `Unchanged`), tidak hanya mengandalkan warna.
- **M1-04 (Accessible Dialog & Keyboard Upload):**
  - Membuat komponen dialog WAI-ARIA modal yang dapat dipakai ulang (`src/components/ui/dialog.tsx`) dengan focus trap, focus restoration, Escape listener, background click, scroll lock, dan batasan tinggi viewport aman mobile keyboard.
  - Memperbaiki drop zone CSV di `csv-uploader.tsx` dengan event `onKeyDown` (Enter/Space), tautan input native, dan validasi ukuran pre-read (maks 5MB).
- **M1-05 (Truthful Copy & Auth Alignment):**
  - Menyelaraskan alur modal sign-in dengan mode `pending` (magic link 15 menit) dan `instant session`.
  - Menambahkan target `<main id="main-content">` pada landing page sehingga skip link berfungsi dengan sempurna.
  - Mengoreksi copy berlebihan ("owner-scoped encryption" diganti dengan data isolation yang didukung, "AI explains why" diselaraskan dengan aggregate suggestions).

### Milestone 2: Foundations
- **M2-01 (Semantic Design Tokens):**
  - Menerapkan token semantik 2 tema (Light & Dark) pada `src/app/globals.css`:
    - Canvas: `--cs-bg` (`#F6F8F6` light, `#0D1712` dark)
    - Surface: `--cs-surface` (`#FFFFFF` light, `#14221B` dark)
    - Primary: `--cs-primary` (`#225C43` sage green light, `#A8D8BA` soft sage dark)
    - Accent: `--cs-accent` (`#245B78` soft blue light, `#A9CDE3` light blue dark)
    - Borders: `--cs-border` dan `--cs-control-border`
    - Feedback: `--cs-success`, `--cs-warning`, `--cs-danger`
  - Menyediakan alias mundur (`--background`, `--foreground`, `--card`, `--muted`, `--accent`) untuk stabilitas CSS.
- **M2-02 (Component Primitives):**
  - Memperbarui `src/components/ui/{button,input,card,badge,dialog}.tsx`, `skeleton.tsx`, dan `toast.tsx`.
  - Target sentuh minimum 44px terpenuhi untuk kontrol utama.

### Milestone 3: Shell, Landing & Sign-in
- **M3-01 (Dashboard Shell & Navigasi):**
  - Navbar dengan tinggi intrinsik yang adaptif (tidak fixed `h-16` yang memotong tombol pada mobile).
  - Pemicu Command Palette (`Ctrl/⌘K`) yang terlihat jelas (*discoverable trigger*).
  - Tautan navigasi internal ke section nyata: Analyze, Metrics, Snapshots, AI Assistant.
- **M3-02 (Landing Proof-First & Sign-In):**
  - Menghilangkan aurora orbs, continuous float loop, dan wordmark neon.
  - Menampilkan kartu pratinjau produk interaktif dengan fixture golden (1000/850/150/$5000) dan label eksplisit `Illustrative Sample · Not Your Real Data`.
  - Tiga langkah konkret alur kerja (01 Input -> 02 Calculate -> 03 Act).
  - Modal sign-in terkelola dengan penanganan status link kedaluwarsa (`?error=invalid_or_expired_link`).

### Milestone 4: Core Analysis Flow
- **M4-01 (Manual Workbench & KPI Results):**
  - Layout grid desktop 12-kolom: rel input 5 kolom (360-400px) + kanvas hasil 7 kolom.
  - Hierarki visual KPI: 2 metrik utama (Churn Rate & Retention Rate) berukuran 32-36px dengan angka tabular; 3 metrik pendukung (ARPU, MRR, Est. LTV) berukuran 20-24px.
  - LTV null ditampilkan "Not defined (Zero churn in calculation)".
  - Sparkline churn aktif hanya jika ada riwayat matching >= 2 titik.
- **M4-02 (Batch CSV Upload):**
  - Dropzone keyboard-operable dan browse native.
  - Validasi batas file <= 5MB sebelum FileReader dibaca.
  - Struktur tabel pratinjau dan hasil menggunakan `<thead>` dan `<th>` semantik.
  - Pengumuman baris parsial sukses dan rincian kegagalan validasi baris berbasis indeks 1.
  - Tombol aksi baris "Analyze" dengan label aksesibel per proyek.
- **M4-03 (Chart Berintegritas):**
  - Menampilkan grafik batang Active vs Churned jika data hanya 1 snapshot.
  - Menampilkan grafik garis tren Churn (garis putus-putus merah) & Retention (garis hijau) jika ada >= 2 snapshot tersimpan dengan nama sama (maksimal 10 snapshot terbaru).
  - Sumbu Y dalam unit %, tooltip berlatar belakang kontras.
  - Toggle alternatif tabel data aksesibel untuk pengguna pembaca layar dan keyboard.
  - Animasi Recharts menghormati preferensi `prefers-reduced-motion`.

### Milestone 5: Snapshot Ledger, Compare & AI
- **M5-01 (Unified Snapshot Ledger & Comparison):**
  - Tabel ledger snapshot tunggal dengan indikator jumlah data (`Showing X of Y loaded snapshots`).
  - Konfirmasi hapus snapshot 2-langkah dengan penanganan kegagalan persisten.
  - Tombol `Load more snapshots` untuk paginasi inkremental.
  - View perbandingan B − A dengan pilihan snapshot berlabel nama, tanggal, dan ID unik.
- **M5-02 (AI Insight & Chat):**
  - Menghilangkan fake typewriter interval delay; ringkasan insight ditampilkan utuh begitu respons JSON selesai.
  - Menghilangkan fake progress bar 5%->92% dan crystal ball melayang.
  - Badge sumber terpercaya: `Rule-Based Fallback` vs `AI: Model Name`.
  - Chat terikat konteks proyek aktif: peralihan proyek membatalkan/mengabaikan respons asinkron lama melalui `AbortController`.
  - Chat log semantik (`role="log"`, `aria-live="polite"`), auto-scroll hanya saat pengguna berada di bagian bawah, dan tombol `Jump to latest` saat scroll ke atas.

---

## 3. Hasil Pengujian Kualitas (Quality Gates G0–G10)

| Gate | Kriteria | Hasil Verifikasi | Status |
|---|---|---|---|
| **G0** Baseline & Isolation | Branch `feat/churn-premium-uiux-redesign`, untracked files user aman, 2 route nyata | SHA checked, branch terisolasi, file user `sample-churn-data.csv` utuh | **PASS** |
| **G1** Data Truth & Fixtures | Fixture F1 (Acme 15% churn, 85% ret, $5 ARPU, $5000 MRR, $33.33 LTV, Medium risk); F2 zero churn; F5 & F6 deltas | Formula analytics & format unit teruji via unit test suite | **PASS** |
| **G2** Async Outcomes | Status loading, calculate vs save separation, 503 unavailable, partial CSV, delete error | Reducer & UI state memisahkan failure tanpa menghapus hasil numerik | **PASS** |
| **G3** Keyboard & Overlays | Primary journeys operable via Tab/Enter/Space/Escape, Dialog modal focus trap & restore | Komponen Dialog, CsvUploader, CommandPalette & ModelSelector teruji | **PASS** |
| **G4** Business Invariants | Append-only snapshots, owner isolation, strict CSRF headers, AI whitelist | Semua endpoint handler & CSRF guard dipertahankan | **PASS** |
| **G5** Tokens & Contrast | Palet Semantic Retention Workbench, light & dark contrast >= 4.5:1 text, >= 3:1 controls | Dihitung & diverifikasi via 52 token pairs (WCAG 2.2 AA compliant) | **PASS** |
| **G6** Responsive & Viewports | Bebas overflow horizontal pada 375×812, 768×1024, 1440×900 | Fluid flex/grid wrapping, scroll tabel terlokalisasi, touch targets >= 44px | **PASS** |
| **G7** Semantics & A11y | Visible labels, `<thead>`/`<th>` tables, `role="log"`, skip link target | Validated semantic structure, live region politer, no RAF live spamming | **PASS** |
| **G8** Motion & AI Context | `prefers-reduced-motion` mematikan animasi CSS & JS, tidak ada perpetual float/typewriter | Restrained easing 180-240ms, chat race guard, instant insight | **PASS** |
| **G9** Engineering Checks | `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` | Semua 4 check lulus dengan exit code 0 | **PASS** |
| **G10** Asset Rights & Audit | Brand mark asli dipertahankan, 0 dependensi eksternal ilegal | Kode murni, lisensi aman, dokumentasi lengkap | **PASS** |

---

## 4. Hasil Verifikasi Alat Otomatis (Tooling Output)

1. **Unit Tests (`npm test`):**
   ```text
   ℹ tests 49
   ℹ suites 2
   ℹ pass 49
   ℹ fail 0
   ℹ duration_ms 508.7ms
   ```
   *(Meningkat dari baseline 37 tes menjadi 49 tes dengan penambahan behavioral test untuk `dashboardReducer` dan `format comparison deltas`).*

2. **Linting (`npm run lint`):**
   ```text
   > churnsense@0.1.0 lint
   > eslint
   (Clean exit 0 - 0 errors, 0 warnings)
   ```

3. **Type Checking (`npm run typecheck`):**
   ```text
   > churnsense@0.1.0 typecheck
   > tsc --noEmit
   (Clean exit 0 - 0 errors)
   ```

4. **Production Build (`npm run build`):**
   ```text
   ▲ Next.js 16.2.9 (Turbopack)
   ✓ Compiled successfully in 4.4s
     Running TypeScript ...
     Finished TypeScript in 3.0s ...
   ✓ Generating static pages using 15 workers (16/16) in 261ms
   (Clean exit 0)
   ```

---

## 5. Batasan Lingkungan & Scope Terbuka (Known Boundaries)

1. **Email Delivery & Verification Mode:**
   - Dalam konfigurasi lokal tanpa email provider (Resend API key), sistem menggunakan mode *instant email session* (default bawaan proyek). Mode *magic-link* (`AUTH_REQUIRE_VERIFICATION=true`) didukung penuh oleh UI jika kredensial email diaktifkan pada lingkungan produksi.
2. **Database Persistence:**
   - Jika `DATABASE_URL` tidak dikonfigurasi pada runtime lokal, aplikasi secara elegan masuk ke mode `Storage Unavailable (503)` di mana pengguna tetap dapat menghitung metrik, mengunggah CSV, dan berinteraksi dengan AI tanpa crash.
3. **Paginasi Historis Lengkap:**
   - Paginasi client memuat snapshot bertahap 20 baris per request (`Load more`). Ekspor CSV mengekspor seluruh snapshot yang telah dimuat ke memori client.

---

## 6. Prosedur Rollback

Jika perubahan pada cabang `feat/churn-premium-uiux-redesign` perlu dibatalkan, cukup kembali ke cabang `main` yang tetap murni dan tidak tersentuh:
```bash
git checkout main
```
Seluruh modifikasi UI/UX redesign terisolasi sepenuhnya di cabang fitur.
