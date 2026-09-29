/* =========================================================
   PARTICLES CANVAS — Floating dots + connecting lines
   ========================================================= */

(function () {
    'use strict';

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let rafId = null;

    const CONFIG = {
        density: 0.00009,       // particles per pixel
        maxParticles: 90,
        minSize: 0.6,
        maxSize: 2.2,
        speed: 0.28,
        connectDist: 130,
        mouseRadius: 160,
        color: '0, 229, 255',
        colorAlt: '168, 85, 247'
    };

    function resize() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        createParticles();
    }

    function createParticles() {
        const target = Math.min(
            CONFIG.maxParticles,
            Math.floor(width * height * CONFIG.density)
        );

        particles = [];
        for (let i = 0; i < target; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * CONFIG.speed,
                vy: (Math.random() - 0.5) * CONFIG.speed,
                size: Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize,
                color: Math.random() > 0.75 ? CONFIG.colorAlt : CONFIG.color,
                alpha: Math.random() * 0.5 + 0.25
            });
        }
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        // Update
        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap or bounce
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;

            // Mouse repel
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                p.x += (dx / dist) * force * 1.2;
                p.y += (dy / dist) * force * 1.2;
            }
        }

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.hypot(dx, dy);
                if (d < CONFIG.connectDist) {
                    const alpha = (1 - d / CONFIG.connectDist) * 0.18;
                    ctx.strokeStyle = `rgba(${CONFIG.color}, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        for (let p of particles) {
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // subtle glow
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.12})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        rafId = requestAnimationFrame(step);
    }

    /* ---------- EVENTS ---------- */
    window.addEventListener('resize', () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resize();
    });

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else {
            if (!rafId) step();
        }
    });

    resize();
    step();

})();