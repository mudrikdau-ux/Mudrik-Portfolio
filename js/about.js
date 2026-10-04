/* =========================================================
   ABOUT PAGE — Interactions
   ========================================================= */

(function () {
    'use strict';

    const t = (key) => (window.DAU_i18n ? window.DAU_i18n.t(key) : key);

    /* =========================================================
       PARALLAX ON HERO VISUAL
       ========================================================= */
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

    /* =========================================================
       INFO CARD MOUSE GLOW (for interactive cards)
       ========================================================= */
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

    /* =========================================================
       SKILL PILL STAGGER
       ========================================================= */
    document.querySelectorAll('.skill-pill').forEach((pill, i) => {
        pill.style.transitionDelay = `${i * 0.05}s`;
    });

    /* =========================================================
       ANIMATED COUNTERS
       ========================================================= */
    const stats = document.querySelectorAll('[data-count]');
    if (stats.length && 'IntersectionObserver' in window) {
        const animate = (el) => {
            const target = parseInt(el.dataset.count, 10) || 0;
            const duration = 1600;
            const start = performance.now();

            function tick(now) {
                const t2 = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t2, 3);
                el.textContent = Math.round(target * eased);
                if (t2 < 1) requestAnimationFrame(tick);
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

    /* =========================================================
       INTERACTIVE INFO CARD ANIMATIONS
       ========================================================= */

    const animLayer = document.getElementById('infoAnim');
    const animCanvas = document.getElementById('infoAnimCanvas');
    const animCaption = document.getElementById('infoAnimCaption');

    if (!animLayer || !animCanvas) return;

    const ctx = animCanvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let rafId = null;
    let particles = [];
    let currentAnim = null;
    let animStartTime = 0;

    /* ---------- RESIZE ---------- */
    function resizeCanvas() {
        W = window.innerWidth;
        H = window.innerHeight;
        animCanvas.width = W * dpr;
        animCanvas.height = H * dpr;
        animCanvas.style.width = W + 'px';
        animCanvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (animLayer.classList.contains('is-open')) resizeCanvas();
    });

    /* ---------- UTILITIES ---------- */
    const rand = (min, max) => Math.random() * (max - min) + min;
    const randInt = (min, max) => Math.floor(rand(min, max + 1));

    const PALETTE = [
        '#00e5ff', '#0077ff', '#a855f7', '#ec4899',
        '#f59e0b', '#22e07a', '#ffffff'
    ];

    /* =========================================================
       PARTICLE FACTORIES
       ========================================================= */

    /* --- Birthday: cakes + balloons + confetti --- */
    function createBirthdayParticle(force) {
        const kind = force || ['cake', 'balloon', 'confetti'][randInt(0, 2)];

        if (kind === 'cake') {
            return {
                kind: 'cake',
                x: rand(W * 0.1, W * 0.9),
                y: H + 80,
                vx: rand(-1.2, 1.2),
                vy: rand(-6, -3.5),
                rot: rand(-0.4, 0.4),
                vr: rand(-0.03, 0.03),
                size: rand(28, 52),
                color: PALETTE[randInt(0, PALETTE.length - 2)],
                life: 1
            };
        }

        if (kind === 'balloon') {
            return {
                kind: 'balloon',
                x: rand(W * 0.05, W * 0.95),
                y: H + 60,
                vx: rand(-0.6, 0.6),
                vy: rand(-4.5, -2.5),
                sway: rand(0, Math.PI * 2),
                swaySpeed: rand(0.02, 0.05),
                size: rand(24, 44),
                color: PALETTE[randInt(0, PALETTE.length - 1)],
                life: 1
            };
        }

        // confetti
        return {
            kind: 'confetti',
            x: rand(0, W),
            y: -20,
            vx: rand(-1.5, 1.5),
            vy: rand(2, 5),
            rot: rand(0, Math.PI * 2),
            vr: rand(-0.15, 0.15),
            size: rand(5, 10),
            color: PALETTE[randInt(0, PALETTE.length - 1)],
            life: 1
        };
    }

    /* --- Education: books + caps + sparkles --- */
    function createEducationParticle(force) {
        const kind = force || ['book', 'cap', 'sparkle'][randInt(0, 2)];

        if (kind === 'book') {
            return {
                kind: 'book',
                x: rand(W * 0.1, W * 0.9),
                y: H + 60,
                vx: rand(-0.8, 0.8),
                vy: rand(-4, -2.2),
                rot: rand(-0.5, 0.5),
                vr: rand(-0.04, 0.04),
                size: rand(32, 48),
                color: ['#a855f7', '#ec4899', '#0077ff', '#22e07a'][randInt(0, 3)],
                life: 1
            };
        }

        if (kind === 'cap') {
            return {
                kind: 'cap',
                x: rand(W * 0.15, W * 0.85),
                y: H + 40,
                vx: rand(-0.8, 0.8),
                vy: rand(-4.5, -3),
                rot: rand(-0.3, 0.3),
                vr: rand(-0.03, 0.03),
                size: rand(34, 54),
                color: '#111827',
                accent: '#f59e0b',
                life: 1
            };
        }

        // sparkle
        return {
            kind: 'sparkle',
            x: rand(0, W),
            y: rand(0, H),
            vx: rand(-0.4, 0.4),
            vy: rand(-0.4, 0.4),
            size: rand(6, 14),
            color: ['#00e5ff', '#a855f7', '#f59e0b'][randInt(0, 2)],
            life: 1,
            phase: rand(0, Math.PI * 2)
        };
    }

    /* --- Hobbies: footballs + controllers --- */
    function createHobbyParticle(force) {
        const kind = force || ['ball', 'controller'][randInt(0, 1)];

        if (kind === 'ball') {
            return {
                kind: 'ball',
                x: rand(W * 0.1, W * 0.9),
                y: H + 60,
                vx: rand(-2, 2),
                vy: rand(-7, -4),
                rot: rand(0, Math.PI * 2),
                vr: rand(-0.15, 0.15),
                size: rand(28, 46),
                life: 1,
                gravity: 0.25,
                bounces: 0
            };
        }

        return {
            kind: 'controller',
            x: rand(W * 0.15, W * 0.85),
            y: H + 40,
            vx: rand(-0.7, 0.7),
            vy: rand(-4, -2.5),
            rot: rand(-0.4, 0.4),
            vr: rand(-0.03, 0.03),
            size: rand(36, 56),
            color: '#111827',
            accent: '#22e07a',
            life: 1
        };
    }

    /* =========================================================
       DRAWING FUNCTIONS
       ========================================================= */

    function drawCake(c) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        const s = c.size;

        // plate
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.ellipse(0, s * 0.55, s * 0.7, s * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();

        // bottom layer
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.roundRect(-s * 0.55, s * 0.15, s * 1.1, s * 0.4, 6);
        ctx.fill();

        // top layer
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(-s * 0.45, -s * 0.15, s * 0.9, s * 0.35, 6);
        ctx.fill();

        // frosting drips
        ctx.fillStyle = c.color;
        for (let i = 0; i < 5; i++) {
            const dx = -s * 0.38 + i * (s * 0.19);
            ctx.beginPath();
            ctx.arc(dx, s * 0.2, s * 0.08, 0, Math.PI);
            ctx.fill();
        }

        // candle
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-s * 0.04, -s * 0.42, s * 0.08, s * 0.28);

        // flame
        ctx.fillStyle = 'rgba(255,200,60,0.95)';
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.5, s * 0.06, s * 0.11, 0, 0, Math.PI * 2);
        ctx.fill();

        // flame glow
        ctx.fillStyle = 'rgba(255,220,100,0.35)';
        ctx.beginPath();
        ctx.arc(0, -s * 0.5, s * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawBalloon(b) {
        ctx.save();
        ctx.translate(b.x, b.y);

        // string
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, b.size * 0.5);
        ctx.quadraticCurveTo(b.size * 0.2, b.size * 0.9, 0, b.size * 1.4);
        ctx.stroke();

        // balloon body
        const grad = ctx.createRadialGradient(-b.size * 0.2, -b.size * 0.25, 2, 0, 0, b.size * 0.6);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, b.color);
        grad.addColorStop(1, b.color);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size * 0.5, b.size * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();

        // knot
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.moveTo(-4, b.size * 0.5);
        ctx.lineTo(4, b.size * 0.5);
        ctx.lineTo(0, b.size * 0.6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function drawConfetti(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
    }

    function drawBook(b) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        const s = b.size;

        // cover
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(-s * 0.55, -s * 0.35, s * 1.1, s * 0.7, 4);
        ctx.fill();

        // pages
        ctx.fillStyle = '#f5f7fa';
        ctx.beginPath();
        ctx.roundRect(-s * 0.5, -s * 0.3, s * 1.0, s * 0.6, 3);
        ctx.fill();

        // spine
        ctx.fillStyle = b.color;
        ctx.fillRect(-s * 0.55, -s * 0.35, s * 0.12, s * 0.7);

        // text lines
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        for (let i = 0; i < 3; i++) {
            const y = -s * 0.15 + i * s * 0.16;
            ctx.fillRect(-s * 0.32, y, s * 0.7, s * 0.04);
        }

        ctx.restore();
    }

    function drawCap(c) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        const s = c.size;

        // board (diamond)
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.35);
        ctx.lineTo(s * 0.7, 0);
        ctx.lineTo(0, s * 0.35);
        ctx.lineTo(-s * 0.7, 0);
        ctx.closePath();
        ctx.fill();

        // base under board
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.roundRect(-s * 0.32, s * 0.15, s * 0.64, s * 0.22, 3);
        ctx.fill();

        // tassel
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(s * 0.5, 0);
        ctx.quadraticCurveTo(s * 0.75, s * 0.3, s * 0.6, s * 0.55);
        ctx.stroke();

        ctx.fillStyle = c.accent;
        ctx.beginPath();
        ctx.arc(s * 0.6, s * 0.55, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawSparkle(s) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.phase);
        const size = s.size * (0.7 + Math.sin(s.phase) * 0.3);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        grad.addColorStop(0, s.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;

        // 4-point star
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI / 2) * i;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            const midAngle = angle + Math.PI / 4;
            const mx = Math.cos(midAngle) * size * 0.3;
            const my = Math.sin(midAngle) * size * 0.3;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            ctx.lineTo(mx, my);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function drawBall(b) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        const s = b.size;

        // shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.52, 0, Math.PI * 2);
        ctx.fill();

        // ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // black pentagons (simple approximation)
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i + b.rot;
            const px = Math.cos(angle) * s * 0.38;
            const py = Math.sin(angle) * s * 0.38;
            ctx.beginPath();
            ctx.arc(px, py, s * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }

        // highlight
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(-s * 0.18, -s * 0.18, s * 0.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawController(c) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        const s = c.size;

        // body
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.roundRect(-s * 0.55, -s * 0.2, s * 1.1, s * 0.45, s * 0.18);
        ctx.fill();

        // left grip
        ctx.beginPath();
        ctx.arc(-s * 0.4, s * 0.2, s * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // right grip
        ctx.beginPath();
        ctx.arc(s * 0.4, s * 0.2, s * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // dpad
        ctx.fillStyle = '#9ca3af';
        ctx.fillRect(-s * 0.32, -s * 0.08, s * 0.14, s * 0.05);
        ctx.fillRect(-s * 0.28, -s * 0.12, s * 0.05, s * 0.14);

        // buttons
        ctx.fillStyle = c.accent;
        ctx.beginPath();
        ctx.arc(s * 0.2, -s * 0.02, s * 0.05, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(s * 0.33, s * 0.05, s * 0.05, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /* =========================================================
       MAIN ANIMATION LOOP
       ========================================================= */
    function loopAnim(now) {
        ctx.clearRect(0, 0, W, H);

        // Update + draw
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            if (p.kind === 'balloon') {
                p.sway += p.swaySpeed;
                p.x += Math.cos(p.sway) * 0.6 + p.vx;
                p.y += p.vy;
            } else if (p.kind === 'ball') {
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;

                // ground bounce
                const floor = H * 0.85;
                if (p.y + p.size * 0.5 > floor) {
                    p.y = floor - p.size * 0.5;
                    p.vy *= -0.6;
                    p.vx *= 0.85;
                    p.bounces++;
                    if (p.bounces > 3) p.life -= 0.05;
                }
            } else if (p.kind === 'sparkle') {
                p.phase += 0.05;
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.006;
            } else {
                p.x += p.vx || 0;
                p.y += p.vy || 0;
                if (p.rot !== undefined) p.rot += p.vr || 0;
            }

            // Life decay
            if (p.kind !== 'ball') {
                p.life -= 0.0025;
            }

            // Cull
            if (p.life <= 0 || p.y < -200 || p.x < -200 || p.x > W + 200) {
                particles.splice(i, 1);
                continue;
            }

            // Draw
            if (p.kind === 'cake') drawCake(p);
            else if (p.kind === 'balloon') drawBalloon(p);
            else if (p.kind === 'confetti') drawConfetti(p);
            else if (p.kind === 'book') drawBook(p);
            else if (p.kind === 'cap') drawCap(p);
            else if (p.kind === 'sparkle') drawSparkle(p);
            else if (p.kind === 'ball') drawBall(p);
            else if (p.kind === 'controller') drawController(p);
        }

        // Spawn new particles
        const elapsed = now - animStartTime;
        const spawnRate = elapsed < 2500 ? 14 : elapsed < 5000 ? 8 : 4;

        if (elapsed < 9000 && Math.random() < spawnRate / 60) {
            let p;
            if (currentAnim === 'birthday') p = createBirthdayParticle();
            else if (currentAnim === 'education') p = createEducationParticle();
            else if (currentAnim === 'hobbies') p = createHobbyParticle();
            if (p) particles.push(p);
        }

        // Continue
        if (particles.length > 0 || elapsed < 9000) {
            rafId = requestAnimationFrame(loopAnim);
        } else {
            rafId = null;
        }
    }

    /* =========================================================
       OPEN / CLOSE ANIMATION
       ========================================================= */
    function openAnim(type) {
        currentAnim = type;
        animStartTime = performance.now();
        particles = [];

        resizeCanvas();

        // Warm-up particles
        if (type === 'birthday') {
            for (let i = 0; i < 10; i++) particles.push(createBirthdayParticle());
        } else if (type === 'education') {
            for (let i = 0; i < 8; i++) particles.push(createEducationParticle());
        } else if (type === 'hobbies') {
            for (let i = 0; i < 6; i++) particles.push(createHobbyParticle());
        }

        // Caption
        const captionKey = {
            birthday: 'about.anim.birthday',
            education: 'about.anim.education',
            hobbies: 'about.anim.hobbies'
        }[type];
        if (animCaption && captionKey) {
            animCaption.textContent = t(captionKey);
        } else if (animCaption) {
            animCaption.textContent = '';
        }

        animLayer.classList.add('is-open');
        animLayer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        // Cancel any existing loop
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(loopAnim);

        // Auto-close after 10s
        clearTimeout(openAnim._autoCloseTimer);
        openAnim._autoCloseTimer = setTimeout(() => {
            if (animLayer.classList.contains('is-open')) closeAnim();
        }, 10000);
    }

    function closeAnim() {
        animLayer.classList.remove('is-open');
        animLayer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        currentAnim = null;
        particles = [];
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        ctx.clearRect(0, 0, W, H);
    }

    /* ---------- BIND OPEN TRIGGERS ---------- */
    document.querySelectorAll('[data-anim]').forEach(el => {
        el.addEventListener('click', (e) => {
            const type = el.dataset.anim;
            // Only handle internal animations (not location — that one opens a link)
            if (type === 'location') return;
            e.preventDefault();
            openAnim(type);
        });
    });

    /* ---------- BIND CLOSE ---------- */
    animLayer.querySelectorAll('[data-close-anim]').forEach(el => {
        el.addEventListener('click', closeAnim);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && animLayer.classList.contains('is-open')) {
            closeAnim();
        }
    });

})();