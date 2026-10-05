/* =========================================================
   API CLIENT — Bridge between Frontend and Backend
   Mudrik Dau Portfolio
   ========================================================= */

(function () {
    'use strict';

    /* =========================================================
       CONFIG
       ========================================================= */
    const API_CONFIG = {
        // Change this to your deployed backend URL when you go live
        // Examples:
        //   Local dev:      http://localhost:5000
        //   Railway:        https://your-app.railway.app
        //   Render:         https://dau-backend.onrender.com
        //   VPS/self-host:  https://api.mudrikdau.com
        baseURL: 'http://localhost:5000',

        timeout: 20000,   // 20 seconds
        retries: 1        // retry once on network failure
    };

    /* =========================================================
       CORE REQUEST HELPER
       ========================================================= */
    async function request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const method = (options.method || 'GET').toUpperCase();

        const headers = {
            'Accept': 'application/json',
            ...(options.headers || {})
        };

        // JSON body for POST/PUT/PATCH
        let body = options.body;
        if (body && typeof body === 'object' && !(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(body);
        }

        // Abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        let attempt = 0;
        let lastError = null;

        while (attempt <= API_CONFIG.retries) {
            try {
                const response = await fetch(url, {
                    method,
                    headers,
                    body,
                    signal: controller.signal,
                    credentials: 'omit',
                    mode: 'cors'
                });

                clearTimeout(timeoutId);

                // Try to parse JSON
                let data = null;
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    data = await response.json().catch(() => null);
                } else {
                    data = await response.text().catch(() => null);
                }

                if (!response.ok) {
                    const err = new Error(
                        (data && data.message) || `Request failed with status ${response.status}`
                    );
                    err.status = response.status;
                    err.data = data;
                    throw err;
                }

                return data;

            } catch (err) {
                lastError = err;

                // Don't retry on validation/client errors
                if (err.status && err.status >= 400 && err.status < 500) {
                    throw err;
                }

                // Don't retry on abort (timeout)
                if (err.name === 'AbortError') {
                    throw new Error('Request timed out. Please check your connection.');
                }

                attempt++;
                if (attempt <= API_CONFIG.retries) {
                    await new Promise(r => setTimeout(r, 800));
                }
            }
        }

        throw lastError || new Error('Network request failed.');
    }

    /* =========================================================
       CONVENIENCE METHODS
       ========================================================= */
    const api = {
        get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
        post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
        put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
        patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
        del: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
    };

    /* =========================================================
       DOMAIN ENDPOINTS
       ========================================================= */
    const endpoints = {

        /* ---------- Health Check ---------- */
        health: () => api.get('/api/health'),

        /* ---------- Root info ---------- */
        info: () => api.get('/'),

        /* ---------- Contact Form ---------- */
        /**
         * Submit a contact message
         * @param {Object} payload
         * @param {string} payload.name
         * @param {string} payload.email
         * @param {string} payload.subject
         * @param {string} payload.message
         * @returns {Promise<{ok: boolean, message: string, data?: object}>}
         */
        submitContact: (payload) => api.post('/api/contact', payload)

    };

    /* =========================================================
       UTILITIES
       ========================================================= */

    /**
     * Check if the backend is reachable
     * @returns {Promise<boolean>}
     */
    async function ping() {
        try {
            const res = await endpoints.health();
            return !!(res && res.ok !== false);
        } catch (err) {
            return false;
        }
    }

    /**
     * Set a new backend base URL at runtime
     * @param {string} url
     */
    function setBaseURL(url) {
        API_CONFIG.baseURL = String(url || '').replace(/\/+$/, '');
    }

    /**
     * Get the current base URL
     */
    function getBaseURL() {
        return API_CONFIG.baseURL;
    }

    /* =========================================================
       PUBLIC API
       ========================================================= */
    window.DAU_api = {
        config: API_CONFIG,
        endpoints,
        ping,
        setBaseURL,
        getBaseURL,
        request,
        get: api.get,
        post: api.post,
        put: api.put,
        patch: api.patch,
        del: api.del
    };

})();