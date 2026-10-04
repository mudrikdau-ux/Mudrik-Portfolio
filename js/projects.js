/* =========================================================
   PROJECTS PAGE — Filtering + Modal
   ========================================================= */

(function () {
    'use strict';

    const t = (key) => (window.DAU_i18n ? window.DAU_i18n.t(key) : key);

    /* =========================================================
       PROJECT DATA
       ========================================================= */
    const PROJECTS = {
        cleanspark: {
            num: '01',
            title: 'CleanSpark',
            subtitleKey: 'project.cleanspark.tag',
            gradient: 'linear-gradient(135deg, #00e5ff 0%, #0077ff 100%)',
            image: 'assets/images/projects/csms.png',
            tags: ['Node.js', 'Express', 'MySQL', 'Bootstrap 5', 'JWT', 'Nodemailer'],
            liveUrl: 'https://mudrikdau-ux.github.io/CLEANING-SERVICE-MANAGEMENT-SYSTEM/index.html',
            about: {
                labelKey: 'proj.modal.about.label',
                titleKey: 'proj.modal.cleanspark.about.title',
                p1Key: 'proj.modal.cleanspark.about.p1',
                p2Key: 'proj.modal.cleanspark.about.p2'
            },
            problem: {
                titleKey: 'proj.modal.cleanspark.problem.title',
                items: [
                    'proj.modal.cleanspark.problem.1',
                    'proj.modal.cleanspark.problem.2',
                    'proj.modal.cleanspark.problem.3',
                    'proj.modal.cleanspark.problem.4',
                    'proj.modal.cleanspark.problem.5'
                ]
            },
            solution: {
                titleKey: 'proj.modal.cleanspark.solution.title',
                items: [
                    'proj.modal.cleanspark.solution.1',
                    'proj.modal.cleanspark.solution.2',
                    'proj.modal.cleanspark.solution.3',
                    'proj.modal.cleanspark.solution.4',
                    'proj.modal.cleanspark.solution.5'
                ]
            },
            features: {
                labelKey: 'proj.modal.features.label',
                titleKey: 'proj.modal.cleanspark.features.title',
                items: [
                    'proj.modal.cleanspark.features.1',
                    'proj.modal.cleanspark.features.2',
                    'proj.modal.cleanspark.features.3',
                    'proj.modal.cleanspark.features.4',
                    'proj.modal.cleanspark.features.5',
                    'proj.modal.cleanspark.features.6'
                ]
            },
            workflow: {
                labelKey: 'proj.modal.workflow.label',
                steps: [
                    'project.workflow.customer',
                    'project.workflow.booking',
                    'project.workflow.admin',
                    'project.workflow.staff',
                    'project.workflow.service',
                    'project.workflow.payment',
                    'project.workflow.report'
                ]
            },
            tech: {
                labelKey: 'proj.modal.tech.label',
                items: ['HTML', 'CSS', 'JavaScript', 'Bootstrap 5.3', 'Node.js', 'Express.js', 'MySQL', 'mysql2', 'Nodemailer', 'bcrypt', 'JWT', 'Google Login', 'Postman', 'GitHub']
            },
            role: {
                labelKey: 'proj.modal.role.label',
                valueKey: 'proj.modal.cleanspark.role.value'
            }
        },

        lams: {
            num: '02',
            title: 'LAMS',
            subtitleKey: 'project.lams.tag',
            gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            image: 'assets/images/projects/lams.png',
            tags: ['Node.js', 'Express', 'MySQL', 'JWT', 'Multer', 'Helmet'],
            liveUrl: 'https://mudrikdau-ux.github.io/Local-administrative-management-system/login.html',
            about: {
                labelKey: 'proj.modal.about.label',
                titleKey: 'proj.modal.lams.about.title',
                p1Key: 'proj.modal.lams.about.p1',
                p2Key: 'proj.modal.lams.about.p2'
            },
            problem: {
                titleKey: 'proj.modal.lams.problem.title',
                items: [
                    'proj.modal.lams.problem.1',
                    'proj.modal.lams.problem.2',
                    'proj.modal.lams.problem.3',
                    'proj.modal.lams.problem.4',
                    'proj.modal.lams.problem.5'
                ]
            },
            solution: {
                titleKey: 'proj.modal.lams.solution.title',
                items: [
                    'proj.modal.lams.solution.1',
                    'proj.modal.lams.solution.2',
                    'proj.modal.lams.solution.3',
                    'proj.modal.lams.solution.4',
                    'proj.modal.lams.solution.5'
                ]
            },
            features: {
                labelKey: 'proj.modal.features.label',
                titleKey: 'proj.modal.lams.features.title',
                items: [
                    'proj.modal.lams.features.1',
                    'proj.modal.lams.features.2',
                    'proj.modal.lams.features.3',
                    'proj.modal.lams.features.4',
                    'proj.modal.lams.features.5',
                    'proj.modal.lams.features.6'
                ]
            },
            workflow: {
                labelKey: 'proj.modal.workflow.label',
                steps: [
                    'project.workflow.citizen',
                    'project.workflow.application',
                    'project.workflow.admin',
                    'project.workflow.payment',
                    'project.workflow.document',
                    'project.workflow.report'
                ]
            },
            tech: {
                labelKey: 'proj.modal.tech.label',
                items: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'bcryptjs', 'JWT', 'Multer', 'Helmet', 'Morgan', 'express-validator', 'CORS', 'dotenv', 'Postman']
            },
            role: {
                labelKey: 'proj.modal.role.label',
                valueKey: 'proj.modal.lams.role.value'
            }
        },

        ssms: {
            num: '03',
            title: 'School Staff Management System',
            subtitleKey: 'project.ssms.tag',
            gradient: 'linear-gradient(135deg, #22e07a 0%, #00e5ff 100%)',
            image: 'assets/images/projects/ssms.png',
            tags: ['Web App', 'Admin Panel', 'GitHub Pages', 'Staff Management'],
            liveUrl: 'https://mudrikdau-ux.github.io/rassaly-school/',
            about: {
                labelKey: 'proj.modal.about.label',
                titleKey: 'proj.modal.ssms.about.title',
                p1Key: 'proj.modal.ssms.about.p1',
                p2Key: 'proj.modal.ssms.about.p2'
            },
            problem: {
                titleKey: 'proj.modal.ssms.problem.title',
                items: [
                    'proj.modal.ssms.problem.1',
                    'proj.modal.ssms.problem.2',
                    'proj.modal.ssms.problem.3',
                    'proj.modal.ssms.problem.4'
                ]
            },
            solution: {
                titleKey: 'proj.modal.ssms.solution.title',
                items: [
                    'proj.modal.ssms.solution.1',
                    'proj.modal.ssms.solution.2',
                    'proj.modal.ssms.solution.3',
                    'proj.modal.ssms.solution.4'
                ]
            },
            features: {
                labelKey: 'proj.modal.features.label',
                titleKey: 'proj.modal.ssms.features.title',
                items: [
                    'proj.modal.ssms.features.1',
                    'proj.modal.ssms.features.2',
                    'proj.modal.ssms.features.3',
                    'proj.modal.ssms.features.4',
                    'proj.modal.ssms.features.5'
                ]
            },
            workflow: {
                labelKey: 'proj.modal.workflow.label',
                steps: [
                    'project.workflow.admin',
                    'project.workflow.staff',
                    'project.workflow.report'
                ]
            },
            tech: {
                labelKey: 'proj.modal.tech.label',
                items: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'GitHub Pages']
            },
            role: {
                labelKey: 'proj.modal.role.label',
                valueKey: 'proj.modal.ssms.role.value'
            }
        },

        portfolio: {
            num: '04',
            title: 'Portfolio Website',
            subtitleKey: 'project.portfolio.tag',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #a855f7 100%)',
            image: 'assets/images/projects/portfolio.png',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'i18n', 'Animations'],
            liveUrl: 'https://mudrikdau-ux.github.io/Mudrik-Portfolio/',
            about: {
                labelKey: 'proj.modal.about.label',
                titleKey: 'proj.modal.portfolio.about.title',
                p1Key: 'proj.modal.portfolio.about.p1',
                p2Key: 'proj.modal.portfolio.about.p2'
            },
            problem: {
                titleKey: 'proj.modal.portfolio.problem.title',
                items: [
                    'proj.modal.portfolio.problem.1',
                    'proj.modal.portfolio.problem.2',
                    'proj.modal.portfolio.problem.3'
                ]
            },
            solution: {
                titleKey: 'proj.modal.portfolio.solution.title',
                items: [
                    'proj.modal.portfolio.solution.1',
                    'proj.modal.portfolio.solution.2',
                    'proj.modal.portfolio.solution.3',
                    'proj.modal.portfolio.solution.4'
                ]
            },
            features: {
                labelKey: 'proj.modal.features.label',
                titleKey: 'proj.modal.portfolio.features.title',
                items: [
                    'proj.modal.portfolio.features.1',
                    'proj.modal.portfolio.features.2',
                    'proj.modal.portfolio.features.3',
                    'proj.modal.portfolio.features.4',
                    'proj.modal.portfolio.features.5',
                    'proj.modal.portfolio.features.6'
                ]
            },
            workflow: {
                labelKey: 'proj.modal.workflow.label',
                steps: [
                    'project.workflow.customer',
                    'project.workflow.report'
                ]
            },
            tech: {
                labelKey: 'proj.modal.tech.label',
                items: ['HTML5', 'CSS3', 'JavaScript', 'Font Awesome', 'Google Fonts', 'GitHub Pages']
            },
            role: {
                labelKey: 'proj.modal.role.label',
                valueKey: 'proj.modal.portfolio.role.value'
            }
        }
    };

    /* =========================================================
       FILTER
       ========================================================= */
    const filterButtons = document.querySelectorAll('.proj-filter__btn');
    const projectCards = document.querySelectorAll('.proj-card[data-tags]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            projectCards.forEach(card => {
                const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
                const match = filter === 'all' || tags.includes(filter);

                if (match) {
                    card.classList.remove('is-hidden');
                    // Trigger reveal re-animation
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = '';
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    /* =========================================================
       MODAL
       ========================================================= */
    const modal = document.getElementById('projModal');
    const modalContent = document.getElementById('projModalContent');

    function openModal(projectKey) {
        const data = PROJECTS[projectKey];
        if (!data || !modal || !modalContent) return;

        const problemItems = data.problem.items.map(k =>
            `<li>${escapeHtml(t(k))}</li>`
        ).join('');

        const solutionItems = data.solution.items.map(k =>
            `<li>${escapeHtml(t(k))}</li>`
        ).join('');

        const featureItems = data.features.items.map(k =>
            `<li>${escapeHtml(t(k))}</li>`
        ).join('');

        const workflowSteps = data.workflow.steps.map((k, i, arr) =>
            `<span class="modal-workflow__step">${escapeHtml(t(k))}</span>` +
            (i < arr.length - 1 ? `<i class="fa-solid fa-arrow-right modal-workflow__arrow"></i>` : '')
        ).join('');

        const techItems = data.tech.items.map(t =>
            `<span>${escapeHtml(t)}</span>`
        ).join('');

        const heroTags = data.tags.map(t =>
            `<span>${escapeHtml(t)}</span>`
        ).join('');

        modalContent.innerHTML = `
            ${data.image ? `
            <div class="modal-preview">
                <img
                    src="${escapeHtml(data.image)}"
                    alt="${escapeHtml(data.title)} preview"
                    class="modal-preview__img"
                    onerror="this.parentElement.style.display='none';"
                />
            </div>
            ` : ''}

            <div class="modal-hero">
                <div class="modal-hero__bg" style="background:${data.gradient};"></div>
                <div class="modal-hero__grid"></div>
                <div class="modal-hero__content">
                    <span class="modal-hero__num">${escapeHtml(data.num)}</span>
                    <h2 class="modal-hero__title">${escapeHtml(data.title)}</h2>
                    <p class="modal-hero__subtitle">${escapeHtml(t(data.subtitleKey))}</p>
                    <div class="modal-hero__tags">${heroTags}</div>
                </div>
            </div>

            <div class="modal-body">

                <div class="modal-section">
                    <span class="modal-section__label">${escapeHtml(t(data.about.labelKey))}</span>
                    <h3 class="modal-section__title">${escapeHtml(t(data.about.titleKey))}</h3>
                    <p>${escapeHtml(t(data.about.p1Key))}</p>
                    <p>${escapeHtml(t(data.about.p2Key))}</p>
                </div>

                <div class="modal-section">
                    <div class="modal-grid">
                        <div class="modal-grid__col">
                            <h4>${escapeHtml(t(data.problem.titleKey))}</h4>
                            <ul>${problemItems}</ul>
                        </div>
                        <div class="modal-grid__col">
                            <h4>${escapeHtml(t(data.solution.titleKey))}</h4>
                            <ul>${solutionItems}</ul>
                        </div>
                    </div>
                </div>

                <div class="modal-section">
                    <span class="modal-section__label">${escapeHtml(t(data.features.labelKey))}</span>
                    <h3 class="modal-section__title">${escapeHtml(t(data.features.titleKey))}</h3>
                    <div class="modal-grid__col">
                        <ul>${featureItems}</ul>
                    </div>
                </div>

                <div class="modal-section">
                    <span class="modal-section__label">${escapeHtml(t(data.workflow.labelKey))}</span>
                    <div class="modal-workflow">${workflowSteps}</div>
                </div>

                <div class="modal-section">
                    <span class="modal-section__label">${escapeHtml(t(data.tech.labelKey))}</span>
                    <div class="modal-tech">${techItems}</div>
                </div>

                <div class="modal-section">
                    <span class="modal-section__label">${escapeHtml(t(data.role.labelKey))}</span>
                    <p>${escapeHtml(t(data.role.valueKey))}</p>
                </div>

                <div class="modal-actions">
                    <a href="${data.liveUrl}" target="_blank" rel="noopener" class="btn btn--primary" data-cursor="hover">
                        <span class="btn__text">${escapeHtml(t('proj.card.demo'))}</span>
                        <span class="btn__icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
                    </a>
                    <button class="btn btn--ghost" data-close-modal data-cursor="hover">
                        <span class="btn__text">${escapeHtml(t('proj.modal.close'))}</span>
                        <span class="btn__icon"><i class="fa-solid fa-xmark"></i></span>
                    </button>
                </div>

            </div>
        `;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        // Bind close inside modal
        modalContent.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', closeModal);
        });
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    /* ---------- BIND OPEN BUTTONS ---------- */
    document.querySelectorAll('[data-open-project]').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.openProject);
        });
    });

    /* ---------- BIND CLOSE ---------- */
    if (modal) {
        modal.querySelectorAll('[data-close-modal]').forEach(el => {
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

    /* =========================================================
       RE-RENDER MODAL ON LANGUAGE CHANGE
       ========================================================= */
    document.addEventListener('dau:langChanged', () => {
        if (modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

})();