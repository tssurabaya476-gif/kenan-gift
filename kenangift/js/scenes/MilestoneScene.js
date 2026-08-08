/* ==========================================================================
   LITTLE MIRACLE — Milestone Scene Controller (Phase 10)
   Physical Stats, Skill Achievements Checklist & Favorite Things
   ========================================================================== */

export class MilestoneScene {
  constructor(appData, router) {
    this.appData = appData;
    this.router = router;
    this.container = document.getElementById('scene-milestone');
  }

  async onEnter() {
    this.render();
    this.bindEvents();
    this.animate();
  }

  render() {
    const profile = this.appData.profile || {};
    const milestones = this.appData.milestones || {};

    this.container.innerHTML = `
      <div class="milestone-header">
        <span class="milestone-badge">✦ ADEGAN 07 — PENCAPAIAN HEBAT KENAN ✦</span>
        <h2 class="milestone-title">Pencapaian 7 Bulan ${profile.nickname || 'Kenan'} Kesayangan Tante</h2>
        <p style="color: var(--color-text-muted); margin-top: 0.5rem;">
          Merayakan setiap kelincahan, senyuman, dan kepintaran baru keponakan ganteng Tante.
        </p>
      </div>

      <!-- Developmental Skills Checklist -->
      <div class="milestone-skills-wrapper">
        <h3 class="skills-title">✨ Pencapaian Hebat Usia 7 Bulan</h3>
        <div class="skills-grid">
          <div class="skill-item-card">
            <div class="skill-check">✓</div>
            <span class="skill-label">Lincah berguling sendiri</span>
          </div>
          <div class="skill-item-card">
            <div class="skill-check">✓</div>
            <span class="skill-label">Duduk tegak penuh percaya diri</span>
          </div>
          <div class="skill-item-card">
            <div class="skill-check">✓</div>
            <span class="skill-label">Lahap menikmati MPASI favorit</span>
          </div>
          <div class="skill-item-card">
            <div class="skill-check">✓</div>
            <span class="skill-label">Mengenali suara Tante & bergumam gembira</span>
          </div>
          <div class="skill-item-card">
            <div class="skill-check">✓</div>
            <span class="skill-label">Pintar meraih dan menggenggam mainan</span>
          </div>
          <div class="skill-item-card">
            <div class="skill-check">✓</div>
            <span class="skill-label">Menyebarkan senyuman gemoy setiap hari</span>
          </div>
        </div>
      </div>

      <button id="milestone-next-btn" class="milestone-cta-btn">
        Lihat Doa & Perayaan Penutup →
      </button>
    `;
  }

  bindEvents() {
    const nextBtn = document.getElementById('milestone-next-btn');
    if (nextBtn && this.router) {
      nextBtn.addEventListener('click', () => {
        this.router.navigateTo('ending');
      });
    }
  }

  animate() {
    if (window.gsap) {
      gsap.fromTo('.milestone-header', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('.milestone-skills-wrapper', 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: 'back.out(1.2)' }
      );

      gsap.fromTo('#milestone-next-btn', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' }
      );
    }
  }

  async onExit() {
    this.container.style.display = 'none';
  }
}
