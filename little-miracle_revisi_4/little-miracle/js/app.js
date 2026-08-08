/* ==========================================================================
   LITTLE MIRACLE — Core Main Engine & App Initialization (8 Sequenced Scenes)
   ========================================================================== */

import { DataLoader } from './dataLoader.js';
import { AudioManager } from './audioManager.js';
import { AnimationManager } from './animationManager.js';
import { SceneManager } from './sceneManager.js';
import { Router } from './router.js';

import { LoaderScene } from './scenes/LoaderScene.js';
import { OpeningScene } from './scenes/OpeningScene.js';
import { HeroScene } from './scenes/HeroScene.js';
import { TimelineScene } from './scenes/TimelineScene.js';
import { GalleryScene } from './scenes/GalleryScene.js';
import { VideoScene } from './scenes/VideoScene.js';
import { MilestoneScene } from './scenes/MilestoneScene.js';
import { EndingScene } from './scenes/EndingScene.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('👶 Little Miracle — Engine Booting!');

  try {
    // 1. Fetch JSON Configuration & Data
    const appData = await DataLoader.loadAllData();

    // 2. Initialize Ambient Particle Canvas Engine
    AnimationManager.initParticles('particles-canvas');

    // 3. Initialize Audio Controller
    const audioManager = new AudioManager(appData.config.audio.bgm, appData.config.audio.volume);
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isPlaying = audioManager.toggle();
        audioBtn.setAttribute('aria-label', isPlaying ? 'Matikan Musik' : 'Putar Musik');
      });
    }

    // 4. Initialize Scene Manager & Hash Router
    const sceneManager = new SceneManager();
    const router = new Router(sceneManager);

    // 5. Register Scenes & Routes for Interactive Scenes (Adegan 01 - 08)
    const endingScene = new EndingScene(appData, router, audioManager);
    sceneManager.registerScene('ending', endingScene);
    router.registerRoute('ending', 'ending');

    const milestoneScene = new MilestoneScene(appData, router);
    sceneManager.registerScene('milestone', milestoneScene);
    router.registerRoute('milestone', 'milestone');

    const videoScene = new VideoScene(appData, router, audioManager);
    sceneManager.registerScene('video', videoScene);
    router.registerRoute('video', 'video');

    const galleryScene = new GalleryScene(appData, router);
    sceneManager.registerScene('gallery', galleryScene);
    router.registerRoute('gallery', 'gallery');

    const timelineScene = new TimelineScene(appData, router);
    sceneManager.registerScene('timeline', timelineScene);
    router.registerRoute('timeline', 'timeline');

    const heroScene = new HeroScene(appData, router);
    sceneManager.registerScene('hero', heroScene);
    router.registerRoute('hero', 'hero');

    const openingScene = new OpeningScene(appData, router);
    sceneManager.registerScene('opening', openingScene);
    router.registerRoute('opening', 'opening');

    const loaderScene = new LoaderScene(appData, audioManager, () => {
      router.navigateTo('opening');
    });
    sceneManager.registerScene('loader', loaderScene);
    router.registerRoute('loader', 'loader');

    // 6. Launch Initial Scene
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && sceneManager.scenes.has(currentHash)) {
      await sceneManager.activateScene(currentHash);
    } else {
      await sceneManager.activateScene('loader');
    }

    console.log('🎉 Little Miracle Application Running!');
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

