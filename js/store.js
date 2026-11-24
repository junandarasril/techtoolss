/* TechTools Aceh — data layer, seed, helpers, shared registries. */
(function () {
  'use strict';

  const NS = (window.TT = window.TT || {});
  NS.actions = NS.actions || {};
  NS.forms = NS.forms || {};

  const KEYS = {
    products: 'ttaceh.products.v1',
    sellers: 'ttaceh.sellers.v1',
    categories: 'ttaceh.categories.v1',
    session: 'ttaceh.session.v1',
    clicks: 'ttaceh.waClicks.v1',
    seeded: 'ttaceh.seeded.v1'
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      if (NS.toast) NS.toast('Penyimpanan browser penuh. Coba foto produk yang lebih kecil.', 'error');
      return false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Seed data                                                          */
  /* ------------------------------------------------------------------ */

  const DEFAULT_CATEGORIES = [
    { id: 'cat-01', nama: 'Precision Screwdriver', slug: 'precision-screwdriver', deskripsi: 'Obeng presisi berujung kecil untuk membuka sekrup halus pada smartphone dan laptop.' },
    { id: 'cat-02', nama: 'Opening Tools', slug: 'opening-tools', deskripsi: 'Alat pembuka casing, layar, dan penutup bodi perangkat tanpa merusak klip.' },
    { id: 'cat-03', nama: 'Tweezers', slug: 'tweezers', deskripsi: 'Pinset teknisi untuk menjepit komponen, kabel fleksibel, dan sekrup mikro.' },
    { id: 'cat-04', nama: 'Pry Tools', slug: 'pry-tools', deskripsi: 'Alat congkel plastik untuk mengangkat konektor dan komponen dari mainboard.' },
    { id: 'cat-05', nama: 'Suction Tools', slug: 'suction-tools', deskripsi: 'Alat pengangkat layar dengan pompa vakum agar panel LCD tidak retak.' },
    { id: 'cat-06', nama: 'Soldering Tools', slug: 'soldering-tools', deskripsi: 'Solder, timah, dan perlengkapan penyolderan komponen tingkat presisi.' },
    { id: 'cat-07', nama: 'Multimeter', slug: 'multimeter', deskripsi: 'Alat ukur kelistrikan untuk mengecek tegangan, arus, dan jalur komponen.' },
    { id: 'cat-08', nama: 'Microscope', slug: 'microscope', deskripsi: 'Mikroskop pemeriksaan komponen dan jalur mikro pada mainboard.' },
    { id: 'cat-09', nama: 'Cleaning Tools', slug: 'cleaning-tools', deskripsi: 'Perlengkapan pembersih perangkat: cairan IPA, kuas, dan kain microfiber.' },
    { id: 'cat-10', nama: 'Repair Accessories', slug: 'repair-accessories', deskripsi: 'Aksesoris pendukung servis seperti mat magnet, kabel jumper, dan pelindung ESD.' }
  ];

  const DEFAULT_SELLERS = [
    {
      id: 'slr-01', toko: 'Berkah Teknik Banda Aceh', lokasi: 'Banda Aceh',
      wa: '6281170123456', username: 'berkah', password: 'seller123',
      aktif: true, createdAt: '2025-02-04T03:00:00.000Z'
    },
    {
      id: 'slr-02', toko: 'Gadget Care Lhokseumawe', lokasi: 'Lhokseumawe',
      wa: '6285270112233', username: 'gadgetcare', password: 'seller123',
      aktif: true, createdAt: '2025-04-18T03:00:00.000Z'
    },
    {
      id: 'slr-03', toko: 'Servis Center Meulaboh', lokasi: 'Meulaboh',
      wa: '6281360455667', username: 'serviscenter', password: 'seller123',
      aktif: true, createdAt: '2025-06-09T03:00:00.000Z'
    },
    {
      id: 'slr-04', toko: 'Aceh Tools Supply', lokasi: 'Banda Aceh',
      wa: '6281988776655', username: 'acehtools', password: 'seller123',
      aktif: true, createdAt: '2025-08-21T03:00:00.000Z'
    }
  ];

  const DEFAULT_PRODUCTS = [
    {
      id: 'prd-01', foto: 'assets/products/prd-01.jpg', nama: 'Obeng Presisi Jakemy JM-8150 (25 in 1)',
      kategori: 'Precision Screwdriver', merek: 'Jakemy', harga: 135000, stok: 22,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Set obeng presisi 25 bit dengan gagang putar 360° dan ujung magnetik. Bit S2 hardened cocok untuk membuka sekrup Phillips, Torx, dan Pentalobe pada smartphone maupun laptop. Dilengkapi extension shaft fleksibel untuk menjangkau sekrup yang tersembunyi.',
      sellerId: 'slr-01', populer: true, rekomendasi: true, createdAt: '2026-10-02T02:00:00.000Z'
    },
    {
      id: 'prd-02', foto: 'assets/products/prd-02.jpg', nama: 'Obeng Presisi 25 in 1 Kaisi K-8125',
      kategori: 'Precision Screwdriver', merek: 'Kaisi', harga: 98000, stok: 15,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Obeng presisi ekonomis untuk teknisi pemula. 25 bit magnetik tersimpan rapi di dalam gagang, ringan dibawa, dan aman digunakan untuk bongkar pasang bodi perangkat sehari-hari. Ujung bit tidak mudah aus untuk pemakaian rutin.',
      sellerId: 'slr-04', populer: false, rekomendasi: true, createdAt: '2026-09-24T02:00:00.000Z'
    },
    {
      id: 'prd-03', foto: 'assets/products/prd-03.jpg', nama: 'Set Pembuka Casing Kaisi K-8160',
      kategori: 'Opening Tools', merek: 'Kaisi', harga: 76000, stok: 18,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Sepuluh alat pembuka berbahan plastik keras untuk membuka casing belakang, layar, dan penutup baterai tanpa menggores bodi. Termasuk pisau plastik tipis untuk celah layar dan spatula lebar untuk klip bodi laptop.',
      sellerId: 'slr-02', populer: true, rekomendasi: false, createdAt: '2026-09-15T02:00:00.000Z'
    },
    {
      id: 'prd-04', foto: 'assets/products/prd-04.jpg', nama: 'Pinset Anti-Statis Vetus ESD-15',
      kategori: 'Tweezers', merek: 'Vetus', harga: 45000, stok: 30,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Pinset stainless ESD-15 dengan ujung runcing dan presisi untuk menjepit komponen SMD, konektor fleksibel, dan sekrup mikro. Bahan anti-statis melindungi IC dari kerusakan akibat listrik statis saat pengerjaan mainboard.',
      sellerId: 'slr-01', populer: true, rekomendasi: true, createdAt: '2026-09-04T02:00:00.000Z'
    },
    {
      id: 'prd-05', foto: 'assets/products/prd-05.jpg', nama: 'Pry Tool Plastik Kaisi 3 PCS',
      kategori: 'Pry Tools', merek: 'Kaisi', harga: 32000, stok: 40,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Tiga alat congkel berbahan nilon fleksibel dengan berbagai bentuk ujung untuk mengangkat konektor baterai, flex cable, dan kamera. Nilon tidak konduktif sehingga aman di area komponen yang masih beraliran listrik.',
      sellerId: 'slr-03', populer: false, rekomendasi: true, createdAt: '2026-08-30T02:00:00.000Z'
    },
    {
      id: 'prd-06', foto: 'assets/products/prd-06.jpg', nama: 'Suction Cup Layar 9 cm + Handle Aluminium',
      kategori: 'Suction Tools', merek: 'Jakemy', harga: 55000, stok: 12,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Alat pengangkat layar dengan pompa vakum kuat dan gagang aluminium. Membantu menarik panel LCD secara perlahan agar tidak retak saat penggantian digitizer. Cocok untuk layar smartphone dan panel belakang perangkat.',
      sellerId: 'slr-02', populer: false, rekomendasi: false, createdAt: '2026-08-22T02:00:00.000Z'
    },
    {
      id: 'prd-07', foto: 'assets/products/prd-07.jpg', nama: 'Solder Station Quick 969 + Handle 907',
      kategori: 'Soldering Tools', merek: 'Quick', harga: 685000, stok: 6,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Solder station digital dengan pengatur suhu 200–480°C, pemanasan cepat, dan elemen keramik. Stabil untuk pekerjaan reballing ringan, penggantian konektor charging, serta penyolderan komponen pada mainboard smartphone maupun laptop.',
      sellerId: 'slr-01', populer: true, rekomendasi: false, createdAt: '2026-08-12T02:00:00.000Z'
    },
    {
      id: 'prd-08', foto: 'assets/products/prd-08.jpg', nama: 'Timah Solder 63/37 0.6 mm 50 gram',
      kategori: 'Soldering Tools', merek: 'Mechanic', harga: 38000, stok: 25,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Timah solder eutectic 63/37 diameter 0,6 mm dengan flux inti. Titik leleh rendah sehingga cocok untuk komponen kecil dan konektor halus. Hasil sambungan mengkilap dan minim gumpalan.',
      sellerId: 'slr-04', populer: false, rekomendasi: false, createdAt: '2026-08-05T02:00:00.000Z'
    },
    {
      id: 'prd-09', foto: 'assets/products/prd-09.jpg', nama: 'Multimeter Digital Sunshine DT-9205A',
      kategori: 'Multimeter', merek: 'Sunshine', harga: 165000, stok: 10,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Multimeter digital dengan fungsi pengukuran tegangan DC/AC, arus, resistansi, kapasitansi, dan uji dioda. Layar LCD besar dan probe presisi untuk menelusuri jalur mati pada mainboard serta mengecek adaptor charger.',
      sellerId: 'slr-03', populer: true, rekomendasi: false, createdAt: '2026-07-28T02:00:00.000Z'
    },
    {
      id: 'prd-10', foto: 'assets/products/prd-10.jpg', nama: 'Multimeter Digital ANENG AN8008',
      kategori: 'Multimeter', merek: 'ANENG', harga: 285000, stok: 0,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Multimeter true RMS dengan akurasi tinggi dan auto range. Dilengkapi mode pengukuran frekuensi serta kapasitansi, ideal untuk diagnosa jalur charging dan komponen power pada perangkat modern.',
      sellerId: 'slr-02', populer: false, rekomendasi: false, createdAt: '2026-07-19T02:00:00.000Z'
    },
    {
      id: 'prd-11', foto: 'assets/products/prd-11.jpg', nama: 'Mikroskop Trinocular 7X–45X + Lampu LED',
      kategori: 'Microscope', merek: 'Relife', harga: 2450000, stok: 2,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Mikroskop trinocular dengan perbesaran 7X–45X, lampu LED adjustable, dan port kamera untuk dokumentasi pekerjaan. Wajib untuk inspeksi jalur mikro, reballing IC, serta perbaikan short pada mainboard.',
      sellerId: 'slr-01', populer: true, rekomendasi: false, createdAt: '2026-07-10T02:00:00.000Z'
    },
    {
      id: 'prd-12', foto: 'assets/products/prd-12.jpg', nama: 'Cairan Pembersih IPA 99% 500 ml',
      kategori: 'Cleaning Tools', merek: 'Relife', harga: 45000, stok: 35,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Isopropyl alcohol 99% untuk membersihkan sisa flux, korosi ringan, dan noda pada mainboard maupun layar. Cepat menguap dan tidak meninggalkan residu, aman untuk komponen elektronik.',
      sellerId: 'slr-04', populer: false, rekomendasi: true, createdAt: '2026-06-30T02:00:00.000Z'
    },
    {
      id: 'prd-13', foto: 'assets/products/prd-13.jpg', nama: 'Magnetic Screw Mat + Pad Servis',
      kategori: 'Repair Accessories', merek: 'Mechanic', harga: 65000, stok: 20,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Mat magnetik untuk menahan sekrup agar tidak tercecer, lengkap dengan panduan posisi sekrup dan bantalan anti-gores untuk meja servis. Membantu teknisi mengingat urutan bongkar pasang dengan rapi.',
      sellerId: 'slr-02', populer: false, rekomendasi: true, createdAt: '2026-06-21T02:00:00.000Z'
    },
    {
      id: 'prd-14', foto: 'assets/products/prd-14.jpg', nama: 'Kabel Jumper B500 0,1 mm 100 m',
      kategori: 'Repair Accessories', merek: 'Vetus', harga: 85000, stok: 8,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Kabel jumper enamel halus untuk menyambung jalur mainboard yang putus atau menghubungkan titik tes. Isolasi tipis dan lentur sehingga mudah mengikuti jalur komponen mikro.',
      sellerId: 'slr-03', populer: false, rekomendasi: false, createdAt: '2026-06-12T02:00:00.000Z'
    },
    {
      id: 'prd-15', foto: 'assets/products/prd-15.jpg', nama: 'Brush Anti-Static ESD + Kuas Pembersih',
      kategori: 'Cleaning Tools', merek: 'Jakemy', harga: 28000, stok: 50,
      kompatibilitas: ['Android', 'iPhone', 'Laptop'],
      deskripsi: 'Set kuas anti-statis untuk membersihkan debu pada bodi, speaker, dan area kamera. Bahan lembut tidak melukai panel dan tidak meninggalkan goresan pada casing.',
      sellerId: 'slr-04', populer: false, rekomendasi: false, createdAt: '2026-06-02T02:00:00.000Z'
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Seeding                                                            */
  /* ------------------------------------------------------------------ */

  /** Seed product id -> catalog photo, used to backfill photos on stored data. */
  const SEED_PHOTOS = DEFAULT_PRODUCTS.reduce((map, product) => {
    map[product.id] = product.foto;
    return map;
  }, {});

  /** Give seeded products their catalog photo without touching seller-uploaded ones. */
  function applySeedPhotos() {
    const list = read(KEYS.products, null);
    if (!Array.isArray(list)) return;
    let changed = false;
    const next = list.map((product) => {
      if (!product || product.foto || !SEED_PHOTOS[product.id]) return product;
      changed = true;
      return Object.assign({}, product, { foto: SEED_PHOTOS[product.id] });
    });
    if (changed) write(KEYS.products, next);
  }

  function ensureSeed() {
    const seeded = read(KEYS.seeded, false);
    if (seeded) {
      if (!Array.isArray(read(KEYS.categories, null))) write(KEYS.categories, DEFAULT_CATEGORIES);
      if (!Array.isArray(read(KEYS.sellers, null))) write(KEYS.sellers, DEFAULT_SELLERS);
      if (!Array.isArray(read(KEYS.products, null))) write(KEYS.products, DEFAULT_PRODUCTS);
      applySeedPhotos();
      return;
    }
    write(KEYS.categories, DEFAULT_CATEGORIES);
    write(KEYS.sellers, DEFAULT_SELLERS);
    write(KEYS.products, DEFAULT_PRODUCTS);
    write(KEYS.clicks, 0);
    write(KEYS.seeded, true);
    applySeedPhotos();
  }

  function resetDemo() {
    localStorage.removeItem(KEYS.session);
    write(KEYS.categories, DEFAULT_CATEGORIES);
    write(KEYS.sellers, DEFAULT_SELLERS);
    write(KEYS.products, DEFAULT_PRODUCTS);
    write(KEYS.clicks, 0);
    write(KEYS.seeded, true);
  }

  /* ------------------------------------------------------------------ */
  /* Accessors                                                          */
  /* ------------------------------------------------------------------ */

  const store = {
    keys: KEYS,
    ensureSeed,
    resetDemo,
    getProducts: () => read(KEYS.products, DEFAULT_PRODUCTS),
    saveProducts: (list) => write(KEYS.products, list),
    getSellers: () => read(KEYS.sellers, DEFAULT_SELLERS),
    saveSellers: (list) => write(KEYS.sellers, list),
    getCategories: () => read(KEYS.categories, DEFAULT_CATEGORIES),
    saveCategories: (list) => write(KEYS.categories, list),
    getSession: () => read(KEYS.session, null),
    setSession: (session) => write(KEYS.session, session),
    clearSession: () => localStorage.removeItem(KEYS.session),
    getWaClicks: () => Number(read(KEYS.clicks, 0)) || 0,
    addWaClick: () => {
      const next = (Number(read(KEYS.clicks, 0)) || 0) + 1;
      write(KEYS.clicks, next);
      return next;
    },
    sellerById: (id) => read(KEYS.sellers, DEFAULT_SELLERS).find((s) => s.id === id) || null
  };

  /* ------------------------------------------------------------------ */
  /* Utilities                                                          */
  /* ------------------------------------------------------------------ */

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
  }

  function rupiah(value) {
    const n = Number(value) || 0;
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  function formatPhone(wa) {
    const digits = String(wa || '').replace(/\D/g, '');
    if (!digits) return '-';
    const local = digits.replace(/^62/, '0');
    return local.replace(/(\d{4})(?=\d)/g, '$1-').replace(/-$/, '');
  }

  function waLink(wa, message) {
    const digits = String(wa || '').replace(/\D/g, '');
    return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message);
  }

  function waMessage(product) {
    return 'Halo, saya tertarik membeli produk ' + product.nama + ' dengan harga ' + rupiah(product.harga) +
      '. Apakah produk tersebut masih tersedia?';
  }

  const TONES = {
    'Precision Screwdriver': ['#1f1f1f', '#d71920'],
    'Opening Tools': ['#22201e', '#e23b28'],
    'Tweezers': ['#1c2024', '#d71920'],
    'Pry Tools': ['#1c1c1f', '#c2185b'],
    'Suction Tools': ['#1e1e22', '#d71920'],
    'Soldering Tools': ['#211d1a', '#e05a13'],
    'Multimeter': ['#1b201f', '#1f9d6b'],
    'Microscope': ['#1a1d26', '#3b6fd4'],
    'Cleaning Tools': ['#1b2124', '#20a3b8'],
    'Repair Accessories': ['#201d24', '#8a5cf6']
  };

  function monogram(name) {
    const words = String(name || 'Alat').split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /** Placeholder image (data URI) used when a product has no photo yet. */
  function placeholderImage(kategori, nama) {
    const tone = TONES[kategori] || ['#1f1f1f', '#d71920'];
    const label = String(kategori || 'Peralatan Teknisi').toUpperCase();
    const initials = monogram(nama || kategori);
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + tone[0] + '"/><stop offset="1" stop-color="#0f0f10"/>' +
      '</linearGradient></defs>' +
      '<rect width="640" height="480" fill="url(#g)"/>' +
      '<g stroke="#ffffff" stroke-opacity="0.05">' +
      '<path d="M0 120h640M0 240h640M0 360h640M160 0v480M320 0v480M480 0v480"/>' +
      '</g>' +
      '<circle cx="548" cy="84" r="132" fill="' + tone[1] + '" fill-opacity="0.18"/>' +
      '<circle cx="96" cy="404" r="104" fill="#ffffff" fill-opacity="0.04"/>' +
      '<text x="320" y="248" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="120" font-weight="700" fill="#ffffff" fill-opacity="0.92">' + esc(initials) + '</text>' +
      '<text x="320" y="304" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" letter-spacing="4" fill="#ffffff" fill-opacity="0.55">' + esc(label) + '</text>' +
      '<rect x="266" y="330" width="108" height="4" rx="2" fill="' + tone[1] + '"/>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function productImage(product) {
    return (product && product.foto) ? product.foto : placeholderImage(product && product.kategori, product && product.nama);
  }

  function byNewest(a, b) {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  }

  /** Downscale an uploaded image with canvas so localStorage stays small. */
  function fileToJpeg(file, maxSize, quality) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\//.test(file.type)) {
        reject(new Error('File harus berupa gambar (JPG/PNG/WebP).'));
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        reject(new Error('Ukuran gambar maksimal 8 MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Gambar tidak bisa dibuka.'));
        img.onload = () => {
          const limit = maxSize || 900;
          const scale = Math.min(1, limit / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality || 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  NS.store = store;
  NS.util = {
    esc, rupiah, formatPhone, waLink, waMessage,
    placeholderImage, productImage, byNewest, fileToJpeg
  };
})();
