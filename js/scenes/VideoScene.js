/* ==========================================================================
   LITTLE MIRACLE — Video Memories Scene Controller (Phase 08)
   Renders HTML5 Video Cards, Overlay Poster Play Trigger & BGM Audio Sync
   ========================================================================== */

export class VideoScene {
  constructor(appData, router, audioManager) {
    this.appData = appData;
    this.router = router;
    this.audioManager = audioManager;
    this.container = document.getElementById('scene-video');
    this.videos = this.appData.videos || [];
  }

  async onEnter() {
    this.render();
    this.bindEvents();
    this.animate();
  }

  render() {
    const profile = this.appData.profile || {};

    const videoCardsHTML = this.videos.map((vid, idx) => `
      <div class="video-card" data-video-id="${vid.id}">
        <div class="video-player-wrapper">
          <video id="video-el-${idx}" class="video-element" controls preload="metadata">
            <source src="${vid.src}" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>

          <div id="video-overlay-${idx}" class="video-poster-overlay" style="background-image: url('${vid.thumbnail}');" data-index="${idx}">
            <div class="video-play-btn">▶</div>
            <span class="video-duration-pill">⏱️ ${vid.duration}</span>
          </div>
        </div>

        <div class="video-card-info">
          <h3 class="video-card-title">${vid.title}</h3>
          <p class="video-card-caption">${vid.caption}</p>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="video-header">
        <span class="video-badge">✦ ADEGAN 06 — KLIP TAWA & KEBERSAMAAN ✦</span>
        <h2 class="video-title">Klip Video Ceria ${profile.nickname || 'Kenan'}</h2>
        <p style="color: var(--color-text-muted); margin-top: 0.5rem;">
          Tawa polos, aksi menggemaskan, dan kebahagiaan yang tak pernah pudar bersama Tante.
        </p>
      </div>

      <div class="video-grid">
        ${videoCardsHTML.length > 0 ? videoCardsHTML : '<p style="color: var(--color-text-muted);">Tidak ada video tersedia.</p>'}
      </div>

      <button id="video-next-btn" class="video-cta-btn">
        Lihat Pencapaian & Pertumbuhan →
      </button>
    `;
  }

  bindEvents() {
    // 1. Overlay Play Button Clicks & BGM Sync
    this.videos.forEach((_, idx) => {
      const overlay = document.getElementById(`video-overlay-${idx}`);
      const videoEl = document.getElementById(`video-el-${idx}`);

      if (overlay && videoEl) {
        overlay.addEventListener('click', () => {
          overlay.style.opacity = '0';
          overlay.style.pointerEvents = 'none';

          // Pause BGM if playing
          if (this.audioManager && this.audioManager.isPlaying) {
            this.audioManager.pause();
          }

          videoEl.play().catch(err => {
            console.warn('Video playback prevented:', err);
          });
        });

        videoEl.addEventListener('play', () => {
          // Pause BGM if playing
          if (this.audioManager && this.audioManager.isPlaying) {
            this.audioManager.pause();
          }

          // Pause all other playing videos in this scene to avoid audio collision
          this.videos.forEach((_, otherIdx) => {
            if (otherIdx !== idx) {
              const otherVid = document.getElementById(`video-el-${otherIdx}`);
              if (otherVid && !otherVid.paused) {
                otherVid.pause();
              }
            }
          });
        });

        // Show overlay when video pauses or ends
        videoEl.addEventListener('pause', () => {
          if (videoEl.ended || videoEl.paused) {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
          }
        });

        videoEl.addEventListener('ended', () => {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
        });
      }
    });

    // 2. CTA Navigation
    const nextBtn = document.getElementById('video-next-btn');
    if (nextBtn && this.router) {
      nextBtn.addEventListener('click', () => {
        this.router.navigateTo('milestone');
      });
    }
  }

  animate() {
    if (window.gsap) {
      gsap.fromTo('.video-header', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('.video-card', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, stagger: 0.15, ease: 'power2.out' }
      );

      gsap.fromTo('#video-next-btn', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power2.out' }
      );
    }
  }

  async onExit() {
    // Pause all playing videos when leaving scene
    this.videos.forEach((_, idx) => {
      const videoEl = document.getElementById(`video-el-${idx}`);
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    });
    this.container.style.display = 'none';
  }
}
