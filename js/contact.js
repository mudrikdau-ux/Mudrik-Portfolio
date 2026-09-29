/* =========================================================
   CONTACT PAGE — Form Validation + Submit (mailto fallback)
   + WeChat copy-to-clipboard
   + WeChat QR modal (Phase 9.5)
   ========================================================= */

(function () {
    'use strict';

    const t = (key) => (window.DAU_i18n ? window.DAU_i18n.t(key) : key);

    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!form) return;

    /* ---------- FIELD VALIDATORS ---------- */
    const validators = {
        name: (val) => {
            if (!val.trim()) return 'contact.form.err.nameRequired';
            if (val.trim().length < 2) return 'contact.form.err.nameShort';
            return null;
        },
        email: (val) => {
            if (!val.trim()) return 'contact.form.err.emailRequired';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'contact.form.err.emailInvalid';
            return null;
        },
        subject: (val) => {
            if (!val.trim()) return 'contact.form.err.subjectRequired';
            if (val.trim().length < 3) return 'contact.form.err.subjectShort';
            return null;
        },
        message: (val) => {
            if (!val.trim()) return 'contact.form.err.messageRequired';
            if (val.trim().length < 10) return 'contact.form.err.messageShort';
            return null;
        }
    };

    /* ---------- SHOW / CLEAR ERRORS ---------- */
    function showError(fieldName, key) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        const wrapper = field.closest('.form-field');
        const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);

        wrapper.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = t(key);
    }

    function clearError(fieldName) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        const wrapper = field.closest('.form-field');
        const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);

        wrapper.classList.remove('is-invalid');
        if (errorEl) errorEl.textContent = '';
    }

    function validateField(fieldName) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field || !validators[fieldName]) return true;

        const errorKey = validators[fieldName](field.value);
        if (errorKey) {
            showError(fieldName, errorKey);
            return false;
        }
        clearError(fieldName);
        return true;
    }

    function validateForm() {
        let valid = true;
        ['name', 'email', 'subject', 'message'].forEach(fieldName => {
            if (!validateField(fieldName)) valid = false;
        });
        return valid;
    }

    /* ---------- LIVE VALIDATION ---------- */
    ['name', 'email', 'subject', 'message'].forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        // On blur, validate fully
        field.addEventListener('blur', () => {
            if (field.value.trim()) validateField(fieldName);
        });

        // On input, clear error if it becomes valid
        field.addEventListener('input', () => {
            if (field.closest('.form-field').classList.contains('is-invalid')) {
                validateField(fieldName);
            }
        });
    });

    /* ---------- STATUS MESSAGE ---------- */
    function setStatus(type, message) {
        if (!formStatus) return;

        formStatus.className = 'form-status';
        formStatus.innerHTML = '';

        if (!type) return;

        const iconClass = type === 'success'
            ? 'fa-solid fa-circle-check'
            : 'fa-solid fa-circle-exclamation';

        const icon = document.createElement('i');
        icon.className = iconClass;

        const text = document.createElement('span');
        text.textContent = message;

        formStatus.classList.add(type === 'success' ? 'is-success' : 'is-error');
        formStatus.appendChild(icon);
        formStatus.appendChild(text);
    }

    /* ---------- SUBMIT (mailto fallback) ---------- */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setStatus('error', t('contact.form.err.fixErrors'));
            // Scroll to first error
            const firstInvalid = form.querySelector('.form-field.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const subject = form.querySelector('[name="subject"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        const recipient = 'mudrikdau@gmail.com';
        const mailSubject = `${subject} — from ${name}`;
        const mailBody =
            `Hello Mudrik,\n\n` +
            `${message}\n\n` +
            `---\n` +
            `From: ${name}\n` +
            `Email: ${email}\n`;

        const mailtoUrl =
            `mailto:${recipient}` +
            `?subject=${encodeURIComponent(mailSubject)}` +
            `&body=${encodeURIComponent(mailBody)}`;

        // Show status
        setStatus('success', t('contact.form.success'));

        // Open mail client
        setTimeout(() => {
            window.location.href = mailtoUrl;
        }, 400);
    });

    /* ---------- RESET ---------- */
    form.addEventListener('reset', () => {
        ['name', 'email', 'subject', 'message'].forEach(fieldName => {
            clearError(fieldName);
        });
        setStatus(null, '');
    });

    /* ---------- RE-RENDER STATUS ON LANGUAGE CHANGE ---------- */
    document.addEventListener('dau:langChanged', () => {
        // Clear any status; it will be re-rendered when needed
        setStatus(null, '');
    });

    /* ---------- FAQ: allow only one open at a time ---------- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item && other.open) {
                        other.open = false;
                    }
                });
            }
        });
    });

    /* ---------- ANIMATED COUNTERS (harmless for this page) ---------- */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
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
       PHASE 9.5 — WeChat QR Modal + Copy ID
       ========================================================= */
    const qrModal = document.getElementById('qrModal');

    function openQrModal() {
        if (!qrModal) return;
        qrModal.classList.add('is-open');
        qrModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function closeQrModal() {
        if (!qrModal) return;
        qrModal.classList.remove('is-open');
        qrModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    // Open via WeChat card
    document.querySelectorAll('[data-open-qr]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // prevent the copy button from also opening the modal
            if (e.target.closest('[data-copy-wechat]')) return;
            openQrModal();
        });
    });

    // Close
    if (qrModal) {
        qrModal.querySelectorAll('[data-close-qr]').forEach(el => {
            el.addEventListener('click', closeQrModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && qrModal.classList.contains('is-open')) {
                closeQrModal();
            }
        });
    }

    /* ---------- COPY WECHAT ID ---------- */
    async function copyWechatId(button, id) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(id);
            } else {
                throw new Error('Clipboard API unavailable');
            }
        } catch (err) {
            // Fallback for older browsers / non-secure contexts
            const temp = document.createElement('textarea');
            temp.value = id;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(temp);
        }

        // Visual feedback
        const original = button.innerHTML;
        button.classList.add('is-copied');
        button.innerHTML = '<i class="fa-solid fa-check"></i><span>' +
            (window.DAU_i18n ? window.DAU_i18n.t('contact.social.copied') : 'Copied!') +
            '</span>';

        setTimeout(() => {
            button.classList.remove('is-copied');
            button.innerHTML = original;
        }, 1800);
    }

    document.querySelectorAll('[data-copy-wechat]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyWechatId(btn, btn.dataset.copyWechat);
        });
    });

    /* ---------- RE-RENDER WECHAT MODAL COPY BUTTON ON LANGUAGE CHANGE ---------- */
    document.addEventListener('dau:langChanged', () => {
        document.querySelectorAll('[data-copy-wechat]').forEach(btn => {
            if (!btn.classList.contains('is-copied')) {
                const icon = btn.querySelector('i');
                const span = btn.querySelector('span[data-i18n="contact.social.copyId"]');
                if (span && window.DAU_i18n) {
                    span.textContent = window.DAU_i18n.t('contact.social.copyId');
                }
            }
        });
    });

})();