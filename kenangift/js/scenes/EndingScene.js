/* ==========================================================================
   LITTLE MIRACLE — Ending Scene Controller (Phase 12 Finale)
   Grand Finale Celebration, Confetti Burst, Replay & Share Triggers
   ========================================================================== */

export class EndingScene {
  constructor(appData, router, audioManager) {
    this.appData = appData;
    this.router = router;
    this.audioManager = audioManager;
    this.container = document.getElementById('scene-ending');
  }

  async onEnter() {
    this.render();
    this.bindEvents();
    this.animate();
    this.triggerConfetti();
  }

  render() {
    const profile = this.appData.profile || {};

    this.container.innerHTML = `
      <div class="ending-badge">✦ ADEGAN 08 — PERAYAAN & DOA PENUTUP ✦</div>

      <div class="ending-card">
        <div class="ending-emblem">👑</div>

        <div>
          <h1 class="ending-title">
            Selamat 7 Bulan,<br>
            <span>${profile.fullName || 'Muhammad Kenan Zafier Alfatih'}</span>!
          </h1>
        </div>

        <p class="ending-quote">
          "Doa dan kasih sayang Tante selalu menyertai setiap langkah kecil ${profile.nickname || 'Kenan'}.<br>
          Semoga keponakan ganteng Tante tumbuh sehat, cerdas, ceria, dan selalu dipenuhi keberkahan."
        </p>

        <div class="ending-actions-grid" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button id="ending-replay-btn" class="ending-action-btn btn-primary-gold">
            🔄 Putar Ulang Kenangan
          </button>
          
          <button id="ending-share-btn" class="ending-action-btn btn-secondary-glass">
            🔗 Bagikan Hadiah Digital
          </button>
        </div>
      </div>

      <!-- Toast Notification -->
      <div id="ending-toast" class="ending-toast">
        ✨ Tautan hadiah berhasil disalin! Bagikan kebahagiaan bersama keluarga.
      </div>

      <p class="ending-credit">Dipersembahkan dengan ❤️ oleh <strong>HiWi Digital Studio</strong></p>
    `;
  }

  bindEvents() {
    // 1. Replay Button
    const replayBtn = document.getElementById('ending-replay-btn');
    if (replayBtn && this.router) {
      replayBtn.addEventListener('click', () => {
        if (this.audioManager) {
          this.audioManager.play();
        }
        this.router.navigateTo('opening');
      });
    }

    // 2. Share Button (Copy Link)
    const shareBtn = document.getElementById('ending-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          this.showToast();
        }).catch(() => {
          this.showToast('✨ Tautan: ' + window.location.href);
        });
      });
    }
  }

  showToast(msg) {
    const toast = document.getElementById('ending-toast');
    if (toast) {
      if (msg) toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  triggerConfetti() {
    // Simulated celebration confetti particle burst
    console.log('🎉 Celebration Confetti Burst Triggered!');
  }

  animate() {
    if (window.gsap) {
      gsap.fromTo('.ending-badge', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('.ending-card', 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 1, delay: 0.3, ease: 'back.out(1.3)' }
      );

      gsap.fromTo('.ending-action-btn', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8, stagger: 0.15, ease: 'power2.out' }
      );
    }
  }

  async onExit() {
    this.container.style.display = 'none';
  }
}
