/* =========================================================
   CERTIFICATES PAGE — Filtering + Modal + Touch Reveal
   ========================================================= */

(function () {
    'use strict';

    const t = (key) => (window.DAU_i18n ? window.DAU_i18n.t(key) : key);

    /* =========================================================
       CERTIFICATE DATA (for modal content)
       ========================================================= */
    const CERTIFICATES = {
        firstClass: {
            image: 'assets/images/certificates/first-class.png',
            titleKey: 'cert.item.firstClass.title',
            issuerKey: 'cert.item.firstClass.issuer',
            date: '2025',
            category: 'academic',
            gradeKey: 'cert.item.firstClass.grade',
            descKey: 'cert.item.firstClass.desc'
        },
        cbit: {
            image: 'assets/images/certificates/cbit.jpeg',
            titleKey: 'cert.item.cbit.title',
            issuerKey: 'cert.item.cbit.issuer',
            date: '2025',
            category: 'technical',
            gradeKey: 'cert.item.cbit.grade',
            descKey: 'cert.item.cbit.desc'
        },
        webprojects: {
            image: 'assets/images/certificates/web-projects.png',
            titleKey: 'cert.item.webprojects.title',
            issuerKey: 'cert.item.webprojects.issuer',
            date: '2026',
            category: 'technical',
            gradeKey: 'cert.item.webprojects.grade',
            descKey: 'cert.item.webprojects.desc'
        },
        hsk2: {
            image: 'assets/images/certificates/hsk2.jpeg',
            titleKey: 'cert.item.hsk2.title',
            issuerKey: 'cert.item.hsk2.issuer',
            date: '2024',
            category: 'language',
            descKey: 'cert.item.hsk2.desc'
        },
        hsk1: {
            image: 'assets/images/certificates/hsk1.png',
            titleKey: 'cert.item.hsk1.title',
            issuerKey: 'cert.item.hsk1.issuer',
            date: '2024',
            category: 'language',
            descKey: 'cert.item.hsk1.desc'
        },
        engHigh: {
            image: 'assets/images/certificates/english-high.jpeg',
            titleKey: 'cert.item.engHigh.title',
            issuerKey: 'cert.item.engHigh.issuer',
            date: '2024',
            category: 'language',
            gradeKey: 'cert.item.engHigh.grade',
            descKey: 'cert.item.engHigh.desc'
        },
        engStage5: {
            image: 'assets/images/certificates/english-stage5.png',
            titleKey: 'cert.item.engStage5.title',
            issuerKey: 'cert.item.engStage5.issuer',
            date: '2023',
            category: 'language',
            descKey: 'cert.item.engStage5.desc'
        },
        chemy: {
            image: 'assets/images/certificates/chemy.png',
            titleKey: 'cert.item.chemy.title',
            issuerKey: 'cert.item.chemy.issuer',
            dateKey: 'cert.item.chemy.period',
            category: 'academic',
            descKey: 'cert.item.chemy.desc'
        }
    };

    /* =========================================================
       FILTER
       ========================================================= */
    const filterButtons = document.querySelectorAll('.cert-filter__btn');
    const certCards = document.querySelectorAll('.cert-card[data-tags]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            certCards.forEach(card => {
                const tags = (card.dataset.tags || '').split(',').map(tag => tag.trim());
                const match = filter === 'all' || tags.includes(filter);

                if (match) {
                    card.style.display = '';
                    // Reset reveal state when re-shown
                    card.classList.remove('is-revealed');
                    void card.offsetWidth;
                } else {
                    card.style.display = 'none';
                    card.classList.remove('is-revealed');
                }
            });
        });
    });

    /* =========================================================
       MODAL
       ========================================================= */
    const modal = document.getElementById('certModal');
    const modalContent = document.getElementById('certModalContent');

    function openModal(certKey) {
        const data = CERTIFICATES[certKey];
        if (!data || !modal || !modalContent) return;

        const title = data.titleKey ? t(data.titleKey) : (data.title || '');
        const issuer = data.issuerKey ? t(data.issuerKey) : (data.issuer || '');
        const desc = data.descKey ? t(data.descKey) : (data.desc || '');
        const grade = data.gradeKey ? t(data.gradeKey) : (data.grade || '');
        const dateText = data.dateKey ? t(data.dateKey) : (data.date || '');

        modalContent.innerHTML = `
            <img class="cert-modal__image" src="${escapeHtml(data.image)}" alt="${escapeHtml(title)}" onerror="this.parentElement.classList.add('cert-modal__image--error'); this.style.display='none';" />
            <div class="cert-modal__info">
                <span class="cert-modal__badge">
                    <i class="fa-solid fa-certificate"></i>
                    ${escapeHtml(t('cert.filter.' + (data.category || 'all')) || data.category || '')}
                </span>
                <h2 class="cert-modal__title">${escapeHtml(title)}</h2>
                <p class="cert-modal__issuer">${escapeHtml(issuer)}</p>
                <p class="cert-modal__date">${escapeHtml(dateText)}</p>
                ${grade ? `<p class="cert-modal__desc" style="color:var(--accent);font-weight:600;">${escapeHtml(grade)}</p>` : ''}
                ${desc ? `<p class="cert-modal__desc">${escapeHtml(desc)}</p>` : ''}
                <div class="cert-modal__actions">
                    <a href="${escapeHtml(data.image)}" download class="btn btn--primary" data-cursor="hover">
                        <span class="btn__text">${escapeHtml(t('cert.modal.download'))}</span>
                        <span class="btn__icon"><i class="fa-solid fa-download"></i></span>
                    </a>
                    <button class="btn btn--ghost" data-close-cert data-cursor="hover">
                        <span class="btn__text">${escapeHtml(t('cert.modal.close'))}</span>
                        <span class="btn__icon"><i class="fa-solid fa-xmark"></i></span>
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        modalContent.querySelectorAll('[data-close-cert]').forEach(el => {
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
    document.querySelectorAll('[data-open-cert]').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.openCert);
        });
    });

    /* ---------- BIND CLOSE ---------- */
    if (modal) {
        modal.querySelectorAll('[data-close-cert]').forEach(el => {
            el.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    /* =========================================================
       TOUCH TO REVEAL (Mobile only)
       - Tap a card → reveals image
       - Tap same card → hides
       - Tap another card → previous hides, new reveals
       - Tap outside → all hide
       ========================================================= */
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (isTouch) {
        document.querySelectorAll('.cert-card').forEach(card => {
            const visual = card.querySelector('.cert-card__visual');
            if (!visual) return;

            visual.addEventListener('click', (e) => {
                // Don't trigger reveal if user clicked inside the button or link
                if (e.target.closest('[data-open-cert]')) return;
                if (e.target.closest('button')) return;
                if (e.target.closest('a')) return;

                const wasRevealed = card.classList.contains('is-revealed');

                // Close all other revealed cards
                document.querySelectorAll('.cert-card.is-revealed').forEach(other => {
                    if (other !== card) other.classList.remove('is-revealed');
                });

                // Toggle this card
                if (wasRevealed) {
                    card.classList.remove('is-revealed');
                } else {
                    card.classList.add('is-revealed');
                }
            });
        });

        // Tap outside closes all reveals
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cert-card')) {
                document.querySelectorAll('.cert-card.is-revealed').forEach(c => {
                    c.classList.remove('is-revealed');
                });
            }
        });
    }

    /* =========================================================
       KEYBOARD REVEAL (Accessibility)
       Tab to focus visual → Enter/Space to reveal/hide
       ========================================================= */
    document.querySelectorAll('.cert-card').forEach(card => {
        const visual = card.querySelector('.cert-card__visual');
        if (!visual) return;

        visual.setAttribute('tabindex', '0');
        visual.setAttribute('role', 'button');
        visual.setAttribute('aria-label', 'Reveal certificate');

        visual.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('is-revealed');
            }
        });
    });

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
       RE-RENDER MODAL ON LANGUAGE CHANGE
       ========================================================= */
    document.addEventListener('dau:langChanged', () => {
        if (modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

})();