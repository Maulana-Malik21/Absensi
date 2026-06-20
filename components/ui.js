/**
 * UI Components — Fingerprint Design System
 */
const ui = {
    renderTable(headers, rows, emptyMessage = 'Tidak ada data tersedia') {
        if (!rows || rows.length === 0) {
            return `
                <div class="p-8 text-center text-text-muted flex flex-col items-center justify-center">
                    <i data-lucide="folder-open" class="w-8 h-8 mb-2 opacity-50"></i>
                    <p class="text-sm">${emptyMessage}</p>
                </div>
            `;
        }

        const thHtml = headers.map(h => `<th class="text-[12px] font-medium text-text-muted text-left px-4 py-3 border-b border-border-default whitespace-nowrap">${h}</th>`).join('');
        
        const trHtml = rows.map((row, idx) => {
            const tdHtml = row.map(cell => `<td class="px-4 py-2 text-[13px] text-text-secondary border-b border-border-default">${cell}</td>`).join('');
            // Add top border accent to first row like the spec suggests for top ranks, but we'll keep standard rows clean hover.
            return `<tr class="hover:bg-bg-hover transition-colors h-9">${tdHtml}</tr>`;
        }).join('');

        // Ensure lucide icons are created after table is inserted
        setTimeout(() => {
            if (window.lucide) lucide.createIcons();
        }, 10);

        return `
            <div class="w-full bg-bg-surface border border-border-default rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse">
                        <thead class="bg-bg-surface">
                            <tr>${thHtml}</tr>
                        </thead>
                        <tbody>${trHtml}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 10);
        }
    },

    hideModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    alert(message, title = 'Perhatian') {
        return new Promise((resolve) => {
            const existing = document.getElementById('edu-alert-modal');
            if (existing) existing.remove();

            const modalHtml = `
                <div id="edu-alert-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div class="bg-bg-surface w-full max-w-sm rounded-lg border border-border-default shadow-lg p-6 text-center transform transition-all">
                        <div class="w-12 h-12 rounded-full bg-danger-subtle text-danger flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="info" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-text-primary mb-2">${title}</h3>
                        <p class="text-sm text-text-secondary mb-6">${message}</p>
                        <button id="edu-alert-ok" class="w-full bg-accent hover:bg-accent-hover text-white text-[13px] font-medium h-8 rounded-md transition-colors">Tutup</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            if (window.lucide) lucide.createIcons();
            
            const modal = document.getElementById('edu-alert-modal');
            const btnOk = document.getElementById('edu-alert-ok');

            const cleanup = () => {
                modal.remove();
            };

            btnOk.onclick = () => { cleanup(); resolve(); };
        });
    },

    confirm(message, title = 'Konfirmasi') {
        return new Promise((resolve) => {
            const existing = document.getElementById('edu-confirm-modal');
            if (existing) existing.remove();

            const modalHtml = `
                <div id="edu-confirm-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div class="bg-bg-surface w-full max-w-sm rounded-lg border border-border-default shadow-lg p-6 text-center transform transition-all">
                        <div class="w-12 h-12 rounded-full bg-warning-subtle text-warning flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="help-circle" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-text-primary mb-2">${title}</h3>
                        <p class="text-sm text-text-secondary mb-6">${message}</p>
                        <div class="flex gap-3">
                            <button id="edu-confirm-cancel" class="flex-1 bg-transparent border border-border-default text-text-secondary hover:bg-bg-hover text-[13px] font-medium h-8 rounded-md transition-colors">Batal</button>
                            <button id="edu-confirm-ok" class="flex-1 bg-accent hover:bg-accent-hover text-white text-[13px] font-medium h-8 rounded-md transition-colors">Ya, Lanjutkan</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            if (window.lucide) lucide.createIcons();
            
            const modal = document.getElementById('edu-confirm-modal');
            const btnCancel = document.getElementById('edu-confirm-cancel');
            const btnOk = document.getElementById('edu-confirm-ok');

            const cleanup = () => {
                modal.remove();
            };

            btnCancel.onclick = () => { cleanup(); resolve(false); };
            btnOk.onclick = () => { cleanup(); resolve(true); };
        });
    },

    /**
     * Global Helper to reliably populate Class Dropdowns
     * Prevents duplicates, ignores non-class data, and prevents accumulation.
     */
    populateClassDropdown(selectElements, classes) {
        if (!Array.isArray(selectElements)) selectElements = [selectElements];
        
        // Ensure classes only contain valid class names (e.g., starting with Roman numerals, numbers, or standard prefixes)
        // This filters out mistaken subject entries like "Biologi"
        const validClasses = classes.filter(c => /^(X|XI|XII|IX|VIII|VII|VI|V|IV|III|II|I|1|2|3|4|5|6|7|8|9|10|11|12|Kelas)\b/i.test(c.name));

        selectElements.forEach(select => {
            if (!select) return;
            // Clear existing options except the first placeholder
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            const seenIds = new Set();
            validClasses.forEach(c => {
                if (!seenIds.has(c.id)) {
                    seenIds.add(c.id);
                    select.appendChild(new Option(c.name, c.id));
                }
            });
        });
    },

    /**
     * Set Button Loading State
     */
    setButtonLoading(btn, text = 'Memproses...') {
        if (!btn) return;
        if (!btn.dataset.originalText) {
            btn.dataset.originalText = btn.innerHTML;
        }
        btn.disabled = true;
        btn.classList.add('opacity-70', 'cursor-not-allowed');
        btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-1.5 animate-spin"></i> ${text}`;
        if (window.lucide) lucide.createIcons();
    },

    /**
     * Reset Button State
     */
    resetButton(btn) {
        if (!btn || !btn.dataset.originalText) return;
        btn.disabled = false;
        btn.classList.remove('opacity-70', 'cursor-not-allowed');
        btn.innerHTML = btn.dataset.originalText;
        if (window.lucide) lucide.createIcons();
    },

    /**
     * Top Progress Bar
     */
    startProgress() {
        let bar = document.getElementById('top-progress-bar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'top-progress-bar';
            document.body.appendChild(bar);
        }
        bar.style.width = '0%';
        bar.style.opacity = '1';
        
        // Simulate progress
        setTimeout(() => { bar.style.width = '30%'; }, 50);
        setTimeout(() => { bar.style.width = '60%'; }, 300);
        setTimeout(() => { bar.style.width = '80%'; }, 800);
    },

    completeProgress() {
        const bar = document.getElementById('top-progress-bar');
        if (bar) {
            bar.style.width = '100%';
            setTimeout(() => { bar.style.opacity = '0'; }, 300);
            setTimeout(() => { bar.style.width = '0%'; }, 600);
        }
    },

    /**
     * Modern Animated QR Loader
     */
    showGlobalLoader(text = 'Memuat Data...') {
        const existing = document.getElementById('global-page-loader');
        if (existing) {
            const textEl = existing.querySelector('#qr-loader-text');
            if (textEl) textEl.textContent = text;
            existing.dataset.shownAt = Date.now();
            return;
        }

        const loaderHtml = `
            <div id="global-page-loader" class="qr-loader-overlay" data-shown-at="${Date.now()}">
                <div class="qr-scanner-box">
                    <div class="qr-scanner-bg"></div>
                    <div class="qr-scanner-active"></div>
                    <div class="qr-scanner-line"></div>
                    <div class="qr-logo-center">E</div>
                </div>
                <div class="text-white font-medium text-[15px] tracking-wide animate-pulse" id="qr-loader-text">${text}</div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loaderHtml);
        
        // Prevent interactions
        document.body.style.pointerEvents = 'none';
        const loader = document.getElementById('global-page-loader');
        loader.style.pointerEvents = 'auto'; // allow clicks inside loader to be captured, effectively blocking background
    },

    hideGlobalLoader() {
        const loader = document.getElementById('global-page-loader');
        if (loader) {
            const shownAt = parseInt(loader.dataset.shownAt || Date.now());
            const elapsed = Date.now() - shownAt;
            const minDisplayTime = 500;
            
            const hide = () => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                    document.body.style.pointerEvents = '';
                }, 300);
            };

            if (elapsed < minDisplayTime) {
                setTimeout(hide, minDisplayTime - elapsed);
            } else {
                hide();
            }
        } else {
            document.body.style.pointerEvents = '';
        }
    },

    /**
     * Table Skeleton HTML
     */
    getTableSkeleton(rows = 5, cols = 4) {
        let rowsHtml = '';
        for (let i = 0; i < rows; i++) {
            let colsHtml = '';
            for (let j = 0; j < cols; j++) {
                colsHtml += `<td class="px-4 py-3 border-b border-border-default"><div class="h-4 bg-bg-hover rounded animate-pulse w-3/4"></div></td>`;
            }
            rowsHtml += `<tr>${colsHtml}</tr>`;
        }
        return `
            <div class="w-full bg-bg-surface border border-border-default rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse">
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    getCardSkeleton() {
        return `
            <div class="p-6 bg-bg-surface border border-border-default rounded-xl">
                <div class="h-5 bg-bg-hover rounded w-1/3 mb-4 animate-pulse"></div>
                <div class="h-8 bg-bg-hover rounded w-1/2 mb-2 animate-pulse"></div>
                <div class="h-4 bg-bg-hover rounded w-2/3 animate-pulse"></div>
            </div>
        `;
    }
};

window.ui = ui;
