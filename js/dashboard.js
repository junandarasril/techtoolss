/* TechTools Aceh — seller & admin dashboards. */
(function () {
  'use strict';

  const NS = window.TT;
  const S = NS.store;
  const U = NS.util;
  const esc = U.esc;

  const ICO = {
    plus: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>',
    power: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v9"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/></svg>',
    shop: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h18l-1.5-4.5A2 2 0 0 0 17.6 3H6.4a2 2 0 0 0-1.9 1.5L3 9Z"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M9 22v-6h6v6"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    box: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>'
  };

  const adminState = { tab: 'overview', q: '', kat: '', sellerQ: '' };

  function clearError(form) {
    const box = form.querySelector('.form-error');
    if (box) { box.textContent = ''; box.classList.remove('show'); }
  }

  function stockBadge(stok) {
    if (stok <= 0) return '<span class="badge out">Habis</span>';
    if (stok <= 5) return '<span class="badge warn">Sisa ' + stok + '</span>';
    return '<span class="badge ok">' + stok + ' unit</span>';
  }

  function statCard(label, value, sub, tone) {
    return '<div class="stat-card ' + (tone || '') + '">' +
      '<div class="sc-label">' + esc(label) + '</div>' +
      '<div class="sc-value">' + esc(String(value)) + '</div>' +
      (sub ? '<div class="sc-sub">' + esc(sub) + '</div>' : '') +
    '</div>';
  }

  function iconButton(act, id, label, ico, danger) {
    return '<button class="icon-btn' + (danger ? ' danger' : '') + '" data-act="' + act + '" data-id="' + esc(id) + '" title="' + esc(label) + '" aria-label="' + esc(label) + '">' + ico + '</button>';
  }

  /* ================================================================== */
  /* SELLER DASHBOARD                                                   */
  /* ================================================================== */

  function renderSellerDashboard(seller) {
    const view = document.getElementById('view');
    const all = S.getProducts();
    const products = all.filter((p) => p.sellerId === seller.id).sort(U.byNewest);
    const tersedia = products.filter((p) => p.stok > 0).length;
    const habis = products.filter((p) => p.stok <= 0).length;
    const nilai = products.reduce((sum, p) => sum + (Number(p.harga) || 0) * (Number(p.stok) || 0), 0);

    const rows = products.length
      ? products.map((p) => {
        return '<tr>' +
          '<td><div class="t-prod">' +
            '<img src="' + U.productImage(p) + '" alt="" />' +
            '<div><div class="t-name">' + esc(p.nama) + '</div><div class="t-sub">' + esc(p.merek || '-') + ' · ' + esc((p.kompatibilitas || []).join(' / ')) + '</div></div>' +
          '</div></td>' +
          '<td>' + esc(p.kategori) + '</td>' +
          '<td class="t-price">' + U.rupiah(p.harga) + '</td>' +
          '<td>' + stockBadge(p.stok) + '</td>' +
          '<td>' + (p.populer ? '<span class="badge dark">Populer</span>' : '<span class="badge off">—</span>') + '</td>' +
          '<td><div class="t-actions">' +
            iconButton('prod-edit', p.id, 'Edit produk', ICO.edit) +
            iconButton('prod-del', p.id, 'Hapus produk', ICO.trash, true) +
          '</div></td>' +
        '</tr>';
      }).join('')
      : '';

    view.innerHTML =
      '<section class="dash"><div class="container">' +
        '<div class="dash-head">' +
          '<div>' +
            '<span class="kicker">Dashboard Penjual</span>' +
            '<h1>' + esc(seller.toko) + '</h1>' +
            '<p>' + esc(seller.lokasi) + ', Aceh · WA ' + esc(U.formatPhone(seller.wa)) + ' · Login sebagai <strong>' + esc(seller.username) + '</strong></p>' +
          '</div>' +
          '<div class="dash-head-actions">' +
            '<a class="btn btn-outline btn-sm" href="#/katalog">Lihat Katalog</a>' +
            '<button class="btn btn-red btn-sm" data-act="prod-add">' + ICO.plus + ' Tambah Produk</button>' +
          '</div>' +
        '</div>' +

        '<div class="stat-cards">' +
          statCard('Total Produk', products.length, 'Produk toko kamu', 'dark') +
          statCard('Stok Tersedia', tersedia, 'Produk siap dijual', 'green') +
          statCard('Stok Habis', habis, 'Perlu restock', 'accent') +
          statCard('Nilai Stok', U.rupiah(nilai), 'Harga × jumlah stok', '') +
        '</div>' +

        '<div class="info-strip">' + ICO.info + '<span>Produk yang kamu tambahkan langsung tampil di katalog publik. Pastikan fungsi alat, kompatibilitas, harga, dan nomor WhatsApp sudah benar.</span></div>' +

        '<div class="panel">' +
          '<div class="panel-head">' +
            '<div><h2>Produk Toko Kamu</h2><p>' + products.length + ' produk terdaftar</p></div>' +
            '<button class="btn btn-red btn-sm" data-act="prod-add">' + ICO.plus + ' Tambah Produk</button>' +
          '</div>' +
          '<div class="panel-body flush">' +
            (products.length
              ? '<div class="table-wrap" style="border:0;border-radius:0"><table class="tbl">' +
                  '<thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th style="text-align:right">Aksi</th></tr></thead>' +
                  '<tbody>' + rows + '</tbody>' +
                '</table></div>'
              : '<div class="panel-body"><div class="empty-state">' +
                  '<div class="es-icon">' + ICO.box + '</div>' +
                  '<h3>Belum ada produk</h3><p>Tambahkan produk pertama toko kamu agar muncul di katalog TechTools Aceh.</p>' +
                  '<button class="btn btn-red" data-act="prod-add">Tambah Produk</button>' +
                '</div></div>') +
          '</div>' +
        '</div>' +

        '<div class="seller-grid">' +
          '<div class="panel">' +
            '<div class="panel-head"><div><h2>Pengaturan Toko</h2><p>Nomor WhatsApp dipakai untuk semua tombol pesanan produkmu.</p></div></div>' +
            '<div class="panel-body">' +
              '<form data-form="seller-settings" novalidate>' +
                '<div class="form-error"></div>' +
                '<div class="field"><label for="set-toko">Nama toko <span class="req">*</span></label>' +
                  '<input id="set-toko" name="toko" type="text" value="' + esc(seller.toko) + '" required /></div>' +
                '<div class="field-grid">' +
                  '<div class="field"><label for="set-lokasi">Kota / kabupaten <span class="req">*</span></label>' +
                    '<input id="set-lokasi" name="lokasi" type="text" value="' + esc(seller.lokasi) + '" required /></div>' +
                  '<div class="field"><label for="set-wa">Nomor WhatsApp <span class="req">*</span></label>' +
                    '<input id="set-wa" name="wa" type="tel" inputmode="numeric" value="' + esc(seller.wa) + '" required /></div>' +
                '</div>' +
                '<div class="form-actions"><button class="btn btn-dark" type="submit">Simpan Pengaturan</button></div>' +
              '</form>' +
            '</div>' +
          '</div>' +
          '<div class="panel">' +
            '<div class="panel-head"><div><h2>Ringkasan Katalog</h2><p>Perbandingan toko kamu dengan seluruh marketplace.</p></div></div>' +
            '<div class="panel-body">' +
              '<dl class="pd-specs" style="margin-top:0">' +
                '<div><dt>Produk di katalog</dt><dd>' + S.getProducts().length + ' produk</dd></div>' +
                '<div><dt>Produk toko kamu</dt><dd>' + products.length + ' produk</dd></div>' +
                '<div><dt>Kategori tersedia</dt><dd>' + S.getCategories().length + ' kategori</dd></div>' +
                '<div><dt>Pesanan via WhatsApp</dt><dd>' + S.getWaClicks() + ' klik</dd></div>' +
              '</dl>' +
              '<p class="form-hint" style="margin-top:12px">Butuh bantuan admin? Hubungi 0811-7012-3456.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></section>';
  }
  NS.renderSellerDashboard = renderSellerDashboard;

  /* ================================================================== */
  /* ADMIN DASHBOARD                                                    */
  /* ================================================================== */

  function renderAdminDashboard() {
    const view = document.getElementById('view');
    const products = S.getProducts();
    const sellers = S.getSellers();
    const cats = S.getCategories();
    const session = S.getSession() || { nama: 'Administrator' };

    const tabs = [
      ['overview', 'Ringkasan', null],
      ['products', 'Produk', products.length],
      ['sellers', 'Penjual', sellers.length],
      ['categories', 'Kategori', cats.length]
    ].map((t) => {
      const active = adminState.tab === t[0];
      return '<button type="button" class="' + (active ? 'active' : '') + '" data-act="admin-tab" data-tab="' + t[0] + '">' +
        esc(t[1]) + (t[2] !== null ? '<span class="tab-count">' + t[2] + '</span>' : '') +
      '</button>';
    }).join('');

    view.innerHTML =
      '<section class="dash"><div class="container">' +
        '<div class="dash-head">' +
          '<div>' +
            '<span class="kicker">Dashboard Admin</span>' +
            '<h1>Kelola Marketplace</h1>' +
            '<p>Masuk sebagai ' + esc(session.nama) + ' · moderasi seluruh katalog TechTools Aceh.</p>' +
          '</div>' +
          '<div class="dash-head-actions">' +
            '<a class="btn btn-outline btn-sm" href="#/katalog">Lihat Katalog</a>' +
            '<button class="btn btn-red btn-sm" data-act="admin-add-prod">' + ICO.plus + ' Tambah Produk</button>' +
          '</div>' +
        '</div>' +
        '<div class="dash-tabs">' + tabs + '</div>' +
        '<div id="adminPanel"></div>' +
      '</div></section>';

    renderAdminPanel();
  }
  NS.renderAdminDashboard = renderAdminDashboard;

  function renderAdminPanel() {
    const host = document.getElementById('adminPanel');
    if (!host) return;
    if (adminState.tab === 'products') host.innerHTML = adminProductsPanel();
    else if (adminState.tab === 'sellers') host.innerHTML = adminSellersPanel();
    else if (adminState.tab === 'categories') host.innerHTML = adminCategoriesPanel();
    else host.innerHTML = adminOverviewPanel();

    bindAdminPanel();
  }

  function adminOverviewPanel() {
    const products = S.getProducts();
    const sellers = S.getSellers();
    const cats = S.getCategories();
    const habis = products.filter((p) => p.stok <= 0);
    const aktif = sellers.filter((s) => s.aktif);
    const recent = products.slice().sort(U.byNewest).slice(0, 5);
    const topSellers = sellers.slice().sort((a, b) => {
      const ca = products.filter((p) => p.sellerId === a.id).length;
      const cb = products.filter((p) => p.sellerId === b.id).length;
      return cb - ca;
    }).slice(0, 5);

    return '<div class="stat-cards">' +
        statCard('Total Produk', products.length, 'Seluruh katalog', 'dark') +
        statCard('Penjual Aktif', aktif.length, sellers.length + ' akun terdaftar', 'green') +
        statCard('Total Kategori', cats.length, 'Kategori peralatan', '') +
        statCard('Stok Habis', habis.length, 'Produk perlu restock', 'accent') +
        statCard('Klik WhatsApp', S.getWaClicks(), 'Estimasi pesanan', 'green') +
      '</div>' +

      '<div class="seller-grid">' +
        '<div class="panel">' +
          '<div class="panel-head"><div><h2>Produk Terbaru</h2><p>5 produk terakhir yang masuk katalog.</p></div>' +
            '<button class="btn btn-outline btn-sm" data-act="admin-tab" data-tab="products">Kelola</button></div>' +
          '<div class="panel-body flush">' +
            '<div class="table-wrap" style="border:0;border-radius:0"><table class="tbl" style="min-width:0">' +
              '<tbody>' + recent.map((p) => {
                const seller = S.sellerById(p.sellerId);
                return '<tr>' +
                  '<td><div class="t-prod"><img src="' + U.productImage(p) + '" alt="" />' +
                    '<div><div class="t-name">' + esc(p.nama) + '</div><div class="t-sub">' + esc(seller ? seller.toko : '-') + ' · ' + esc(p.kategori) + '</div></div>' +
                  '</div></td>' +
                  '<td class="t-price">' + U.rupiah(p.harga) + '</td>' +
                  '<td>' + stockBadge(p.stok) + '</td>' +
                '</tr>';
              }).join('') + '</tbody>' +
            '</table></div>' +
          '</div>' +
        '</div>' +

        '<div class="panel">' +
          '<div class="panel-head"><div><h2>Toko Teratas</h2><p>Berdasarkan jumlah produk terdaftar.</p></div>' +
            '<button class="btn btn-outline btn-sm" data-act="admin-tab" data-tab="sellers">Kelola</button></div>' +
          '<div class="panel-body flush">' +
            '<div class="table-wrap" style="border:0;border-radius:0"><table class="tbl" style="min-width:0">' +
              '<tbody>' + topSellers.map((s) => {
                const count = products.filter((p) => p.sellerId === s.id).length;
                return '<tr>' +
                  '<td><div class="t-name">' + esc(s.toko) + '</div><div class="t-sub">' + esc(s.lokasi) + '</div></td>' +
                  '<td>' + count + ' produk</td>' +
                  '<td>' + (s.aktif ? '<span class="badge ok">Aktif</span>' : '<span class="badge off">Nonaktif</span>') + '</td>' +
                '</tr>';
              }).join('') + '</tbody>' +
            '</table></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="panel">' +
        '<div class="panel-head"><div><h2>Aksi Cepat</h2><p>Tindakan umum administrator.</p></div></div>' +
        '<div class="panel-body">' +
          '<div class="toolbar">' +
            '<button class="btn btn-dark btn-sm" data-act="admin-add-prod">' + ICO.plus + ' Tambah Produk</button>' +
            '<button class="btn btn-outline btn-sm" data-act="seller-add">' + ICO.plus + ' Tambah Penjual</button>' +
            '<button class="btn btn-outline btn-sm" data-act="cat-add">' + ICO.plus + ' Tambah Kategori</button>' +
            '<button class="btn btn-outline btn-sm" data-act="reset-demo" style="margin-left:auto;border-color:#fecdd3;color:#b3121a">Reset Data Demo</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function adminProductsPanel() {
    return '<div class="panel">' +
      '<div class="panel-head">' +
        '<div><h2>Manajemen Semua Produk</h2><p id="adminProdCount"></p></div>' +
        '<div class="toolbar">' +
          '<input class="input search" id="adminProdQ" type="search" placeholder="Cari produk / toko / merek…" value="' + esc(adminState.q) + '" aria-label="Cari produk" />' +
          '<select id="adminProdKat" aria-label="Filter kategori">' +
            '<option value="">Semua kategori</option>' +
            S.getCategories().map((c) => '<option value="' + esc(c.nama) + '"' + (adminState.kat === c.nama ? ' selected' : '') + '>' + esc(c.nama) + '</option>').join('') +
          '</select>' +
          '<button class="btn btn-red btn-sm" data-act="admin-add-prod">' + ICO.plus + ' Tambah</button>' +
        '</div>' +
      '</div>' +
      '<div class="panel-body flush" id="adminProdTable"></div>' +
    '</div>';
  }

  function adminProductRows() {
    const q = adminState.q.trim().toLowerCase();
    const products = S.getProducts().filter((p) => {
      if (adminState.kat && p.kategori !== adminState.kat) return false;
      if (!q) return true;
      const seller = S.sellerById(p.sellerId);
      return [p.nama, p.merek, p.kategori, seller ? seller.toko + ' ' + seller.lokasi : '']
        .join(' ').toLowerCase().indexOf(q) !== -1;
    }).sort(U.byNewest);

    if (!products.length) {
      return '<div class="panel-body"><div class="empty-state">' +
        '<div class="es-icon">' + ICO.box + '</div>' +
        '<h3>Tidak ada produk</h3><p>Tidak ada produk yang cocok dengan pencarian atau filter kategori.</p>' +
        '<button class="btn btn-red" data-act="admin-add-prod">Tambah Produk</button>' +
      '</div></div>';
    }

    return '<div class="table-wrap" style="border:0;border-radius:0"><table class="tbl">' +
      '<thead><tr><th>Produk</th><th>Toko</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Populer</th><th>Pemula</th><th style="text-align:right">Aksi</th></tr></thead>' +
      '<tbody>' + products.map((p) => {
        const seller = S.sellerById(p.sellerId);
        return '<tr>' +
          '<td><div class="t-prod">' +
            '<img src="' + U.productImage(p) + '" alt="" />' +
            '<div><div class="t-name">' + esc(p.nama) + '</div><div class="t-sub">' + esc(p.merek || '-') + ' · ' + esc((p.kompatibilitas || []).join(' / ')) + '</div></div>' +
          '</div></td>' +
          '<td><div class="t-name" style="font-size:12.5px">' + esc(seller ? seller.toko : '-') + '</div><div class="t-sub">' + esc(seller ? seller.lokasi : '-') + '</div></td>' +
          '<td>' + esc(p.kategori) + '</td>' +
          '<td class="t-price">' + U.rupiah(p.harga) + '</td>' +
          '<td>' + stockBadge(p.stok) + '</td>' +
          '<td><button class="badge ' + (p.populer ? 'dark' : 'off') + '" data-act="toggle-pop" data-id="' + esc(p.id) + '" title="Tandai produk populer">' + (p.populer ? '★ Populer' : '☆ Populer') + '</button></td>' +
          '<td><button class="badge ' + (p.rekomendasi ? 'red' : 'off') + '" data-act="toggle-rec" data-id="' + esc(p.id) + '" title="Tandai rekomendasi paket pemula">' + (p.rekomendasi ? '★ Pemula' : '☆ Pemula') + '</button></td>' +
          '<td><div class="t-actions">' +
            iconButton('prod-edit', p.id, 'Edit produk', ICO.edit) +
            iconButton('prod-del', p.id, 'Hapus produk', ICO.trash, true) +
          '</div></td>' +
        '</tr>';
      }).join('') + '</tbody>' +
    '</table></div>';
  }

  function refreshAdminProducts() {
    const wrap = document.getElementById('adminProdTable');
    if (wrap) wrap.innerHTML = adminProductRows();
    const count = document.getElementById('adminProdCount');
    if (count) {
      const q = adminState.q.trim().toLowerCase();
      const filtered = S.getProducts().filter((p) => {
        if (adminState.kat && p.kategori !== adminState.kat) return false;
        if (!q) return true;
        const seller = S.sellerById(p.sellerId);
        return [p.nama, p.merek, p.kategori, seller ? seller.toko + ' ' + seller.lokasi : ''].join(' ').toLowerCase().indexOf(q) !== -1;
      });
      count.textContent = filtered.length + ' dari ' + S.getProducts().length + ' produk ditampilkan';
    }
  }

  function adminSellersPanel() {
    return '<div class="panel">' +
      '<div class="panel-head">' +
        '<div><h2>Manajemen Penjual / Toko</h2><p id="adminSellerCount"></p></div>' +
        '<div class="toolbar">' +
          '<input class="input search" id="adminSellerQ" type="search" placeholder="Cari toko / lokasi / WhatsApp…" value="' + esc(adminState.sellerQ) + '" aria-label="Cari penjual" />' +
          '<button class="btn btn-red btn-sm" data-act="seller-add">' + ICO.plus + ' Tambah Penjual</button>' +
        '</div>' +
      '</div>' +
      '<div class="panel-body flush" id="adminSellerTable"></div>' +
    '</div>';
  }

  function adminSellerRows() {
    const products = S.getProducts();
    const q = adminState.sellerQ.trim().toLowerCase();
    const sellers = S.getSellers().filter((s) => {
      if (!q) return true;
      return [s.toko, s.lokasi, s.wa, s.username].join(' ').toLowerCase().indexOf(q) !== -1;
    });

    if (!sellers.length) {
      return '<div class="panel-body"><div class="empty-state"><h3>Tidak ada penjual</h3><p>Belum ada akun toko yang cocok dengan pencarian.</p></div></div>';
    }

    return '<div class="table-wrap" style="border:0;border-radius:0"><table class="tbl">' +
      '<thead><tr><th>Toko</th><th>Lokasi</th><th>WhatsApp</th><th>Username</th><th>Produk</th><th>Status</th><th style="text-align:right">Aksi</th></tr></thead>' +
      '<tbody>' + sellers.map((s) => {
        const count = products.filter((p) => p.sellerId === s.id).length;
        return '<tr>' +
          '<td><div class="t-name">' + esc(s.toko) + '</div><div class="t-sub">Bergabung ' + esc(String(s.createdAt || '').slice(0, 10) || '-') + '</div></td>' +
          '<td>' + esc(s.lokasi) + '</td>' +
          '<td class="t-price">' + esc(U.formatPhone(s.wa)) + '</td>' +
          '<td>' + esc(s.username) + '</td>' +
          '<td>' + count + '</td>' +
          '<td>' + (s.aktif ? '<span class="badge ok">Aktif</span>' : '<span class="badge off">Nonaktif</span>') + '</td>' +
          '<td><div class="t-actions">' +
            iconButton('seller-edit', s.id, 'Edit penjual', ICO.edit) +
            iconButton('seller-toggle', s.id, s.aktif ? 'Nonaktifkan toko' : 'Aktifkan toko', ICO.power) +
            iconButton('seller-del', s.id, 'Hapus penjual', ICO.trash, true) +
          '</div></td>' +
        '</tr>';
      }).join('') + '</tbody>' +
    '</table></div>';
  }

  function refreshAdminSellers() {
    const products = S.getProducts();
    const q = adminState.sellerQ.trim().toLowerCase();
    const sellers = S.getSellers().filter((s) => !q || [s.toko, s.lokasi, s.wa, s.username].join(' ').toLowerCase().indexOf(q) !== -1);
    const wrap = document.getElementById('adminSellerTable');
    if (wrap) wrap.innerHTML = adminSellerRows();
    const count = document.getElementById('adminSellerCount');
    if (count) count.textContent = sellers.length + ' dari ' + S.getSellers().length + ' toko · ' + products.length + ' produk total';
  }

  function adminCategoriesPanel() {
    const products = S.getProducts();
    const cats = S.getCategories();
    return '<div class="panel">' +
      '<div class="panel-head">' +
        '<div><h2>Manajemen Kategori</h2><p>' + cats.length + ' kategori peralatan terdaftar.</p></div>' +
        '<button class="btn btn-red btn-sm" data-act="cat-add">' + ICO.plus + ' Tambah Kategori</button>' +
      '</div>' +
      '<div class="panel-body">' +
        '<div class="category-admin-grid">' + cats.map((c) => {
          const count = products.filter((p) => p.kategori === c.nama).length;
          return '<div class="cat-admin">' +
            '<div class="ca-top"><h4>' + esc(c.nama) + '</h4>' +
              (count ? '<span class="badge ok">' + count + ' produk</span>' : '<span class="badge off">0 produk</span>') +
            '</div>' +
            '<p>' + esc(c.deskripsi || '—') + '</p>' +
            '<div class="ca-foot">' +
              '<span class="form-hint" style="margin:0">' + esc(c.slug || '') + '</span>' +
              '<button class="btn btn-outline btn-sm" data-act="cat-edit" data-id="' + esc(c.id) + '">' + ICO.edit + ' Edit</button>' +
            '</div>' +
          '</div>';
        }).join('') + '</div>' +
      '</div>' +
    '</div>';
  }

  function bindAdminPanel() {
    const q = document.getElementById('adminProdQ');
    if (q) q.addEventListener('input', () => { adminState.q = q.value; refreshAdminProducts(); });

    const kat = document.getElementById('adminProdKat');
    if (kat) kat.addEventListener('change', () => { adminState.kat = kat.value; refreshAdminProducts(); });

    const sq = document.getElementById('adminSellerQ');
    if (sq) sq.addEventListener('input', () => { adminState.sellerQ = sq.value; refreshAdminSellers(); });

    if (adminState.tab === 'products') refreshAdminProducts();
    if (adminState.tab === 'sellers') refreshAdminSellers();
  }

  /* ================================================================== */
  /* PRODUCT FORM                                                       */
  /* ================================================================== */

  function openProductForm(product, opts) {
    opts = opts || {};
    const session = S.getSession();
    const isAdmin = session && session.role === 'admin';
    const sellers = S.getSellers();
    if (!sellers.length) {
      NS.toast('Belum ada akun penjual. Tambahkan penjual terlebih dahulu.', 'error');
      return;
    }
    const editing = !!product;
    const sellerId = editing ? product.sellerId : (isAdmin ? (opts.sellerId || sellers[0].id) : session.sellerId);
    const seller = S.sellerById(sellerId) || sellers[0];
    const foto = editing && product.foto ? product.foto : '';
    const kompat = editing && product.kompatibilitas ? product.kompatibilitas : ['Android', 'iPhone', 'Laptop'];
    const catOptions = S.getCategories().map((c) => {
      const selected = editing ? product.kategori === c.nama : false;
      return '<option value="' + esc(c.nama) + '"' + (selected ? ' selected' : '') + '>' + esc(c.nama) + '</option>';
    }).join('');

    NS.openModal(
      '<div class="modal modal-md" role="dialog" aria-modal="true" aria-label="' + (editing ? 'Edit produk' : 'Tambah produk') + '">' +
        '<button class="modal-close" data-act="close-modal" aria-label="Tutup">&times;</button>' +
        '<div class="modal-head"><h2>' + (editing ? 'Edit Produk' : 'Tambah Produk Baru') + '</h2>' +
          '<p>Lengkapi informasi alat agar teknisi mudah menemukannya.</p></div>' +
        '<div class="modal-body">' +
          '<form data-form="product-save" data-id="' + (editing ? esc(product.id) : '') + '" novalidate>' +
            '<div class="form-error"></div>' +

            '<div class="field"><label for="pf-nama">Nama produk <span class="req">*</span></label>' +
              '<input id="pf-nama" name="nama" type="text" value="' + esc(editing ? product.nama : '') + '" placeholder="cth. Obeng Presisi Jakemy JM-8150" required /></div>' +

            '<div class="field-grid">' +
              '<div class="field"><label for="pf-kategori">Kategori <span class="req">*</span></label>' +
                '<select id="pf-kategori" name="kategori" required><option value="">Pilih kategori</option>' + catOptions + '</select></div>' +
              '<div class="field"><label for="pf-merek">Merek <span class="req">*</span></label>' +
                '<input id="pf-merek" name="merek" type="text" value="' + esc(editing ? product.merek : '') + '" placeholder="cth. Jakemy" required /></div>' +
            '</div>' +

            (isAdmin
              ? '<div class="field"><label for="pf-seller">Penjual / toko <span class="req">*</span></label>' +
                  '<select id="pf-seller" name="sellerId">' + sellers.map((s) =>
                    '<option value="' + esc(s.id) + '"' + (s.id === sellerId ? ' selected' : '') + '>' + esc(s.toko) + ' — ' + esc(s.lokasi) + (s.aktif ? '' : ' (nonaktif)') + '</option>').join('') +
                  '</select></div>'
              : '<input type="hidden" name="sellerId" value="' + esc(sellerId) + '" />') +

            '<div class="field">' +
              '<span class="filter-label" style="display:block;font-size:12px;font-weight:700;color:#404040;margin-bottom:6px">Kompatibilitas perangkat <span class="req" style="color:#d71920">*</span></span>' +
              '<div class="check-row">' +
                ['Android', 'iPhone', 'Laptop'].map((d) =>
                  '<label class="check-pill"><input type="checkbox" name="kompatibilitas" value="' + d + '"' + (kompat.indexOf(d) !== -1 ? ' checked' : '') + ' /> ' + d + '</label>').join('') +
              '</div>' +
            '</div>' +

            '<div class="field-grid-3">' +
              '<div class="field"><label for="pf-harga">Harga (Rp) <span class="req">*</span></label>' +
                '<input id="pf-harga" name="harga" type="number" min="1" step="1000" inputmode="numeric" value="' + (editing ? product.harga : '') + '" placeholder="135000" required /></div>' +
              '<div class="field"><label for="pf-stok">Jumlah stok <span class="req">*</span></label>' +
                '<input id="pf-stok" name="stok" type="number" min="0" step="1" inputmode="numeric" value="' + (editing ? product.stok : '') + '" placeholder="10" required /></div>' +
              '<div class="field"><label for="pf-wa">WhatsApp toko <span class="req">*</span></label>' +
                '<input id="pf-wa" name="wa" type="tel" inputmode="numeric" value="' + esc(seller.wa) + '" placeholder="628xxxxxxxxxx" required /></div>' +
            '</div>' +

            '<div class="field"><label for="pf-deskripsi">Deskripsi &amp; fungsi alat <span class="req">*</span></label>' +
              '<textarea id="pf-deskripsi" name="deskripsi" rows="4" placeholder="Jelaskan fungsi alat, bahan, dan kegunaannya untuk teknisi pemula…" required>' + esc(editing ? product.deskripsi : '') + '</textarea></div>' +

            '<div class="field">' +
              '<label for="pf-file">Foto produk</label>' +
              '<div class="upload-row">' +
                '<div class="upload-preview"><img id="pfPreview" src="' + (foto ? esc(foto) : U.placeholderImage(editing ? product.kategori : '', editing ? product.nama : 'Produk')) + '" alt="Pratinjau foto produk" /></div>' +
                '<div class="upload-meta">' +
                  '<input class="file-input" id="pf-file" name="fotoFile" type="file" accept="image/*" />' +
                  '<p class="form-hint">JPG/PNG maks. 8 MB, otomatis dikompres.</p>' +
                  '<input class="input" id="pf-fotourl" name="fotoUrl" type="url" placeholder="atau tempel URL gambar (https://…)" value="' + esc(foto && foto.indexOf('http') === 0 ? foto : '') + '" style="margin-top:8px" />' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div class="form-actions">' +
              '<button type="button" class="btn btn-outline" data-act="close-modal">Batal</button>' +
              '<button type="submit" class="btn btn-red">' + (editing ? 'Simpan Perubahan' : 'Tambah Produk') + '</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>'
    );

    const form = document.querySelector('form[data-form="product-save"]');
    if (!form) return;
    form._foto = foto;

    const preview = document.getElementById('pfPreview');
    const fileInput = document.getElementById('pf-file');
    const urlInput = document.getElementById('pf-fotourl');

    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      U.fileToJpeg(file, 900, 0.82).then((dataUrl) => {
        form._foto = dataUrl;
        preview.src = dataUrl;
        NS.toast('Foto berhasil dimuat.');
      }).catch((err) => NS.toast(err.message || 'Gagal memuat foto.', 'error'));
    });

    urlInput.addEventListener('input', () => {
      const url = urlInput.value.trim();
      if (!url) {
        form._foto = '';
        preview.src = U.placeholderImage('', 'Produk');
        return;
      }
      if (!/^https?:\/\//i.test(url)) {
        NS.toast('URL foto harus diawali http:// atau https://', 'error');
        return;
      }
      form._foto = url;
      preview.src = url;
    });

    const sellerSelect = document.getElementById('pf-seller');
    if (sellerSelect) {
      sellerSelect.addEventListener('change', () => {
        const s = S.sellerById(sellerSelect.value);
        const waInput = form.querySelector('[name="wa"]');
        if (s && waInput) waInput.value = s.wa;
      });
    }
  }
  NS.openProductForm = openProductForm;

  NS.forms['product-save'] = function (form) {
    clearError(form);
    const data = new FormData(form);
    const editingId = form.dataset.id;
    const nama = String(data.get('nama') || '').trim();
    const kategori = String(data.get('kategori') || '').trim();
    const merek = String(data.get('merek') || '').trim();
    const deskripsi = String(data.get('deskripsi') || '').trim();
    const sellerId = String(data.get('sellerId') || '');
    const kompatibilitas = data.getAll('kompatibilitas').map(String);
    const harga = Number(data.get('harga'));
    const stok = Number(data.get('stok'));
    const wa = NS.normalizeWa(data.get('wa'));

    if (nama.length < 4) return NS.formError(form, 'Nama produk minimal 4 karakter.');
    if (!kategori) return NS.formError(form, 'Pilih kategori produk.');
    if (merek.length < 2) return NS.formError(form, 'Merek produk wajib diisi.');
    if (!kompatibilitas.length) return NS.formError(form, 'Pilih minimal satu jenis perangkat yang kompatibel.');
    if (!Number.isFinite(harga) || !Number.isInteger(harga) || harga <= 0) {
      return NS.formError(form, 'Harga harus berupa angka bulat lebih dari 0 (tidak boleh negatif).');
    }
    if (!Number.isFinite(stok) || !Number.isInteger(stok) || stok < 0) {
      return NS.formError(form, 'Jumlah stok harus angka bulat 0 atau lebih.');
    }
    if (deskripsi.length < 15) return NS.formError(form, 'Deskripsi minimal 15 karakter agar teknisi paham fungsi alat.');
    if (!/^62\d{8,13}$/.test(wa)) return NS.formError(form, 'Nomor WhatsApp tidak valid. Gunakan format 628xxxxxxxxxx.');

    const sellers = S.getSellers();
    const sIdx = sellers.findIndex((s) => s.id === sellerId);
    if (sIdx === -1) return NS.formError(form, 'Pilih penjual/toko yang valid.');
    if (sellers[sIdx].wa !== wa) {
      sellers[sIdx] = Object.assign({}, sellers[sIdx], { wa: wa });
      if (!S.saveSellers(sellers)) return NS.formError(form, 'Gagal menyimpan nomor WhatsApp.');
    }

    const list = S.getProducts();
    if (editingId) {
      const idx = list.findIndex((p) => p.id === editingId);
      if (idx === -1) return NS.formError(form, 'Produk tidak ditemukan. Mungkin sudah dihapus.');
      list[idx] = Object.assign({}, list[idx], {
        nama: nama,
        kategori: kategori,
        merek: merek,
        deskripsi: deskripsi,
        sellerId: sellerId,
        kompatibilitas: kompatibilitas,
        harga: harga,
        stok: stok,
        foto: form._foto || ''
      });
    } else {
      list.push({
        id: 'prd-' + Date.now().toString(36),
        nama: nama,
        kategori: kategori,
        merek: merek,
        deskripsi: deskripsi,
        sellerId: sellerId,
        kompatibilitas: kompatibilitas,
        harga: harga,
        stok: stok,
        foto: form._foto || '',
        populer: false,
        rekomendasi: false,
        createdAt: new Date().toISOString()
      });
    }

    if (!S.saveProducts(list)) return NS.formError(form, 'Gagal menyimpan produk. Penyimpanan browser penuh.');

    NS.closeModal();
    NS.rerender();
    NS.toast(editingId ? 'Produk berhasil diperbarui.' : 'Produk baru berhasil ditambahkan.');
  };

  /* ================================================================== */
  /* SELLER FORM (admin)                                                */
  /* ================================================================== */

  function openSellerForm(seller) {
    const editing = !!seller;
    const cities = ['Banda Aceh', 'Lhokseumawe', 'Meulaboh', 'Langsa', 'Sigli', 'Takengon', 'Calang', 'Sabang'];

    NS.openModal(
      '<div class="modal modal-md" role="dialog" aria-modal="true" aria-label="' + (editing ? 'Edit penjual' : 'Tambah penjual') + '">' +
        '<button class="modal-close" data-act="close-modal" aria-label="Tutup">&times;</button>' +
        '<div class="modal-head"><h2>' + (editing ? 'Edit Akun Penjual' : 'Tambah Akun Penjual') + '</h2>' +
          '<p>Akun penjual dapat mengelola produk tokonya sendiri.</p></div>' +
        '<div class="modal-body">' +
          '<form data-form="seller-save" data-id="' + (editing ? esc(seller.id) : '') + '" novalidate>' +
            '<div class="form-error"></div>' +
            '<div class="field"><label for="sf-toko">Nama toko <span class="req">*</span></label>' +
              '<input id="sf-toko" name="toko" type="text" value="' + esc(editing ? seller.toko : '') + '" required /></div>' +
            '<div class="field-grid">' +
              '<div class="field"><label for="sf-lokasi">Kota / kabupaten <span class="req">*</span></label>' +
                '<input id="sf-lokasi" name="lokasi" type="text" list="sfCities" value="' + esc(editing ? seller.lokasi : '') + '" required />' +
                '<datalist id="sfCities">' + cities.map((c) => '<option>' + c + '</option>').join('') + '</datalist></div>' +
              '<div class="field"><label for="sf-wa">Nomor WhatsApp <span class="req">*</span></label>' +
                '<input id="sf-wa" name="wa" type="tel" inputmode="numeric" value="' + esc(editing ? seller.wa : '628') + '" required /></div>' +
            '</div>' +
            '<div class="field-grid">' +
              '<div class="field"><label for="sf-user">Username <span class="req">*</span></label>' +
                '<input id="sf-user" name="username" type="text" value="' + esc(editing ? seller.username : '') + '" required /></div>' +
              '<div class="field"><label for="sf-pass">Password ' + (editing ? '' : '<span class="req">*</span>') + '</label>' +
                '<input id="sf-pass" name="password" type="text" value="" placeholder="' + (editing ? 'Kosongkan jika tidak diubah' : 'min. 5 karakter') + '" /></div>' +
            '</div>' +
            '<label class="check-pill" style="margin-bottom:6px"><input type="checkbox" name="aktif"' + (!editing || seller.aktif ? ' checked' : '') + ' /> Toko aktif</label>' +
            '<div class="form-actions">' +
              '<button type="button" class="btn btn-outline" data-act="close-modal">Batal</button>' +
              '<button type="submit" class="btn btn-red">' + (editing ? 'Simpan Perubahan' : 'Tambah Penjual') + '</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>'
    );
  }
  NS.openSellerForm = openSellerForm;

  NS.forms['seller-save'] = function (form) {
    clearError(form);
    const data = new FormData(form);
    const editingId = form.dataset.id;
    const toko = String(data.get('toko') || '').trim();
    const lokasi = String(data.get('lokasi') || '').trim();
    const wa = NS.normalizeWa(data.get('wa'));
    const username = String(data.get('username') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    const aktif = data.get('aktif') === 'on';

    if (toko.length < 3) return NS.formError(form, 'Nama toko minimal 3 karakter.');
    if (lokasi.length < 3) return NS.formError(form, 'Kota/kabupaten wajib diisi.');
    if (!/^62\d{8,13}$/.test(wa)) return NS.formError(form, 'Nomor WhatsApp tidak valid. Gunakan format 628xxxxxxxxxx.');
    if (!/^[a-z0-9._-]{3,20}$/.test(username)) return NS.formError(form, 'Username 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.');
    if (!editingId && password.length < 5) return NS.formError(form, 'Password minimal 5 karakter.');
    if (editingId && password && password.length < 5) return NS.formError(form, 'Password baru minimal 5 karakter.');

    const sellers = S.getSellers();
    if (sellers.some((s) => String(s.username || '').toLowerCase() === username && s.id !== editingId)) {
      return NS.formError(form, 'Username sudah dipakai penjual lain.');
    }

    if (editingId) {
      const idx = sellers.findIndex((s) => s.id === editingId);
      if (idx === -1) return NS.formError(form, 'Penjual tidak ditemukan.');
      sellers[idx] = Object.assign({}, sellers[idx], {
        toko: toko, lokasi: lokasi, wa: wa, username: username, aktif: aktif
      }, password ? { password: password } : {});
    } else {
      sellers.push({
        id: 'slr-' + Date.now().toString(36),
        toko: toko, lokasi: lokasi, wa: wa, username: username,
        password: password, aktif: aktif, createdAt: new Date().toISOString()
      });
    }

    if (!S.saveSellers(sellers)) return NS.formError(form, 'Gagal menyimpan data penjual.');
    NS.closeModal();
    NS.rerender();
    NS.toast(editingId ? 'Data penjual diperbarui.' : 'Penjual baru ditambahkan.');
  };

  /* ================================================================== */
  /* CATEGORY FORM                                                      */
  /* ================================================================== */

  function openCategoryForm(cat) {
    const editing = !!cat;
    NS.openModal(
      '<div class="modal" role="dialog" aria-modal="true" aria-label="' + (editing ? 'Edit kategori' : 'Tambah kategori') + '">' +
        '<button class="modal-close" data-act="close-modal" aria-label="Tutup">&times;</button>' +
        '<div class="modal-head"><h2>' + (editing ? 'Edit Kategori' : 'Tambah Kategori') + '</h2>' +
          '<p>Kategori membantu pembeli menemukan alat yang tepat.</p></div>' +
        '<div class="modal-body">' +
          '<form data-form="category-save" data-id="' + (editing ? esc(cat.id) : '') + '" novalidate>' +
            '<div class="form-error"></div>' +
            '<div class="field"><label for="cf-nama">Nama kategori <span class="req">*</span></label>' +
              '<input id="cf-nama" name="nama" type="text" value="' + esc(editing ? cat.nama : '') + '" placeholder="cth. Hot Air Rework" required /></div>' +
            '<div class="field"><label for="cf-desk">Deskripsi singkat</label>' +
              '<textarea id="cf-desk" name="deskripsi" rows="3" placeholder="Jelaskan jenis peralatan pada kategori ini…">' + esc(editing ? cat.deskripsi : '') + '</textarea></div>' +
            (editing ? '<p class="form-hint">Mengubah nama kategori juga memperbarui kategori pada produk terkait.</p>' : '') +
            '<div class="form-actions">' +
              '<button type="button" class="btn btn-outline" data-act="close-modal">Batal</button>' +
              '<button type="submit" class="btn btn-red">' + (editing ? 'Simpan' : 'Tambah Kategori') + '</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>'
    );
  }
  NS.openCategoryForm = openCategoryForm;

  NS.forms['category-save'] = function (form) {
    clearError(form);
    const data = new FormData(form);
    const editingId = form.dataset.id;
    const nama = String(data.get('nama') || '').trim();
    const deskripsi = String(data.get('deskripsi') || '').trim();

    if (nama.length < 3) return NS.formError(form, 'Nama kategori minimal 3 karakter.');

    const cats = S.getCategories();
    if (cats.some((c) => c.nama.toLowerCase() === nama.toLowerCase() && c.id !== editingId)) {
      return NS.formError(form, 'Nama kategori sudah ada.');
    }

    const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    if (editingId) {
      const idx = cats.findIndex((c) => c.id === editingId);
      if (idx === -1) return NS.formError(form, 'Kategori tidak ditemukan.');
      const oldName = cats[idx].nama;
      cats[idx] = Object.assign({}, cats[idx], { nama: nama, slug: slug, deskripsi: deskripsi });

      if (oldName !== nama) {
        const products = S.getProducts().map((p) => p.kategori === oldName ? Object.assign({}, p, { kategori: nama }) : p);
        S.saveProducts(products);
      }
    } else {
      cats.push({ id: 'cat-' + Date.now().toString(36), nama: nama, slug: slug, deskripsi: deskripsi });
    }

    if (!S.saveCategories(cats)) return NS.formError(form, 'Gagal menyimpan kategori.');
    NS.closeModal();
    NS.rerender();
    NS.toast(editingId ? 'Kategori diperbarui.' : 'Kategori baru ditambahkan.');
  };

  /* ================================================================== */
  /* SELLER SETTINGS                                                    */
  /* ================================================================== */

  NS.forms['seller-settings'] = function (form) {
    clearError(form);
    const session = S.getSession();
    if (!session || session.role !== 'seller') return NS.formError(form, 'Sesi login tidak valid. Silakan login ulang.');
    const data = new FormData(form);
    const toko = String(data.get('toko') || '').trim();
    const lokasi = String(data.get('lokasi') || '').trim();
    const wa = NS.normalizeWa(data.get('wa'));

    if (toko.length < 3) return NS.formError(form, 'Nama toko minimal 3 karakter.');
    if (lokasi.length < 3) return NS.formError(form, 'Kota/kabupaten wajib diisi.');
    if (!/^62\d{8,13}$/.test(wa)) return NS.formError(form, 'Nomor WhatsApp tidak valid. Gunakan format 628xxxxxxxxxx.');

    const sellers = S.getSellers();
    const idx = sellers.findIndex((s) => s.id === session.sellerId);
    if (idx === -1) return NS.formError(form, 'Akun toko tidak ditemukan.');
    sellers[idx] = Object.assign({}, sellers[idx], { toko: toko, lokasi: lokasi, wa: wa });
    if (!S.saveSellers(sellers)) return NS.formError(form, 'Gagal menyimpan pengaturan toko.');

    S.setSession(Object.assign({}, session, { nama: toko }));
    NS.auth.refresh();
    NS.rerender();
    NS.toast('Pengaturan toko disimpan.');
  };

  /* ================================================================== */
  /* ADMIN ACTIONS                                                      */
  /* ================================================================== */

  function requireAdmin(btn) {
    const s = S.getSession();
    if (!s || s.role !== 'admin') {
      NS.toast('Aksi ini hanya untuk admin.', 'error');
      return false;
    }
    return true;
  }

  Object.assign(NS.actions, {
    'admin-tab': (btn) => {
      adminState.tab = btn.dataset.tab || 'overview';
      renderAdminDashboard();
    },
    'prod-add': () => {
      const s = S.getSession();
      if (!s || s.role !== 'seller') return NS.toast('Login sebagai penjual untuk menambah produk.', 'error');
      openProductForm(null, { sellerId: s.sellerId });
    },
    'admin-add-prod': () => {
      if (!requireAdmin()) return;
      openProductForm(null, {});
    },
    'prod-edit': (btn) => {
      const product = S.getProducts().find((p) => p.id === btn.dataset.id);
      if (!product) return NS.toast('Produk tidak ditemukan.', 'error');
      const s = S.getSession();
      if (!s) return;
      if (s.role === 'seller' && product.sellerId !== s.sellerId) {
        return NS.toast('Kamu hanya bisa mengedit produk toko sendiri.', 'error');
      }
      openProductForm(product);
    },
    'prod-del': (btn) => {
      const product = S.getProducts().find((p) => p.id === btn.dataset.id);
      if (!product) return NS.toast('Produk tidak ditemukan.', 'error');
      const s = S.getSession();
      if (!s) return;
      if (s.role === 'seller' && product.sellerId !== s.sellerId) {
        return NS.toast('Kamu hanya bisa menghapus produk toko sendiri.', 'error');
      }
      NS.confirm({
        title: 'Hapus produk?',
        html: 'Produk <strong>' + esc(product.nama) + '</strong> akan dihapus permanen dari katalog.',
        confirmLabel: 'Ya, hapus',
        onConfirm: () => {
          S.saveProducts(S.getProducts().filter((p) => p.id !== product.id));
          NS.rerender();
          NS.toast('Produk dihapus.');
        }
      });
    },
    'toggle-pop': (btn) => {
      if (!requireAdmin()) return;
      const list = S.getProducts();
      const idx = list.findIndex((p) => p.id === btn.dataset.id);
      if (idx === -1) return;
      list[idx] = Object.assign({}, list[idx], { populer: !list[idx].populer });
      S.saveProducts(list);
      NS.rerender();
      NS.toast(list[idx].populer ? 'Produk ditandai populer.' : 'Tanda populer dilepas.');
    },
    'toggle-rec': (btn) => {
      if (!requireAdmin()) return;
      const list = S.getProducts();
      const idx = list.findIndex((p) => p.id === btn.dataset.id);
      if (idx === -1) return;
      list[idx] = Object.assign({}, list[idx], { rekomendasi: !list[idx].rekomendasi });
      S.saveProducts(list);
      NS.rerender();
      NS.toast(list[idx].rekomendasi ? 'Produk masuk rekomendasi paket pemula.' : 'Rekomendasi dilepas.');
    },
    'seller-add': () => {
      if (!requireAdmin()) return;
      openSellerForm(null);
    },
    'seller-edit': (btn) => {
      if (!requireAdmin()) return;
      const seller = S.sellerById(btn.dataset.id);
      if (!seller) return NS.toast('Penjual tidak ditemukan.', 'error');
      openSellerForm(seller);
    },
    'seller-toggle': (btn) => {
      if (!requireAdmin()) return;
      const sellers = S.getSellers();
      const idx = sellers.findIndex((s) => s.id === btn.dataset.id);
      if (idx === -1) return;
      sellers[idx] = Object.assign({}, sellers[idx], { aktif: !sellers[idx].aktif });
      S.saveSellers(sellers);
      NS.toast(sellers[idx].aktif ? 'Toko diaktifkan.' : 'Toko dinonaktifkan.');
      NS.rerender();
    },
    'seller-del': (btn) => {
      if (!requireAdmin()) return;
      const seller = S.sellerById(btn.dataset.id);
      if (!seller) return NS.toast('Penjual tidak ditemukan.', 'error');
      const count = S.getProducts().filter((p) => p.sellerId === seller.id).length;
      const current = S.getSession();
      if (current && current.role === 'seller' && current.sellerId === seller.id) {
        return NS.toast('Kamu tidak bisa menghapus akun toko sendiri.', 'error');
      }
      NS.confirm({
        title: 'Hapus akun penjual?',
        html: 'Akun <strong>' + esc(seller.toko) + '</strong> beserta <strong>' + count + ' produk</strong> miliknya akan dihapus permanen.',
        confirmLabel: 'Ya, hapus toko',
        onConfirm: () => {
          S.saveSellers(S.getSellers().filter((s) => s.id !== seller.id));
          S.saveProducts(S.getProducts().filter((p) => p.sellerId !== seller.id));
          NS.rerender();
          NS.toast('Toko dan produknya dihapus.');
        }
      });
    },
    'cat-add': () => {
      if (!requireAdmin()) return;
      openCategoryForm(null);
    },
    'cat-edit': (btn) => {
      if (!requireAdmin()) return;
      const cat = S.getCategories().find((c) => c.id === btn.dataset.id);
      if (!cat) return NS.toast('Kategori tidak ditemukan.', 'error');
      openCategoryForm(cat);
    },
    'reset-demo': () => {
      if (!requireAdmin()) return;
      NS.confirm({
        title: 'Reset data demo?',
        html: 'Semua perubahan produk, penjual, kategori, dan sesi login akan dikembalikan ke data awal. Tindakan ini tidak bisa dibatalkan.',
        confirmLabel: 'Ya, reset data',
        onConfirm: () => {
          S.resetDemo();
          NS.auth.refresh();
          location.hash = '#/home';
          NS.rerender();
          NS.toast('Data demo berhasil direset.');
        }
      });
    }
  });
})();
