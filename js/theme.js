// theme.js - EduTrack Design System v2.0 — Tailwind Config + PWA

// PWA Registration
(function registerPWA() {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/teacher/') || window.location.pathname.includes('/student/') ? '../manifest.json' : './manifest.json';
    document.head.appendChild(link);

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swPath = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/teacher/') || window.location.pathname.includes('/student/') ? '../sw.js' : './sw.js';
            navigator.serviceWorker.register(swPath).then(registration => {
                console.log('SW registered:', registration.scope);
            }).catch(error => {
                console.log('SW registration failed:', error);
            });
        });
    }
})();

(function() {
    // Tailwind Config — Unified palette
    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                colors: {
                    'primary':        '#4F46E5',
                    'primary-light':  '#818CF8',
                    'primary-lighter':'#C7D2FE',
                    'primary-lightest':'#EEF2FF',
                    'primary-dark':   '#3730A3',
                    'secondary':      '#0EA5E9',
                    'secondary-light':'#7DD3FC',
                    'secondary-lightest':'#E0F2FE',
                    'accent':         '#8B5CF6',
                    'accent-light':   '#C4B5FD',
                    'accent-lightest':'#EDE9FE',
                    'success':        '#10B981',
                    'success-light':  '#D1FAE5',
                    'success-dark':   '#059669',
                    'warning':        '#F59E0B',
                    'warning-light':  '#FEF3C7',
                    'warning-dark':   '#D97706',
                    'error':          '#EF4444',
                    'error-light':    '#FEE2E2',
                    'error-dark':     '#DC2626',
                    'info':           '#3B82F6',
                    'info-light':     '#DBEAFE',
                    'bg':             '#F8FAFC',
                    'bg-alt':         '#F1F5F9',
                    'surface':        '#FFFFFF',
                    'surface-alt':    '#F1F5F9',
                    'border':         '#E2E8F0',
                    'border-dark':    '#CBD5E1',
                    'text-main':      '#0F172A',
                    'text-secondary': '#334155',
                    'text-muted':     '#64748B',
                    'text-placeholder':'#94A3B8',
                    'sidebar-bg':     '#0F172A',
                    'sidebar-hover':  '#1E293B',
                },
                fontFamily: {
                    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                },
                borderRadius: {
                    DEFAULT: '8px',
                    sm:  '6px',
                    md:  '8px',
                    lg:  '12px',
                    xl:  '16px',
                    '2xl': '20px',
                    full: '9999px',
                },
                fontSize: {
                    'xs':  ['0.6875rem', { lineHeight: '1rem' }],
                    'sm':  ['0.8125rem', { lineHeight: '1.25rem' }],
                    'base':['0.9375rem', { lineHeight: '1.5rem' }],
                    'lg':  ['1.125rem',  { lineHeight: '1.75rem' }],
                    'xl':  ['1.25rem',   { lineHeight: '1.75rem' }],
                    '2xl': ['1.5rem',    { lineHeight: '2rem' }],
                    '3xl': ['1.875rem',  { lineHeight: '2.25rem' }],
                    '4xl': ['2.5rem',    { lineHeight: '2.75rem' }],
                },
                boxShadow: {
                    'card':      '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
                    'card-hover':'0 10px 25px rgba(0,0,0,0.08)',
                    'primary':   '0 4px 14px rgba(79, 70, 229, 0.25)',
                },
                spacing: {
                    '18': '4.5rem',
                    '22': '5.5rem',
                },
            }
        }
    };

    // Inject Inter Font
    const fontLink1 = document.createElement('link');
    fontLink1.rel = 'preconnect';
    fontLink1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(fontLink1);

    const fontLink2 = document.createElement('link');
    fontLink2.rel = 'preconnect';
    fontLink2.href = 'https://fonts.gstatic.com';
    fontLink2.crossOrigin = '';
    document.head.appendChild(fontLink2);

    const interFont = document.createElement('link');
    interFont.rel = 'stylesheet';
    interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(interFont);

    // Inject Material Symbols
    const materialSymbols = document.createElement('link');
    materialSymbols.rel = 'stylesheet';
    materialSymbols.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    document.head.appendChild(materialSymbols);

    const style = document.createElement('style');
    style.innerHTML = `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    `;
    document.head.appendChild(style);
})();
