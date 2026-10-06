/* =========================================================
   NAVBAR + FULLSCREEN MENU + LANGUAGE + THEME INTEGRATION
   Mobile-optimized: parallax disabled on touch/small screens
   ========================================================= */

(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('menu');
    const menuLinks = document.querySelectorAll('.menu__link');

    const langSwitcher = document.getElementById('langSwitcher');
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');

    if (!navbar || !toggle || !menu) return;

    /* =========================================================
       SCROLL STATE
       ========================================================= */
    let lastScroll = 0;

    function onScroll() {
        const y = window.scrollY;
        if (y > 40) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
        lastScroll = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* =========================================================
       LANGUAGE DROPDOWN HELPERS
       ========================================================= */
    function closeLangDropdown() {
        if (!langSwitcher) return;
        langSwitcher.classList.remove('is-open');
        if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
        if (langDropdown) langDropdown.setAttribute('aria-hidden', 'true');
    }

    function isLangOpen() {
        return langSwitcher && langSwitcher.classList.contains('is-open');
    }

    /* =========================================================
       MENU OPEN / CLOSE
       ========================================================= */
    let isOpen = false;

    function openMenu() {
        isOpen = true;
        closeLangDropdown();

        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
        document.body.classList.add('no-scroll');

        menuLinks.forEach((link, i) => {
            link.style.transitionDelay = `${0.2 + i * 0.06}s`;
        });
    }

    function closeMenu() {
        isOpen = false;
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('no-scroll');

        menuLinks.forEach(link => {
            link.style.transitionDelay = '0s';
        });
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen ? closeMenu() : openMenu();
    });

    /* =========================================================
       CLOSE ON LINK CLICK
       ========================================================= */
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                closeMenu();
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target) {
                        const navH = 84;
                        const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 20;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }, 400);
                return;
            }

            if (href) {
                e.preventDefault();
                closeMenu();
                closeLangDropdown();
                setTimeout(() => {
                    window.location.href = href;
                }, 550);
            }
        });
    });

    /* =========================================================
       ESC KEY
       ========================================================= */
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (isOpen) closeMenu();
        if (isLangOpen()) closeLangDropdown();
    });

    document.addEventListener('dau:closeMenu', () => {
        if (isOpen) closeMenu();
        if (isLangOpen()) closeLangDropdown();
    });

    /* =========================================================
       CLICK OUTSIDE
       ========================================================= */
    menu.addEventListener('click', (e) => {
        if (e.target === menu || e.target.classList.contains('menu__bg')) {
            closeMenu();
        }
    });

    document.addEventListener('click', (e) => {
        if (!langSwitcher) return;
        if (!langSwitcher.contains(e.target)) {
            closeLangDropdown();
        }
    });

    /* =========================================================
       LANG TOGGLE — close menu if opening lang dropdown
       ========================================================= */
    if (langToggle && langSwitcher) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !langSwitcher.classList.contains('is-open');
            if (willOpen && isOpen) closeMenu();
        });
    }

    /* =========================================================
       PARALLAX BACKGROUND GLOWS (desktop only)
       ========================================================= */
    const glows = document.querySelectorAll('.bg-glow');
    const canRunParallax =
        glows.length &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        window.innerWidth >= 900 &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canRunParallax) {
        let mx = 0, my = 0;
        let cx = 0, cy = 0;

        document.addEventListener('mousemove', (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function loop() {
            cx += (mx - cx) * 0.05;
            cy += (my - cy) * 0.05;

            glows.forEach((glow, i) => {
                const factor = (i + 1) * 12;
                glow.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
            });

            requestAnimationFrame(loop);
        }
        loop();
    }

})();