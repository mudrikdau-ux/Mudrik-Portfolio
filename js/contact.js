/* =========================================================
   CONTACT PAGE — Form + Map + WeChat + FAQ + Backend API
   Mudrik Dau Portfolio
   ========================================================= */

(function () {
    'use strict';

    const t = (key) => (window.DAU_i18n ? window.DAU_i18n.t(key) : key);

    /* =========================================================
       INTERACTIVE MAP (Leaflet)
       ========================================================= */
    const mapEl = document.getElementById('leafletMap');
    const coordsEl = document.getElementById('mapCoords');

    // Coordinates for Maungani, Zanzibar (approx)
    const LAT = -6.1622;
    const LNG = 39.1999;

    let map = null;

    function initMap() {
        if (!mapEl || typeof L === 'undefined') return;

        map = L.map('leafletMap', {
            center: [LAT, LNG],
            zoom: 15,
            scrollWheelZoom: false,
            zoomControl: true,
            attributionControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Custom marker
        const icon = L.divIcon({
            className: '',
            html: '<div class="contact-map__marker"><i class="fa-solid fa-location-dot"></i></div>',
            iconSize: [44, 44],
            iconAnchor: [22, 44]
        });

        const marker = L.marker([LAT, LNG], { icon }).addTo(map);

        marker.bindPopup(
            '<strong>' + t('contact.map.pin') + '</strong><br />' +
            '<span style="font-size:12px;color:#5a6382;">' + t('contact.map.pinSub') + '</span>',
            { closeButton: false, offset: [0, -34] }
        );

        if (coordsEl) {
            coordsEl.textContent = `${LAT.toFixed(4)}° S, ${LNG.toFixed(4)}° E`;
        }

        map.on('click', () => map.scrollWheelZoom.enable());
        map.on('mouseout', () => map.scrollWheelZoom.disable());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMap);
    } else {
        initMap();
    }

    /* ---------- Scroll to map section ---------- */
    const mapScrollBtn = document.querySelector('[data-scroll-to-map]');
    if (mapScrollBtn) {
        mapScrollBtn.addEventListener('click', () => {
            const target = document.getElementById('mapSection');
            if (!target) return;
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
            const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 20;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    }

    /* =========================================================
       CONTACT FORM
       ========================================================= */
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
        subjectSelect: (val) => {
            if (!val) return 'contact.form.err.subjectRequired';
            return null;
        },
        customSubject: (val) => {
            const field = document.getElementById('cfCustomSubjectField');
            if (!field || !field.classList.contains('is-visible')) return null;
            if (!val.trim()) return 'contact.form.err.customSubjectRequired';
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

        if (wrapper) wrapper.classList.add('is-invalid');
        if (errorEl) {
            // Support "raw:Actual message" to display backend text directly
            if (typeof key === 'string' && key.startsWith('raw:')) {
                errorEl.textContent = key.slice(4);
            } else {
                errorEl.textContent = t(key);
            }
        }
    }

    function clearError(fieldName) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        const wrapper = field.closest('.form-field');
        const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);

        if (wrapper) wrapper.classList.remove('is-invalid');
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
        ['name', 'email', 'subjectSelect', 'customSubject', 'message'].forEach(fieldName => {
            if (!validateField(fieldName)) valid = false;
        });
        return valid;
    }

    /* ---------- LIVE VALIDATION ---------- */
    ['name', 'email', 'customSubject', 'message'].forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.addEventListener('blur', () => {
            if (field.value.trim()) validateField(fieldName);
        });

        field.addEventListener('input', () => {
            const wrapper = field.closest('.form-field');
            if (wrapper && wrapper.classList.contains('is-invalid')) {
                validateField(fieldName);
            }
        });
    });

    /* ---------- SUBJECT SELECT ↔ CUSTOM SUBJECT ---------- */
    const subjectSelect = document.getElementById('cfSubjectSelect');
    const customSubjectField = document.getElementById('cfCustomSubjectField');
    const customSubjectInput = document.getElementById('cfCustomSubject');

    if (subjectSelect && customSubjectField) {
        subjectSelect.addEventListener('change', () => {
            const isOther = subjectSelect.value === 'other';

            if (isOther) {
                customSubjectField.classList.add('is-visible');
                setTimeout(() => {
                    if (customSubjectInput) customSubjectInput.focus();
                }, 220);
            } else {
                customSubjectField.classList.remove('is-visible');
                if (customSubjectInput) customSubjectInput.value = '';
                clearError('customSubject');
            }

            clearError('subjectSelect');
        });
    }

    /* ---------- STATUS MESSAGE ---------- */
    function setStatus(type, message) {
        if (!formStatus) return;

        formStatus.className = 'form-status';
        formStatus.innerHTML = '';

        if (!type) return;

        const iconClass =
            type === 'success' ? 'fa-solid fa-circle-check' :
            type === 'error'   ? 'fa-solid fa-circle-exclamation' :
            type === 'info'    ? 'fa-solid fa-spinner fa-spin' :
                                 'fa-solid fa-circle-info';

        const icon = document.createElement('i');
        icon.className = iconClass;

        const text = document.createElement('span');
        text.textContent = message;

        formStatus.classList.add(
            type === 'success' ? 'is-success' :
            type === 'error'   ? 'is-error' :
            type === 'info'    ? 'is-info'  :
                                 'is-info'
        );
        formStatus.appendChild(icon);
        formStatus.appendChild(text);
    }

    /* =========================================================
       SUBMIT — Send to Backend API
       ========================================================= */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        /* ---------- 1) Frontend validation ---------- */
        if (!validateForm()) {
            setStatus('error', t('contact.form.err.fixErrors'));
            const firstInvalid = form.querySelector('.form-field.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        /* ---------- 2) Collect values ---------- */
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        // Resolve subject
        let subject = '';
        const selectedVal = subjectSelect ? subjectSelect.value : '';
        if (selectedVal === 'other') {
            subject = (customSubjectInput ? customSubjectInput.value.trim() : '');
        } else if (selectedVal) {
            subject = t('contact.subject.' + selectedVal);
        }

        /* ---------- 3) Disable submit + show spinner ---------- */
        const submitBtn = form.querySelector('.form-submit');
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span class="btn__text">' + t('contact.form.sending') + '</span>' +
                '<span class="btn__icon"><i class="fa-solid fa-spinner fa-spin"></i></span>';
        }

        setStatus('info', t('contact.form.sending'));

        /* ---------- 4) Check API client is loaded ---------- */
        if (!window.DAU_api || !window.DAU_api.endpoints || !window.DAU_api.endpoints.submitContact) {
            console.error('[Contact] DAU_api client not loaded.');
            setStatus('error', t('contact.form.err.sendFailed'));
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
            return;
        }

        /* ---------- 5) Send to backend ---------- */
        try {
            const response = await window.DAU_api.endpoints.submitContact({
                name,
                email,
                subject,
                message
            });

            if (!response || !response.ok) {
                throw new Error((response && response.message) || 'Server rejected the request.');
            }

            /* ---------- 6) Success ---------- */
            setStatus('success', response.message || t('contact.form.success'));

            // Reset form
            form.reset();

            // Reset custom subject visibility
            if (customSubjectField) customSubjectField.classList.remove('is-visible');
            if (customSubjectInput) customSubjectInput.value = '';

            // Clear all errors
            ['name', 'email', 'subjectSelect', 'customSubject', 'message'].forEach(fn => clearError(fn));

        } catch (err) {
            console.error('[Contact] Submit failed:', err);

            // Backend validation errors (400)
            if (err && err.status === 400 && err.data && err.data.errors) {
                const fieldMap = {
                    name: 'name',
                    email: 'email',
                    subject: 'subjectSelect',
                    message: 'message'
                };
                let hasFieldError = false;
                Object.entries(err.data.errors).forEach(([field, msg]) => {
                    const formField = fieldMap[field] || field;
                    showError(formField, 'raw:' + msg);
                    hasFieldError = true;
                });
                if (hasFieldError) {
                    setStatus('error', t('contact.form.err.fixErrors'));
                    const firstInvalid = form.querySelector('.form-field.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }
            }

            // Rate limit (429)
            if (err && err.status === 429) {
                setStatus('error', err.message || t('contact.form.err.tooMany'));
                return;
            }

            // Timeout / network
            if (err && /timed out/i.test(err.message)) {
                setStatus('error', t('contact.form.err.timeout'));
                return;
            }

            // Generic error
            setStatus(
                'error',
                (err && err.message) || t('contact.form.err.sendFailed')
            );

        } finally {
            /* ---------- 7) Re-enable submit ---------- */
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        }
    });

    /* ---------- RESET ---------- */
    form.addEventListener('reset', () => {
        ['name', 'email', 'subjectSelect', 'customSubject', 'message'].forEach(fieldName => {
            clearError(fieldName);
        });
        setStatus(null, '');

        if (customSubjectField) customSubjectField.classList.remove('is-visible');
        if (customSubjectInput) customSubjectInput.value = '';
    });

    /* ---------- RE-RENDER STATUS ON LANGUAGE CHANGE ---------- */
    document.addEventListener('dau:langChanged', () => {
        setStatus(null, '');
    });

    /* =========================================================
       FAQ: allow only one open at a time
       ========================================================= */
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

    /* =========================================================
       WeChat QR Modal + Copy ID
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

    document.querySelectorAll('[data-open-qr]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('[data-copy-wechat]')) return;
            openQrModal();
        });
    });

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
            const temp = document.createElement('textarea');
            temp.value = id;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(temp);
        }

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

    /* ---------- CARD MOUSE GLOW ---------- */
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isFine) {
        document.querySelectorAll('.contact-card').forEach(card => {
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
       BACKEND CONNECTION CHECK (silent, on page load)
       ========================================================= */
    if (window.DAU_api && window.DAU_api.ping) {
        window.DAU_api.ping().then(ok => {
            if (!ok) {
                console.warn(
                    '[Contact] Backend unreachable at ' +
                    (window.DAU_api.getBaseURL ? window.DAU_api.getBaseURL() : '') +
                    '. Contact form will not work until the backend is running.'
                );
            } else {
                console.info(
                    '[Contact] Backend reachable at ' +
                    (window.DAU_api.getBaseURL ? window.DAU_api.getBaseURL() : '')
                );
            }
        });
    }

})();