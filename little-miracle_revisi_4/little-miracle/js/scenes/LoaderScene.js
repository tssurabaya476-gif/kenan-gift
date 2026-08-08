/* ==========================================================================
   LITTLE MIRACLE — Loader Scene Controller (Phase 03)
   Handles Progress Animation, CTA Reveal & Audio Trigger Transition
   ========================================================================== */

export class LoaderScene {
  constructor(appData, audioManager, onComplete) {
    this.appData = appData;
    this.audioManager = audioManager;
    this.onComplete = onComplete;
    this.progress = 0;
    this.container = document.getElementById('scene-loader');
  }

  async onEnter() {
    this.render();
    this.bindEvents();
    this.startLoadingProgress();
  }

  render() {
    const profile = this.appData.profile || {};
    this.container.innerHTML = `
      <div class="loader-card glass-card">
        <div class="loader-emblem">👑</div>
        <div>
          <h1 class="loader-title">Little Miracle</h1>
          <p class="loader-subtitle">Kisah 7 Bulan Keponakan Kesayangan Tante</p>
          <p class="loader-baby-name">${profile.fullName || 'Muhammad Kenan Zafier Alfatih'}</p>
        </div>

        <div id="loader-progress-box" class="loader-progress-wrapper">
          <div class="loader-progress-bar-bg">
            <div id="loader-progress-fill" class="loader-progress-fill"></div>
          </div>
          <span id="loader-percentage" class="loader-percentage">0%</span>
        </div>

        <button id="loader-start-btn" class="loader-start-btn">
          ✨ Buka Kejutan Cinta dari Tante
        </button>
      </div>
    `;
  }

  startLoadingProgress() {
    const fillEl = document.getElementById('loader-progress-fill');
    const percentEl = document.getElementById('loader-percentage');
    const progressBox = document.getElementById('loader-progress-box');
    const startBtn = document.getElementById('loader-start-btn');

    const interval = setInterval(() => {
      this.progress += Math.floor(Math.random() * 8) + 4;
      if (this.progress > 100) this.progress = 100;

      if (fillEl) fillEl.style.width = `${this.progress}%`;
      if (percentEl) percentEl.textContent = `${this.progress}%`;

      if (this.progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (progressBox) progressBox.style.display = 'none';
          if (startBtn) {
            startBtn.style.display = 'block';
            setTimeout(() => {
              startBtn.style.opacity = '1';
            }, 50);
          }
        }, 300);
      }
    }, 100);
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'loader-start-btn') {
        this.handleStartClick();
      }
    });
  }

  handleStartClick() {
    if (this.audioManager) {
      this.audioManager.play();
    }
    
    this.container.classList.add('loader-curtain-exit');

    setTimeout(() => {
      if (this.onComplete) {
        this.onComplete();
      }
    }, 1000);
  }

  async onExit() {
    this.container.style.display = 'none';
  }
}
