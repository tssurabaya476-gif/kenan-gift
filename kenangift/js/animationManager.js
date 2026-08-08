/* ==========================================================================
   LITTLE MIRACLE — Animation Manager Module (Phase 13 Optimized)
   Canvas Particle Engine with Tab Visibility API Battery Savings
   ========================================================================== */

export class AnimationManager {
  static initParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId = null;
    let isTabVisible = true;

    // Responsive Canvas Resizing with Debounce
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Page Visibility Check (Battery & Performance Optimization)
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !animationFrameId) {
        animate();
      }
    });

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      speedY: - (Math.random() * 0.5 + 0.2)
    }));

    function animate() {
      if (!isTabVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y += p.speedY;
        if (p.y < 0) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
  }
}
