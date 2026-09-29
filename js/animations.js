/* =========================================================
   SCROLL REVEAL + COUNTERS + TILT
   ========================================================= */

(function () {
    'use strict';

    /* ---------- SCROLL REVEAL ---------- */
    const revealEls = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        io.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px'
            }
        );

        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-revealed'));
    }

    /* ---------- AUTO-REVEAL on sections ---------- */
    // Auto assign reveals to common elements if not set
    const autoTargets = document.querySelectorAll(
        '.featured .section-head, .featured__grid .project-card, .quick-about__grid, .cta-band__inner'
    );

    if ('IntersectionObserver' in window) {
        const io2 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        io2.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        autoTargets.forEach((el, i) => {
            if (!el.hasAttribute('data-reveal')) {
                el.setAttribute('data-reveal', 'up');
                el.style.transitionDelay = `${(i % 4) * 0.08}s`;
            }
            io2.observe(el);
        });
    }

    /* ---------- COUNTERS ---------- */
    const counters = document.querySelectorAll('[data-count]');

    if ('IntersectionObserver' in window && counters.length) {
        const animate = (el) => {
            const target = parseInt(el.dataset.count, 10) || 0;
            const duration = 1600;
            const start = performance.now();

            function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(target * eased);
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            }

            requestAnimationFrame(tick);
        };

        const cIO = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        cIO.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        counters.forEach(c => cIO.observe(c));
    }

    /* ---------- 3D TILT ---------- */
    const tiltTargets = document.querySelectorAll('[data-tilt]');

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        tiltTargets.forEach(el => {
            const strength = 12;

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const rotY = x * strength;
                const rotX = -y * strength;

                el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

})();