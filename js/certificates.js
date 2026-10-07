/* =========================================================
   CERTIFICATES PAGE — SIMPLE VEIL SYSTEM (works on iOS)
   ========================================================= */

.cert-page {
    position: relative;
    padding-top: var(--nav-h);
}

/* =========================================================
   HERO
   ========================================================= */
.cert-hero {
    padding: 60px 0 80px;
}

.cert-hero__inner {
    max-width: 900px;
}

.cert-hero__title {
    font-size: clamp(2rem, 5.5vw, 4rem);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
    margin: 22px 0 26px;
}

.cert-hero__title em {
    font-style: normal;
    background: var(--grad-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cert-hero__desc {
    font-size: 1.08rem;
    color: var(--text-1);
    line-height: 1.75;
    max-width: 620px;
    margin-bottom: 40px;
}

.cert-hero__stats {
    display: flex;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
}

.cert-hero__stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.cert-hero__stat-num {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    background: var(--grad-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cert-hero__stat-label {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-3);
}

.cert-hero__stat-divider {
    width: 1px;
    height: 40px;
    background: var(--border-2);
}

/* =========================================================
   FILTER
   ========================================================= */
.cert-filter {
    padding: 0 0 40px;
}

.cert-filter__inner {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding: 8px;
    background: var(--glass-bg);
    border: 1px solid var(--border-1);
    border-radius: var(--r-full);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    width: fit-content;
    max-width: 100%;
}

.cert-filter__btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 11px 22px;
    border-radius: var(--r-full);
    font-size: 0.86rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-1);
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: color 0.25s var(--ease),
                background 0.3s var(--ease),
                border-color 0.3s var(--ease);
    white-space: nowrap;
}

.cert-filter__btn:hover {
    color: var(--text-0);
    background: var(--surface-2);
}

.cert-filter__btn.is-active {
    color: #05060a;
    background: var(--grad-accent);
    box-shadow: 0 8px 24px rgba(0, 229, 255, 0.3);
}

.cert-filter__count {
    display: inline-grid;
    place-items: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: var(--r-full);
    background: var(--surface-3);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
}

.cert-filter__btn.is-active .cert-filter__count {
    background: rgba(5, 6, 10, 0.2);
    color: #05060a;
}

/* =========================================================
   GRID
   ========================================================= */
.cert-grid-section {
    padding: 20px 0 60px;
}

.cert-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
}

.cert-card {
    position: relative;
    border-radius: var(--r-lg);
    background: var(--glass-bg);
    border: 1px solid var(--border-1);
    overflow: hidden;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    transition: transform 0.5s var(--ease),
                border-color 0.5s var(--ease),
                box-shadow 0.5s var(--ease);
    display: flex;
    flex-direction: column;
}

.cert-card:hover {
    transform: translateY(-8px);
    border-color: var(--border-accent);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 229, 255, 0.12);
}

.cert-card--featured .cert-card__title {
    background: var(--grad-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* =========================================================
   VISUAL — image + veil
   ========================================================= */
.cert-card__visual {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--bg-2);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

.cert-card__visual img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
}

/* =========================================================
   VEIL — solid cover panel (100% reliable on iOS)
   Contains the lock icon and text INSIDE it.
   ========================================================= */
.cert-card__veil {
    position: absolute;
    inset: 0;
    z-index: 3;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;

    /* Solid opaque gradient — no filters, no blur, no
       pseudo-elements, no z-index fights. Just a panel. */
    background:
        radial-gradient(circle at 50% 30%, #1a2135 0%, #0a0e1a 100%);

    transition: opacity 0.4s ease, visibility 0.4s ease;
    opacity: 1;
    visibility: visible;
}

/* Hidden when revealed */
.cert-card.is-revealed .cert-card__veil,
.cert-card:hover .cert-card__veil,
.cert-card:focus-within .cert-card__veil {
    opacity: 0;
    visibility: hidden;
}

.cert-card__veil-icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: rgba(0, 229, 255, 0.1);
    border: 1.5px solid rgba(0, 229, 255, 0.45);
    color: var(--accent);
    font-size: 1.35rem;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
    animation: certVeilPulse 2.6s ease-in-out infinite;
}

.cert-card__veil-text {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.92);
    padding: 6px 14px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: var(--r-full);
    white-space: nowrap;
}

/* Dashed frame inside veil */
.cert-card__veil::before {
    content: '';
    position: absolute;
    inset: 14px;
    border: 1px dashed rgba(255, 255, 255, 0.08);
    border-radius: var(--r-md);
    pointer-events: none;
}

@keyframes certVeilPulse {
    0%, 100% {
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 45px rgba(0, 229, 255, 0.45);
        transform: scale(1.06);
    }
}

/* =========================================================
   BADGE — always visible above veil
   ========================================================= */
.cert-card__badge {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: var(--r-full);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
}

.cert-card__badge i {
    color: var(--accent);
    font-size: 0.72rem;
}

.cert-card__badge--featured {
    background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
}

.cert-card__badge--featured i {
    color: #ffffff;
}

/* =========================================================
   BODY
   ========================================================= */
.cert-card__body {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
}

.cert-card__date {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    color: var(--accent);
}

.cert-card__title {
    font-size: 1.08rem;
    font-weight: 700;
    color: var(--text-0);
    line-height: 1.3;
    margin-top: 2px;
}

.cert-card__issuer {
    font-size: 0.85rem;
    color: var(--text-1);
    margin-bottom: 4px;
}

.cert-card__grade {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    margin-top: 4px;
    background: var(--accent-soft);
    border: 1px solid var(--border-accent);
    border-radius: var(--r-full);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--accent);
    align-self: flex-start;
}

.cert-card__actions {
    margin-top: auto;
    padding-top: 14px;
}

.cert-card__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: var(--r-full);
    font-size: 0.82rem;
    font-weight: 600;
    border: 1px solid transparent;
    cursor: pointer;
    transition: transform 0.25s var(--ease),
                background 0.3s var(--ease),
                border-color 0.3s var(--ease),
                color 0.3s var(--ease),
                box-shadow 0.3s var(--ease);
}

.cert-card__btn--primary {
    background: var(--grad-accent);
    color: #05060a;
    box-shadow: 0 6px 20px rgba(0, 229, 255, 0.25);
}

.cert-card__btn--primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 229, 255, 0.4);
}

/* =========================================================
   CTA
   ========================================================= */
.cert-cta {
    padding: 100px 0 40px;
}

.cert-cta__inner {
    position: relative;
    padding: 70px 50px;
    border-radius: var(--r-xl);
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(168, 85, 247, 0.08));
    border: 1px solid var(--border-1);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    text-align: center;
    overflow: hidden;
}

.cert-cta__inner::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%);
    pointer-events: none;
}

.cert-cta__title {
    position: relative;
    z-index: 1;
    font-size: clamp(1.6rem, 4vw, 2.8rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
}

.cert-cta__title em {
    font-style: normal;
    background: var(--grad-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cert-cta__desc {
    position: relative;
    z-index: 1;
    color: var(--text-1);
    font-size: 1rem;
    margin-bottom: 32px;
    max-width: 480px;
    margin-inline: auto;
}

.cert-cta__actions {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
}

/* =========================================================
   MODAL
   ========================================================= */
.cert-modal {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.35s var(--ease), visibility 0.35s var(--ease);
}

.cert-modal.is-open {
    visibility: visible;
    opacity: 1;
}

.cert-modal__bg {
    position: absolute;
    inset: 0;
    background: rgba(5, 6, 10, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    cursor: pointer;
}

.cert-modal__dialog {
    position: relative;
    width: 100%;
    max-width: 1000px;
    max-height: calc(100vh - 40px);
    background: var(--bg-1);
    border: 1px solid var(--border-2);
    border-radius: var(--r-lg);
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
    transform: translateY(30px) scale(0.97);
    transition: transform 0.4s var(--ease);
    display: flex;
    flex-direction: column;
}

.cert-modal.is-open .cert-modal__dialog {
    transform: translateY(0) scale(1);
}

.cert-modal__close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 5;
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    cursor: pointer;
    transition: transform 0.25s var(--ease), background 0.3s var(--ease);
}

.cert-modal__close:hover {
    transform: rotate(90deg);
    background: rgba(0, 0, 0, 0.8);
}

.cert-modal__content {
    overflow-y: auto;
    max-height: calc(100vh - 40px);
}

.cert-modal__image {
    width: 100%;
    display: block;
    background: var(--bg-2);
    max-height: 65vh;
    object-fit: contain;
}

.cert-modal__info {
    padding: 30px 36px 36px;
}

.cert-modal__badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    background: var(--accent-soft);
    border: 1px solid var(--border-accent);
    border-radius: var(--r-full);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 14px;
}

.cert-modal__title {
    font-size: clamp(1.3rem, 3vw, 1.8rem);
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text-0);
}

.cert-modal__issuer {
    font-size: 0.95rem;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 6px;
}

.cert-modal__date {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    color: var(--text-3);
    margin-bottom: 20px;
}

.cert-modal__desc {
    font-size: 0.96rem;
    color: var(--text-1);
    line-height: 1.75;
    margin-bottom: 26px;
    max-width: 720px;
}

.cert-modal__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 24px;
    border-top: 1px solid var(--border-1);
}

/* =========================================================
   LIGHT THEME
   ========================================================= */
[data-theme="light"] .cert-card {
    background: rgba(255, 255, 255, 0.7);
}

[data-theme="light"] .cert-card__veil {
    background: radial-gradient(circle at 50% 30%, #eef2f8 0%, #dde4ee 100%);
}

[data-theme="light"] .cert-card__veil-icon {
    background: rgba(0, 119, 255, 0.08);
    border-color: rgba(0, 119, 255, 0.4);
    color: #0077ff;
    box-shadow: 0 0 30px rgba(0, 119, 255, 0.2);
}

[data-theme="light"] .cert-card__veil-text {
    color: #0a0e1a;
    background: rgba(255, 255, 255, 0.75);
    border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .cert-card__veil::before {
    border-color: rgba(0, 0, 0, 0.06);
}

[data-theme="light"] .cert-modal__dialog {
    background: #ffffff;
}

[data-theme="light"] .cert-cta__inner {
    background: linear-gradient(135deg, rgba(0, 119, 255, 0.06), rgba(124, 58, 237, 0.06));
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width: 1024px) {
    .cert-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .cert-hero {
        padding: 40px 0 50px;
    }

    .cert-hero__stats {
        gap: 18px;
    }

    .cert-hero__stat-divider {
        height: 32px;
    }

    .cert-filter__inner {
        width: 100%;
        overflow-x: auto;
        justify-content: flex-start;
        border-radius: var(--r-md);
        flex-wrap: nowrap;
        padding: 6px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    }

    .cert-filter__inner::-webkit-scrollbar {
        display: none;
    }

    .cert-filter__btn {
        padding: 9px 16px;
        font-size: 0.78rem;
    }

    .cert-grid {
        grid-template-columns: 1fr;
    }

    .cert-cta {
        padding: 60px 0 20px;
    }

    .cert-cta__inner {
        padding: 50px 30px;
    }

    .cert-cta__actions .btn {
        flex: 1 1 100%;
        justify-content: center;
    }

    .cert-modal__info {
        padding: 24px 22px 28px;
    }

    .cert-card__veil-icon {
        width: 64px;
        height: 64px;
        font-size: 1.5rem;
    }

    .cert-card__veil-text {
        font-size: 0.74rem;
        padding: 7px 15px;
    }
}

@media (max-width: 480px) {
    .cert-hero__stats {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
    }

    .cert-hero__stat-divider {
        display: none;
    }

    .cert-cta__inner {
        padding: 40px 22px;
    }

    .cert-card__body {
        padding: 18px;
    }

    .cert-card__title {
        font-size: 1rem;
    }

    .cert-card__veil-icon {
        width: 56px;
        height: 56px;
        font-size: 1.3rem;
    }

    .cert-card__veil-text {
        font-size: 0.68rem;
        padding: 6px 13px;
    }
}

/* =========================================================
   MOBILE PERF — kill all backdrop-filters + animation cost
   ========================================================= */
@media (max-width: 900px), (hover: none), (pointer: coarse) {
    .cert-card,
    .cert-filter__inner,
    .cert-cta__inner {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
    }

    .cert-card__veil-icon {
        animation: none !important;
    }
}

/* =========================================================
   REDUCED MOTION
   ========================================================= */
@media (prefers-reduced-motion: reduce) {
    .cert-card__veil,
    .cert-card__visual img {
        transition: none !important;
    }

    .cert-card__veil-icon {
        animation: none !important;
    }
}