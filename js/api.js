/* =========================================================
   API CLIENT — Bridge between Frontend and Backend
   Mudrik Dau Portfolio
   ========================================================= */

(function () {
    'use strict';

    /* =========================================================
       CONFIGURATION
       ========================================================= */

    const API_CONFIG = {
        // Production backend hosted on Render
        baseURL: 'https://portfolio-backend-sel3.onrender.com',

        // Maximum request duration: 20 seconds
        timeout: 20000,

        // Retry once after a network failure
        retries: 1
    };

    /* =========================================================
       CORE REQUEST HELPER
       ========================================================= */

    async function request(endpoint, options = {}) {
        const normalizedEndpoint = endpoint.startsWith('/')
            ? endpoint
            : `/${endpoint}`;

        const url = `${API_CONFIG.baseURL}${normalizedEndpoint}`;
        const method = (options.method || 'GET').toUpperCase();

        const headers = {
            Accept: 'application/json',
            ...(options.headers || {})
        };

        let body = options.body;

        // Convert JavaScript objects to JSON.
        // FormData must be sent without manually setting Content-Type.
        if (
            body !== undefined &&
            body !== null &&
            typeof body === 'object' &&
            !(body instanceof FormData)
        ) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(body);
        }

        let attempt = 0;
        let lastError = null;

        while (attempt <= API_CONFIG.retries) {
            const controller = new AbortController();

            const timeoutId = setTimeout(() => {
                controller.abort();
            }, API_CONFIG.timeout);

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

                let data = null;

                const contentType =
                    response.headers.get('content-type') || '';

                if (contentType.includes('application/json')) {
                    data = await response.json().catch(() => null);
                } else {
                    data = await response.text().catch(() => null);
                }

                if (!response.ok) {
                    const errorMessage =
                        data &&
                        typeof data === 'object' &&
                        data.message
                            ? data.message
                            : `Request failed with status ${response.status}`;

                    const error = new Error(errorMessage);

                    error.status = response.status;
                    error.data = data;

                    throw error;
                }

                return data;

            } catch (error) {
                lastError = error;

                // Do not retry HTTP client errors.
                if (
                    error.status &&
                    error.status >= 400 &&
                    error.status < 500
                ) {
                    throw error;
                }

                // Stop immediately if the request times out.
                if (error.name === 'AbortError') {
                    throw new Error(
                        'Request timed out. Please check your connection and try again.'
                    );
                }

                attempt++;

                // Retry once after a short delay.
                if (attempt <= API_CONFIG.retries) {
                    await new Promise(resolve => {
                        setTimeout(resolve, 800);
                    });
                }

            } finally {
                clearTimeout(timeoutId);
            }
        }

        throw lastError || new Error('Network request failed.');
    }

    /* =========================================================
       CONVENIENCE METHODS
       ========================================================= */

    const api = {
        get: (endpoint, options = {}) =>
            request(endpoint, {
                ...options,
                method: 'GET'
            }),

        post: (endpoint, body, options = {}) =>
            request(endpoint, {
                ...options,
                method: 'POST',
                body
            }),

        put: (endpoint, body, options = {}) =>
            request(endpoint, {
                ...options,
                method: 'PUT',
                body
            }),

        patch: (endpoint, body, options = {}) =>
            request(endpoint, {
                ...options,
                method: 'PATCH',
                body
            }),

        del: (endpoint, options = {}) =>
            request(endpoint, {
                ...options,
                method: 'DELETE'
            })
    };

    /* =========================================================
       DOMAIN ENDPOINTS
       ========================================================= */

    const endpoints = {

        // Backend health check
        health: () => api.get('/api/health'),

        // Backend information
        info: () => api.get('/'),

        // Submit a contact form message
        submitContact: payload =>
            api.post('/api/contact', payload)

    };

    /* =========================================================
       UTILITIES
       ========================================================= */

    /**
     * Check whether the backend is reachable.
     * Returns true if the health endpoint responds successfully.
     */
    async function ping() {
        try {
            const response = await endpoints.health();

            return Boolean(response && response.ok === true);

        } catch (error) {
            console.error('[API] Backend health check failed:', error.message);
            return false;
        }
    }

    /**
     * Change the backend URL at runtime.
     */
    function setBaseURL(url) {
        const normalizedURL = String(url || '')
            .trim()
            .replace(/\/+$/, '');

        if (!normalizedURL) {
            throw new Error('A valid backend URL is required.');
        }

        API_CONFIG.baseURL = normalizedURL;
    }

    /**
     * Return the currently configured backend URL.
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

    console.log('[API] Backend configured:', API_CONFIG.baseURL);

})();