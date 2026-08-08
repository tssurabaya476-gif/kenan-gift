/* ==========================================================================
   LITTLE MIRACLE — Router Module (Phase 02)
   Manages URL Hash Navigation & Scene State History
   ========================================================================== */

export class Router {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.routes = new Map();
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  registerRoute(hash, sceneName) {
    this.routes.set(hash.replace('#', ''), sceneName);
  }

  navigateTo(sceneName) {
    window.location.hash = sceneName;
  }

  async handleHashChange() {
    const rawHash = window.location.hash.replace('#', '') || 'loader';
    const targetScene = this.routes.get(rawHash) || rawHash;
    if (this.sceneManager) {
      await this.sceneManager.activateScene(targetScene);
    }
  }
}
