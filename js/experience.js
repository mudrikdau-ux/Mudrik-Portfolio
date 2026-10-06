/* =========================================================
   EXPERIENCE PAGE — Interactions
   Mobile-optimized: mouse glow + marker follow skipped on touch
   ========================================================= */

(function () {
    'use strict';

    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const canRunHover = isFine && window.innerWidth >= 900;

    /* ---------- ANIMATED COUNTERS ---------- */
    const counters = document.querySelectorAll('[data-count]');

    if (counters.length && 'IntersectionObserver' in window) {
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

    /* ---------- TIMELINE ITEM MOUSE GLOW (desktop only) ---------- */
    if (canRunHover) {
        const cards = document.querySelectorAll('.timeline-item__card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mx', x + '%');
                card.style.setProperty('--my', y + '%');
            });
        });
    }

    /* ---------- TIMELINE MARKER SUBTLE FOLLOW (desktop only) ---------- */
    if (canRunHover) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const marker = item.querySelector('.timeline-item__marker');
            if (!marker) return;

            item.addEventListener('mouseenter', () => {
                marker.style.transform = 'scale(1.15)';
            });
            item.addEventListener('mouseleave', () => {
                marker.style.transform = '';
            });
        });
    }

    /* ---------- PROGRESSIVE TIMELINE LINE DRAW ---------- */
    const timeline = document.querySelector('.timeline');
    if (timeline && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-drawn');
                    }
                });
            },
            { threshold: 0.1 }
        );
        io.observe(timeline);
    }

})();