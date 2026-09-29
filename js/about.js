/* =========================================================
   ABOUT PAGE — Interactions
   ========================================================= */

(function () {
    'use strict';

    /* ---------- PARALLAX ON HERO VISUAL (mousemove) ---------- */
    const visual = document.querySelector('.about-hero__visual');
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

    /* ---------- INFO CARD MOUSE GLOW ---------- */
    const cards = document.querySelectorAll('.info-card, .edu-card, .interest-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
    });

    /* ---------- STAGGER REVEAL FOR SKILL PILLS ---------- */
    const pills = document.querySelectorAll('.skill-pill');
    pills.forEach((pill, i) => {
        pill.style.transitionDelay = `${i * 0.05}s`;
    });

    /* ---------- ANIMATED COUNTER (Bonus) ---------- */
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

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        stats.forEach(s => io.observe(s));
    }

})();