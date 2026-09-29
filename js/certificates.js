/* =========================================================
   CERTIFICATES PAGE — Filtering + Modal
   ========================================================= */

(function () {
    'use strict';

    const t = (key) => (window.DAU_i18n ? window.DAU_i18n.t(key) : key);

    /* =========================================================
       CERTIFICATE DATA
       ---------------------------------------------------------
       HOW TO ADD A CERTIFICATE:
       1. Place the certificate image at:
          assets/images/certificates/your-cert.jpg
       2. Add an entry below like:
          myCert: {
              image: 'assets/images/certificates/your-cert.jpg',
              titleKey: 'cert.item.mycert.title',
              issuerKey: 'cert.item.mycert.issuer',
              date: '2026',
              category: 'technical',
              descKey: 'cert.item.mycert.desc',
              viewUrl: 'assets/images/certificates/your-cert.jpg'
          }
       3. Add the corresponding card HTML inside <div class="cert-grid"> in certificates.html
       4. Remove the `hidden` attribute from #certGrid and delete/hide #certEmpty
       ========================================================= */
    const CERTIFICATES = {
        // Example entry (uncomment and edit when you have a real certificate):
        // exampleCert: {
        //     image: 'assets/images/certificates/example.jpg',
        //     titleKey: 'cert.item.example.title',
        //     issuerKey: 'cert.item.example.issuer',
        //     date: '2026',
        //     category: 'technical',
        //     descKey: 'cert.item.example.desc',
        //     viewUrl: 'assets/images/certificates/example.jpg'
        // }
    };

    /* =========================================================
       DETECT EMPTY STATE
       ========================================================= */
    const grid = document.getElementById('certGrid');
    const empty = document.getElementById('certEmpty');

    const hasCerts = Object.keys(CERTIFICATES).length > 0;

    if (grid) {
        if (hasCerts) {
            grid.removeAttribute('hidden');
            if (empty) empty.style.display = 'none';
        } else {
            grid.setAttribute('hidden', '');
            if (empty) empty.style.display = '';
        }
    }

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
                const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
                const match = filter === 'all' || tags.includes(filter);

                if (match) {
                    card.style.display = '';
                    // Trigger reveal re-animation
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = '';
                } else {
                    card.style.display = 'none';
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

        modalContent.innerHTML = `
            <img class="cert-modal__image" src="${escapeHtml(data.image)}" alt="${escapeHtml(title)}" />
            <div class="cert-modal__info">
                <span class="cert-modal__badge">
                    <i class="fa-solid fa-certificate"></i>
                    ${escapeHtml(data.category || '')}
                </span>
                <h2 class="cert-modal__title">${escapeHtml(title)}</h2>
                <p class="cert-modal__issuer">${escapeHtml(issuer)}</p>
                <p class="cert-modal__date">${escapeHtml(data.date || '')}</p>
                ${desc ? `<p class="cert-modal__desc">${escapeHtml(desc)}</p>` : ''}
                <div class="cert-modal__actions">
                    <a href="${escapeHtml(data.viewUrl || data.image)}" download class="btn btn--primary" data-cursor="hover">
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

    /* ---------- BIND OPEN BUTTONS ---------- */
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