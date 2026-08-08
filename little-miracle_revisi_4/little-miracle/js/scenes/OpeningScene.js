/* ==========================================================================
   LITTLE MIRACLE — Opening Scene Controller (Phase 04)
   Cinematic Story Intro Reveal
   ========================================================================== */

export class OpeningScene {
  constructor(appData, router) {
    this.appData = appData;
    this.router = router;
    this.container = document.getElementById('scene-opening');
  }

  async onEnter() {
    this.render();
    this.animate();
  }

  render() {
    const profile = this.appData.profile || {};
    this.container.innerHTML = `
      <div class="opening-badge">✦ ADEGAN 02 — UNGKAPAN KASIH SAYANG TANTE ✦</div>
      
      <h2 id="opening-title" class="opening-story-text">
        Untuk Keponakan Ganteng Tante Kesayangan...<br>
        Tujuh bulan lalu, hadirnya malaikat kecil bernama ${profile.nickname || 'Kenan'} membawa kehangatan, tawa, dan kebahagiaan tak terhingga untuk Tante dan seluruh keluarga.
      </h2>
      
      <p id="opening-quote" class="opening-quote glass-card" style="padding: 2rem; border-radius: 20px;">
        "${profile.tagline || 'Tujuh Bulan Kehadiranmu Menyebarkan Kebahagiaan dan Cinta Murni dari Tante Tersayang'}"
      </p>

      <button id="opening-next-btn" class="next-scene-btn">
        Jelajahi Dunia Ceria ${profile.nickname || 'Kenan'} →
      </button>
    `;

    const nextBtn = document.getElementById('opening-next-btn');
    if (nextBtn && this.router) {
      nextBtn.addEventListener('click', () => {
        this.router.navigateTo('hero');
      });
    }
  }

  animate() {
    if (window.gsap) {
      gsap.fromTo('.opening-badge', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('#opening-title', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo('#opening-quote', 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 1, delay: 0.7, ease: 'back.out(1.4)' }
      );

      gsap.fromTo('#opening-next-btn', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: 'power2.out' }
      );
    }
  }

  async onExit() {
    this.container.style.display = 'none';
  }
}
