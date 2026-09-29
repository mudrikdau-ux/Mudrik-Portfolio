/* =========================================================
   HOME PAGE INTERACTIONS
   ========================================================= */

(function () {
    'use strict';

    /* ---------- ROLE ROTATOR ---------- */
    const rotator = document.getElementById('roleRotate');
    if (rotator) {
        const words = rotator.querySelectorAll('.hero__role-word');
        if (words.length) {
            let index = 0;
            words[0].classList.add('is-active');

            setInterval(() => {
                const current = words[index];
                index = (index + 1) % words.length;
                const next = words[index];

                current.classList.remove('is-active');
                current.classList.add('is-leaving');

                setTimeout(() => {
                    current.classList.remove('is-leaving');
                }, 600);

                next.classList.add('is-active');
            }, 2800);
        }
    }

    /* ---------- HERO PARALLAX (mousemove) ---------- */
    const visual = document.querySelector('.hero__visual');
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

            visual.style.transform = `translate(${cx * 14}px, ${cy * 14}px)`;

            requestAnimationFrame(loop);
        }
        loop();
    }

    /* ---------- PROJECT CARD MOUSE GLOW ---------- */
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mx', x + 'px');
            card.style.setProperty('--my', y + 'px');
        });
    });

    /* ---------- SMOOTH SCROLL TO FEATURED (if hash) ---------- */
    if (window.location.hash === '#featured') {
        const el = document.getElementById('featured');
        if (el) {
            setTimeout(() => {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 600);
        }
    }

})();