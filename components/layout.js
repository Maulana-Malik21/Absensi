/**
 * Layout Component — EduTrack Admin Shell v5 (Premium SaaS Design)
 */

const layout = {
    init(role, activeMenu) {
        this.role = role;
        this.activeMenu = activeMenu;
        try {
            const stored = localStorage.getItem('user');
            this.user = stored && stored !== 'undefined' ? JSON.parse(stored) : {};
        } catch(e) {
            this.user = {};
            localStorage.removeItem('user');
        }
        this.collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
        this.mobileOpen = false;

        const token = localStorage.getItem('token');
        if (!token) { 
            const loginPath = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/teacher/') ? '../index.html' : 'index.html';
            window.location.href = loginPath; 
            return; 
        }

        if (window.ui && ui.showGlobalLoader) {
            let loadText = 'Memuat Data...';
            if (activeMenu === 'dashboard') loadText = 'Memuat Dashboard...';
            else if (activeMenu === 'students') loadText = 'Memuat Data Siswa...';
            else if (activeMenu === 'schedules' || activeMenu === 'schedule') loadText = 'Memuat Jadwal...';
            else if (activeMenu === 'teachers') loadText = 'Memuat Data Guru...';
            else if (activeMenu === 'history') loadText = 'Memuat Riwayat...';
            else if (activeMenu === 'scanner') loadText = 'Memuat Scanner...';
            else if (activeMenu === 'reports') loadText = 'Memuat Laporan...';
            else if (activeMenu === 'profile') loadText = 'Memuat Profil...';
            
            ui.showGlobalLoader(loadText);
        }

        this._buildShell();
    },

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        localStorage.setItem('sidebar-collapsed', this.collapsed);
        this._applyCollapseState();
    },

    toggleMobile() {
        this.mobileOpen = !this.mobileOpen;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-overlay');
        if (!sidebar) return;

        if (this.mobileOpen) {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            if (overlay) overlay.classList.remove('hidden');
        } else {
            sidebar.classList.remove('translate-x-0');
            sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
        }
    },

    _applyCollapseState() {
        const sidebar = document.getElementById('sidebar');
        const wrapper = document.getElementById('main-wrapper');
        const header = document.getElementById('main-header');
        if (!sidebar || !wrapper) return;

        const collapseBtnIcon = document.getElementById('collapse-icon');

        if (this.collapsed) {
            sidebar.style.width = '56px';
            wrapper.style.marginLeft = '56px';
            if(header) header.style.width = 'calc(100% - 56px)';
            
            document.querySelectorAll('.sb-text').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.sb-label').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.sb-item').forEach(el => {
                el.classList.add('justify-center', 'px-0', 'w-9', 'mx-auto');
                el.classList.remove('px-3', 'mx-2');
            });
            if (collapseBtnIcon) collapseBtnIcon.setAttribute('data-lucide', 'panel-left-open');
        } else {
            sidebar.style.width = '220px';
            wrapper.style.marginLeft = '220px';
            if(header) header.style.width = 'calc(100% - 220px)';

            document.querySelectorAll('.sb-text').forEach(el => el.classList.remove('hidden'));
            document.querySelectorAll('.sb-label').forEach(el => el.classList.remove('hidden'));
            document.querySelectorAll('.sb-item').forEach(el => {
                el.classList.remove('justify-center', 'px-0', 'w-9', 'mx-auto');
                el.classList.add('px-3', 'mx-2');
            });
            if (collapseBtnIcon) collapseBtnIcon.setAttribute('data-lucide', 'panel-left-close');
        }

        if (window.lucide) lucide.createIcons();
    },

    getMenuGroups() {
        if (this.role === 'admin') {
            return [
                {
                    id: 'nav-utama', label: '',
                    items: [
                        { id: 'dashboard', label: 'Dashboard',      icon: 'layout-dashboard', url: 'dashboard.html' },
                        { id: 'students',  label: 'Kelola Siswa',   icon: 'graduation-cap',   url: 'students.html' },
                        { id: 'teachers',  label: 'Kelola Guru',    icon: 'users',            url: 'teachers.html' },
                        { id: 'assignments',label: 'Penugasan Guru',icon: 'briefcase',        url: 'assignments.html' },
                        { id: 'schedules', label: 'Jadwal Pelajaran',icon: 'calendar-days',   url: 'schedules.html' },
                        { id: 'academic',  label: 'Kelola Akademik', icon: 'book-open',       url: 'academic.html' },
                        { id: 'promotions',label: 'Kenaikan Kelas',  icon: 'trending-up',     url: 'promotions.html' },
                        { id: 'reports',   label: 'Laporan',         icon: 'file-bar-chart',  url: 'reports.html' },
                        { id: 'settings',  label: 'Pengaturan',      icon: 'settings',        url: 'settings.html' }
                    ]
                }
            ];
        }
        if (this.role === 'teacher') {
            return [
                {
                    id: 'nav-utama', label: '',
                    items: [
                        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', url: 'dashboard.html' },
                        { id: 'schedule', label: 'Jadwal Mengajar', icon: 'calendar-days', url: 'schedule.html' },
                        { id: 'manual-attendance', label: 'Input Manual', icon: 'list-checks', url: 'manual-attendance.html' },
                        { id: 'analytics', label: 'Analitik', icon: 'pie-chart', url: 'analytics.html' },
                        { id: 'reports', label: 'Laporan', icon: 'file-bar-chart', url: 'reports.html' },
                        { id: 'profile', label: 'Profil Saya', icon: 'user', url: 'profile.html' }
                    ]
                }
            ];
        }
        if (this.role === 'student') {
            return [
                {
                    id: 'nav-utama', label: '',
                    items: [
                        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', url: 'dashboard.html' },
                        { id: 'schedule', label: 'Jadwal Kelas', icon: 'calendar-days', url: 'schedule.html' },
                        { id: 'scanner', label: 'Scan QR Code', icon: 'scan', url: 'scanner.html' },
                        { id: 'history', label: 'Riwayat Kehadiran', icon: 'history', url: 'history.html' },
                        { id: 'profile', label: 'Profil Saya', icon: 'user', url: 'profile.html' }
                    ]
                }
            ];
        }
        return [];
    },

    _buildNavHtml(groups) {
        let navHtml = '';
        groups.forEach(group => {
            let itemsHtml = '';
            group.items.forEach(item => {
                const isActive = item.id === this.activeMenu;
                
                // Base classes
                let itemCls = 'sb-item relative flex items-center gap-2 rounded-md h-9 text-[14px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2';
                
                if (this.collapsed) {
                    itemCls += ' justify-center px-0 w-9 mx-auto';
                } else {
                    itemCls += ' px-3 mx-2';
                }

                // Active/Inactive state classes
                if (isActive) {
                    itemCls += ' bg-accent-subtle text-text-primary font-medium nav-active-border';
                } else {
                    itemCls += ' text-text-secondary hover:bg-bg-hover hover:text-text-primary';
                }

                const iconCls = isActive ? 'text-accent shrink-0' : 'text-text-muted shrink-0';
                
                // Beta/New badges if any
                const badgeHtml = item.badge 
                    ? `<span class="sb-text shrink-0 rounded border border-accent-border bg-accent-subtle px-1.5 py-0.5 text-[10px] font-medium text-accent ${this.collapsed ? 'hidden' : ''}">${item.badge}</span>`
                    : '';

                itemsHtml += `
                    <li>
                        <a href="${item.url}" class="${itemCls}" title="${this.collapsed ? item.label : ''}" ${isActive ? 'aria-current="page"' : ''}>
                            <i data-lucide="${item.icon}" class="w-4 h-4 ${iconCls}" aria-hidden="true"></i>
                            <span class="sb-text flex-1 truncate ${this.collapsed ? 'hidden' : ''}">${item.label}</span>
                            ${badgeHtml}
                        </a>
                    </li>
                `;
            });

            navHtml += `
                <li role="group" aria-labelledby="${group.id}" class="${group.label ? 'pt-4' : 'pt-2'}">
                    ${group.label ? `<span id="${group.id}" class="sb-label block px-4 mb-1 text-[11px] font-medium uppercase tracking-widest text-text-placeholder ${this.collapsed ? 'hidden' : ''}">${group.label}</span>` : ''}
                    <ul class="space-y-0.5">${itemsHtml}</ul>
                </li>
            `;
        });
        return navHtml;
    },

    _buildShell() {
        const capturedContent = [];
        Array.from(document.body.children).forEach(child => {
            if (child.tagName !== 'SCRIPT') capturedContent.push(child.outerHTML);
        });

        const groups = this.getMenuGroups();
        let pageTitle = 'EduTrack';
        groups.forEach(g => g.items.forEach(i => { if (i.id === this.activeMenu) pageTitle = i.label; }));

        const userName = this.user.full_name || this.user.email || 'Admin';
        const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const navHtml = this._buildNavHtml(groups);

        Array.from(document.body.children).forEach(child => {
            if (child.tagName !== 'SCRIPT') child.remove();
        });

        const shell = document.createElement('div');
        shell.id = 'layout-shell';
        shell.className = 'flex h-screen overflow-hidden bg-bg-page font-sans';
        
        const sidebarWidth = this.collapsed ? '56px' : '220px';

        shell.innerHTML = `
            <!-- Mobile overlay -->
            <div id="mobile-overlay" class="fixed inset-0 z-20 bg-black/40 hidden lg:hidden" onclick="layout.toggleMobile()" aria-hidden="true"></div>

            <!-- SIDEBAR -->
            <aside id="sidebar" aria-label="Application navigation"
                class="fixed left-0 top-0 z-30 flex h-full flex-col bg-bg-surface border-r border-border-default transition-all duration-200 overflow-hidden ${this.mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0"
                style="width: ${sidebarWidth}">
                
                <!-- App Switcher -->
                <div class="flex h-12 shrink-0 items-center gap-2 border-b border-border-default px-4 cursor-pointer hover:bg-bg-hover transition-colors">
                    <div class="h-6 w-6 shrink-0 rounded bg-brand-orange flex items-center justify-center text-white font-bold text-[12px]" aria-hidden="true">E</div>
                    <div class="sb-text flex-1 min-w-0 flex items-center justify-between ${this.collapsed ? 'hidden' : ''}">
                        <p class="truncate text-[14px] font-medium text-text-primary">EduTrack App</p>
                        <span class="shrink-0 rounded border border-border-default px-1.5 py-0.5 text-[11px] font-medium text-text-muted">Pro</span>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 overflow-y-auto py-2 scrollbar-thin" aria-label="Main navigation">
                    <ul class="space-y-0">
                        ${navHtml}
                    </ul>
                </nav>

                <!-- Bottom Section -->
                <div class="shrink-0 border-t border-border-default flex flex-col gap-1 pt-2 pb-2 px-2">
                    <!-- Collapse Toggle -->
                    <button onclick="layout.toggleCollapse()" title="${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}"
                        class="relative flex items-center w-full gap-2 rounded-md px-3 h-9 text-sm font-normal text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 hidden lg:flex ${this.collapsed ? 'justify-center px-0' : ''} z-20">
                        <i id="collapse-icon" data-lucide="${this.collapsed ? 'panel-left-open' : 'panel-left-close'}" class="w-4 h-4 shrink-0"></i>
                        <span class="sb-text flex-1 text-left ${this.collapsed ? 'hidden' : ''}">Tutup Sidebar</span>
                    </button>

                    <button onclick="api.logout()" class="relative flex items-center w-full gap-2 rounded-md px-3 h-9 text-sm font-normal text-text-muted hover:bg-danger-subtle hover:text-danger transition-colors duration-150 ${this.collapsed ? 'justify-center px-0' : ''} z-10">
                        <i data-lucide="log-out" class="w-4 h-4 shrink-0" aria-hidden="true"></i>
                        <span class="sb-text flex-1 text-left ${this.collapsed ? 'hidden' : ''}">Keluar</span>
                    </button>
                </div>
            </aside>

            <!-- MAIN CONTENT WRAPPER -->
            <div id="main-wrapper" class="flex flex-1 flex-col overflow-hidden transition-all duration-200" style="margin-left: ${sidebarWidth}">
                
                <!-- HEADER (Sticky) -->
                <header id="main-header" class="sticky top-0 z-10 flex h-[48px] shrink-0 items-center justify-between bg-bg-surface border-b border-border-default px-4 md:px-6">
                    <!-- Left: Title/Breadcrumb -->
                    <div class="flex items-center gap-3">
                        <button onclick="layout.toggleMobile()" class="lg:hidden p-1.5 -ml-1.5 rounded-md text-text-muted hover:bg-bg-hover transition-colors">
                            <i data-lucide="menu" class="w-5 h-5"></i>
                        </button>
                        <h1 class="text-[18px] font-semibold text-text-primary tracking-tight">${pageTitle}</h1>
                    </div>

                    <!-- Right: Actions -->
                    <div class="flex items-center gap-2">
                        <!-- Search -->
                        <button class="flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors sm:w-auto sm:px-2 sm:gap-2">
                            <i data-lucide="search" class="w-4 h-4"></i>
                            <span class="hidden sm:inline text-[13px]">Search...</span>
                            <kbd class="hidden sm:inline-flex items-center justify-center px-1.5 h-5 text-[11px] font-mono border border-border-default rounded bg-bg-hover text-text-muted">⌘K</kbd>
                        </button>
                        
                        <!-- Notifications -->
                        <button class="relative flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors">
                            <i data-lucide="bell" class="w-5 h-5"></i>
                            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <!-- PAGE CONTENT -->
                <main id="main-content" class="flex-1 overflow-y-auto p-6 bg-bg-page relative">
                    <!-- Content injected here -->
                </main>
            </div>
        `;

        document.body.insertBefore(shell, document.body.firstChild);

        const mainEl = document.getElementById('main-content');
        if (mainEl && capturedContent.length > 0) {
            mainEl.innerHTML = capturedContent.join('');
        }

        if (window.lucide) lucide.createIcons();
    }
};

window.layout = layout;
