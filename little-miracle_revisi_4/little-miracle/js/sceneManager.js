/* ==========================================================================
   LITTLE MIRACLE — Scene Manager Module (Phase 02)
   Controls Scene Registration, Lifecycle Hooking & DOM Transitions
   ========================================================================== */

export class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.activeSceneName = null;
  }

  registerScene(name, sceneInstance) {
    this.scenes.set(name, sceneInstance);
  }

  async activateScene(name) {
    if (this.activeSceneName === name) return;

    // 1. Exit current active scene
    if (this.activeSceneName && this.scenes.has(this.activeSceneName)) {
      const currentScene = this.scenes.get(this.activeSceneName);
      if (currentScene.onExit) {
        await currentScene.onExit();
      }
      const currentElement = document.getElementById(`scene-${this.activeSceneName}`);
      if (currentElement) {
        currentElement.style.display = 'none';
      }
    }

    // 2. Set new scene
    this.activeSceneName = name;
    const nextElement = document.getElementById(`scene-${name}`);
    if (nextElement) {
      nextElement.style.display = 'flex';
    }

    // 3. Enter new scene
    if (this.scenes.has(name)) {
      const nextScene = this.scenes.get(name);
      if (nextScene.onEnter) {
        await nextScene.onEnter();
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
