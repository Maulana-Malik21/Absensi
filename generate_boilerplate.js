const fs = require('fs');
const path = require('path');

const directories = [
    'admin',
    'teacher',
    'student'
];

const pages = {
    admin: [
        { file: 'dashboard.html', title: 'Admin Dashboard' },
        { file: 'students.html', title: 'Student Management' },
        { file: 'teachers.html', title: 'Teacher Management' },
        { file: 'academic.html', title: 'Academic Setup' },
        { file: 'settings.html', title: 'System Settings' }
    ],
    teacher: [
        { file: 'dashboard.html', title: 'Teacher Dashboard' },
        { file: 'qr-generator.html', title: 'QR Session Generator' },
        { file: 'active-session.html', title: 'Active QR Session' },
        { file: 'manual-attendance.html', title: 'Manual Attendance' },
        { file: 'analytics.html', title: 'Attendance Analytics' }
    ],
    student: [
        { file: 'dashboard.html', title: 'Student Dashboard' },
        { file: 'scanner.html', title: 'QR Attendance Scanner' },
        { file: 'history.html', title: 'Attendance History' }
    ]
};

const getBoilerplate = (title, role) => `<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduTrack - ${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <!-- html5-qrcode library included in all pages just in case, heavily used in scanner -->
    <script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen font-sans antialiased">
    
    <div id="sidebar-root"></div>

    <div class="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <div id="navbar-root"></div>

        <main class="flex-1 p-4 lg:p-8">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-bold">${title}</h1>
                    <p class="text-slate-500 text-sm">Manage your ${title.toLowerCase()} here.</p>
                </div>
            </div>

            <div class="glass rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <!-- Page specific content will go here -->
                <div id="app-content">
                    <div class="animate-pulse flex space-x-4">
                        <div class="flex-1 space-y-6 py-1">
                            <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div class="space-y-3">
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
                                    <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
                                </div>
                                <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="../js/utils.js"></script>
    <script src="../js/api.js"></script>
    <script src="../components/layout.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Check auth
            const user = utils.checkAuth('${role}');
            if (!user) return;

            // Render Layout
            const currentPath = window.location.pathname;
            const activeMenu = currentPath.split('/').pop().replace('.html', '');
            
            // Map sub-pages to main menu item to keep highlight active
            const menuMap = {
                'active-session': 'qr'
            };

            layout.init('${role}', menuMap[activeMenu] || activeMenu);
            
            // Specific page initialization logic goes here
            initPage();
        });

        async function initPage() {
            // Fetch data and render
            document.getElementById('app-content').innerHTML = '<p class="text-slate-500">Content loading...</p>';
            // TODO: Implement specific logic
        }
    </script>
</body>
</html>`;

directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    pages[dir].forEach(page => {
        const filePath = path.join(dirPath, page.file);
        fs.writeFileSync(filePath, getBoilerplate(page.title, dir));
        console.log(`Created ${filePath}`);
    });
});

console.log('All boilerplate pages generated successfully!');
