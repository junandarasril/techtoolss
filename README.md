# TechTools Aceh — Marketplace Peralatan Teknisi Elektronik

SPA/PWA statis (HTML5, CSS3, Vanilla JavaScript) untuk katalog peralatan servis smartphone
Android, iPhone, dan laptop dari toko lokal Aceh. Tanpa build step dan tanpa backend.

## Menjalankan

Buka `index.html` langsung di browser, atau sajikan lewat server statis:

```bash
python3 -m http.server 3000
# lalu buka http://localhost:3000
```

## Deploy (Vercel)

Proyek ini situs statis, bukan aplikasi Next.js. `vercel.json` mengunci Framework Preset ke
**Other** (`"framework": null`), mematikan build/install command, dan menyajikan direktori root
apa adanya — jadi tidak ada lagi `next build` maupun error `NEXT_NO_VERSION`.

## Akun demo

| Peran | Username | Password | Akses |
| --- | --- | --- | --- |
| Admin | `admin` | `admin` | Moderasi katalog, manajemen penjual & kategori, statistik |
| Penjual | `berkah` | `seller123` | Dashboard toko (Berkah Teknik Banda Aceh) |
| Penjual | `gadgetcare` | `seller123` | Gadget Care Lhokseumawe |
| Penjual | `serviscenter` | `seller123` | Servis Center Meulaboh |
| Penjual | `acehtools` | `seller123` | Aceh Tools Supply |

Pembeli tidak perlu login. Login penjual/admin lewat tombol **Masuk** di header.

## Fitur

- Katalog publik: hero, 10 kategori, produk terbaru, produk populer, rekomendasi paket pemula.
- Pencarian real-time (nama, merek, perangkat, deskripsi, toko) dan filter kategori,
  jenis perangkat, rentang harga, merek, ketersediaan stok, plus sorting harga/terbaru.
- Modal detail produk lengkap dengan tombol **Pesan via WhatsApp**
  (`https://wa.me/62...?text=...`, pesan otomatis berisi nama produk dan harga).
- Registrasi & login penjual, dashboard penjual untuk CRUD produk, upload foto (dikompres
  via canvas ke JPEG), pengaturan nama toko, lokasi, dan nomor WhatsApp.
- Dashboard admin: 5 kartu statistik, moderasi semua produk (tambah/edit/hapus,
  tandai populer & rekomendasi), manajemen penjual (tambah/edit/aktif-nonaktif/hapus),
  manajemen kategori, dan reset data demo.
- Hak akses: rute `#/seller` dan `#/admin` diproteksi sesi; data penjual dibatasi ke tokonya.

## Data & penyimpanan

Data awal (*pre-seeded*): 15 produk di seluruh 10 kategori dari 4 toko (Banda Aceh,
Lhokseumawe, Meulaboh) disimpan di `localStorage`:

- `ttaceh.products.v1`
- `ttaceh.sellers.v1`
- `ttaceh.categories.v1`
- `ttaceh.session.v1`
- `ttaceh.waClicks.v1`

Hapus semua kunci tersebut (atau gunakan **Reset Data Demo** di dashboard admin) untuk
mengembalikan data awal. Catatan: data disimpan per-browser, bukan database bersama.

## Struktur

```
index.html               # shell SPA (topbar, header, footer, modal root)
css/styles.css           # seluruh styling responsif
js/store.js              # seed data, persistensi localStorage, util (Rupiah, WhatsApp, gambar)
js/app.js                # routing hash, katalog, detail produk, login/registrasi
js/dashboard.js          # dashboard penjual & admin, form produk/penjual/kategori
manifest.webmanifest     # metadata PWA
vercel.json              # konfigurasi deploy statis (framework: null)
assets/icon.svg          # ikon aplikasi
```
