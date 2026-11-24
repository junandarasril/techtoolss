/* TechTools Aceh — public app: routing, catalog, product detail, auth. */
(function () {
  'use strict';

  const NS = window.TT;
  const S = NS.store;
  const U = NS.util;
  const esc = U.esc;

  const view = document.getElementById('view');

  const state = {
    q: '',
    kategori: '',
    perangkat: 'Semua',
    hargaMin: '',
    hargaMax: '',
    merek: '',
    stok: 'semua',
    sort: 'baru',
    authTab: 'seller'
  };

  const ICON = {
    wa: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.55 0-3.07-.42-4.4-1.2l-.32-.19-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.25-8.24 8.25Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.13-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.12.17 1.75 2.72 4.25 3.72.59.25 1.06.4 1.42.51.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11L4 12"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    logout: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
    shop: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h18l-1.5-4.5A2 2 0 0 0 17.6 3H6.4a2 2 0 0 0-1.9 1.5L3 9Z"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M9 22v-6h6v6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
  };

  /* ------------------------------------------------------------------ */
  /* UI helpers                                                         */
  /* ------------------------------------------------------------------ */

  function toast(message, type) {
    const root = document.getElementById('toastRoot');
    if (!root) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .25s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }
  NS.toast = toast;

  let lastFocused = null;

  function openModal(inner) {
    const root = document.getElementById('modalRoot');
    lastFocused = document.activeElement;
    root.innerHTML = '<div class="modal-backdrop">' + inner + '</div>';
    document.body.style.overflow = 'hidden';
    const backdrop = root.firstElementChild;
    backdrop.addEventListener('mousedown', (e) => {
      if (e.target === backdrop) closeModal();
    });
    const focusable = root.querySelector('input, select, textarea, button:not(.modal-close)');
    if (focusable) setTimeout(() => { try { focusable.focus({ preventScroll: true }); } catch (err) {} }, 60);
  }
  NS.openModal = openModal;

  function closeModal() {
    const root = document.getElementById('modalRoot');
    if (!root || !root.innerHTML) return;
    root.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus({ preventScroll: true }); } catch (err) {}
    }
    lastFocused = null;
  }
  NS.closeModal = closeModal;

  function confirmDialog(opts) {
    const danger = opts.danger !== false;
    openModal(
      '<div class="modal" role="dialog" aria-modal="true" aria-label="Konfirmasi">' +
        '<button class="modal-close" data-act="close-modal" aria-label="Tutup">&times;</button>' +
        '<div class="modal-head"><h2>' + esc(opts.title || 'Konfirmasi') + '</h2></div>' +
        '<div class="modal-body">' +
          '<p style="font-size:13.5px;color:#444;line-height:1.65">' + (opts.html || esc(opts.message || '')) + '</p>' +
          '<div class="form-actions">' +
            '<button type="button" class="btn btn-outline" data-act="close-modal">Batal</button>' +
            '<button type="button" class="btn ' + (danger ? 'btn-red' : 'btn-dark') + '" id="confirmYes">' + esc(opts.confirmLabel || 'Ya, lanjutkan') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    document.getElementById('confirmYes').addEventListener('click', () => {
      closeModal();
      if (typeof opts.onConfirm === 'function') opts.onConfirm();
    });
  }
  NS.confirm = confirmDialog;

  function formError(form, message) {
    if (!form) {
      toast(message, 'error');
      return false;
    }
    const box = form.querySelector('.form-error');
    if (box) {
      box.textContent = message;
      box.classList.add('show');
      box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      toast(message, 'error');
    }
    return false;
  }
  NS.formError = formError;

  function clearFormError(form) {
    const box = form.querySelector('.form-error');
    if (box) { box.textContent = ''; box.classList.remove('show'); }
  }

  /* ------------------------------------------------------------------ */
  /* Session                                                            */
  /* ------------------------------------------------------------------ */

  function session() {
    return S.getSession();
  }

  function renderAuth() {
    const slot = document.getElementById('authSlot');
    if (!slot) return;
    const s = session();
    if (s && (s.role === 'admin' || s.role === 'seller')) {
      const dashHref = s.role === 'admin' ? '#/admin' : '#/seller';
      const initial = (s.nama || 'U').trim().charAt(0).toUpperCase();
      slot.innerHTML =
        '<div class="user-chip">' +
          '<span class="avatar" aria-hidden="true">' + esc(initial) + '</span>' +
          '<span>' +
            '<span class="uc-role">' + (s.role === 'admin' ? 'ADMIN' : 'PENJUAL') + '</span>' +
            '<span class="uc-name">' + esc(s.nama) + '</span>' +
          '</span>' +
        '</div>' +
        '<a class="btn btn-dark btn-sm hide-sm" href="' + dashHref + '">Dashboard</a>' +
        '<button class="icon-btn" data-act="logout" title="Logout" aria-label="Logout">' + ICON.logout + '</button>';
    } else {
      slot.innerHTML =
        '<button class="btn btn-outline btn-sm" data-act="login">Masuk</button>' +
        '<button class="btn btn-red btn-sm hide-sm" data-act="register">Daftar Toko</button>';
    }
  }

  function logout() {
    S.clearSession();
    renderAuth();
    toast('Kamu sudah logout.', 'info');
    if (location.hash.indexOf('#/seller') === 0 || location.hash.indexOf('#/admin') === 0) {
      location.hash = '#/home';
    } else {
      render(false);
    }
  }

  NS.auth = {
    session,
    refresh: renderAuth,
    logout
  };

  /* ------------------------------------------------------------------ */
  /* Routing                                                            */
  /* ------------------------------------------------------------------ */

  function currentRoute() {
    const raw = location.hash.replace(/^#\/?/, '').split('?')[0];
    if (!raw) return 'home';
    return raw;
  }

  let lastRoute = null;

  function render(scroll) {
    const route = currentRoute();
    closeNav();

    if (route === 'katalog') {
      renderCatalog();
    } else if (route === 'seller') {
      renderSellerRoute();
    } else if (route === 'admin') {
      renderAdminRoute();
    } else {
      renderHome();
    }

    const headerSearch = document.getElementById('globalSearch');
    if (headerSearch && document.activeElement !== headerSearch) headerSearch.value = state.q;

    if (scroll !== false && lastRoute !== route) window.scrollTo({ top: 0, behavior: 'auto' });
    lastRoute = route;
  }
  NS.render = render;
  NS.rerender = () => render(false);

  function renderSellerRoute() {
    const s = session();
    if (!s || s.role !== 'seller') return renderLocked('Dashboard Penjual', 'Login sebagai penjual untuk mengelola produk toko kamu.', 'seller');
    const seller = S.sellerById(s.sellerId);
    if (!seller) {
      S.clearSession();
      renderAuth();
      return renderLocked('Dashboard Penjual', 'Akun toko tidak ditemukan. Silakan login kembali.', 'seller');
    }
    if (!seller.aktif) {
      return renderLocked('Toko Nonaktif', 'Akun toko kamu sedang dinonaktifkan administrator. Hubungi admin TechTools Aceh untuk mengaktifkan kembali.', 'seller');
    }
    renderAuth();
    NS.renderSellerDashboard(seller);
  }

  function renderAdminRoute() {
    const s = session();
    if (!s || s.role !== 'admin') return renderLocked('Dashboard Admin', 'Halaman ini hanya bisa diakses administrator TechTools Aceh.', 'admin');
    renderAuth();
    NS.renderAdminDashboard();
  }

  function renderLocked(title, message, tab) {
    view.innerHTML =
      '<section class="dash"><div class="container">' +
        '<div class="locked-panel">' +
          '<div class="lock-ico">' + ICON.lock + '</div>' +
          '<h2>' + esc(title) + '</h2>' +
          '<p>' + esc(message) + '</p>' +
          '<button class="btn btn-red btn-block" data-act="login" data-tab="' + esc(tab) + '">Masuk sekarang</button>' +
          '<a class="btn btn-outline btn-block" style="margin-top:9px" href="#/katalog">Kembali ke katalog</a>' +
        '</div>' +
      '</div></section>';
  }

  /* ------------------------------------------------------------------ */
  /* Home                                                               */
  /* ------------------------------------------------------------------ */

  function activeSellers() {
    return S.getSellers().filter((s) => s.aktif);
  }

  function productCard(p, opts) {
    opts = opts || {};
    const seller = S.sellerById(p.sellerId);
    const stockClass = p.stok <= 0 ? 'empty' : (p.stok <= 5 ? 'low' : '');
    const stockLabel = p.stok <= 0 ? 'Stok habis' : (p.stok <= 5 ? 'Sisa ' + p.stok + ' unit' : 'Stok ' + p.stok);
    const flag = p.populer
      ? '<span class="p-flag">Populer</span>'
      : (opts.markRec && p.rekomendasi ? '<span class="p-flag rec">Pemula</span>' : '');

    return '<article class="p-card">' +
      '<a class="p-media" href="#/katalog" data-act="product" data-id="' + esc(p.id) + '" aria-label="Lihat detail ' + esc(p.nama) + '">' +
        '<img src="' + U.productImage(p) + '" alt="' + esc(p.nama) + '" loading="lazy" />' +
        '<span class="p-tag">' + esc(p.kategori) + '</span>' +
        flag +
        (p.stok <= 0 ? '<span class="p-out">Stok Habis</span>' : '') +
      '</a>' +
      '<div class="p-body">' +
        '<p class="p-meta">' + esc(p.merek || 'Tanpa merek') + ' · ' + esc((p.kompatibilitas || []).join(' / ')) + '</p>' +
        '<h3 class="p-name"><a href="#/katalog" data-act="product" data-id="' + esc(p.id) + '">' + esc(p.nama) + '</a></h3>' +
        '<p class="p-desc">' + esc(p.deskripsi) + '</p>' +
        '<div class="p-foot">' +
          '<div>' +
            '<div class="p-price">' + U.rupiah(p.harga) + '</div>' +
            '<div class="p-stock ' + stockClass + '">' + stockLabel + ' · ' + esc(seller ? seller.lokasi : '-') + '</div>' +
          '</div>' +
          '<button class="btn btn-wa btn-sm" data-act="wa" data-id="' + esc(p.id) + '">' + ICON.wa + ' WhatsApp</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderHome() {
    const products = S.getProducts();
    const sellers = activeSellers();
    const cats = S.getCategories();
    const newest = products.slice().sort(U.byNewest).slice(0, 8);
    let popular = products.filter((p) => p.populer).sort(U.byNewest).slice(0, 8);
    if (!popular.length) popular = products.filter((p) => p.stok > 0).slice(0, 8);
    const starter = products.filter((p) => p.rekomendasi).sort(U.byNewest).slice(0, 6);
    const HERO_PHOTOS = [
      { src: 'assets/hero-1.jpg', alt: 'iPhone rusak dan alat servis di atas matras kerja' },
      { src: 'assets/hero-2.jpg', alt: 'Teknisi membongkar laptop dengan obeng presisi' },
      { src: 'assets/hero-3.jpg', alt: 'Teknisi mengukur komponen papan sirkuit dengan multimeter' }
    ];

    const catCount = (name) => products.filter((p) => p.kategori === name).length;

    const catCards = cats.map((c) => {
      return '<a class="cat-card" href="#/katalog" data-act="cat" data-cat="' + esc(c.nama) + '">' +
        '<span class="cat-ico">' + esc(monogramOf(c.nama)) + '</span>' +
        '<span>' +
          '<span class="cat-name">' + esc(c.nama) + '</span>' +
          '<span class="cat-count">' + catCount(c.nama) + ' produk</span>' +
        '</span>' +
      '</a>';
    }).join('');

    view.innerHTML =
      '<section class="hero">' +
        '<div class="container hero-inner">' +
          '<div class="hero-copy">' +
            '<span class="eyebrow">Marketplace Peralatan Teknisi · Aceh</span>' +
            '<h1>Alat servis <em>pro</em> untuk teknisi <span class="hl">smartphone &amp; laptop</span></h1>' +
            '<p>Obeng presisi, solder station, mikroskop, hingga multimeter — semua kebutuhan servis Android, iPhone, dan laptop dari toko lokal Banda Aceh, Lhokseumawe, dan Meulaboh. Pesan langsung ke penjual lewat WhatsApp.</p>' +
            '<div class="hero-actions">' +
              '<a class="btn btn-red" href="#/katalog">Jelajahi Katalog ' + ICON.arrow + '</a>' +
              '<button class="btn btn-ghost-light" data-act="scroll" data-target="kategori">Lihat Kategori</button>' +
            '</div>' +
            '<ul class="hero-points">' +
              '<li>' + ICON.check + ' 10 kategori alat servis</li>' +
              '<li>' + ICON.check + ' Harga &amp; stok transparan</li>' +
              '<li>' + ICON.check + ' Toko lokal terverifikasi</li>' +
            '</ul>' +
          '</div>' +
          '<div class="hero-media">' +
            '<div class="hero-panel">' +
              HERO_PHOTOS.map((photo) => '<img src="' + photo.src + '" alt="' + photo.alt + '" loading="eager" />').join('') +
            '</div>' +
            '<div class="hero-float">' +
              '<span class="hf-icon">' + ICON.wa + '</span>' +
              '<div><div class="hf-label">Pesan langsung</div><div class="hf-value">via WhatsApp</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section-tight">' +
        '<div class="container">' +
          '<div class="stat-strip">' +
            '<div><div class="ss-value">' + products.length + '<span>+</span></div><div class="ss-label">Produk terdaftar</div></div>' +
            '<div><div class="ss-value">' + sellers.length + '</div><div class="ss-label">Toko lokal Aceh</div></div>' +
            '<div><div class="ss-value">' + cats.length + '</div><div class="ss-label">Kategori peralatan</div></div>' +
            '<div><div class="ss-value">' + S.getWaClicks() + '</div><div class="ss-label">Pesanan via WhatsApp</div></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section" id="kategori">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div><span class="kicker">Kategori Peralatan</span><h2>Temukan alat sesuai pekerjaan</h2>' +
            '<p>Sepuluh kategori peralatan servis smartphone dan laptop, dari obeng presisi sampai mikroskop mainboard.</p></div>' +
            '<a class="link-more" href="#/katalog">Lihat katalog ' + ICON.arrow + '</a>' +
          '</div>' +
          '<div class="cat-grid">' + catCards + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section section-grey" id="terbaru">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div><span class="kicker">Produk Terbaru</span><h2>Baru masuk dari toko Aceh</h2>' +
            '<p>Peralatan servis terbaru yang baru ditambahkan penjual.</p></div>' +
            '<a class="link-more" href="#/katalog">Semua produk ' + ICON.arrow + '</a>' +
          '</div>' +
          '<div class="product-grid">' + newest.map((p) => productCard(p)).join('') + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div><span class="kicker">Produk Populer</span><h2>Paling dicari teknisi</h2>' +
            '<p>Peralatan favorit teknisi profesional di Aceh.</p></div>' +
          '</div>' +
          '<div class="product-grid">' + popular.map((p) => productCard(p)).join('') + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section section-grey" id="paket">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div><span class="kicker">Rekomendasi Paket Pemula</span><h2>Mulai buka jasa servis</h2>' +
            '<p>Pilihan alat wajib untuk teknisi pemula dengan harga masuk akal.</p></div>' +
          '</div>' +
          (starter.length
            ? '<div class="paket-grid">' + starter.map(paketCard).join('') + '</div>'
            : '<div class="empty-state"><h3>Belum ada paket rekomendasi</h3><p>Admin dapat menandai produk sebagai rekomendasi dari dashboard.</p></div>') +
        '</div>' +
      '</section>' +

      '<section class="section">' +
        '<div class="container">' +
          '<div class="section-head"><div><span class="kicker">Cara Pesan</span><h2>Tiga langkah, tanpa keranjang</h2></div></div>' +
          '<div class="steps">' +
            '<div class="step"><div class="step-no">1</div><h4>Pilih alat</h4><p>Gunakan pencarian dan filter untuk menemukan alat yang sesuai jenis perangkat dan anggaranmu.</p></div>' +
            '<div class="step"><div class="step-no">2</div><h4>Cek detail</h4><p>Baca fungsi alat, kompatibilitas, harga, ketersediaan stok, serta lokasi toko penjual.</p></div>' +
            '<div class="step"><div class="step-no">3</div><h4>Pesan via WhatsApp</h4><p>Klik tombol WhatsApp, pesan otomatis berisi nama produk dan harga langsung terkirim ke penjual.</p></div>' +
          '</div>' +
          '<div class="cta-band" style="margin-top:28px">' +
            '<div><h2>Punya toko alat teknisi di Aceh?</h2>' +
            '<p>Daftarkan toko dan jual peralatan servismu ke teknisi profesional dan pemula di seluruh Aceh.</p></div>' +
            '<button class="btn btn-red" data-act="register">Daftar sebagai Penjual ' + ICON.arrow + '</button>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  function monogramOf(name) {
    const words = String(name || 'Alat').split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function paketCard(p) {
    const seller = S.sellerById(p.sellerId);
    return '<a class="paket-card" href="#/katalog" data-act="product" data-id="' + esc(p.id) + '">' +
      '<img src="' + U.productImage(p) + '" alt="' + esc(p.nama) + '" loading="lazy" />' +
      '<div>' +
        '<h4>' + esc(p.nama) + '</h4>' +
        '<div class="pk-price">' + U.rupiah(p.harga) + '</div>' +
        '<div class="pk-shop">' + esc(seller ? seller.toko + ' · ' + seller.lokasi : '-') + '</div>' +
      '</div>' +
    '</a>';
  }

  /* ------------------------------------------------------------------ */
  /* Catalog                                                            */
  /* ------------------------------------------------------------------ */

  function filterOptions(list, selected, allLabel) {
    return '<option value="">' + esc(allLabel) + '</option>' + list.map((item) => {
      return '<option value="' + esc(item) + '"' + (selected === item ? ' selected' : '') + '>' + esc(item) + '</option>';
    }).join('');
  }

  function renderCatalog() {
    const products = S.getProducts();
    const cats = S.getCategories();
    const brands = Array.from(new Set(products.map((p) => p.merek).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    const devices = ['Semua', 'Android', 'iPhone', 'Laptop'];

    view.innerHTML =
      '<section class="page-head">' +
        '<div class="container">' +
          '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/home">Beranda</a><span>/</span><span>Katalog</span></nav>' +
          '<h1>Katalog Peralatan Teknisi</h1>' +
          '<p>' + products.length + ' produk dari ' + activeSellers().length + ' toko lokal Aceh — cari, filter, lalu pesan via WhatsApp.</p>' +
        '</div>' +
      '</section>' +
      '<div class="container">' +
        '<div class="catalog-layout">' +
          '<aside class="filters" id="filtersPanel" aria-label="Filter produk">' +
            '<div class="filters-head"><h3>Filter Produk</h3><button type="button" data-act="reset-filters">Reset</button></div>' +
            '<div class="filter-block">' +
              '<label for="catFilter">Kategori Produk</label>' +
              '<select id="catFilter" data-filter="kategori">' + filterOptions(cats.map((c) => c.nama), state.kategori, 'Semua kategori') + '</select>' +
            '</div>' +
            '<div class="filter-block">' +
              '<span class="filter-label">Jenis Perangkat</span>' +
              '<div class="pill-group" id="devicePills">' +
                devices.map((d) => '<button type="button" class="pill' + (state.perangkat === d ? ' active' : '') + '" data-act="perangkat" data-value="' + d + '">' + d + '</button>').join('') +
              '</div>' +
            '</div>' +
            '<div class="filter-block">' +
              '<span class="filter-label">Rentang Harga</span>' +
              '<div class="price-row">' +
                '<input type="number" min="0" step="1000" inputmode="numeric" data-filter="hargaMin" placeholder="Min" value="' + esc(state.hargaMin) + '" aria-label="Harga minimum" />' +
                '<span>–</span>' +
                '<input type="number" min="0" step="1000" inputmode="numeric" data-filter="hargaMax" placeholder="Max" value="' + esc(state.hargaMax) + '" aria-label="Harga maksimum" />' +
              '</div>' +
            '</div>' +
            '<div class="filter-block">' +
              '<label for="brandFilter">Merek</label>' +
              '<select id="brandFilter" data-filter="merek">' + filterOptions(brands, state.merek, 'Semua merek') + '</select>' +
            '</div>' +
            '<div class="filter-block">' +
              '<label for="stockFilter">Ketersediaan Stok</label>' +
              '<select id="stockFilter" data-filter="stok">' +
                '<option value="semua"' + (state.stok === 'semua' ? ' selected' : '') + '>Semua stok</option>' +
                '<option value="tersedia"' + (state.stok === 'tersedia' ? ' selected' : '') + '>Tersedia</option>' +
                '<option value="habis"' + (state.stok === 'habis' ? ' selected' : '') + '>Habis</option>' +
              '</select>' +
            '</div>' +
            '<div class="filter-block">' +
              '<label for="sideSearch">Pencarian</label>' +
              '<input type="search" id="sideSearch" data-filter="q" placeholder="Nama, merek, perangkat…" value="' + esc(state.q) + '" />' +
            '</div>' +
          '</aside>' +
          '<section aria-label="Hasil produk">' +
            '<div class="catalog-toolbar">' +
              '<p class="result-count" id="resultCount"></p>' +
              '<button class="btn btn-outline btn-sm filters-toggle" data-act="toggle-filters">Filter Produk</button>' +
              '<div class="sort-field">' +
                '<label for="sortSelect">Urutkan</label>' +
                '<select id="sortSelect" data-filter="sort">' +
                  '<option value="baru"' + (state.sort === 'baru' ? ' selected' : '') + '>Produk Terbaru</option>' +
                  '<option value="murah"' + (state.sort === 'murah' ? ' selected' : '') + '>Harga Termurah</option>' +
                  '<option value="mahal"' + (state.sort === 'mahal' ? ' selected' : '') + '>Harga Termahal</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
            '<div class="active-chips" id="activeChips"></div>' +
            '<div id="catalogResults"></div>' +
          '</section>' +
        '</div>' +
      '</div>';

    refreshResults();
  }

  function filteredProducts() {
    const all = S.getProducts();
    const q = state.q.trim().toLowerCase();
    const min = state.hargaMin === '' ? null : Number(state.hargaMin);
    const max = state.hargaMax === '' ? null : Number(state.hargaMax);

    const list = all.filter((p) => {
      const seller = S.sellerById(p.sellerId);
      if (state.kategori && p.kategori !== state.kategori) return false;
      if (state.perangkat !== 'Semua' && (p.kompatibilitas || []).indexOf(state.perangkat) === -1) return false;
      if (state.merek && p.merek !== state.merek) return false;
      if (state.stok === 'tersedia' && p.stok <= 0) return false;
      if (state.stok === 'habis' && p.stok > 0) return false;
      if (min !== null && !isNaN(min) && p.harga < min) return false;
      if (max !== null && !isNaN(max) && p.harga > max) return false;
      if (q) {
        const haystack = [p.nama, p.merek, p.kategori, (p.kompatibilitas || []).join(' '), p.deskripsi, seller ? seller.toko + ' ' + seller.lokasi : '']
          .join(' ').toLowerCase();
        if (haystack.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (state.sort === 'murah') return list.sort((a, b) => a.harga - b.harga);
    if (state.sort === 'mahal') return list.sort((a, b) => b.harga - a.harga);
    return list.sort(U.byNewest);
  }

  function refreshResults() {
    const results = document.getElementById('catalogResults');
    if (!results) return;

    const list = filteredProducts();
    const total = S.getProducts().length;

    const count = document.getElementById('resultCount');
    if (count) count.innerHTML = 'Menampilkan <strong>' + list.length + '</strong> dari ' + total + ' produk';

    const chips = document.getElementById('activeChips');
    if (chips) {
      const items = [];
      if (state.q.trim()) items.push(['q', 'Cari: ' + state.q.trim()]);
      if (state.kategori) items.push(['kategori', state.kategori]);
      if (state.perangkat !== 'Semua') items.push(['perangkat', state.perangkat]);
      if (state.merek) items.push(['merek', state.merek]);
      if (state.stok !== 'semua') items.push(['stok', state.stok === 'tersedia' ? 'Tersedia' : 'Habis']);
      if (state.hargaMin !== '' || state.hargaMax !== '') {
        items.push(['harga', 'Harga ' + (state.hargaMin !== '' ? U.rupiah(Number(state.hargaMin) || 0) : 'min') +
          ' – ' + (state.hargaMax !== '' ? U.rupiah(Number(state.hargaMax) || 0) : 'max')]);
      }
      chips.innerHTML = items.map((it) => {
        return '<span class="chip">' + esc(it[1]) +
          '<button type="button" data-act="chip" data-key="' + esc(it[0]) + '" aria-label="Hapus filter ' + esc(it[1]) + '">&times;</button></span>';
      }).join('');
    }

    if (!list.length) {
      results.innerHTML =
        '<div class="empty-state">' +
          '<div class="es-icon">' + ICON.search + '</div>' +
          '<h3>Produk tidak ditemukan</h3>' +
          '<p>Tidak ada peralatan yang cocok dengan kata kunci atau filter yang dipilih. Coba kata kunci lain atau reset pencarian.</p>' +
          '<button class="btn btn-red" data-act="reset-filters">Reset Pencarian</button>' +
        '</div>';
      return;
    }

    results.innerHTML = '<div class="product-grid">' + list.map((p) => productCard(p)).join('') + '</div>';
  }

  function syncFilterUI() {
    const map = {
      kategori: state.kategori,
      merek: state.merek,
      stok: state.stok,
      sort: state.sort
    };
    Object.keys(map).forEach((key) => {
      const el = document.querySelector('[data-filter="' + key + '"]');
      if (el) el.value = map[key];
    });
    const min = document.querySelector('[data-filter="hargaMin"]');
    const max = document.querySelector('[data-filter="hargaMax"]');
    if (min) min.value = state.hargaMin;
    if (max) max.value = state.hargaMax;
    const side = document.getElementById('sideSearch');
    if (side) side.value = state.q;
    const header = document.getElementById('globalSearch');
    if (header) header.value = state.q;

    const pills = document.querySelectorAll('#devicePills .pill');
    Array.prototype.forEach.call(pills, (pill) => {
      pill.classList.toggle('active', pill.dataset.value === state.perangkat);
    });
  }

  function resetFilters() {
    state.q = '';
    state.kategori = '';
    state.perangkat = 'Semua';
    state.hargaMin = '';
    state.hargaMax = '';
    state.merek = '';
    state.stok = 'semua';
    state.sort = 'baru';
    syncFilterUI();
    refreshResults();
    toast('Filter direset.', 'info');
  }

  /* ------------------------------------------------------------------ */
  /* Product detail & WhatsApp order                                    */
  /* ------------------------------------------------------------------ */

  function openProduct(id) {
    const p = S.getProducts().find((x) => x.id === id);
    if (!p) {
      toast('Produk tidak ditemukan.', 'error');
      return;
    }
    const seller = S.sellerById(p.sellerId);
    const stockClass = p.stok <= 0 ? 'empty' : (p.stok <= 5 ? 'low' : '');
    const stockLabel = p.stok <= 0 ? 'Stok habis' : (p.stok <= 5 ? 'Stok terbatas — sisa ' + p.stok + ' unit' : 'Tersedia · ' + p.stok + ' unit');
    const kompat = (p.kompatibilitas && p.kompatibilitas.length) ? p.kompatibilitas.join(', ') : 'Umum';

    openModal(
      '<div class="modal modal-wide" role="dialog" aria-modal="true" aria-label="Detail produk ' + esc(p.nama) + '">' +
        '<button class="modal-close" data-act="close-modal" aria-label="Tutup">&times;</button>' +
        '<div class="product-detail">' +
          '<div class="pd-media">' +
            '<img src="' + U.productImage(p) + '" alt="' + esc(p.nama) + '" />' +
            (p.populer ? '<span class="p-flag" style="right:12px;top:12px">Populer</span>' : '') +
          '</div>' +
          '<div class="pd-info">' +
            '<span class="pd-cat">' + esc(p.kategori) + '</span>' +
            '<h2>' + esc(p.nama) + '</h2>' +
            '<p class="pd-brand">Merek ' + esc(p.merek || '-') + ' · ' + (seller ? esc(seller.toko) : 'Toko tidak diketahui') + '</p>' +
            '<div class="pd-price">' + U.rupiah(p.harga) + '</div>' +
            '<p class="pd-stock ' + stockClass + '">' + stockLabel + '</p>' +
            '<dl class="pd-specs">' +
              '<div><dt>Merek</dt><dd>' + esc(p.merek || '-') + '</dd></div>' +
              '<div><dt>Kategori</dt><dd>' + esc(p.kategori) + '</dd></div>' +
              '<div><dt>Kompatibilitas</dt><dd>' + esc(kompat) + '</dd></div>' +
              '<div><dt>Stok</dt><dd>' + p.stok + ' unit</dd></div>' +
              '<div><dt>Toko</dt><dd>' + esc(seller ? seller.toko : '-') + '</dd></div>' +
              '<div><dt>Lokasi</dt><dd>' + esc(seller ? seller.lokasi + ', Aceh' : '-') + '</dd></div>' +
            '</dl>' +
            '<div class="pd-block">' +
              '<h4>Fungsi &amp; deskripsi alat</h4>' +
              '<p>' + esc(p.deskripsi) + '</p>' +
            '</div>' +
            '<div class="pd-seller">' +
              '<div>' +
                '<div class="shop-name">' + esc(seller ? seller.toko : 'Toko tidak diketahui') + '</div>' +
                '<div class="shop-meta">' + esc(seller ? seller.lokasi + ', Aceh' : '') + ' · WA ' + esc(seller ? U.formatPhone(seller.wa) : '-') + '</div>' +
              '</div>' +
              (seller && seller.aktif ? '<span class="badge ok">Toko aktif</span>' : '<span class="badge off">Toko nonaktif</span>') +
            '</div>' +
            '<div class="pd-actions">' +
              '<button class="btn btn-wa" data-act="wa" data-id="' + esc(p.id) + '">' + ICON.wa + ' Pesan via WhatsApp</button>' +
              '<p class="pd-note">Pesan otomatis berisi nama produk dan harga. Transaksi dilakukan langsung dengan penjual.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }
  NS.openProduct = openProduct;

  function orderProduct(id) {
    const p = S.getProducts().find((x) => x.id === id);
    if (!p) return;
    const seller = S.sellerById(p.sellerId);
    if (!seller) {
      toast('Data penjual tidak ditemukan.', 'error');
      return;
    }
    if (!seller.aktif) {
      toast('Toko ini sedang nonaktif. Coba produk dari toko lain.', 'error');
      return;
    }
    const url = U.waLink(seller.wa, U.waMessage(p));
    S.addWaClick();
    window.open(url, '_blank', 'noopener');
    toast('Membuka WhatsApp ' + seller.toko + '…');
    if (currentRoute() === 'admin' || currentRoute() === 'seller' || currentRoute() === 'home') render(false);
  }
  NS.orderProduct = orderProduct;

  /* ------------------------------------------------------------------ */
  /* Auth modal & forms                                                 */
  /* ------------------------------------------------------------------ */

  function authPanelHtml(tab) {
    if (tab === 'admin') {
      return '<form data-form="admin-login" novalidate>' +
        '<div class="form-error"></div>' +
        '<div class="field"><label for="adm-user">Username admin <span class="req">*</span></label>' +
          '<input id="adm-user" name="username" type="text" autocomplete="username" placeholder="admin" required /></div>' +
        '<div class="field"><label for="adm-pass">Password <span class="req">*</span></label>' +
          '<div class="password-wrap"><input id="adm-pass" name="password" type="password" autocomplete="current-password" placeholder="••••••" required />' +
          '<button type="button" data-act="toggle-pass">Lihat</button></div></div>' +
        '<button class="btn btn-dark btn-block" type="submit">Masuk sebagai Admin</button>' +
        '<div class="demo-note">Kredensial demo admin: <code>admin</code> / <code>admin</code>. Admin dapat memoderasi seluruh katalog, mengelola penjual, dan kategori.</div>' +
      '</form>';
    }

    if (tab === 'register') {
      return '<form data-form="seller-register" novalidate>' +
        '<div class="form-error"></div>' +
        '<div class="field"><label for="reg-toko">Nama toko <span class="req">*</span></label>' +
          '<input id="reg-toko" name="toko" type="text" placeholder="cth. Berkah Teknik Banda Aceh" required /></div>' +
        '<div class="field"><label for="reg-lokasi">Kota / kabupaten <span class="req">*</span></label>' +
          '<input id="reg-lokasi" name="lokasi" type="text" placeholder="cth. Banda Aceh" required list="acehCities" />' +
          '<datalist id="acehCities"><option>Banda Aceh</option><option>Lhokseumawe</option><option>Meulaboh</option><option>Langsa</option><option>Sigli</option><option>Takengon</option><option>Calang</option><option>Sabang</option></datalist></div>' +
        '<div class="field"><label for="reg-wa">Nomor WhatsApp toko <span class="req">*</span></label>' +
          '<input id="reg-wa" name="wa" type="tel" inputmode="numeric" placeholder="628xxxxxxxxxx" required />' +
          '<p class="form-hint">Format internasional tanpa +, contoh 6281170123456.</p></div>' +
        '<div class="field-grid">' +
          '<div class="field"><label for="reg-user">Username <span class="req">*</span></label>' +
            '<input id="reg-user" name="username" type="text" autocomplete="username" placeholder="cth. berkah" required /></div>' +
          '<div class="field"><label for="reg-pass">Password <span class="req">*</span></label>' +
            '<input id="reg-pass" name="password" type="password" autocomplete="new-password" placeholder="min. 5 karakter" required /></div>' +
        '</div>' +
        '<button class="btn btn-red btn-block" type="submit">Daftar &amp; Masuk</button>' +
        '<p class="form-hint" style="text-align:center;margin-top:12px">Sudah punya akun? ' +
          '<button type="button" class="link-like" data-act="authtab" data-tab="seller">Masuk penjual</button></p>' +
      '</form>';
    }

    return '<form data-form="seller-login" novalidate>' +
      '<div class="form-error"></div>' +
      '<div class="field"><label for="sl-user">Username toko <span class="req">*</span></label>' +
        '<input id="sl-user" name="username" type="text" autocomplete="username" placeholder="cth. berkah" required /></div>' +
      '<div class="field"><label for="sl-pass">Password <span class="req">*</span></label>' +
        '<div class="password-wrap"><input id="sl-pass" name="password" type="password" autocomplete="current-password" placeholder="••••••" required />' +
        '<button type="button" data-act="toggle-pass">Lihat</button></div></div>' +
      '<button class="btn btn-red btn-block" type="submit">Masuk sebagai Penjual</button>' +
      '<p class="form-hint" style="text-align:center;margin-top:12px">Belum punya akun toko? ' +
        '<button type="button" class="link-like" data-act="authtab" data-tab="register">Daftarkan toko</button></p>' +
      '<div class="demo-note">Akun demo penjual: <code>berkah</code> / <code>seller123</code>. Bisa juga <code>gadgetcare</code>, <code>serviscenter</code>, atau <code>acehtools</code> (password sama).</div>' +
    '</form>';
  }

  function openAuth(tab) {
    state.authTab = tab || 'seller';
    const sellerActive = state.authTab === 'seller' || state.authTab === 'register';
    openModal(
      '<div class="modal" role="dialog" aria-modal="true" aria-label="Masuk ke akun">' +
        '<button class="modal-close" data-act="close-modal" aria-label="Tutup">&times;</button>' +
        '<div class="modal-head"><h2>Masuk ke TechTools Aceh</h2>' +
          '<p>Pembeli tidak perlu login. Login hanya untuk penjual dan administrator.</p></div>' +
        '<div class="modal-body">' +
          '<div class="auth-tabs" role="tablist">' +
            '<button type="button" role="tab" aria-selected="' + sellerActive + '" class="' + (sellerActive ? 'active' : '') + '" data-act="authtab" data-tab="seller">Penjual</button>' +
            '<button type="button" role="tab" aria-selected="' + (!sellerActive) + '" class="' + (!sellerActive ? 'active' : '') + '" data-act="authtab" data-tab="admin">Admin</button>' +
          '</div>' +
          '<div id="authPanel">' + authPanelHtml(state.authTab) + '</div>' +
        '</div>' +
      '</div>'
    );
  }
  NS.openAuth = openAuth;

  function setAuthTab(tab) {
    state.authTab = tab;
    const panel = document.getElementById('authPanel');
    if (!panel) return;
    panel.innerHTML = authPanelHtml(tab);
    const tabs = document.querySelectorAll('.auth-tabs button');
    Array.prototype.forEach.call(tabs, (btn) => {
      const active = tab === 'register' ? btn.dataset.tab === 'seller' : btn.dataset.tab === tab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function normalizeWa(value) {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.indexOf('0') === 0) digits = '62' + digits.slice(1);
    return digits;
  }
  NS.normalizeWa = normalizeWa;

  NS.forms['seller-login'] = function (form) {
    clearFormError(form);
    const data = new FormData(form);
    const username = String(data.get('username') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    if (!username || !password) return formError(form, 'Username dan password wajib diisi.');
    const sellers = S.getSellers();
    const seller = sellers.find((s) => String(s.username || '').toLowerCase() === username);
    if (!seller || seller.password !== password) return formError(form, 'Username atau password salah.');
    if (!seller.aktif) return formError(form, 'Akun toko ini dinonaktifkan admin. Hubungi administrator TechTools Aceh.');
    S.setSession({ role: 'seller', sellerId: seller.id, nama: seller.toko });
    closeModal();
    renderAuth();
    toast('Selamat datang, ' + seller.toko + '!');
    location.hash = '#/seller';
    if (currentRoute() === 'seller') render();
  };

  NS.forms['admin-login'] = function (form) {
    clearFormError(form);
    const data = new FormData(form);
    const username = String(data.get('username') || '').trim();
    const password = String(data.get('password') || '');
    if (username !== 'admin' || password !== 'admin') {
      return formError(form, 'Kredensial admin salah. Gunakan username "admin" dan password "admin".');
    }
    S.setSession({ role: 'admin', nama: 'Administrator' });
    closeModal();
    renderAuth();
    toast('Login admin berhasil.');
    location.hash = '#/admin';
    if (currentRoute() === 'admin') render();
  };

  NS.forms['seller-register'] = function (form) {
    clearFormError(form);
    const data = new FormData(form);
    const toko = String(data.get('toko') || '').trim();
    const lokasi = String(data.get('lokasi') || '').trim();
    const wa = normalizeWa(data.get('wa'));
    const username = String(data.get('username') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');

    if (toko.length < 3) return formError(form, 'Nama toko minimal 3 karakter.');
    if (lokasi.length < 3) return formError(form, 'Kota/kabupaten wajib diisi.');
    if (!/^62\d{8,13}$/.test(wa)) return formError(form, 'Nomor WhatsApp tidak valid. Gunakan format 628xxxxxxxxxx (10–15 digit).');
    if (!/^[a-z0-9._-]{3,20}$/.test(username)) return formError(form, 'Username 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.');
    if (password.length < 5) return formError(form, 'Password minimal 5 karakter.');

    const sellers = S.getSellers();
    if (sellers.some((s) => String(s.username || '').toLowerCase() === username)) {
      return formError(form, 'Username sudah dipakai. Pilih username lain.');
    }

    const seller = {
      id: 'slr-' + Date.now().toString(36),
      toko: toko,
      lokasi: lokasi,
      wa: wa,
      username: username,
      password: password,
      aktif: true,
      createdAt: new Date().toISOString()
    };
    sellers.push(seller);
    if (!S.saveSellers(sellers)) return formError(form, 'Gagal menyimpan akun. Penyimpanan browser penuh.');

    S.setSession({ role: 'seller', sellerId: seller.id, nama: seller.toko });
    closeModal();
    renderAuth();
    toast('Toko berhasil didaftarkan. Selamat datang!');
    location.hash = '#/seller';
    if (currentRoute() === 'seller') render();
  };

  /* ------------------------------------------------------------------ */
  /* Global events                                                      */
  /* ------------------------------------------------------------------ */

  Object.assign(NS.actions, {
    login: (btn) => openAuth(btn.dataset.tab || 'seller'),
    register: () => openAuth('register'),
    logout: logout,
    'close-modal': closeModal,
    authtab: (btn) => setAuthTab(btn.dataset.tab),
    'toggle-pass': (btn) => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Sembunyi' : 'Lihat';
    },
    product: (btn) => openProduct(btn.dataset.id),
    wa: (btn) => orderProduct(btn.dataset.id),
    cat: (btn) => {
      state.kategori = btn.dataset.cat || '';
      if (currentRoute() !== 'katalog') {
        location.hash = '#/katalog';
        render();
      } else {
        syncFilterUI();
        refreshResults();
      }
    },
    scroll: (btn) => {
      const targetId = btn.dataset.target;
      const go = () => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      if (currentRoute() !== 'home') {
        location.hash = '#/home';
        render();
        setTimeout(go, 120);
      } else {
        go();
      }
    },
    perangkat: (btn) => {
      state.perangkat = btn.dataset.value || 'Semua';
      syncFilterUI();
      refreshResults();
    },
    'chip': (btn) => {
      const key = btn.dataset.key;
      if (key === 'harga') {
        state.hargaMin = '';
        state.hargaMax = '';
      } else if (key === 'perangkat') {
        state.perangkat = 'Semua';
      } else if (key === 'stok') {
        state.stok = 'semua';
      } else if (key === 'q') {
        state.q = '';
      } else if (key === 'kategori') {
        state.kategori = '';
      } else if (key === 'merek') {
        state.merek = '';
      }
      syncFilterUI();
      refreshResults();
    },
    'reset-filters': resetFilters,
    'toggle-filters': () => {
      const panel = document.getElementById('filtersPanel');
      if (panel) {
        panel.classList.toggle('open');
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });

  function onFilterInput(e) {
    const el = e.target.closest('[data-filter]');
    if (!el) return;
    const key = el.dataset.filter;
    const value = el.value;
    if (key === 'q') {
      state.q = value;
      const header = document.getElementById('globalSearch');
      if (header && document.activeElement !== header) header.value = value;
      refreshResults();
      return;
    }
    if (key === 'hargaMin' || key === 'hargaMax') {
      state[key] = value;
      window.clearTimeout(onFilterInput._timer);
      onFilterInput._timer = window.setTimeout(refreshResults, 260);
      return;
    }
    state[key] = value;
    refreshResults();
  }

  document.addEventListener('input', onFilterInput);
  document.addEventListener('change', onFilterInput);

  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-act]');
    if (!trigger) return;
    const handler = NS.actions[trigger.dataset.act];
    if (!handler) return;
    e.preventDefault();
    handler(trigger, e);
  });

  document.addEventListener('submit', function (e) {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    const handler = NS.forms[form.dataset.form];
    if (handler) handler(form);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header')) closeNav();
  });

  function closeNav() {
    document.body.classList.remove('nav-open');
    const toggle = document.getElementById('navToggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function bindHeader() {
    const toggle = document.getElementById('navToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    const form = document.getElementById('headerSearch');
    const input = document.getElementById('globalSearch');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.q = input ? input.value : '';
        if (currentRoute() !== 'katalog') {
          location.hash = '#/katalog';
          render();
        } else {
          syncFilterUI();
          refreshResults();
        }
        input.blur();
      });
    }

    if (input) {
      let timer = null;
      input.addEventListener('input', () => {
        state.q = input.value;
        window.clearTimeout(timer);
        if (currentRoute() !== 'katalog') {
          location.hash = '#/katalog';
          render();
        } else {
          const side = document.getElementById('sideSearch');
          if (side) side.value = state.q;
          timer = window.setTimeout(refreshResults, 120);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    window.addEventListener('hashchange', () => render());
  }

  function init() {
    S.ensureSeed();
    renderAuth();
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
    bindHeader();
    if (!location.hash) {
      history.replaceState(null, '', '#/home');
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
