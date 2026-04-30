/* ========================================
   HEXA WEB SOLUTIONS - THEME ENGINE
   Dynamic Theme Cycling System
   ======================================== */

const ThemeEngine = {
  themes: ['aurora', 'sunset', 'forest', 'ocean', 'royal'],
  currentTheme: 'aurora',
  cycleInterval: null,
  cycleDuration: 8000, // 8 seconds per theme
  
  // Initialize theme system
  init() {
    this.loadSavedTheme();
    this.setupThemeDots();
    this.startAutoCycle();
    this.setupKeyboardShortcuts();
    console.log(`🎨 Theme Engine initialized: ${this.currentTheme}`);
  },
  
  // Load theme from localStorage
  loadSavedTheme() {
    const saved = localStorage.getItem('hexa-theme');
    if (saved && this.themes.includes(saved)) {
      this.setTheme(saved, false);
    }
  },
  
  // Save theme to localStorage
  saveTheme(theme) {
    localStorage.setItem('hexa-theme', theme);
  },
  
  // Apply theme to document
  setTheme(theme, save = true) {
    if (!this.themes.includes(theme)) return;
    
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    // Update active dot
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.classList.remove('active');
      if (dot.classList.contains(theme)) {
        dot.classList.add('active');
      }
    });
    
    // Update CSS variables for dynamic effects
    this.updateDynamicStyles(theme);
    
    if (save) this.saveTheme(theme);
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
  },
  
  // Update dynamic styles based on theme
  updateDynamicStyles(theme) {
    const root = document.documentElement;
    const colors = this.getThemeColors(theme);
    
    // Update shadow colors dynamically
    root.style.setProperty('--shadow-colored', 
      `0 10px 40px rgba(${colors.primaryRgb}, 0.2)`);
  },
  
  // Get theme color values
  getThemeColors(theme) {
    const colors = {
      aurora: { primaryRgb: '99, 102, 241', accentRgb: '6, 182, 212' },
      sunset: { primaryRgb: '249, 115, 22', accentRgb: '251, 191, 36' },
      forest: { primaryRgb: '34, 197, 94', accentRgb: '132, 204, 22' },
      ocean: { primaryRgb: '14, 165, 233', accentRgb: '34, 211, 238' },
      royal: { primaryRgb: '124, 58, 237', accentRgb: '244, 114, 182' }
    };
    return colors[theme] || colors.aurora;
  },
  
  // Setup theme selector dots
  setupThemeDots() {
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const theme = [...dot.classList].find(c => this.themes.includes(c));
        if (theme) {
          this.setTheme(theme);
          this.pauseAutoCycle(3000); // Pause cycling after manual selection
        }
      });
    });
  },
  
  // Start automatic theme cycling
  startAutoCycle() {
    this.stopAutoCycle(); // Clear any existing interval
    this.cycleInterval = setInterval(() => {
      const currentIndex = this.themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % this.themes.length;
      this.setTheme(this.themes[nextIndex]);
    }, this.cycleDuration);
    console.log('🔄 Auto theme cycling started');
  },
  
  // Stop automatic cycling
  stopAutoCycle() {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
      this.cycleInterval = null;
      console.log('⏹️ Auto theme cycling stopped');
    }
  },
  
  // Pause cycling temporarily (e.g., after user interaction)
  pauseAutoCycle(duration) {
    this.stopAutoCycle();
    setTimeout(() => this.startAutoCycle(), duration);
    console.log(`⏸️ Theme cycling paused for ${duration}ms`);
  },
  
  // Keyboard shortcuts for theme control
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + T: Toggle theme cycling
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        if (this.cycleInterval) {
          this.stopAutoCycle();
          this.showNotification('Theme cycling paused ⏸️');
        } else {
          this.startAutoCycle();
          this.showNotification('Theme cycling resumed ▶️');
        }
      }
      // Number keys 1-5: Select specific theme
      if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        if (this.themes[index]) {
          this.setTheme(this.themes[index]);
          this.pauseAutoCycle(5000);
          this.showNotification(`Theme: ${this.themes[index].charAt(0).toUpperCase() + this.themes[index].slice(1)} ✨`);
        }
      }
    });
  },
  
  // Show temporary notification
  showNotification(message) {
    // Remove existing
    document.querySelectorAll('.theme-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.style.cssText = `
      position: fixed; top: 2rem; left: 50%; transform: translateX(-50%);
      padding: 0.75rem 1.5rem; background: var(--dark); color: white;
      border-radius: 50px; font-weight: 500; z-index: 10002;
      animation: slideDown 0.3s ease, fadeOut 0.5s ease 2s forwards;
      box-shadow: var(--shadow-lg);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add keyframes if not exists
    if (!document.querySelector('#theme-animations')) {
      const style = document.createElement('style');
      style.id = 'theme-animations';
      style.textContent = `
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translate(-50%, -20px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => notification.remove(), 2500);
  },
  
  // Get current theme info
  getCurrentTheme() {
    return {
      name: this.currentTheme,
      index: this.themes.indexOf(this.currentTheme),
      total: this.themes.length
    };
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeEngine.init());
} else {
  ThemeEngine.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeEngine;
}