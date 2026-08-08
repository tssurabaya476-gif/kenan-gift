/* ==========================================================================
   LITTLE MIRACLE — Hero Baby Scene Controller (Phase 05 Enhanced)
   Presents Hero Photo, Identity, Quick Stats, Photo Modal, and Live Age Counter
   ========================================================================== */

export class HeroScene {
  constructor(appData, router) {
    this.appData = appData;
    this.router = router;
    this.container = document.getElementById('scene-hero');
  }

  async onEnter() {
    this.render();
    this.bindEvents();
    this.animate();
  }

  calculateAge(birthDateString) {
    const birth = new Date(birthDateString || '2026-02-28');
    const now = new Date();
    const diffTime = Math.abs(now - birth);
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = 7;
    const hours = Math.floor(diffTime / (1000 * 60 * 60));

    return { months, weeks, days, hours };
  }

  render() {
    const profile = this.appData.profile || {};
    const age = this.calculateAge(profile.birthDate);

    this.container.innerHTML = `
      <div class="hero-badge">👑 ADEGAN 03 — KEPONAKAN KESAYANGAN TANTE</div>

      <div id="hero-photo-trigger" class="hero-portrait-wrapper" title="Klik untuk melihat foto penuh">
        <div class="hero-crown-tag">👑</div>
        <div class="hero-portrait-frame">
          <video class="hero-portrait-img" src="assets/videos/hero_video.mp4" autoplay muted loop playsinline></video>
        </div>
      </div>

      <div>
        <h1 class="hero-name">${profile.fullName} <span>(${profile.nickname})</span></h1>
        <p class="hero-parents">Keponakan Tercinta dari Tante Tersayang • Putra dari ${profile.fatherName} & ${profile.motherName}</p>
      </div>

      <!-- Live Age Counter Grid -->
      <div class="hero-counter-grid">
        <div class="counter-card">
          <div class="counter-number">${age.months}</div>
          <div class="counter-label">Bulan Cinta</div>
        </div>
        <div class="counter-card">
          <div class="counter-number">${age.weeks}</div>
          <div class="counter-label">Minggu Bahagia</div>
        </div>
        <div class="counter-card">
          <div class="counter-number">${age.days}</div>
          <div class="counter-label">Hari Ceria</div>
        </div>
        <div class="counter-card">
          <div class="counter-number">${age.hours.toLocaleString()}</div>
          <div class="counter-label">Jam Kasih Sayang</div>
        </div>
      </div>

      <button id="hero-next-btn" class="hero-cta-btn">
        Lihat Alur Perjalanan Tumbuh Kembang ↓
      </button>

      <!-- Photo Fullscreen Zoom Modal -->
      <div id="hero-modal" class="hero-modal">
        <button id="hero-modal-close" class="hero-modal-close">✕</button>
        <div class="hero-modal-content">
          <video class="hero-modal-img" src="assets/videos/hero_video.mp4" controls muted autoplay loop playsinline></video>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const photoTrigger = document.getElementById('hero-photo-trigger');
    const modal = document.getElementById('hero-modal');
    const modalClose = document.getElementById('hero-modal-close');
    const nextBtn = document.getElementById('hero-next-btn');

    if (photoTrigger && modal) {
      photoTrigger.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }

    if (modalClose && modal) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }

    if (nextBtn && this.router) {
      nextBtn.addEventListener('click', () => {
        this.router.navigateTo('timeline');
      });
    }
  }

  animate() {
    if (window.gsap) {
      gsap.fromTo('.hero-badge', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('.hero-portrait-wrapper', 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 1.2, delay: 0.2, ease: 'back.out(1.5)' }
      );

      gsap.fromTo('.hero-name', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: 'power2.out' }
      );

      gsap.fromTo('.counter-card', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.7, stagger: 0.15, ease: 'power2.out' }
      );

      gsap.fromTo('#hero-next-btn', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: 'power2.out' }
      );
    }
  }

  async onExit() {
    this.container.style.display = 'none';
  }
}
