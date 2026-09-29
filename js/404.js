/* =========================================================
   404 PAGE — Interactions
   ========================================================= */

(function () {
    'use strict';

    /* ---------- MOUSE PARALLAX ON VISUAL ---------- */
    const visual = document.querySelector('.e404__visual');
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

    /* ---------- LOG 404 EVENT (for debugging, optional) ---------- */
    try {
        const missing = window.location.pathname;
        console.info('[DAU 404] Page not found:', missing);
    } catch (e) {}
})();