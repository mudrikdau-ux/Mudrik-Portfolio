/* =========================================================
   ACHIEVEMENTS PAGE — Filter + Animations
   ========================================================= */

(function () {
    'use strict';

    /* ---------- FILTER ---------- */
    const filterButtons = document.querySelectorAll('.ach-filter__btn');
    const achievementCards = document.querySelectorAll('.ach-card[data-tags]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            achievementCards.forEach(card => {
                const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
                const match = filter === 'all' || tags.includes(filter);

                if (match) {
                    card.style.display = '';
                    // Retrigger reveal
                    card.classList.remove('is-revealed');
                    void card.offsetWidth;
                    card.classList.add('is-revealed');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

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

    /* ---------- HIGHLIGHT NUMBER COUNT-UP ---------- */
    // Animate `.highlight-card__num` from 0 to its content
    const highlightNums = document.querySelectorAll('.highlight-card__num');

    if (highlightNums.length && 'IntersectionObserver' in window) {
        const animateNum = (el) => {
            const target = parseInt(el.textContent, 10) || 0;
            const duration = 1500;
            const start = performance.now();
            const originalText = el.textContent;

            function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(target * eased);
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = originalText;
            }
            requestAnimationFrame(tick);
        };

        const hIO = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNum(entry.target);
                        hIO.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        highlightNums.forEach(n => hIO.observe(n));
    }

    /* ---------- CARD MOUSE GLOW ---------- */
    const cards = document.querySelectorAll('.ach-card, .highlight-card');
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isFine) {
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

    /* ---------- STAGGER REVEAL ---------- */
    const revealEls = document.querySelectorAll('.ach-card, .highlight-card');
    revealEls.forEach((el, i) => {
        const delay = (i % 6) * 0.05;
        el.style.transitionDelay = `${delay}s`;
    });

})();