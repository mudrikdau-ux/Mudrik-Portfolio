/* =========================================================
   SKILLS PAGE — Interactions
   ========================================================= */

(function () {
    'use strict';

    /* ---------- SKILL BAR PROGRESS ---------- */
    const bars = document.querySelectorAll('.skill-bar');

    if (bars.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const level = parseInt(el.dataset.level, 10) || 0;
                        el.style.setProperty('--fill', level + '%');
                        el.classList.add('is-visible');
                        io.unobserve(el);
                    }
                });
            },
            { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
        );

        bars.forEach(bar => io.observe(bar));
    } else {
        bars.forEach(bar => {
            const level = parseInt(bar.dataset.level, 10) || 0;
            bar.style.setProperty('--fill', level + '%');
            bar.classList.add('is-visible');
        });
    }

    /* ---------- ORBIT PARALLAX (mousemove) ---------- */
    const visual = document.querySelector('.skills-hero__visual');
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (visual && isFine) {
        let mx = 0, my = 0;
        let cx = 0, cy = 0;

        window.addEventListener('mousemove', (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function loop() {
            cx += (mx - cx) * 0.06;
            cy += (my - cy) * 0.06;
            visual.style.transform = `translate(${cx * 12}px, ${cy * 12}px)`;
            requestAnimationFrame(loop);
        }
        loop();
    }

    /* ---------- CARD MOUSE GLOW ---------- */
    const glowTargets = document.querySelectorAll(
        '.tech-card, .skill-cat, .learning-item, .flip-card'
    );

    glowTargets.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
    });

    /* ---------- ANIMATED COUNTERS ---------- */
    const stats = document.querySelectorAll('[data-count]');

    if (stats.length && 'IntersectionObserver' in window) {
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

        stats.forEach(s => cIO.observe(s));
    }

    /* ---------- FLIP CARDS (mobile tap + keyboard) ---------- */
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        // Make it focusable + keyboard-toggleable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('is-flipped');
            }
        });

        // Tap to flip on touch devices
        card.addEventListener('click', () => {
            if (window.matchMedia('(hover: none)').matches) {
                card.classList.toggle('is-flipped');
            }
        });
    });

    /* ---------- TECH CARD EXTERNAL LINK SAFETY ---------- */
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        // Ensure rel is set (in case HTML missed it)
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
            link.setAttribute('rel', (rel + ' noopener').trim());
        }
    });

    /* ---------- STAGGER FOR TECH CARDS ---------- */
    document.querySelectorAll('.tech-card').forEach((card, i) => {
        card.style.transitionDelay = `${(i % 8) * 0.04}s`;
    });

    /* ---------- STAGGER FOR FLIP CARDS ---------- */
    document.querySelectorAll('.flip-card').forEach((card, i) => {
        if (!card.hasAttribute('data-delay')) {
            card.style.transitionDelay = `${(i % 4) * 0.06}s`;
        }
    });

})();