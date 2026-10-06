/* =========================================================
   SCROLL FAB — Floating "scroll to top / bottom" button
   ========================================================= */

(function () {
    'use strict';

    /* ---------- Create the button ---------- */
    const btn = document.createElement('button');
    btn.className = 'scroll-fab';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Scroll');
    btn.setAttribute('title', 'Scroll');
    btn.innerHTML = `
        <span class="scroll-fab__icon" aria-hidden="true">
            <span class="scroll-fab__arrow scroll-fab__arrow--down">
                <i class="fa-solid fa-arrow-down"></i>
            </span>
            <span class="scroll-fab__arrow scroll-fab__arrow--up">
                <i class="fa-solid fa-arrow-up"></i>
            </span>
        </span>
    `;
    document.body.appendChild(btn);

    /* ---------- Config ---------- */
    const SHOW_THRESHOLD = 220;      // px scrolled before showing
    const BOTTOM_TRIGGER = 600;      // px from bottom → switch to "up" mode
    const MIN_PAGE_HEIGHT = 900;     // skip if page too short

    let mode = 'down';               // 'down' | 'up'
    let isVisible = false;

    /* ---------- Position detection ---------- */
    function update() {
        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;
        const distFromBottom = maxScroll - scrollTop;

        // Hide entirely if page is too short
        if (docHeight < MIN_PAGE_HEIGHT) {
            hide();
            return;
        }

        // Should we show the button?
        const shouldShow = scrollTop > SHOW_THRESHOLD;

        if (shouldShow && !isVisible) {
            show();
        } else if (!shouldShow && isVisible) {
            hide();
        }

        // Switch arrow direction
        // If we're closer to bottom than top → up arrow (to go back to top)
        const closerToBottom = distFromBottom < BOTTOM_TRIGGER;
        const newMode = closerToBottom ? 'up' : 'down';

        if (newMode !== mode) {
            mode = newMode;
            btn.classList.toggle('is-up', mode === 'up');
            btn.setAttribute(
                'aria-label',
                mode === 'up' ? 'Scroll to top' : 'Scroll to bottom'
            );
            btn.setAttribute(
                'title',
                mode === 'up' ? 'Scroll to top' : 'Scroll to bottom'
            );
        }
    }

    function show() {
        isVisible = true;
        btn.classList.add('is-visible');
    }

    function hide() {
        isVisible = false;
        btn.classList.remove('is-visible');
    }

    /* ---------- Click behavior ---------- */
    btn.addEventListener('click', () => {
        if (mode === 'down') {
            // Scroll to bottom
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    /* ---------- Listeners ---------- */
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    /* ---------- Raise when other FAB exists ---------- */
    // If page has .contact-fab (contact page WhatsApp button) → lift the scroll button
    // (CSS :has handles this, but we add a fallback class too)
    if (document.querySelector('.contact-fab')) {
        btn.classList.add('scroll-fab--raised');
    }

    /* ---------- Initial + deferred checks ---------- */
    // Delay initial check so layout settles
    setTimeout(update, 300);
    update();

    // Re-check after images/content load
    window.addEventListener('load', update);

})();