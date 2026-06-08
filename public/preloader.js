/* ============================================
   FULL-SCREEN PRELOADER JAVASCRIPT
   Handles preloader lifecycle:
   - Initialization on DOMContentLoaded
   - Scanner line animation control
   - Logo visibility sync with scanner
   - Glitch effect trigger after 3.5 seconds
   - Fade out and cleanup
   ============================================ */

(function() {
  'use strict';

  // Configuration
  const PRELOADER_DURATION = 8000; // 8 seconds (more suspense)
  const GLITCH_DURATION = 1500; // 1.5 seconds (extended glitch effect)
  const FADE_DURATION = 400; // 0.4 seconds
  const SCANNER_CYCLE = 5500; // 5.5 seconds (matches CSS animation)
  const LOGO_PULSE_CYCLE = 2500; // 2.5 seconds (matches CSS animation)

  /**
   * Initialize the preloader when DOM is fully loaded
   */
  function initializePreloader() {
    const preloader = document.getElementById('preloader');
    const logo = document.getElementById('preloader-logo');
    const scannerLine = document.getElementById('scanner-line');

    if (!preloader) {
      console.warn('Preloader element with id="preloader" not found');
      return;
    }

    // Add body class to hide page content
    document.body.classList.add('preloader-active');

    // Start the exit sequence after PRELOADER_DURATION
    setTimeout(() => {
      triggerGlitchExit(preloader);
    }, PRELOADER_DURATION);
  }

  /**
   * Trigger the glitch effect and fade out sequence
   * @param {HTMLElement} preloader - The preloader element
   */
  function triggerGlitchExit(preloader) {
    // Add glitch-out class to start the glitch animation
    preloader.classList.add('glitch-out');

    // After glitch + fade animation completes, hide preloader and reveal page
    setTimeout(() => {
      completePreloaderExit(preloader);
    }, GLITCH_DURATION + FADE_DURATION);
  }

  /**
   * Complete the preloader exit: hide element and reveal page content
   * @param {HTMLElement} preloader - The preloader element
   */
  function completePreloaderExit(preloader) {
    // Hide the preloader element
    preloader.style.display = 'none';

    // Remove the active class and add done class to reveal page
    document.body.classList.remove('preloader-active');
    document.body.classList.add('preloader-done');

    // Dispatch custom event for any additional logic
    const event = new CustomEvent('preloaderComplete');
    document.dispatchEvent(event);
  }

  /**
   * Optional: Sync logo visibility with scanner position for enhanced effect
   * Uncomment and use if you want the logo to brighten as scanner passes over it
   */
  function syncLogoWithScanner() {
    const logo = document.getElementById('preloader-logo');
    if (!logo) return;

    // Calculate scanner position over time
    const updateLogoOpacity = () => {
      const now = Date.now();
      const cycleProgress = (now % SCANNER_CYCLE) / SCANNER_CYCLE;

      // Logo brightens when scanner is near it (around the middle of screen)
      // This is a subtle enhancement - the pulse animation still dominates
      const opacity = 0.3 + (Math.sin(cycleProgress * Math.PI * 2) * 0.15);
      // Note: CSS animation takes precedence, so this is more of a guide
    };

    setInterval(updateLogoOpacity, 16); // ~60fps update
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePreloader);
  } else {
    // DOM already loaded (e.g., if script is deferred)
    initializePreloader();
  }

  // Optional: Expose API for manual control
  window.PreloaderAPI = {
    /**
     * Manually trigger preloader exit
     */
    exit: function() {
      const preloader = document.getElementById('preloader');
      if (preloader && !preloader.classList.contains('glitch-out')) {
        triggerGlitchExit(preloader);
      }
    },

    /**
     * Reset preloader to initial state
     */
    reset: function() {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.remove('glitch-out');
        preloader.style.display = '';
        document.body.classList.remove('preloader-done', 'preloader-active');
        document.body.classList.add('preloader-active');
      }
    },

    /**
     * Check if preloader is currently active
     */
    isActive: function() {
      const preloader = document.getElementById('preloader');
      return preloader && preloader.style.display !== 'none';
    }
  };

})();
