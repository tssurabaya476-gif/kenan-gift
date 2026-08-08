/* ==========================================================================
   LITTLE MIRACLE — Timeline Journey Scene Controller (Phase 06)
   Renders Monthly Growth Milestones with GSAP Staggered Entrance
   ========================================================================== */

export class TimelineScene {
  constructor(appData, router) {
    this.appData = appData;
    this.router = router;
    this.container = document.getElementById('scene-timeline');
  }

  async onEnter() {
    this.render();
    this.bindEvents();
    this.animate();
  }

  getIconForMonth(month) {
    const icons = {
      1: '👶',
      2: '👀',
      3: '🚼',
      4: '🔄',
      5: '🧸',
      6: '🥑',
      7: '👑'
    };
    return icons[month] || '✨';
  }

  render() {
    const milestonesData = this.appData.milestones || {};
    const achievements = milestonesData.achievements || [];
    const profile = this.appData.profile || {};

    const itemsHTML = achievements.map((item) => {
      const icon = this.getIconForMonth(item.month);
      return `
        <div class="timeline-item">
          <div class="timeline-node">${icon}</div>
          <div class="timeline-card">
            <span class="month-pill">Bulan 0${item.month}</span>
            <h3 class="timeline-card-title">${item.title}</h3>
            <p class="timeline-card-desc">${item.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="timeline-header">
        <span class="timeline-badge">✦ ADEGAN 04 — ALUR PERJALANAN 7 BULAN ✦</span>
        <h2 class="timeline-title">Perjalanan Tumbuh Kembang ${profile.nickname || 'Kenan'}</h2>
        <p style="color: var(--color-text-muted); margin-top: 0.5rem;">
          Dari kehangatan hari pertama hingga usia 7 bulan ini, Tante selalu bangga dan bahagia melihat setiap momen indahmu.
        </p>
      </div>

      <div class="timeline-container">
        ${itemsHTML}
      </div>

      <button id="timeline-next-btn" class="timeline-cta-btn">
        Lihat Galeri Senyuman Kenan →
      </button>
    `;
  }

  bindEvents() {
    const nextBtn = document.getElementById('timeline-next-btn');
    if (nextBtn && this.router) {
      nextBtn.addEventListener('click', () => {
        this.router.navigateTo('gallery');
      });
    }
  }

  animate() {
    if (window.gsap) {
      gsap.fromTo('.timeline-header', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('.timeline-item', 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, stagger: 0.15, ease: 'power2.out' }
      );

      gsap.fromTo('#timeline-next-btn', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 1.4, ease: 'power2.out' }
      );
    }
  }

  async onExit() {
    this.container.style.display = 'none';
  }
}
