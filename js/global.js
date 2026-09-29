/* =========================================================
   GLOBAL JS — MUDRIK DAU PORTFOLIO
   ========================================================= */

(function () {
    'use strict';

    /* ---------- UTILITY: $ and $$ ---------- */
    window.$ = (sel, ctx = document) => ctx.querySelector(sel);
    window.$$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ---------- YEAR IN FOOTER ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- LOADER ---------- */
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');

    function runLoader() {
        if (!loader || !loaderBar) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 18 + 6;
            if (progress >= 100) {
                progress = 100;
                loaderBar.style.width = '100%';
                clearInterval(interval);

                setTimeout(() => {
                    loader.classList.add('is-hidden');
                    document.body.classList.remove('no-scroll');
                    document.dispatchEvent(new CustomEvent('dau:loaded'));
                }, 350);
            } else {
                loaderBar.style.width = progress + '%';
            }
        }, 130);
    }

    document.body.classList.add('no-scroll');
    window.addEventListener('load', runLoader);

    // Fallback: hide loader after 4s no matter what
    setTimeout(() => {
        if (loader && !loader.classList.contains('is-hidden')) {
            loader.classList.add('is-hidden');
            document.body.classList.remove('no-scroll');
            document.dispatchEvent(new CustomEvent('dau:loaded'));
        }
    }, 4000);

    /* ---------- CUSTOM CURSOR ---------- */
    const cursor = document.getElementById('cursor');

    if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const dot = cursor.querySelector('.cursor__dot');
        const ring = cursor.querySelector('.cursor__ring');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // dot follows instantly
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Smooth ring lag
        function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover targets — includes Home + About + (future pages)
        const hoverTargets = [
            'a',
            'button',
            '.btn',
            '[data-cursor="hover"]',
            '[data-tilt]',
            '.project-card',
            '.menu__link',
            '.navbar__toggle',
            '.menu__socials a',
            '.hero__chip',
            /* About page interactive elements */
            '.info-card',
            '.edu-card',
            '.interest-card',
            '.skill-pill',
            '.about-hero__badge'
        ].join(',');

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursor.classList.add('is-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursor.classList.remove('is-hover');
            }
        });

        // Click state
        document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
        document.addEventListener('mouseup', () => cursor.classList.remove('is-click'));

        // Hide when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        // Safety: reset hover state on scroll/hash change
        window.addEventListener('scroll', () => {
            if (document.body.classList.contains('no-scroll')) return;
        }, { passive: true });
    }

    /* ---------- ACTIVE PAGE HIGHLIGHT ---------- */
    // Normalize current page name
    const path = window.location.pathname;
    const currentFile = (
        path.substring(path.lastIndexOf('/') + 1) || 'index.html'
    ).toLowerCase();

    // Build a mapping of page keys → file names for data-page fallback
    const PAGE_FILE_MAP = {
        'home': 'index.html',
        'about': 'about.html',
        'skills': 'skills.html',
        'experience': 'experience.html',
        'projects': 'projects.html',
        'certificates': 'certificates.html',
        'services': 'services.html',
        'achievements': 'achievements.html',
        'contact': 'contact.html'
    };

    $$('.menu__link').forEach(link => {
        const href = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
        const pageAttr = (link.dataset.page || '').toLowerCase();
        const mappedFile = PAGE_FILE_MAP[pageAttr] || '';

        const isCurrent =
            href === currentFile ||
            mappedFile === currentFile ||
            (currentFile === '' && pageAttr === 'home');

        if (isCurrent) {
            link.classList.add('is-active');
        } else {
            link.classList.remove('is-active');
        }
    });

    /* ---------- SMOOTH ANCHOR SCROLL ---------- */
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
        const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
    });

    /* ---------- LAZY IMAGES (native + fallback) ---------- */
    if ('loading' in HTMLImageElement.prototype) {
        $$('img').forEach(img => {
            if (
                !img.hasAttribute('loading') &&
                !img.closest('.hero__visual-card') &&
                !img.closest('.about-hero__photo')
            ) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    /* ---------- KEYBOARD: ESC CLOSES MENU ---------- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.dispatchEvent(new CustomEvent('dau:closeMenu'));
        }
    });

    /* ---------- SAFE: RESET SCROLL LOCK ON PAGE SHOW ---------- */
    // When navigating back/forward via bfcache, ensure scroll isn't locked
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            document.body.classList.remove('no-scroll');
        }
    });

})();