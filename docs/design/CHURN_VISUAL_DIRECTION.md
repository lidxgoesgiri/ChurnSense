# ChurnSense — visual direction

Tanggal: 31 Oktober 2026 (Asia/Jakarta). Status: **PROPOSED / siap dijadikan arah implementasi**, bukan hasil redesign yang sudah dirender. Baca [audit proyek](../audits/CHURN_PROJECT_AUDIT.md), [audit UI](../audits/CHURN_UIUX_AUDIT.md), dan [riset web](../research/WEB_DESIGN_REFERENCES.md).

## Kontrak produk

ChurnSense membantu pemilik/operator SaaS memasukkan hitungan pengguna dan revenue bulanan, menghitung metrik, menyimpan snapshot, membandingkan hasil, serta meminta penjelasan AI. Persona operator SaaS adalah **inferred** dari fungsi produk; belum ada wawancara pengguna. Produk bukan platform blockchain dan belum memiliki event analytics, periode bisnis eksplisit, cohort, billing integration, team workspace, atau predictive churn model. Jangan menambahkan fitur tersebut untuk membuat dashboard terlihat lengkap.

Job utama: **masukkan data → pahami kesehatan retensi → ketahui apakah tersimpan → tentukan tindakan**. Pekerjaan sekunder: import batch, telusuri snapshot, bandingkan, ekspor, dan diskusi AI. Dua URL halaman yang nyata: `/` dan `/dashboard`; rincian lain adalah state/section dalam halaman.

Bahasa antarmuka tetap Inggris sesuai `src/app/layout.tsx` dan copy saat ini. Dokumen handoff berbahasa Indonesia. Pertahankan logo lokal `public/churn.jpg`; jangan mengganti identitas menjadi Linear/Stripe atau memakai aset pihak lain. Light dan dark dipertahankan karena kedua mode sudah ada, tanpa menambah tema lain.

## Perbandingan tiga arah

| Arah | Karakter/type/palette/layout | Referensi dan penerapan nyata | Kelebihan UX | Biaya/risiko | Keputusan |
|---|---|---|---|---|---|
| Editorial Precision | Hierarki judul kuat, grid sejajar, angka dominan, whitespace terukur; Plus Jakarta Sans; sage netral + blue; satu panel hasil utama | [Vercel Geist typography](https://vercel.com/geist/typography): peran type dan tabular numbers; [Resend](https://resend.com/): penjelasan produk yang langsung menuju tindakan | Landing lebih jelas; hasil metrik menjadi pusat perhatian | Headline terlalu besar akan mengurangi kepadatan; editorial penuh kurang cocok untuk tabel panjang | Dipakai sebagai lapisan hierarchy, bukan arah utama |
| Premium Futuristic | Dark dominan, detail geometri, tint/depth terbatas, reveal singkat; aksen terang terkendali | [Linear](https://linear.app/), [Framer](https://www.framer.com/): referensi craft dan presentasi produk, **tampilan/motion aktual belum terverifikasi visual** | Bisa memberi kepribadian dan kesan responsif | Aura/neon/typewriter sudah mendominasi source; blur besar dan continuous motion menambah distraksi, contrast dan rendering risk | Ditolak sebagai sistem utama; hanya feedback interaksi yang berguna dipertahankan |
| Product-Led Minimalism | Data-first, padat tetapi tenang, tabel semantik, warna sebagai sinyal; Plus Jakarta; sage/blue; workbench tanpa sidebar kosong | [ChartMogul](https://chartmogul.com/), [Baremetrics](https://baremetrics.com/): metrik + konteks; [Stripe analytics](https://docs.stripe.com/billing/subscriptions/analytics): pemisahan chart/table/export; [Linear filters](https://linear.app/docs/filters): scope hasil eksplisit | Cocok dengan input→metrics→history; gampang dipakai berulang; tidak mengaburkan kegagalan data | Butuh disiplin state dan label dataset; minimalisme tanpa hierarchy bisa datar | **PRIMARY**, dengan ketelitian editorial |

Referensi di atas mendukung pola informasi dari halaman/dokumentasi yang diperiksa; tidak ada klaim ukuran, font, atau animasi situs tersebut telah diukur. Spesifikasi angka di dokumen desain adalah target ChurnSense.

## Keputusan final: Retention Workbench

Gunakan **Product-Led Minimalism dengan Editorial Precision** untuk membuat kesehatan retensi terbaca cepat, dengan motif **snapshot ledger**: angka utama, timestamp/scope yang dekat, lalu bukti dalam tabel dan chart. Tiga atribut: **presisi, tenang, dapat ditelusuri**.

Motif ini berasal dari model data nyata: setiap penyimpanan membuat snapshot baru, bukan memperbarui project object. Autosave analisis bersifat best-effort dan dapat gagal; UI wajib membedakan hasil hitung dan hasil simpan. Daftar harus membantu membedakan dua snapshot bernama sama. Jangan menyatakan timestamp penyimpanan sebagai periode bisnis; schema belum menyediakan periode tersebut. Jangan memakai cohort heatmap atau kalender dummy sebagai dekorasi.

- **Brand:** sage green untuk aksi dan identitas; pastel blue untuk konteks/penjelasan; risk tetap memiliki label Low/Medium/High. Tanaman/logo tidak perlu dianimasikan.
- **Type:** pertahankan Plus Jakarta Sans yang sudah dimuat `next/font/google`; data memakai `font-variant-numeric: tabular-nums`. Tidak ada font/dependency baru.
- **Palette:** light canvas off-white kehijauan, surface opaque; dark canvas forest/charcoal, surface terangkat halus. Lihat nilai dan contrast di [design system](CHURN_DESIGN_SYSTEM.md).
- **Layout:** landing memakai komposisi produk dan contoh metrik, bukan deretan klaim abstrak. Dashboard memakai topbar + section links; form 360px dan result fleksibel di desktop lebar, satu kolom di layar lebih kecil. Sidebar permanen tidak dibutuhkan untuk dua route.
- **Density:** input dan hasil di atas; visualisasi mendukung hasil; AI tidak menggeser data utama. History dan retention table memakai dataset/scope yang sama walaupun punya representasi berbeda.
- **Depth:** border dekoratif, satu surface opaque, shadow hanya overlay; kartu metrik tidak terangkat saat hover bila tidak bisa diklik.
- **Motion:** feedback 120–180ms, dialog ≤180ms, chart update ≤240ms bila berguna; tidak ada aurora, text-gradient bergerak, float berulang, atau fake progress persen.

## Perubahan konkret per surface

| Surface | Sekarang, dari source | Target |
|---|---|---|
| Landing `/` | Hero centered, logo float, aurora, emoji cards berulang, klaim encryption/WHY | Header ringkas; headline konkret + preview metrik berlabel sample; satu CTA sign-in; tiga langkah input→metrics→action; bukti fitur tanpa klaim yang melampaui aggregate data |
| Sign-in | Modal visual tanpa kontrak dialog lengkap | Dialog bernama, fokus terkelola, error dekat field, pending hanya ketika API mengembalikan pending, informasi expired link yang dapat dipulihkan |
| Dashboard awal | Form setara AI kosong, banner shortcut besar | Judul dan konteks; input dominan; empty result ringkas; shortcut sebagai kontrol command yang dapat ditemukan |
| Hasil analisis | Lima KPI kecil dengan gradient stripe, risk glow | Churn dan retention sebagai angka utama; ARPU/MRR/Est.LTV sebagai pendukung; hasil hitung terpisah dari status penyimpanan |
| History/comparison | Dua daftar + selector bekerja dari 20 data tanpa scope, negative sign hilang | Scope dan pagination jelas; identitas snapshot+tanggal; signed delta dan unit pp; ekspor menyatakan cakupan yang benar |
| AI | Typewriter buatan setelah JSON, model glow, chat di seluruh lebar | AI insight berlabel sumber; penjelasan berbasis aggregate counts; chat dengan konteks proyek, model di dekat AI, status stream yang tidak memalsukan progres |

## Aturan kemiripan referensi

Targetnya **close structural match** pada susunan data/context/action dan **interaction match** pada dialog/keyboard. Tidak ada pixel-parity claim karena screenshot referensi belum tersedia. Ukuran responsive adalah desain yang diusulkan, bukan perilaku situs referensi yang terukur. Jangan mengambil logo, paid imagery, proprietary screenshots, atau source minified. Bangun ulang pola dengan komponen lokal. Rekomendasi ini tidak mengharuskan Radix, shadcn, Motion, atau chart library baru.

## Batas verifikasi dan kesiapan

Source dibaca, teks landing deployment dapat diakses lewat AX browser; kesamaan SHA deployment dengan working tree belum diverifikasi. Screenshot gagal karena origin approval review browser timeout; bukan keputusan bahwa halaman tidak aman. Tidak ada dashboard authenticated, keyboard runtime, responsive render, Lighthouse, INP lapangan, atau screen-reader audit pada fase ini. Arah ini siap untuk implementasi bertahap; persetujuan kualitas visual harus menunggu evidence gate Gemini.
