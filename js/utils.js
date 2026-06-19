/**
 * Utilities — EduTrack Design System v2.0
 */
const utils = {
    /**
     * Show a toast notification with progress bar
     * @param {string} message 
     * @param {string} type 'success' | 'error' | 'warning' | 'info'
     */
    showToast(message, type = 'success') {
        const containerId = 'toast-container';
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);
        }

        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `edu-toast ${type} toast-enter`;
        
        toast.innerHTML = `
            <div class="edu-toast-icon">
                <i data-lucide="${icons[type] || 'info'}" class="w-5 h-5"></i>
            </div>
            <span class="edu-toast-message">${message}</span>
            <div class="edu-toast-progress"></div>
        `;

        container.appendChild(toast);
        if (window.lucide) window.lucide.createIcons({ root: toast });

        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Show/hide global full-screen loader
     */
    showLoader() {
        let loader = document.getElementById('global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loader);
        }
        loader.classList.remove('hidden');
    },

    hideLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    },

    /**
     * Check authentication and redirect if not logged in
     * @param {string} requiredRole Optional role to check
     */
    checkAuth(requiredRole = null) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        if (!token || !user) {
            window.location.href = '/index.html';
            return null;
        }

        if (requiredRole && user.role !== requiredRole) {
            window.location.href = `/${user.role}/dashboard.html`;
            return null;
        }

        return user;
    },

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    }
};

window.utils = utils;
