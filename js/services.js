/* =========================================================
   SERVICES PAGE — Filter + Modal + Animations (Phase 7.5)
   ========================================================= */

(function () {
    'use strict';

    const t = (key) => (window.DAU_i18n ? window.DAU_i18n.t(key) : key);

    /* =========================================================
       SERVICE DATA (for modals)
       ========================================================= */
    const SERVICES = {
        'web-dev': {
            num: '01',
            icon: 'fa-solid fa-code',
            gradient: 'linear-gradient(135deg, #00e5ff 0%, #0077ff 100%)',
            titleKey: 'svc.card.1.title',
            descKey: 'svc.card.1.desc',
            longKey: 'svc.modal.web-dev.long',
            includes: [
                'svc.modal.web-dev.inc1',
                'svc.modal.web-dev.inc2',
                'svc.modal.web-dev.inc3',
                'svc.modal.web-dev.inc4',
                'svc.modal.web-dev.inc5'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'Responsive Design']
        },
        fullstack: {
            num: '02',
            icon: 'fa-solid fa-layer-group',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            titleKey: 'svc.card.2.title',
            descKey: 'svc.card.2.desc',
            longKey: 'svc.modal.fullstack.long',
            includes: [
                'svc.modal.fullstack.inc1',
                'svc.modal.fullstack.inc2',
                'svc.modal.fullstack.inc3',
                'svc.modal.fullstack.inc4',
                'svc.modal.fullstack.inc5'
            ],
            tech: ['Node.js', 'Express.js', 'MySQL', 'REST APIs', 'JWT', 'bcrypt']
        },
        website: {
            num: '03',
            icon: 'fa-solid fa-globe',
            gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            titleKey: 'svc.card.3.title',
            descKey: 'svc.card.3.desc',
            longKey: 'svc.modal.website.long',
            includes: [
                'svc.modal.website.inc1',
                'svc.modal.website.inc2',
                'svc.modal.website.inc3',
                'svc.modal.website.inc4'
            ],
            tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'SEO Basics', 'GitHub Pages']
        },
        infosys: {
            num: '04',
            icon: 'fa-solid fa-diagram-project',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            titleKey: 'svc.card.4.title',
            descKey: 'svc.card.4.desc',
            longKey: 'svc.modal.infosys.long',
            includes: [
                'svc.modal.infosys.inc1',
                'svc.modal.infosys.inc2',
                'svc.modal.infosys.inc3',
                'svc.modal.infosys.inc4'
            ],
            tech: ['Systems Design', 'Workflow Analysis', 'Database Design', 'Reporting']
        },
        dbdev: {
            num: '05',
            icon: 'fa-solid fa-database',
            gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
            titleKey: 'svc.card.5.title',
            descKey: 'svc.card.5.desc',
            longKey: 'svc.modal.dbdev.long',
            includes: [
                'svc.modal.dbdev.inc1',
                'svc.modal.dbdev.inc2',
                'svc.modal.dbdev.inc3',
                'svc.modal.dbdev.inc4'
            ],
            tech: ['MySQL', 'MariaDB', 'SQL', 'Schema Design', 'Normalization']
        },
        dbmgmt: {
            num: '06',
            icon: 'fa-solid fa-server',
            gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
            titleKey: 'svc.card.6.title',
            descKey: 'svc.card.6.desc',
            longKey: 'svc.modal.dbmgmt.long',
            includes: [
                'svc.modal.dbmgmt.inc1',
                'svc.modal.dbmgmt.inc2',
                'svc.modal.dbmgmt.inc3',
                'svc.modal.dbmgmt.inc4'
            ],
            tech: ['MySQL Workbench', 'DBeaver', 'Query Optimization', 'Backups']
        },
        itsupport: {
            num: '07',
            icon: 'fa-solid fa-screwdriver-wrench',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            titleKey: 'svc.card.7.title',
            descKey: 'svc.card.7.desc',
            longKey: 'svc.modal.itsupport.long',
            includes: [
                'svc.modal.itsupport.inc1',
                'svc.modal.itsupport.inc2',
                'svc.modal.itsupport.inc3',
                'svc.modal.itsupport.inc4'
            ],
            tech: ['Windows 10/11', 'Microsoft Office', 'IT Admin', 'Troubleshooting']
        },
        networking: {
            num: '08',
            icon: 'fa-solid fa-network-wired',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            titleKey: 'svc.card.8.title',
            descKey: 'svc.card.8.desc',
            longKey: 'svc.modal.networking.long',
            includes: [
                'svc.modal.networking.inc1',
                'svc.modal.networking.inc2',
                'svc.modal.networking.inc3',
                'svc.modal.networking.inc4'
            ],
            tech: ['Networking', 'Cisco', 'TCP/IP', 'Troubleshooting']
        },
        backend: {
            num: '09',
            icon: 'fa-solid fa-plug',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            titleKey: 'svc.card.9.title',
            descKey: 'svc.card.9.desc',
            longKey: 'svc.modal.backend.long',
            includes: [
                'svc.modal.backend.inc1',
                'svc.modal.backend.inc2',
                'svc.modal.backend.inc3',
                'svc.modal.backend.inc4'
            ],
            tech: ['Node.js', 'Express', 'REST', 'JWT', 'Authentication', 'Postman']
        },
        consult: {
            num: '10',
            icon: 'fa-solid fa-comments',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            titleKey: 'svc.card.10.title',
            descKey: 'svc.card.10.desc',
            longKey: 'svc.modal.consult.long',
            includes: [
                'svc.modal.consult.inc1',
                'svc.modal.consult.inc2',
                'svc.modal.consult.inc3',
                'svc.modal.consult.inc4'
            ],
            tech: ['Planning', 'Architecture', 'Code Review', 'Best Practices']
        }
    };

    /* =========================================================
       FILTER
       ========================================================= */
    const filterButtons = document.querySelectorAll('.svc-filter__btn');
    const serviceCards = document.querySelectorAll('.svc-card[data-tags]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            serviceCards.forEach(card => {
                const tags = (card.dataset.tags || '').split(',').map(tag => tag.trim());
                const match = filter === 'all' || tags.includes(filter);

                if (match) {
                    card.style.display = '';
                    card.classList.remove('is-revealed');
                    void card.offsetWidth;
                    card.classList.add('is-revealed');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* =========================================================
       MODAL
       ========================================================= */
    const modal = document.getElementById('svcModal');
    const modalContent = document.getElementById('svcModalContent');

    function openModal(serviceKey) {
        const data = SERVICES[serviceKey];
        if (!data || !modal || !modalContent) return;

        const title = t(data.titleKey);
        const desc = t(data.descKey);
        const long = t(data.longKey);

        const includesHTML = data.includes.map(k =>
            `<li>${escapeHtml(t(k))}</li>`
        ).join('');

        const techHTML = data.tech.map(tech =>
            `<span>${escapeHtml(tech)}</span>`
        ).join('');

        modalContent.innerHTML = `
            <div class="svc-modal__hero">
                <div class="svc-modal__hero-bg" style="background:${data.gradient};"></div>
                <div class="svc-modal__hero-grid"></div>
                <div class="svc-modal__hero-inner">
                    <div class="svc-modal__hero-icon">
                        <i class="${escapeHtml(data.icon)}"></i>
                    </div>
                    <div class="svc-modal__hero-text">
                        <span class="svc-modal__hero-num">${escapeHtml(data.num)}</span>
                        <h2 class="svc-modal__hero-title">${escapeHtml(title)}</h2>
                    </div>
                </div>
            </div>

            <div class="svc-modal__body">

                <div class="svc-modal__section">
                    <span class="svc-modal__label">${escapeHtml(t('svc.modal.about'))}</span>
                    <p>${escapeHtml(desc)}</p>
                    <p style="margin-top:12px;">${escapeHtml(long)}</p>
                </div>

                <div class="svc-modal__section">
                    <span class="svc-modal__label">${escapeHtml(t('svc.modal.includes'))}</span>
                    <ul class="svc-modal__list">${includesHTML}</ul>
                </div>

                <div class="svc-modal__section">
                    <span class="svc-modal__label">${escapeHtml(t('svc.modal.tech'))}</span>
                    <div class="svc-modal__tech">${techHTML}</div>
                </div>

                <div class="svc-modal__actions">
                    <a href="contact.html" class="btn btn--primary" data-cursor="hover">
                        <span class="btn__text">${escapeHtml(t('svc.card.cta'))}</span>
                        <span class="btn__icon"><i class="fa-solid fa-paper-plane"></i></span>
                    </a>
                    <button class="btn btn--ghost" data-close-service data-cursor="hover">
                        <span class="btn__text">${escapeHtml(t('svc.modal.close'))}</span>
                        <span class="btn__icon"><i class="fa-solid fa-xmark"></i></span>
                    </button>
                </div>

            </div>
        `;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        modalContent.querySelectorAll('[data-close-service]').forEach(el => {
            el.addEventListener('click', closeModal);
        });
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    /* ---------- BIND OPEN ---------- */
    document.querySelectorAll('[data-open-service]').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.openService);
        });
    });

    /* ---------- BIND CLOSE ---------- */
    if (modal) {
        modal.querySelectorAll('[data-close-service]').forEach(el => {
            el.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    /* =========================================================
       UTILITIES
       ========================================================= */
    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /* =========================================================
       ANIMATED COUNTERS
       ========================================================= */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const animate = (el) => {
            const target = parseInt(el.dataset.count, 10) || 0;
            const duration = 1600;
            const start = performance.now();

            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased);
                if (p < 1) requestAnimationFrame(tick);
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

    /* =========================================================
       CARD MOUSE GLOW
       ========================================================= */
    const glowTargets = document.querySelectorAll('.svc-card, .why-card, .process-step');
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isFine) {
        glowTargets.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mx', x + '%');
                card.style.setProperty('--my', y + '%');
            });
        });
    }

    /* =========================================================
       PROCESS STEPPER LINE DRAW
       ========================================================= */
    const stepper = document.querySelector('.process-stepper');
    if (stepper && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-drawn');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        io.observe(stepper);
    }

    /* =========================================================
       STAGGER REVEAL
       ========================================================= */
    const revealEls = document.querySelectorAll('.svc-card, .process-step, .why-card');
    revealEls.forEach((el, i) => {
        if (!el.hasAttribute('data-delay')) {
            const delay = (i % 6) * 0.05;
            el.style.transitionDelay = `${delay}s`;
        }
    });

    /* =========================================================
       RE-RENDER MODAL ON LANGUAGE CHANGE
       ========================================================= */
    document.addEventListener('dau:langChanged', () => {
        if (modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

})();