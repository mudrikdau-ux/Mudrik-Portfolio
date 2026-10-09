/* =========================================================
   TOP STATUS BAR — Time + Day + Date + Weather + Welcome
   FULLY RESPONSIVE — Desktop, Tablet, Mobile
   - Auto-detects location via IP
   - Fetches weather from Open-Meteo (free, no API key)
   - Clock hides seconds on small screens
   - Date shortens gracefully on mobile
   - Rotating welcome message in center (desktop only)
   - Re-renders on window resize / orientation change
   ========================================================= */

(function () {
    'use strict';

    /* =========================================================
       CONFIG
       ========================================================= */
    const CONFIG = {
        weatherRefreshMs: 30 * 60 * 1000,   // refresh weather every 30 min
        clockRefreshMs: 1000,                // update clock every second
        welcomeIntervalMs: 6500,             // welcome message display time
        cacheKey: 'dau:statusBar:weather',
        langKey: 'dau:lang',
        fallback: { lat: -6.1622, lon: 39.1999, city: 'Zanzibar' }
    };

    /* =========================================================
       TRANSLATIONS
       ========================================================= */
    const STRINGS = {
        en: {
            day0: 'Sunday', day1: 'Monday', day2: 'Tuesday', day3: 'Wednesday',
            day4: 'Thursday', day5: 'Friday', day6: 'Saturday',
            month0: 'January', month1: 'February', month2: 'March', month3: 'April',
            month4: 'May', month5: 'June', month6: 'July', month7: 'August',
            month8: 'September', month9: 'October', month10: 'November', month11: 'December',
            feelsLike: 'Feels like',
            humidity: 'Humidity',
            wind: 'Wind',
            loading: 'Loading weather…',
            unavailable: 'Weather unavailable',
            clear: 'Clear', partlyCloudy: 'Partly cloudy', cloudy: 'Cloudy',
            fog: 'Fog', drizzle: 'Drizzle', rain: 'Rain', snow: 'Snow',
            thunder: 'Thunderstorm'
        },
        sw: {
            day0: 'Jumapili', day1: 'Jumatatu', day2: 'Jumanne', day3: 'Jumatano',
            day4: 'Alhamisi', day5: 'Ijumaa', day6: 'Jumamosi',
            month0: 'Januari', month1: 'Februari', month2: 'Machi', month3: 'Aprili',
            month4: 'Mei', month5: 'Juni', month6: 'Julai', month7: 'Agosti',
            month8: 'Septemba', month9: 'Oktoba', month10: 'Novemba', month11: 'Desemba',
            feelsLike: 'Inahisi kama',
            humidity: 'Unyevu',
            wind: 'Upepo',
            loading: 'Inapakia hali ya hewa…',
            unavailable: 'Hali ya hewa haipatikani',
            clear: 'Anga safi', partlyCloudy: 'Mawingu kidogo', cloudy: 'Mawingu',
            fog: 'Ukungu', drizzle: 'Manyunyu', rain: 'Mvua', snow: 'Theluji',
            thunder: 'Radi'
        },
        ar: {
            day0: 'الأحد', day1: 'الإثنين', day2: 'الثلاثاء', day3: 'الأربعاء',
            day4: 'الخميس', day5: 'الجمعة', day6: 'السبت',
            month0: 'يناير', month1: 'فبراير', month2: 'مارس', month3: 'أبريل',
            month4: 'مايو', month5: 'يونيو', month6: 'يوليو', month7: 'أغسطس',
            month8: 'سبتمبر', month9: 'أكتوبر', month10: 'نوفمبر', month11: 'ديسمبر',
            feelsLike: 'يشعر كأنه',
            humidity: 'الرطوبة',
            wind: 'الرياح',
            loading: 'جاري تحميل الطقس…',
            unavailable: 'الطقس غير متوفر',
            clear: 'صافٍ', partlyCloudy: 'غائم جزئياً', cloudy: 'غائم',
            fog: 'ضباب', drizzle: 'رذاذ', rain: 'مطر', snow: 'ثلج',
            thunder: 'عاصفة رعدية'
        },
        zh: {
            day0: '星期日', day1: '星期一', day2: '星期二', day3: '星期三',
            day4: '星期四', day5: '星期五', day6: '星期六',
            month0: '一月', month1: '二月', month2: '三月', month3: '四月',
            month4: '五月', month5: '六月', month6: '七月', month7: '八月',
            month8: '九月', month9: '十月', month10: '十一月', month11: '十二月',
            feelsLike: '体感温度',
            humidity: '湿度',
            wind: '风速',
            loading: '正在加载天气…',
            unavailable: '天气暂不可用',
            clear: '晴朗', partlyCloudy: '局部多云', cloudy: '多云',
            fog: '雾', drizzle: '毛毛雨', rain: '雨', snow: '雪',
            thunder: '雷暴'
        },
        fr: {
            day0: 'Dimanche', day1: 'Lundi', day2: 'Mardi', day3: 'Mercredi',
            day4: 'Jeudi', day5: 'Vendredi', day6: 'Samedi',
            month0: 'Janvier', month1: 'Février', month2: 'Mars', month3: 'Avril',
            month4: 'Mai', month5: 'Juin', month6: 'Juillet', month7: 'Août',
            month8: 'Septembre', month9: 'Octobre', month10: 'Novembre', month11: 'Décembre',
            feelsLike: 'Ressenti',
            humidity: 'Humidité',
            wind: 'Vent',
            loading: 'Chargement de la météo…',
            unavailable: 'Météo indisponible',
            clear: 'Dégagé', partlyCloudy: 'Partiellement nuageux', cloudy: 'Nuageux',
            fog: 'Brouillard', drizzle: 'Bruine', rain: 'Pluie', snow: 'Neige',
            thunder: 'Orage'
        }
    };

    /* =========================================================
       WELCOME MESSAGES
       ========================================================= */
    const WELCOME_MESSAGES = {
        en: {
            morning:   ['Good morning', 'Welcome to Mr Dau Portfolio'],
            afternoon: ['Good afternoon', 'Welcome to Mr Dau Portfolio'],
            evening:   ['Good evening', 'Welcome to Mr Dau Portfolio'],
            night:     ['Good night', 'Welcome to Mr Dau Portfolio'],
            extras: [
                'Explore my work',
                'Full-Stack Developer',
                'Based in Zanzibar',
                'Open to opportunities'
            ]
        },
        sw: {
            morning:   ['Habari za asubuhi', 'Karibu kwenye Portfolio ya Bw. Dau'],
            afternoon: ['Habari za mchana', 'Karibu kwenye Portfolio ya Bw. Dau'],
            evening:   ['Habari za jioni', 'Karibu kwenye Portfolio ya Bw. Dau'],
            night:     ['Usiku mwema', 'Karibu kwenye Portfolio ya Bw. Dau'],
            extras: [
                'Chunguza kazi zangu',
                'Msanidi Full-Stack',
                'Nipo Zanzibar',
                'Nipo tayari kufanya kazi'
            ]
        },
        ar: {
            morning:   ['صباح الخير', 'مرحباً بكم في محفظة السيد Dau'],
            afternoon: ['مساء الخير', 'مرحباً بكم في محفظة السيد Dau'],
            evening:   ['مساء الخير', 'مرحباً بكم في محفظة السيد Dau'],
            night:     ['طابت ليلتكم', 'مرحباً بكم في محفظة السيد Dau'],
            extras: [
                'استكشف أعمالي',
                'مطور Full-Stack',
                'من زنجبار',
                'متاح للفرص'
            ]
        },
        zh: {
            morning:   ['早上好', '欢迎来到 Dau 先生的作品集'],
            afternoon: ['下午好', '欢迎来到 Dau 先生的作品集'],
            evening:   ['晚上好', '欢迎来到 Dau 先生的作品集'],
            night:     ['晚安', '欢迎来到 Dau 先生的作品集'],
            extras: [
                '浏览我的作品',
                '全栈开发者',
                '来自桑给巴尔',
                '欢迎合作'
            ]
        },
        fr: {
            morning:   ['Bonjour', 'Bienvenue sur le portfolio de M. Dau'],
            afternoon: ['Bon après-midi', 'Bienvenue sur le portfolio de M. Dau'],
            evening:   ['Bonsoir', 'Bienvenue sur le portfolio de M. Dau'],
            night:     ['Bonne nuit', 'Bienvenue sur le portfolio de M. Dau'],
            extras: [
                'Explorez mon travail',
                'Développeur Full-Stack',
                'Basé à Zanzibar',
                'Ouvert aux opportunités'
            ]
        }
    };

    /* =========================================================
       STATE
       ========================================================= */
    let currentLang = 'en';
    let clockTimer = null;
    let weatherTimer = null;
    let welcomeTimer = null;
    let welcomeIndex = 0;
    let bar = null;

    /* =========================================================
       UTILITIES
       ========================================================= */
    function getLang() {
        try {
            const l = localStorage.getItem(CONFIG.langKey);
            if (l && STRINGS[l]) return l;
        } catch (e) {}
        const html = document.documentElement.getAttribute('lang');
        if (html && STRINGS[html]) return html;
        return 'en';
    }

    function getStrings() {
        return STRINGS[currentLang] || STRINGS.en;
    }

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    /* =========================================================
       WEATHER CODE → description key + animation class
       ========================================================= */
    function weatherCodeInfo(code) {
        const c = Number(code);
        if (c === 0) return { key: 'clear', anim: 'sun' };
        if (c === 1) return { key: 'clear', anim: 'sun-cloud' };
        if (c === 2) return { key: 'partlyCloudy', anim: 'sun-cloud' };
        if (c === 3) return { key: 'cloudy', anim: 'clouds' };
        if (c === 45 || c === 48) return { key: 'fog', anim: 'fog' };
        if (c === 51 || c === 53 || c === 55) return { key: 'drizzle', anim: 'drizzle' };
        if (c === 56 || c === 57) return { key: 'drizzle', anim: 'drizzle' };
        if (c === 61 || c === 63 || c === 65) return { key: 'rain', anim: 'rain' };
        if (c === 66 || c === 67) return { key: 'rain', anim: 'rain' };
        if (c === 71 || c === 73 || c === 75) return { key: 'snow', anim: 'snow' };
        if (c === 77) return { key: 'snow', anim: 'snow' };
        if (c === 80 || c === 81 || c === 82) return { key: 'rain', anim: 'rain' };
        if (c === 85 || c === 86) return { key: 'snow', anim: 'snow' };
        if (c === 95) return { key: 'thunder', anim: 'thunder' };
        if (c === 96 || c === 99) return { key: 'thunder', anim: 'thunder' };
        return { key: 'clear', anim: 'sun' };
    }

    /* =========================================================
       BUILD DOM
       ========================================================= */
    function buildBar() {
        if (document.getElementById('dauStatusBar')) {
            bar = document.getElementById('dauStatusBar');
            return bar;
        }

        bar = document.createElement('div');
        bar.id = 'dauStatusBar';
        bar.className = 'dau-status';
        bar.setAttribute('role', 'status');
        bar.setAttribute('aria-live', 'polite');

        bar.innerHTML = `
            <div class="dau-status__inner">
                <!-- WEATHER -->
                <div class="dau-status__weather" id="dauStatusWeather">
                    <div class="dau-status__weather-icon" id="dauStatusWeatherIcon">
                        <div class="dau-wx dau-wx--loading">
                            <span class="dau-wx__dot"></span>
                        </div>
                    </div>
                    <div class="dau-status__weather-info">
                        <div class="dau-status__weather-temp" id="dauStatusWeatherTemp">--°C</div>
                        <div class="dau-status__weather-city" id="dauStatusWeatherCity">Loading…</div>
                    </div>
                </div>

                <!-- WELCOME MESSAGE (center) -->
                <div class="dau-status__welcome" aria-live="polite">
                    <span class="dau-status__welcome-text" id="dauStatusWelcome"></span>
                </div>

                <!-- DIVIDER -->
                <div class="dau-status__divider" aria-hidden="true"></div>

                <!-- TIME -->
                <div class="dau-status__time">
                    <div class="dau-status__clock" id="dauStatusClock">--:--:--</div>
                    <div class="dau-status__date" id="dauStatusDate">—</div>
                </div>
            </div>
        `;

        document.body.insertBefore(bar, document.body.firstChild);

        return bar;
    }

    /* =========================================================
       CLOCK — Responsive: hides seconds & shortens date
       ========================================================= */
    function updateClock() {
        const S = getStrings();
        const now = new Date();
        const w = window.innerWidth;

        const clockEl = document.getElementById('dauStatusClock');
        const dateEl = document.getElementById('dauStatusDate');

        /* ---------------- CLOCK ---------------- */
        if (clockEl) {
            if (w < 480) {
                clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
            } else {
                clockEl.textContent =
                    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            }
        }

        /* ---------------- DATE ---------------- */
        if (dateEl) {
            const dayName = S['day' + now.getDay()];
            const monthName = S['month' + now.getMonth()];
            const dayShort = dayName.slice(0, 3);
            const monthShort = monthName.slice(0, 3);
            const dayNum = now.getDate();
            const year = now.getFullYear();

            const isCJK = (currentLang === 'ar' || currentLang === 'zh');
            const shortDay = isCJK ? dayName : dayShort;
            const shortMonth = isCJK ? monthName : monthShort;

            let text = '';

            if (w < 360) {
                text = '';
            } else if (w < 480) {
                text = `${shortDay} ${dayNum} ${shortMonth}`;
            } else if (w < 768) {
                text = `${dayName}, ${dayNum} ${shortMonth}`;
            } else if (currentLang === 'ar') {
                text = `${dayName}، ${dayNum} ${monthName} ${year}`;
            } else if (currentLang === 'zh') {
                text = `${year}年${monthName}${dayNum}日 ${dayName}`;
            } else if (currentLang === 'fr') {
                text = `${dayName} ${dayNum} ${monthName} ${year}`;
            } else {
                text = `${dayName}, ${dayNum} ${monthName} ${year}`;
            }

            dateEl.textContent = text;
        }
    }

    /* =========================================================
       WELCOME MESSAGE — rotating greeting in the center
       ========================================================= */
    function getTimeSlot() {
        const h = new Date().getHours();
        if (h >= 5 && h < 12)  return 'morning';
        if (h >= 12 && h < 17) return 'afternoon';
        if (h >= 17 && h < 21) return 'evening';
        return 'night';
    }

    function buildWelcomeQueue() {
        const set = WELCOME_MESSAGES[currentLang] || WELCOME_MESSAGES.en;
        const slot = getTimeSlot();
        return [
            ...(set[slot] || []),
            ...(set.extras || [])
        ];
    }

    function showWelcomeMessage() {
        const el = document.getElementById('dauStatusWelcome');
        if (!el) return;

        const queue = buildWelcomeQueue();
        if (!queue.length) return;

        const text = queue[welcomeIndex % queue.length];
        welcomeIndex++;

        // Fade out current
        el.classList.remove('is-shown');
        el.classList.add('is-hiding');

        setTimeout(() => {
            el.textContent = text;
            el.classList.remove('is-hiding');
            void el.offsetWidth; // force reflow to restart animation
            el.classList.add('is-shown');
        }, 420);

        // Schedule next message
        if (welcomeTimer) clearTimeout(welcomeTimer);
        welcomeTimer = setTimeout(showWelcomeMessage, CONFIG.welcomeIntervalMs);
    }

    /* =========================================================
       WEATHER — Open-Meteo + IP geolocation
       ========================================================= */
    async function fetchLocation() {
        try {
            const cached = JSON.parse(localStorage.getItem(CONFIG.cacheKey) || 'null');
            if (cached && cached.lat && cached.lon && Date.now() - cached.t < CONFIG.weatherRefreshMs) {
                return { lat: cached.lat, lon: cached.lon, city: cached.city };
            }
        } catch (e) {}

        try {
            const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data && data.latitude && data.longitude) {
                    return {
                        lat: data.latitude,
                        lon: data.longitude,
                        city: data.city || data.region || data.country_name || 'Your location'
                    };
                }
            }
        } catch (e) {}

        try {
            const res = await fetch('https://ipwho.is/', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data && data.success !== false && data.latitude && data.longitude) {
                    return {
                        lat: data.latitude,
                        lon: data.longitude,
                        city: data.city || data.region || 'Your location'
                    };
                }
            }
        } catch (e) {}

        return { ...CONFIG.fallback };
    }

    async function fetchWeather(lat, lon) {
        const url =
            `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
            `&timezone=auto`;

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('Weather fetch failed');
        return res.json();
    }

    async function loadWeather() {
        const S = getStrings();
        const cityEl = document.getElementById('dauStatusWeatherCity');
        const tempEl = document.getElementById('dauStatusWeatherTemp');
        const iconEl = document.getElementById('dauStatusWeatherIcon');

        try {
            const loc = await fetchLocation();
            const data = await fetchWeather(loc.lat, loc.lon);

            const cur = data.current;
            const info = weatherCodeInfo(cur.weather_code);

            if (tempEl) tempEl.textContent = `${Math.round(cur.temperature_2m)}°C`;
            if (cityEl) cityEl.textContent = loc.city || S.unavailable;

            if (iconEl) {
                iconEl.innerHTML = renderWeatherIcon(info.anim);
            }

            const weatherWrap = document.getElementById('dauStatusWeather');
            if (weatherWrap) {
                weatherWrap.setAttribute('title',
                    `${S[info.key]} · ${S.feelsLike} ${Math.round(cur.apparent_temperature)}°C · ` +
                    `${S.humidity} ${cur.relative_humidity_2m}% · ` +
                    `${S.wind} ${Math.round(cur.wind_speed_10m)} km/h`
                );
            }

            try {
                localStorage.setItem(CONFIG.cacheKey, JSON.stringify({
                    t: Date.now(),
                    lat: loc.lat,
                    lon: loc.lon,
                    city: loc.city,
                    temp: cur.temperature_2m,
                    code: cur.weather_code,
                    anim: info.anim,
                    key: info.key
                }));
            } catch (e) {}

        } catch (err) {
            if (cityEl) cityEl.textContent = S.unavailable;
            if (tempEl) tempEl.textContent = '--°C';
            if (iconEl) iconEl.innerHTML = renderWeatherIcon('sun');
        }
    }

    function loadCachedWeather() {
        try {
            const cached = JSON.parse(localStorage.getItem(CONFIG.cacheKey) || 'null');
            if (!cached) return false;

            const cityEl = document.getElementById('dauStatusWeatherCity');
            const tempEl = document.getElementById('dauStatusWeatherTemp');
            const iconEl = document.getElementById('dauStatusWeatherIcon');

            if (tempEl && cached.temp !== undefined) tempEl.textContent = `${Math.round(cached.temp)}°C`;
            if (cityEl && cached.city) cityEl.textContent = cached.city;
            if (iconEl && cached.anim) iconEl.innerHTML = renderWeatherIcon(cached.anim);

            return true;
        } catch (e) {
            return false;
        }
    }

    /* =========================================================
       WEATHER ICON (animated SVG/CSS)
       ========================================================= */
    function renderWeatherIcon(type) {
        switch (type) {
            case 'sun':
                return `
                    <div class="dau-wx dau-wx--sun">
                        <div class="dau-wx__sun">
                            <span class="dau-wx__sun-core"></span>
                            <span class="dau-wx__sun-rays"></span>
                        </div>
                    </div>`;
            case 'sun-cloud':
                return `
                    <div class="dau-wx dau-wx--sun-cloud">
                        <div class="dau-wx__sun dau-wx__sun--mini">
                            <span class="dau-wx__sun-core"></span>
                            <span class="dau-wx__sun-rays"></span>
                        </div>
                        <div class="dau-wx__cloud dau-wx__cloud--front">
                            <span></span><span></span><span></span>
                        </div>
                    </div>`;
            case 'clouds':
                return `
                    <div class="dau-wx dau-wx--clouds">
                        <div class="dau-wx__cloud">
                            <span></span><span></span><span></span>
                        </div>
                    </div>`;
            case 'fog':
                return `
                    <div class="dau-wx dau-wx--fog">
                        <div class="dau-wx__cloud dau-wx__cloud--soft">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="dau-wx__fog-lines">
                            <span></span><span></span><span></span>
                        </div>
                    </div>`;
            case 'drizzle':
                return `
                    <div class="dau-wx dau-wx--drizzle">
                        <div class="dau-wx__cloud">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="dau-wx__rain">
                            <span></span><span></span><span></span>
                        </div>
                    </div>`;
            case 'rain':
                return `
                    <div class="dau-wx dau-wx--rain">
                        <div class="dau-wx__cloud">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="dau-wx__rain">
                            <span></span><span></span><span></span><span></span>
                        </div>
                    </div>`;
            case 'snow':
                return `
                    <div class="dau-wx dau-wx--snow">
                        <div class="dau-wx__cloud">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="dau-wx__snow">
                            <span>❄</span><span>❄</span><span>❄</span>
                        </div>
                    </div>`;
            case 'thunder':
                return `
                    <div class="dau-wx dau-wx--thunder">
                        <div class="dau-wx__cloud dau-wx__cloud--dark">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="dau-wx__lightning">⚡</div>
                        <div class="dau-wx__rain">
                            <span></span><span></span><span></span>
                        </div>
                    </div>`;
            default:
                return renderWeatherIcon('sun');
        }
    }

    /* =========================================================
       MOUNT
       ========================================================= */
    function mount() {
        buildBar();

        currentLang = getLang();

        updateClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateClock, CONFIG.clockRefreshMs);

        /* ---- Re-render on resize / orientation change ---- */
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateClock();
            }, 150);
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(updateClock, 250);
        });

        // Show cached weather instantly (if any), then refresh
        const hadCache = loadCachedWeather();
        if (!hadCache) {
            const S = getStrings();
            const cityEl = document.getElementById('dauStatusWeatherCity');
            if (cityEl) cityEl.textContent = S.loading;
        }

        // Start the rotating welcome message
        welcomeIndex = 0;
        setTimeout(showWelcomeMessage, 1200);

        // Fetch fresh weather
        loadWeather();

        // Refresh weather periodically
        if (weatherTimer) clearInterval(weatherTimer);
        weatherTimer = setInterval(loadWeather, CONFIG.weatherRefreshMs);

        // Re-translate when site language changes
        document.addEventListener('dau:langChanged', () => {
            currentLang = getLang();
            updateClock();
            loadCachedWeather();
            // Reset welcome cycle so new language shows immediately
            welcomeIndex = 0;
            if (welcomeTimer) clearTimeout(welcomeTimer);
            showWelcomeMessage();
        });

        // Show bar only after loader is done (if a loader exists)
        const loader = document.getElementById('loader');
        if (loader) {
            const io = setInterval(() => {
                if (loader.classList.contains('is-hidden') || loader.style.display === 'none') {
                    bar.classList.add('is-visible');
                    clearInterval(io);
                }
            }, 200);
            setTimeout(() => bar.classList.add('is-visible'), 4000);
        } else {
            requestAnimationFrame(() => bar.classList.add('is-visible'));
        }
    }

    /* =========================================================
       INIT
       ========================================================= */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }

    /* =========================================================
       PUBLIC API
       ========================================================= */
    window.DAU_statusBar = {
        refresh: loadWeather,
        get language() { return currentLang; }
    };

})();