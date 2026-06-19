const API_BASE_URL = ' https://aqua-doodle-illusion.ngrok-free.dev/api'

const api = {
    /**
     * Get the JWT token from localStorage
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Set the JWT token in localStorage
     */
    setToken(token) {
        localStorage.setItem('token', token);
    },

    /**
     * Clear the JWT token and user info
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Navigate to login page relative to the current hostname
        const loginPath = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/teacher/')
            ? '../index.html'
            : 'index.html';
        window.location.href = loginPath;
    },

    /**
     * Generic fetch wrapper with Authorization header and error handling
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Bypass-Tunnel-Reminder': 'true',
            'ngrok-skip-browser-warning': 'true',
            ...options.headers,
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // If body is FormData (for file uploads), remove Content-Type so browser sets it with boundary
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const config = {
            ...options,
            headers,
        };

        const method = options.method || 'GET';
        const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        // By default, show fullscreen loader for mutations, unless explicitly disabled
        const showOverlay = options.showLoader === true || (isMutation && options.showLoader !== false);
        const loadingText = options.loadingText || 'Memproses...';

        if (window.ui && ui.startProgress) ui.startProgress();
        if (showOverlay && window.ui && ui.showGlobalLoader) ui.showGlobalLoader(loadingText);

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle Unauthorized
                if (response.status === 401 || response.status === 403) {
                    console.warn('Unauthorized access, redirecting to login...');
                    if (!url.includes('/auth/login')) {
                        this.logout();
                    }
                }
                const err = new Error(data.message || 'Something went wrong');
                err.data = data.data; // Attach additional error data (e.g. validation arrays)
                throw err;
            }

            return data;
        } catch (error) {
            console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
            // Hide overlay first, then show toast if needed
            if (showOverlay && window.ui && ui.hideGlobalLoader) ui.hideGlobalLoader();
            throw error;
        } finally {
            if (window.ui && ui.completeProgress) ui.completeProgress();
            if (showOverlay && window.ui && ui.hideGlobalLoader) ui.hideGlobalLoader();
        }
    },


    async download(endpoint, filename) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        if (window.utils && window.utils.showToast) {
            utils.showToast('Menyiapkan file untuk diunduh...', 'info');
        }
        if (window.ui && ui.startProgress) ui.startProgress();
        if (window.ui && ui.showGlobalLoader) ui.showGlobalLoader('Mengunduh Laporan...');

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                let errorMsg = 'Gagal mengunduh file';
                try {
                    const data = await response.json();
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

            if (window.utils && window.utils.showToast) {
                utils.showToast('Berhasil mengunduh file', 'success');
            }
        } catch (error) {
            console.error('Download Error:', error);
            if (window.utils && window.utils.showToast) {
                utils.showToast(error.message, 'error');
            }
        } finally {
            if (window.ui && ui.completeProgress) ui.completeProgress();
            if (window.ui && ui.hideGlobalLoader) ui.hideGlobalLoader();
        }
    },
    get(endpoint, options = {}) {
        return this.request(endpoint, { method: 'GET', ...options });
    },

    post(endpoint, body, options = {}) {
        const isFormData = body instanceof FormData;
        return this.request(endpoint, {
            method: 'POST',
            body: isFormData ? body : JSON.stringify(body),
            ...options
        });
    },

    put(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            ...options
        });
    },

    patch(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            ...options
        });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    }
};

window.api = api;
