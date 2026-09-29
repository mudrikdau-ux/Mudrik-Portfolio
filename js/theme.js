/* =========================================================
   THEME — Dark / Light mode toggle with persistence
   ========================================================= */

(function () {
    'use strict';

    const STORAGE_KEY = 'dau:theme';
    const DEFAULT = 'dark';
    const SUPPORTED = ['dark', 'light'];

    function getStoredTheme() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && SUPPORTED.includes(stored)) return stored;
        } catch (e) {}
        // Respect OS preference if user hasn't chosen
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return DEFAULT;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Update meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f9fc' : '#05060a');

        // Update toggle aria
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', String(theme === 'light'));
            toggle.setAttribute('title', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        }
    }

    let currentTheme = getStoredTheme();

    function setTheme(theme) {
        if (!SUPPORTED.includes(theme)) return;
        currentTheme = theme;
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
        applyTheme(theme);
        document.dispatchEvent(new CustomEvent('dau:themeChanged', { detail: { theme } }));
    }

    function toggleTheme() {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    /* ---------- BOOT ---------- */
    // Apply early to avoid FOUC
    applyTheme(currentTheme);

    function initUI() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

    /* ---------- PUBLIC API ---------- */
    window.DAU_theme = {
        set: setTheme,
        toggle: toggleTheme,
        get: () => currentTheme
    };

})();