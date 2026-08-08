/* ==========================================================================
   LITTLE MIRACLE — Photo Gallery Scene Controller (Phase 13 Optimized)
   Filter Tabs, Ken Burns Cards, Lightbox Modal with Lazy Loading & Fallbacks
   ========================================================================== */

export class GalleryScene {
  constructor(appData, router) {
    this.appData = appData;
    this.router = router;
    this.container = document.getElementById('scene-gallery');
    this.photos = this.appData.gallery || [];
    this.currentActiveCategory = 'Semua';
    this.currentLightboxIndex = 0;
  }

  async onEnter() {
    this.render();
    this.bindEvents();
    this.animate();
  }

  render() {
    const profile = this.appData.profile || {};
    const categories = ['Semua', ...new Set(this.photos.map(p => p.category))];

    const filterButtonsHTML = categories.map(cat => `
      <button class="filter-btn ${cat === this.currentActiveCategory ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    this.container.innerHTML = `
      <div class="gallery-header">
        <span class="gallery-badge">✦ ADEGAN 05 — GALERI SENYUMAN KENAN ✦</span>
        <h2 class="gallery-title">Video-Video Manis ${profile.nickname || 'Kenan'}</h2>
        <p style="color: var(--color-text-muted); margin-top: 0.5rem;">
          Senyuman manis, tawa ceria, dan setiap momen berharga keponakan Tante yang terekam indah.
        </p>
      </div>

      <!-- Category Filters -->
      <div class="gallery-filters">
        ${filterButtonsHTML}
      </div>

      <!-- Photo Grid -->
      <div id="gallery-grid" class="gallery-grid">
        ${this.renderPhotoCards()}
      </div>

      <button id="gallery-next-btn" class="gallery-cta-btn">
        Tonton Video Kebersamaan →
      </button>

      <!-- Lightbox Modal -->
      <div id="lightbox-modal" class="lightbox-modal">
        <button id="lightbox-prev-btn" class="lightbox-nav-btn lightbox-prev" aria-label="Foto Sebelumnya">‹</button>
        <button id="lightbox-next-nav-btn" class="lightbox-nav-btn lightbox-next" aria-label="Foto Selanjutnya">›</button>

        <div class="lightbox-card">
          <button id="lightbox-close-btn" class="lightbox-close-btn" aria-label="Tutup Pratinjau">✕</button>
          <div class="lightbox-img-box">
            <img id="lightbox-img" class="lightbox-img" src="" alt="Pratinjau Galeri" loading="lazy" decoding="async">
            <video id="lightbox-video" class="lightbox-img" controls playsinline style="display:none;"></video>
          </div>
          <div class="lightbox-info">
            <span id="lightbox-category" class="gallery-card-category">Kategori</span>
            <h3 id="lightbox-title" class="gallery-card-title">Judul</h3>
            <p id="lightbox-caption" class="gallery-card-caption">Keterangan</p>
          </div>
        </div>
      </div>
    `;
  }

  renderPhotoCards() {
    const filtered = this.currentActiveCategory === 'Semua' 
      ? this.photos 
      : this.photos.filter(p => p.category === this.currentActiveCategory);

    if (filtered.length === 0) {
      return `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Tidak ada video dalam kategori ini.</p>`;
    }

    return filtered.map((photo, index) => {
      const isVideo = /\.mp4($|\?)/i.test(photo.src);
      const mediaHTML = isVideo
        ? `<video class="gallery-img" src="${photo.src}" muted loop autoplay playsinline></video>
           <span class="gallery-video-badge">▶ Video</span>`
        : `<img class="gallery-img" src="${photo.src}" alt="${photo.title}" loading="lazy" decoding="async" onerror="this.src='assets/photos/hero_baby.jpg'">`;

      return `
      <div class="gallery-card" data-index="${index}" data-photo-id="${photo.id}">
        <div class="gallery-img-wrapper">
          ${mediaHTML}
        </div>
        <div class="gallery-card-content">
          <span class="gallery-card-category">${photo.category}</span>
          <h3 class="gallery-card-title">${photo.title}</h3>
          <p class="gallery-card-caption">${photo.caption}</p>
        </div>
      </div>
    `;
    }).join('');
  }

  bindEvents() {
    // 1. Filter tabs
    const filterBtns = this.container.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentActiveCategory = btn.getAttribute('data-category');
        const grid = document.getElementById('gallery-grid');
        if (grid) {
          grid.innerHTML = this.renderPhotoCards();
          this.bindCardClicks();
          this.animateCards();
        }
      });
    });

    // 2. Card Clicks (Open Lightbox)
    this.bindCardClicks();

    // 3. Lightbox Controls
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtnNav = document.getElementById('lightbox-next-nav-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        this.pauseLightboxVideo();
      });
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          this.pauseLightboxVideo();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    }
    if (nextBtnNav) {
      nextBtnNav.addEventListener('click', () => this.navigateLightbox(1));
    }

    // 4. CTA Button Navigation
    const nextBtn = document.getElementById('gallery-next-btn');
    if (nextBtn && this.router) {
      nextBtn.addEventListener('click', () => {
        this.router.navigateTo('video');
      });
    }
  }

  bindCardClicks() {
    const cards = this.container.querySelectorAll('.gallery-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const photoId = parseInt(card.getAttribute('data-photo-id'));
        const index = this.photos.findIndex(p => p.id === photoId);
        if (index !== -1) {
          this.openLightbox(index);
        }
      });
    });
  }

  openLightbox(index) {
    this.currentLightboxIndex = index;
    const photo = this.photos[index];
    if (!photo) return;

    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    const cat = document.getElementById('lightbox-category');
    const title = document.getElementById('lightbox-title');
    const caption = document.getElementById('lightbox-caption');

    const isVideo = /\.mp4($|\?)/i.test(photo.src);

    if (video) video.pause();

    if (isVideo) {
      if (video) { video.src = photo.src; video.style.display = 'block'; video.play().catch(() => {}); }
      if (img) { img.style.display = 'none'; img.src = ''; }
    } else {
      if (img) { img.src = photo.src; img.style.display = 'block'; }
      if (video) { video.style.display = 'none'; video.src = ''; }
    }

    if (cat) cat.textContent = photo.category;
    if (title) title.textContent = photo.title;
    if (caption) caption.textContent = photo.caption;

    if (modal) modal.classList.add('active');
  }

  pauseLightboxVideo() {
    const video = document.getElementById('lightbox-video');
    if (video) video.pause();
  }

  navigateLightbox(direction) {
    let newIndex = this.currentLightboxIndex + direction;
    if (newIndex < 0) newIndex = this.photos.length - 1;
    if (newIndex >= this.photos.length) newIndex = 0;
    this.openLightbox(newIndex);
  }

  animate() {
    if (window.gsap) {
      gsap.fromTo('.gallery-header', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('.gallery-filters', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      );

      this.animateCards();
    }
  }

  animateCards() {
    if (window.gsap) {
      gsap.fromTo('.gallery-card', 
        { opacity: 0, y: 30, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.4, stagger: 0.12, ease: 'back.out(1.2)' }
      );
    }
  }

  async onExit() {
    this.container.style.display = 'none';
  }
}
