/* =========================================================
   MUDRIK DAU — AI PORTFOLIO ASSISTANT (BOT) v3.1
   - FULL 5-language replies (EN, SW, AR, ZH, FR)
   - FIXED: multilingual intent keywords for ALL 5 languages
     (e.g. "من هو Mudrik؟", "谁是 Mudrik？", "Qui est Mudrik ?",
      "Nani Mudrik?", "Mudrik ni nani?")
   - Auto language detect + auto reply language
   - Fuzzy/typo tolerance for all 5 languages
   - Knows Mudrik's full profile + all technologies
   - Never invents personal information
   ========================================================= */

(function () {
    'use strict';

    /* =========================================================
       1. CONFIG
       ========================================================= */
    const BOT_CONFIG = {
        name: 'DAU Assistant',
        version: '3.1.0',
        storageKey: 'dau:bot:history',
        langKey: 'dau:bot:lang',
        openKey: 'dau:bot:open',
        maxHistory: 60,
        typingDelay: 420,
        responseDelay: 320,
        useBackend: false,
        backendEndpoint: '/api/bot',
        fuzzyTolerance: 2,
        fuzzyMinLen: 4
    };

    const LANGS = ['en', 'sw', 'ar', 'zh', 'fr'];

    /* =========================================================
       2. KNOWLEDGE BASE
       ========================================================= */
    const KNOWLEDGE = {
        identity: {
            fullName: 'Mudrik Mohamed Othman',
            professionalName: 'Mudrik Dau',
            aka: 'DAU',
            dob: '14 October 2005',
            country: 'Tanzania',
            region: 'Zanzibar',
            location: 'Maungani / Kombeni, Zanzibar',
            role: 'IT Student and Full-Stack Developer',
            email: 'mudrikdau@gmail.com',
            phone: '0621662883',
            phoneIntl: '+255621662883',
            whatsapp: '0759101113',
            whatsappIntl: '+255759101113',
            github: 'mudrikdau-ux',
            linkedin: 'mudrik-dau',
            instagram: 'youngw_04',
            threads: 'youngw_04',
            facebook: 'Young Wx',
            x: 'Mudrik Dau',
            messenger: 'Young Wx',
            wechat: 'Mudrik_2005',
            hobbies: ['Football', 'Video games']
        },

        education: [
            { level: 'Certificate in Business Information', institution: 'Zanzibar University Institute of Continuing Education (ICE)', period: '2023–2024', status: 'Completed 2024', gpa: '3.8 / 4.0' },
            { level: 'Diploma in Business Information', institution: 'Zanzibar University Institute of Continuing Education (ICE)', period: '2024–2026', status: 'Completed / completion in 2026', gpa: '4.83 / 5.0' },
            { level: 'Bachelor of Science in Business Information', institution: 'Zanzibar University', faculty: 'Faculty of Business Administration (FBA)', started: '2026', expected: '2028–2029', status: 'First year, first semester', gpa: 'Not yet available' },
            { level: 'HSK Level 2 (Chinese)', period: '2026', score: '180' },
            { level: 'High School — Science Stream', location: 'Zanzibar, Tanzania', result: 'Division 2.18' }
        ],

        skills: {
            frontend: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5.3', 'Responsive Web Design', 'UI/UX Concepts', 'Interactive Interfaces', 'Form Handling', 'Client-side Validation', 'Browser Storage / localStorage'],
            backend: ['Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Authorization', 'JWT', 'OTP Authentication', 'Password Hashing (bcrypt)', 'API Development', 'Middleware', 'File Uploads (multer)', 'Email Services (Nodemailer)'],
            databases: ['MySQL', 'MariaDB', 'MySQL Workbench', 'DBeaver', 'Database Design', 'Relational Databases', 'SQL', 'CRUD Operations', 'Relationships', 'Authentication Databases'],
            tools: ['Visual Studio Code', 'Git', 'GitHub', 'GitHub Pages', 'Postman', 'XAMPP', 'VMware', 'Ubuntu Server', 'Kali Linux', 'Node.js', 'npm'],
            other: ['Chart.js', 'Leaflet', 'OpenStreetMap', 'Geofencing', 'Font Awesome', 'Email OTP', 'Google Authentication', 'JWT Authentication', 'Role-based Access Control']
        },

        devEnvironment: {
            os: 'Windows 11',
            pc: 'Gigabyte laptop',
            cpu: 'Intel Core i5-11400H',
            ram: '64 GB',
            storage: '1 TB',
            gpu: 'NVIDIA RTX 3050 Ti Laptop GPU',
            igpu: 'Intel UHD Graphics',
            software: {
                xampp: '8.2.12', node: '24.x', npm: '11.x', python: '3.14.x',
                ubuntuServer: '24.04', kali: 'Rolling', mariadb: '11.8.x',
                nvidiaDriver: '550.x', cuda: '12.4'
            }
        },

        experience: [
            {
                role: 'Full-Stack Developer',
                roleTranslations: { sw: 'Msanidi Full-Stack', ar: 'مطور Full-Stack', zh: '全栈开发者', fr: 'Développeur Full-Stack' },
                org: 'Livinkey', location: 'Zanzibar', period: 'August 2026 – September 2026'
            },
            {
                role: 'IT & Software Development — Field Placement',
                roleTranslations: { sw: 'IT na Maendeleo ya Programu — Mafunzo ya Uwanjani', ar: 'تكنولوجيا المعلومات وتطوير البرمجيات — تدريب ميداني', zh: 'IT 与软件开发 — 实地实习', fr: 'IT et développement logiciel — Stage sur le terrain' },
                org: 'Zanzibar University Institute of Continuing Education (ICE)',
                start: 'Monday, 16 March 2026', duration: '5 weeks', schedule: '~8 hours/day',
                activities: ['IT administration support', 'Windows 11 support', 'Microsoft Office support', 'Cisco/network-related tasks', 'VS Code, XAMPP', 'Web development (frontend + backend)', 'Database development', 'Cleaning Service Management System / CleanSpark development']
            },
            {
                role: 'Office Assistant',
                roleTranslations: { sw: 'Msaidizi wa Ofisi', ar: 'مساعد مكتبي', zh: '办公室助理', fr: 'Assistant de bureau' },
                org: 'Zan Drive Car Rental', location: 'Kilimani, Zanzibar', period: '2026 — Present',
                activities: ['Office administration and documentation', 'Customer service for car rentals', 'IT and computer-related support', 'Records maintenance']
            },
            {
                role: 'Office Assistant',
                roleTranslations: { sw: 'Msaidizi wa Ofisi', ar: 'مساعد مكتبي', zh: '办公室助理', fr: 'Assistant de bureau' },
                org: 'White Bird Cleaning Company', location: 'Mlandege, Zanzibar', duration: '6 months',
                activities: ['Administrative tasks', 'Documentation and communication', 'Customer interaction', 'Technology-related work observation']
            },
            {
                role: 'Intern',
                roleTranslations: { sw: 'Mwanafunzi wa mafunzo', ar: 'متدرب', zh: '实习生', fr: 'Stagiaire' },
                org: 'Nyota Tech Hub Organization', location: 'Kiembe Samaki, Zanzibar', duration: '8 weeks (2 months)',
                activities: ['Technology and innovation projects', 'Collaboration with tech teams and mentors', 'Applied software and IT skills']
            }
        ],

        projects: [
            {
                name: 'CleanSpark',
                nameTranslations: { sw: 'CleanSpark', ar: 'CleanSpark', zh: 'CleanSpark', fr: 'CleanSpark' },
                altName: 'Cleaning Service Management System (CSMS)',
                type: 'Full-Stack Web Application',
                purpose: 'Helps cleaning businesses in Zanzibar manage customers, bookings, staff, payments, scheduling and reports.',
                purposeTranslations: {
                    sw: 'Husaidia biashara za usafi Zanzibar kusimamia wateja, uhifadhi, wafanyakazi, malipo, ratiba na ripoti.',
                    ar: 'يساعد شركات التنظيف في زنجبار على إدارة العملاء والحجوزات والموظفين والمدفوعات والجدولة والتقارير.',
                    zh: '帮助桑给巴尔的清洁企业管理客户、预订、员工、付款、排班和报告。',
                    fr: 'Aide les entreprises de nettoyage à Zanzibar à gérer clients, réservations, personnel, paiements, planning et rapports.'
                },
                targetUsers: 'Local cleaning businesses in Zanzibar (Unguja & Pemba)',
                workflow: 'Customer → Booking → Admin → Staff → Service → Payment → Report',
                features: {
                    customer: ['Register / Login', 'Email OTP', 'Google Login', 'View cleaning services', 'Make bookings', 'Track bookings', 'Account management', 'Quotations (view/download/share)'],
                    services: ['Name, location, description, included services, image, creation date', 'Locations: Unguja, Pemba, Both', '~18 seeded services planned'],
                    payments: ['M-Pesa', 'Airtel Money', 'HaloPesa', 'Azam Pay', 'Cards'],
                    staff: ['Admin', 'Customer/User', 'Staff'],
                    postPayment: ['Cleaner assignment', 'General supervisor assignment', 'Supervisor confirms arrival', 'Confirms service start', 'Confirms completion']
                },
                technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap 5.3', 'Node.js', 'Express.js', 'MySQL', 'MySQL Workbench', 'Nodemailer', 'bcrypt', 'JWT', 'Postman', 'GitHub'],
                note: 'There is NO shopping cart concept in CleanSpark.',
                noteTranslations: {
                    sw: 'Hakuna dhana ya kikapu cha ununuzi katika CleanSpark.',
                    ar: 'لا يوجد مفهوم سلة التسوق في CleanSpark.',
                    zh: 'CleanSpark 中没有购物车概念。',
                    fr: 'Il n\'y a AUCUN concept de panier dans CleanSpark.'
                }
            },
            {
                name: 'Rasally School Staff Management System',
                nameTranslations: {
                    sw: 'Mfumo wa Usimamizi wa Wafanyakazi wa Shule ya Rasally',
                    ar: 'نظام إدارة موظفي مدرسة راسالي',
                    zh: 'Rasally 学校员工管理系统',
                    fr: 'Système de gestion du personnel de l\'école Rasally'
                },
                repo: 'mudrikdau-ux/rassaly-school',
                type: 'Full-Stack School Staff Management Platform',
                purpose: 'Manages school employees, HR, attendance, payroll, permissions, reports, user management and school settings.',
                purposeTranslations: {
                    sw: 'Husimamia wafanyakazi wa shule, HR, mahudhurio, mishahara, ruhusa, ripoti, usimamizi wa watumiaji na mipangilio ya shule.',
                    ar: 'يدير موظفي المدرسة والموارد البشرية والحضور والرواتب والأذونات والتقارير وإدارة المستخدمين وإعدادات المدرسة.',
                    zh: '管理学校员工、人力资源、考勤、薪资、权限、报告、用户管理和学校设置。',
                    fr: 'Gère les employés, RH, présences, paie, permissions, rapports, utilisateurs et paramètres scolaires.'
                },
                roles: {
                    admin: ['User Management', 'Attendance records', 'Attendance CSV', 'Payroll', 'Payslips', 'Permissions', 'Evidence approval/rejection', 'Reports', 'School settings'],
                    employee: ['Login', 'OTP authentication', 'Forgot password', 'Attendance', 'Location verification', 'Check-in', 'Check-out'],
                    hr: ['Employee records', 'Attendance', 'Leave', 'Payroll', 'Settings']
                },
                keyFeature: 'Location-based attendance verification using Leaflet, OpenStreetMap and Geofencing.',
                keyFeatureTranslations: {
                    sw: 'Uthibitishaji wa mahudhurio kwa eneo kwa kutumia Leaflet, OpenStreetMap na Geofencing.',
                    ar: 'التحقق من الحضور على أساس الموقع باستخدام Leaflet و OpenStreetMap و Geofencing.',
                    zh: '使用 Leaflet、OpenStreetMap 和地理围栏进行基于位置的考勤验证。',
                    fr: 'Vérification de présence basée sur la localisation via Leaflet, OpenStreetMap et Geofencing.'
                },
                technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'JWT', 'Email OTP', 'Chart.js', 'Leaflet', 'OpenStreetMap', 'Font Awesome', 'REST APIs', 'Postman']
            },
            {
                name: 'LAMS — Local Administration Management System',
                nameTranslations: {
                    sw: 'LAMS — Mfumo wa Usimamizi wa Utawala wa Mitaa',
                    ar: 'LAMS — نظام إدارة الحكم المحلي',
                    zh: 'LAMS — 地方行政管理系统',
                    fr: 'LAMS — Système de gestion de l\'administration locale'
                },
                altName: 'Community Service Management System for Local Administration',
                type: 'Full-Stack Web Application',
                purpose: 'Digital system for managing community/local administration services.',
                purposeTranslations: {
                    sw: 'Mfumo wa kidijitali wa kusimamia huduma za jamii/utawala wa mitaa.',
                    ar: 'نظام رقمي لإدارة خدمات المجتمع / الإدارة المحلية.',
                    zh: '用于管理社区/地方行政服务的数字系统。',
                    fr: 'Système numérique pour gérer les services communautaires / administration locale.'
                },
                roles: ['Citizen', 'Admin', 'Super Admin'],
                pages: ['Home', 'About', 'Announcements', 'Contact', 'Login', 'Admin', 'Citizen'],
                technologies: ['Node.js', 'Express.js', 'MySQL', 'dotenv', 'CORS', 'bcryptjs', 'JWT', 'multer', 'express-validator', 'express-rate-limit', 'helmet', 'morgan', 'nodemon']
            },
            {
                name: 'Portfolio Website',
                nameTranslations: {
                    sw: 'Tovuti ya Portfolio',
                    ar: 'موقع المحفظة',
                    zh: '作品集网站',
                    fr: 'Site de portfolio'
                },
                repo: 'mudrikdau-ux/Mudrik-Portfolio',
                type: 'Personal Portfolio',
                purpose: 'Presents Mudrik professionally as a developer and IT student.',
                purposeTranslations: {
                    sw: 'Inawasilisha Mudrik kitaalamu kama msanidi na mwanafunzi wa IT.',
                    ar: 'يقدم Mudrik بشكل احترافي كمطور وطالب تقنية معلومات.',
                    zh: '以开发者与 IT 学生的身份专业地展示 Mudrik。',
                    fr: 'Présente Mudrik professionnellement en tant que développeur et étudiant en informatique.'
                },
                sections: ['Home', 'About', 'Projects', 'Services', 'Skills', 'Experience', 'Certificates', 'Achievements', 'Contact'],
                technologies: ['HTML5', 'CSS3', 'JavaScript (vanilla)', 'i18n (5 languages)', 'IntersectionObserver', 'Canvas API']
            }
        ],

        services: [
            'Full-Stack Web Development', 'Frontend Development', 'Backend Development',
            'Database Development', 'REST API Development', 'Business Information Systems',
            'Web Application Development', 'Responsive Website Development', 'UI Implementation',
            'Authentication Systems', 'Database Integration', 'System Management Solutions',
            'IT & Technical Support'
        ],

        servicesTranslated: {
            sw: ['Uendelezaji wa Wavuti wa Full-Stack', 'Uendelezaji wa Frontend', 'Uendelezaji wa Backend', 'Uendelezaji wa Hifadhidata', 'Uendelezaji wa REST API', 'Mifumo ya Taarifa za Biashara', 'Uendelezaji wa Programu za Wavuti', 'Uendelezaji wa Tovuti Zinazobadilika', 'Utekelezaji wa UI', 'Mifumo ya Uthibitishaji', 'Uunganishaji wa Hifadhidata', 'Suluhisho za Usimamizi wa Mifumo', 'Msaada wa IT na Kiufundi'],
            ar: ['تطوير الويب Full-Stack', 'تطوير الواجهة الأمامية', 'تطوير الواجهة الخلفية', 'تطوير قواعد البيانات', 'تطوير REST API', 'أنظمة معلومات الأعمال', 'تطوير تطبيقات الويب', 'تطوير مواقع متجاوبة', 'تنفيذ واجهة المستخدم', 'أنظمة المصادقة', 'تكامل قواعد البيانات', 'حلول إدارة الأنظمة', 'دعم تقني وتقنية المعلومات'],
            zh: ['全栈 Web 开发', '前端开发', '后端开发', '数据库开发', 'REST API 开发', '商业信息系统', 'Web 应用开发', '响应式网站开发', 'UI 实现', '身份验证系统', '数据库集成', '系统管理解决方案', 'IT 与技术支持'],
            fr: ['Développement Web Full-Stack', 'Développement Frontend', 'Développement Backend', 'Développement de bases de données', 'Développement d\'API REST', 'Systèmes d\'information de gestion', 'Développement d\'applications Web', 'Développement de sites responsives', 'Implémentation UI', 'Systèmes d\'authentification', 'Intégration de bases de données', 'Solutions de gestion de systèmes', 'Support IT et technique']
        },

        certificates: [
            { name: 'First Class Award — Best Student', issuer: 'Zanzibar University', year: '2025' },
            { name: 'Business of Information Technology (First Class)', issuer: 'Zanzibar University', year: '2025' },
            { name: 'Web Projects Completion (Supervisor Signed)', issuer: 'Field Supervisor · ICE', year: '2026' },
            { name: 'HSK Level 2 — Chinese', issuer: 'Chinese Language Proficiency', year: '2024' },
            { name: 'HSK Level 1 — Chinese', issuer: 'Chinese Language Proficiency', year: '2024' },
            { name: 'High Level English — Completed', issuer: 'English Proficiency Program', year: '2024' },
            { name: 'English Stage 5 — Completed', issuer: 'English Proficiency Program', year: '2023' },
            { name: 'Chemistry Club Participation', issuer: 'O-Level Science Club' }
        ],

        forbidden: [
            'salary', 'income', 'bank', 'password',
            'relationship', 'family', 'medical',
            'mshahara', 'benki', 'neno la siri',
            'راتب', 'بنك', 'كلمة المرور',
            'salaire', 'banque', 'mot de passe',
            '工资', '银行', '密码'
        ]
    };

    /* =========================================================
       3. GENERAL TECH KB — MULTILINGUAL
       ========================================================= */
    const TECH_KB = {
        'html': {
            en: 'HTML (HyperText Markup Language) is the standard language for creating web pages. It defines structure and content using elements like <div>, <p>, <a>, <img>. Mudrik uses HTML5 as the foundation of all his pages.',
            sw: 'HTML (HyperText Markup Language) ni lugha ya kawaida ya kuunda kurasa za wavuti. Inafafanua muundo na maudhui kwa kutumia vipengele kama <div>, <p>, <a>, <img>. Mudrik hutumia HTML5 kama msingi wa kurasa zake zote.',
            ar: 'HTML (لغة توصيف النص التشعبي) هي اللغة القياسية لإنشاء صفحات الويب. تحدد البنية والمحتوى باستخدام عناصر مثل <div> و <p> و <a> و <img>. يستخدم Mudrik HTML5 كأساس لجميع صفحاته.',
            zh: 'HTML（超文本标记语言）是创建网页的标准语言。它使用 <div>、<p>、<a>、<img> 等元素定义结构和内容。Mudrik 使用 HTML5 作为所有页面的基础。',
            fr: 'HTML (HyperText Markup Language) est le langage standard pour créer des pages web. Il définit la structure et le contenu avec des éléments comme <div>, <p>, <a>, <img>. Mudrik utilise HTML5 comme base de toutes ses pages.'
        },
        'css': {
            en: 'CSS (Cascading Style Sheets) controls the visual presentation of HTML — colors, layout, spacing, typography, animations. Mudrik uses CSS3 extensively with variables, grid, flexbox, and custom animations.',
            sw: 'CSS (Cascading Style Sheets) hudhibiti muonekano wa HTML — rangi, mpangilio, nafasi, uchapishaji, uhuishaji. Mudrik hutumia CSS3 sana na vigeu, grid, flexbox, na uhuishaji maalum.',
            ar: 'CSS (أوراق الأنماط المتتالية) تتحكم في العرض المرئي لـ HTML — الألوان والتخطيط والمسافات والطباعة والرسوم المتحركة. يستخدم Mudrik CSS3 بكثافة مع المتغيرات و grid و flexbox والرسوم المتحركة المخصصة.',
            zh: 'CSS（层叠样式表）控制 HTML 的视觉呈现——颜色、布局、间距、排版、动画。Mudrik 广泛使用 CSS3，包括变量、grid、flexbox 和自定义动画。',
            fr: 'CSS (Cascading Style Sheets) contrôle la présentation visuelle du HTML — couleurs, mise en page, espacement, typographie, animations. Mudrik utilise largement CSS3 avec variables, grid, flexbox et animations personnalisées.'
        },
        'javascript': {
            en: 'JavaScript is the programming language of the web. It enables interactivity — DOM manipulation, event handling, async requests, animations. Mudrik uses vanilla JavaScript (no frameworks) across all his projects.',
            sw: 'JavaScript ni lugha ya programu ya wavuti. Inawezesha mwingiliano — udhibiti wa DOM, kushughulikia matukio, maombi ya async, uhuishaji. Mudrik hutumia JavaScript ya kawaida (bila mifumo) katika miradi yake yote.',
            ar: 'JavaScript هي لغة برمجة الويب. تتيح التفاعل — التلاعب بـ DOM، معالجة الأحداث، الطلبات غير المتزامنة، الرسوم المتحركة. يستخدم Mudrik JavaScript الأصلية (بدون أطر) في جميع مشاريعه.',
            zh: 'JavaScript 是 Web 的编程语言。它支持交互——DOM 操作、事件处理、异步请求、动画。Mudrik 在所有项目中使用原生 JavaScript（无框架）。',
            fr: 'JavaScript est le langage de programmation du web. Il permet l\'interactivité — manipulation DOM, gestion d\'événements, requêtes asynchrones, animations. Mudrik utilise JavaScript vanilla (sans framework) dans tous ses projets.'
        },
        'node.js': {
            en: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that lets you run JavaScript on the server. Mudrik uses Node.js for backend development in CleanSpark, Rasally, and LAMS.',
            sw: 'Node.js ni mazingira ya utekelezaji wa JavaScript yaliyoundwa juu ya injini ya V8 ya Chrome ambayo inakuwezesha kuendesha JavaScript kwenye seva. Mudrik hutumia Node.js kwa uendelezaji wa backend katika CleanSpark, Rasally, na LAMS.',
            ar: 'Node.js هو بيئة تشغيل JavaScript مبنية على محرك V8 من Chrome تتيح لك تشغيل JavaScript على الخادم. يستخدم Mudrik Node.js لتطوير الواجهة الخلفية في CleanSpark و Rasally و LAMS.',
            zh: 'Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时，允许你在服务器上运行 JavaScript。Mudrik 在 CleanSpark、Rasally 和 LAMS 中使用 Node.js 进行后端开发。',
            fr: 'Node.js est un runtime JavaScript basé sur le moteur V8 de Chrome qui permet d\'exécuter JavaScript côté serveur. Mudrik utilise Node.js pour le backend de CleanSpark, Rasally et LAMS.'
        },
        'express': {
            en: 'Express.js is a minimal and flexible Node.js web framework for building REST APIs and web applications. Mudrik uses Express in every backend project.',
            sw: 'Express.js ni mfumo mdogo na rahisi wa wavuti wa Node.js wa kujenga REST APIs na programu za wavuti. Mudrik hutumia Express katika kila mradi wa backend.',
            ar: 'Express.js هو إطار ويب بسيط ومرن لـ Node.js لبناء REST APIs وتطبيقات الويب. يستخدم Mudrik Express في كل مشروع خلفي.',
            zh: 'Express.js 是一个极简且灵活的 Node.js Web 框架，用于构建 REST API 和 Web 应用。Mudrik 在每个后端项目中使用 Express。',
            fr: 'Express.js est un framework web Node.js minimal et flexible pour créer des API REST et des applications web. Mudrik utilise Express dans chaque projet backend.'
        },
        'mysql': {
            en: 'MySQL is a popular open-source relational database management system. Mudrik uses MySQL + MySQL Workbench for database design in CleanSpark and LAMS.',
            sw: 'MySQL ni mfumo maarufu wa usimamizi wa hifadhidata ya uhusiano wa chanzo huria. Mudrik hutumia MySQL + MySQL Workbench kwa ubunifu wa hifadhidata katika CleanSpark na LAMS.',
            ar: 'MySQL هو نظام إدارة قواعد بيانات علائقية مفتوح المصدر شائع. يستخدم Mudrik MySQL + MySQL Workbench لتصميم قواعد البيانات في CleanSpark و LAMS.',
            zh: 'MySQL 是流行的开源关系数据库管理系统。Mudrik 在 CleanSpark 和 LAMS 中使用 MySQL + MySQL Workbench 进行数据库设计。',
            fr: 'MySQL est un système de gestion de base de données relationnelle open source populaire. Mudrik utilise MySQL + MySQL Workbench pour la conception de bases de données dans CleanSpark et LAMS.'
        },
        'mariadb': {
            en: 'MariaDB is a community-developed fork of MySQL — highly compatible and open-source. Mudrik has MariaDB 11.8.x in his dev environment.',
            sw: 'MariaDB ni fork ya MySQL iliyoandaliwa na jamii — inayoendana sana na chanzo huria. Mudrik ana MariaDB 11.8.x katika mazingira yake ya maendeleo.',
            ar: 'MariaDB هو فرع من MySQL مطور من المجتمع — متوافق للغاية ومفتوح المصدر. لدى Mudrik MariaDB 11.8.x في بيئة تطويره.',
            zh: 'MariaDB 是 MySQL 的社区开发分支——高度兼容且开源。Mudrik 的开发环境中装有 MariaDB 11.8.x。',
            fr: 'MariaDB est un fork de MySQL développé par la communauté — très compatible et open source. Mudrik a MariaDB 11.8.x dans son environnement de développement.'
        },
        'sql': {
            en: 'SQL (Structured Query Language) is the standard language for managing and querying relational databases. Mudrik uses SQL daily for CRUD operations, joins, and schema design.',
            sw: 'SQL (Structured Query Language) ni lugha ya kawaida ya kusimamia na kuuliza hifadhidata za uhusiano. Mudrik hutumia SQL kila siku kwa shughuli za CRUD, joins, na ubunifu wa schema.',
            ar: 'SQL (لغة الاستعلام البنيوية) هي اللغة القياسية لإدارة واستعلام قواعد البيانات العلائقية. يستخدم Mudrik SQL يومياً لعمليات CRUD والربط وتصميم المخططات.',
            zh: 'SQL（结构化查询语言）是管理和查询关系数据库的标准语言。Mudrik 每天使用 SQL 进行 CRUD 操作、连接和模式设计。',
            fr: 'SQL (Structured Query Language) est le langage standard pour gérer et interroger les bases de données relationnelles. Mudrik utilise SQL quotidiennement pour les opérations CRUD, jointures et conception de schémas.'
        },
        'jwt': {
            en: 'JWT (JSON Web Token) is a compact, URL-safe way to represent claims between two parties. It is commonly used for stateless authentication. Mudrik uses JWT in CleanSpark, Rasally, and LAMS for secure user sessions.',
            sw: 'JWT (JSON Web Token) ni njia fupi na salama ya URL ya kuwakilisha madai kati ya pande mbili. Hutumika sana kwa uthibitishaji usio na hali. Mudrik hutumia JWT katika CleanSpark, Rasally, na LAMS kwa vikao salama vya watumiaji.',
            ar: 'JWT (JSON Web Token) هو وسيلة مختصرة وآمنة لعنوان URL لتمثيل المطالبات بين طرفين. يستخدم عادةً للمصادقة بدون حالة. يستخدم Mudrik JWT في CleanSpark و Rasally و LAMS لجلسات مستخدم آمنة.',
            zh: 'JWT（JSON Web Token）是一种紧凑、URL 安全的方式来表示两方之间的声明。通常用于无状态身份验证。Mudrik 在 CleanSpark、Rasally 和 LAMS 中使用 JWT 实现安全的用户会话。',
            fr: 'JWT (JSON Web Token) est un moyen compact et sûr pour les URL de représenter des revendications entre deux parties. Il est couramment utilisé pour l\'authentification sans état. Mudrik utilise JWT dans CleanSpark, Rasally et LAMS pour des sessions utilisateur sécurisées.'
        },
        'otp': {
            en: 'OTP (One-Time Password) is a temporary code used to authenticate a user — often sent via email or SMS. Mudrik implements Email OTP in CleanSpark and Rasally using Nodemailer.',
            sw: 'OTP (Nenosiri la Mara Moja) ni msimbo wa muda unaotumika kuthibitisha mtumiaji — mara nyingi hutumwa kwa barua pepe au SMS. Mudrik hutekeleza Email OTP katika CleanSpark na Rasally kwa kutumia Nodemailer.',
            ar: 'OTP (كلمة مرور لمرة واحدة) هو رمز مؤقت يستخدم لمصادقة المستخدم — غالباً ما يتم إرساله عبر البريد الإلكتروني أو الرسائل النصية. يطبق Mudrik OTP عبر البريد الإلكتروني في CleanSpark و Rasally باستخدام Nodemailer.',
            zh: 'OTP（一次性密码）是用于验证用户的临时代码——通常通过电子邮件或短信发送。Mudrik 在 CleanSpark 和 Rasally 中使用 Nodemailer 实现电子邮件 OTP。',
            fr: 'OTP (mot de passe à usage unique) est un code temporaire utilisé pour authentifier un utilisateur — souvent envoyé par email ou SMS. Mudrik implémente OTP par email dans CleanSpark et Rasally avec Nodemailer.'
        },
        'rest api': {
            en: 'A REST API is an interface that follows REST principles. Mudrik builds REST APIs using Node.js, Express.js, and MySQL, tested with Postman.',
            sw: 'REST API ni kiolesura kinachofuata kanuni za REST. Mudrik hujenga REST APIs kwa kutumia Node.js, Express.js, na MySQL, hujaribiwa na Postman.',
            ar: 'REST API هو واجهة تتبع مبادئ REST. يبني Mudrik واجهات REST API باستخدام Node.js و Express.js و MySQL، يتم اختبارها بـ Postman.',
            zh: 'REST API 是遵循 REST 原则的接口。Mudrik 使用 Node.js、Express.js 和 MySQL 构建 REST API，并用 Postman 测试。',
            fr: 'Une API REST est une interface qui suit les principes REST. Mudrik construit des API REST avec Node.js, Express.js et MySQL, testées avec Postman.'
        },
        'api': {
            en: 'An API (Application Programming Interface) allows two software systems to communicate. Mudrik builds REST APIs with Node.js + Express for all his full-stack projects.',
            sw: 'API (Application Programming Interface) huruhusu mifumo miwili ya programu kuwasiliana. Mudrik hujenga REST APIs kwa Node.js + Express kwa miradi yake yote ya full-stack.',
            ar: 'API (واجهة برمجة التطبيقات) تسمح لنظامين برمجيين بالتواصل. يبني Mudrik REST APIs بـ Node.js + Express لجميع مشاريعه Full-Stack.',
            zh: 'API（应用程序编程接口）允许两个软件系统进行通信。Mudrik 使用 Node.js + Express 为他的所有全栈项目构建 REST API。',
            fr: 'Une API (Application Programming Interface) permet à deux systèmes logiciels de communiquer. Mudrik construit des API REST avec Node.js + Express pour tous ses projets full-stack.'
        },
        'bootstrap': {
            en: 'Bootstrap is a popular CSS framework for building responsive, mobile-first websites. Mudrik uses Bootstrap 5.3 in CleanSpark.',
            sw: 'Bootstrap ni mfumo maarufu wa CSS wa kujenga tovuti zinazobadilika, zinazotanguliza simu. Mudrik hutumia Bootstrap 5.3 katika CleanSpark.',
            ar: 'Bootstrap هو إطار CSS شائع لبناء مواقع متجاوبة تركز على الجوال. يستخدم Mudrik Bootstrap 5.3 في CleanSpark.',
            zh: 'Bootstrap 是流行的 CSS 框架，用于构建响应式、移动优先的网站。Mudrik 在 CleanSpark 中使用 Bootstrap 5.3。',
            fr: 'Bootstrap est un framework CSS populaire pour créer des sites responsives mobile-first. Mudrik utilise Bootstrap 5.3 dans CleanSpark.'
        },
        'chart.js': {
            en: 'Chart.js is a JavaScript library for creating beautiful, interactive charts using the HTML5 canvas. Mudrik uses it in Rasally for reports and analytics.',
            sw: 'Chart.js ni maktaba ya JavaScript ya kuunda chati nzuri, zinazoingiliana kwa kutumia canvas ya HTML5. Mudrik hutumia katika Rasally kwa ripoti na uchanganuzi.',
            ar: 'Chart.js هي مكتبة JavaScript لإنشاء رسوم بيانية جميلة وتفاعلية باستخدام HTML5 canvas. يستخدمها Mudrik في Rasally للتقارير والتحليلات.',
            zh: 'Chart.js 是一个 JavaScript 库，使用 HTML5 canvas 创建精美、交互式图表。Mudrik 在 Rasally 中用于报告和分析。',
            fr: 'Chart.js est une bibliothèque JavaScript pour créer de beaux graphiques interactifs via le canvas HTML5. Mudrik l\'utilise dans Rasally pour les rapports et analyses.'
        },
        'leaflet': {
            en: 'Leaflet is a leading open-source JavaScript library for interactive maps. Mudrik uses Leaflet with OpenStreetMap in Rasally for location-based attendance verification.',
            sw: 'Leaflet ni maktaba inayoongoza ya JavaScript ya chanzo huria kwa ramani zinazoingiliana. Mudrik hutumia Leaflet na OpenStreetMap katika Rasally kwa uthibitishaji wa mahudhurio kwa eneo.',
            ar: 'Leaflet هي مكتبة JavaScript مفتوحة المصدر رائدة للخرائط التفاعلية. يستخدم Mudrik Leaflet مع OpenStreetMap في Rasally للتحقق من الحضور على أساس الموقع.',
            zh: 'Leaflet 是领先的开源 JavaScript 库，用于交互式地图。Mudrik 在 Rasally 中结合 OpenStreetMap 使用 Leaflet 进行基于位置的考勤验证。',
            fr: 'Leaflet est une bibliothèque JavaScript open source de premier plan pour les cartes interactives. Mudrik utilise Leaflet avec OpenStreetMap dans Rasally pour la vérification de présence par localisation.'
        },
        'openstreetmap': {
            en: 'OpenStreetMap (OSM) is a free, editable map of the world built by a community of volunteers. Mudrik uses OSM tiles inside Leaflet maps in Rasally.',
            sw: 'OpenStreetMap (OSM) ni ramani ya dunia ya bure, inayoweza kuhaririwa iliyoundwa na jamii ya wajitolea. Mudrik hutumia tiles za OSM ndani ya ramani za Leaflet katika Rasally.',
            ar: 'OpenStreetMap (OSM) هي خريطة عالم مجانية وقابلة للتعديل بناها مجتمع من المتطوعين. يستخدم Mudrik بلاطات OSM داخل خرائط Leaflet في Rasally.',
            zh: 'OpenStreetMap (OSM) 是由志愿者社区构建的免费、可编辑的世界地图。Mudrik 在 Rasally 的 Leaflet 地图中使用 OSM 瓦片。',
            fr: 'OpenStreetMap (OSM) est une carte mondiale gratuite et modifiable construite par une communauté de bénévoles. Mudrik utilise les tuiles OSM dans les cartes Leaflet de Rasally.'
        },
        'geofencing': {
            en: 'Geofencing is a location-based service that triggers an action when a device enters or exits a virtual boundary. Mudrik uses geofencing in Rasally to verify that an employee is within the permitted area before check-in.',
            sw: 'Geofencing ni huduma inayotegemea eneo ambayo husababisha hatua wakati kifaa kinaingia au kutoka kwenye mpaka pepe. Mudrik hutumia geofencing katika Rasally kuthibitisha kwamba mfanyakazi yuko ndani ya eneo linaloruhusiwa kabla ya kuingia.',
            ar: 'Geofencing هي خدمة قائمة على الموقع تُشغّل إجراءً عندما يدخل جهاز أو يخرج من حدود افتراضية. يستخدم Mudrik geofencing في Rasally للتحقق من أن الموظف داخل المنطقة المسموح بها قبل تسجيل الدخول.',
            zh: '地理围栏是一项基于位置的服务，当设备进入或离开虚拟边界时触发操作。Mudrik 在 Rasally 中使用地理围栏，在签入前验证员工是否在允许区域内。',
            fr: 'Le geofencing est un service basé sur la localisation qui déclenche une action lorsqu\'un appareil entre ou sort d\'une limite virtuelle. Mudrik utilise le geofencing dans Rasally pour vérifier qu\'un employé est dans la zone autorisée avant le pointage.'
        },
        'bcrypt': {
            en: 'bcrypt is a password-hashing function designed for securely storing passwords. Mudrik uses bcrypt and bcryptjs in his authentication systems.',
            sw: 'bcrypt ni kazi ya kuhifadhi nenosiri iliyoundwa kwa ajili ya kuhifadhi nywila kwa usalama. Mudrik hutumia bcrypt na bcryptjs katika mifumo yake ya uthibitishaji.',
            ar: 'bcrypt هي دالة تجزئة لكلمات المرور مصممة لتخزين كلمات المرور بأمان. يستخدم Mudrik bcrypt و bcryptjs في أنظمة المصادقة الخاصة به.',
            zh: 'bcrypt 是一种密码哈希函数，专为安全存储密码而设计。Mudrik 在其身份验证系统中使用 bcrypt 和 bcryptjs。',
            fr: 'bcrypt est une fonction de hachage de mot de passe conçue pour stocker les mots de passe en toute sécurité. Mudrik utilise bcrypt et bcryptjs dans ses systèmes d\'authentification.'
        },
        'nodemailer': {
            en: 'Nodemailer is a Node.js module for sending emails. Mudrik uses Nodemailer to send OTP codes and contact form notifications in CleanSpark and Rasally.',
            sw: 'Nodemailer ni moduli ya Node.js ya kutuma barua pepe. Mudrik hutumia Nodemailer kutuma misimbo ya OTP na arifa za fomu ya mawasiliano katika CleanSpark na Rasally.',
            ar: 'Nodemailer هو وحدة Node.js لإرسال رسائل البريد الإلكتروني. يستخدم Mudrik Nodemailer لإرسال رموز OTP وإشعارات نموذج الاتصال في CleanSpark و Rasally.',
            zh: 'Nodemailer 是用于发送电子邮件的 Node.js 模块。Mudrik 在 CleanSpark 和 Rasally 中使用 Nodemailer 发送 OTP 代码和联系表单通知。',
            fr: 'Nodemailer est un module Node.js pour envoyer des emails. Mudrik utilise Nodemailer pour envoyer des codes OTP et des notifications de formulaire de contact dans CleanSpark et Rasally.'
        },
        'multer': {
            en: 'Multer is a Node.js middleware for handling multipart/form-data, primarily used for file uploads. Mudrik uses it in LAMS for document uploads.',
            sw: 'Multer ni middleware ya Node.js ya kushughulikia multipart/form-data, hasa kwa kupakia faili. Mudrik hutumia katika LAMS kwa kupakia nyaraka.',
            ar: 'Multer هو برمجية وسيطة لـ Node.js لمعالجة multipart/form-data، يُستخدم أساساً لتحميل الملفات. يستخدمه Mudrik في LAMS لتحميل المستندات.',
            zh: 'Multer 是用于处理 multipart/form-data 的 Node.js 中间件，主要用于文件上传。Mudrik 在 LAMS 中使用它来上传文档。',
            fr: 'Multer est un middleware Node.js pour gérer multipart/form-data, principalement utilisé pour les téléchargements de fichiers. Mudrik l\'utilise dans LAMS pour télécharger des documents.'
        },
        'jwt authentication': {
            en: 'JWT authentication uses signed tokens to verify a user\'s identity without storing sessions on the server. Mudrik implements JWT auth across all his full-stack projects.',
            sw: 'Uthibitishaji wa JWT hutumia tokeni zilizosainiwa kuthibitisha utambulisho wa mtumiaji bila kuhifadhi vikao kwenye seva. Mudrik hutekeleza uthibitishaji wa JWT katika miradi yake yote ya full-stack.',
            ar: 'تستخدم مصادقة JWT رموزاً موقعة للتحقق من هوية المستخدم دون تخزين الجلسات على الخادم. يطبق Mudrik مصادقة JWT في جميع مشاريعه Full-Stack.',
            zh: 'JWT 身份验证使用签名令牌来验证用户身份，而无需在服务器上存储会话。Mudrik 在他的所有全栈项目中实现 JWT 身份验证。',
            fr: 'L\'authentification JWT utilise des jetons signés pour vérifier l\'identité d\'un utilisateur sans stocker de sessions sur le serveur. Mudrik implémente l\'auth JWT dans tous ses projets full-stack.'
        },
        'xampp': {
            en: 'XAMPP is a free cross-platform web server stack (Apache, MySQL/MariaDB, PHP, Perl). Mudrik uses XAMPP 8.2.12 in his dev environment.',
            sw: 'XAMPP ni stack ya seva ya wavuti ya bure ya majukwaa mbalimbali (Apache, MySQL/MariaDB, PHP, Perl). Mudrik hutumia XAMPP 8.2.12 katika mazingira yake ya maendeleo.',
            ar: 'XAMPP هو حزمة خادم ويب مجانية متعددة المنصات (Apache، MySQL/MariaDB، PHP، Perl). يستخدم Mudrik XAMPP 8.2.12 في بيئة تطويره.',
            zh: 'XAMPP 是一个免费的跨平台 Web 服务器堆栈（Apache、MySQL/MariaDB、PHP、Perl）。Mudrik 在其开发环境中使用 XAMPP 8.2.12。',
            fr: 'XAMPP est une pile de serveur web multiplateforme gratuite (Apache, MySQL/MariaDB, PHP, Perl). Mudrik utilise XAMPP 8.2.12 dans son environnement de développement.'
        },
        'vmware': {
            en: 'VMware is a virtualization platform that lets you run multiple operating systems on one machine. Mudrik uses VMware to run Ubuntu Server 24.04 and Kali Linux.',
            sw: 'VMware ni jukwaa la uboreshaji ambalo hukuwezesha kuendesha mifumo mingi ya uendeshaji kwenye mashine moja. Mudrik hutumia VMware kuendesha Ubuntu Server 24.04 na Kali Linux.',
            ar: 'VMware هي منصة محاكاة افتراضية تتيح تشغيل أنظمة تشغيل متعددة على جهاز واحد. يستخدم Mudrik VMware لتشغيل Ubuntu Server 24.04 و Kali Linux.',
            zh: 'VMware 是一个虚拟化平台，可让您在一台机器上运行多个操作系统。Mudrik 使用 VMware 运行 Ubuntu Server 24.04 和 Kali Linux。',
            fr: 'VMware est une plateforme de virtualisation qui permet d\'exécuter plusieurs systèmes d\'exploitation sur une seule machine. Mudrik utilise VMware pour exécuter Ubuntu Server 24.04 et Kali Linux.'
        },
        'ubuntu': {
            en: 'Ubuntu is a popular Debian-based Linux distribution. Mudrik runs Ubuntu Server 24.04 in a VMware VM.',
            sw: 'Ubuntu ni usambazaji maarufu wa Linux unaotegemea Debian. Mudrik huendesha Ubuntu Server 24.04 katika VM ya VMware.',
            ar: 'Ubuntu هو توزيع Linux شائع قائم على Debian. يشغّل Mudrik Ubuntu Server 24.04 في جهاز افتراضي VMware.',
            zh: 'Ubuntu 是流行的基于 Debian 的 Linux 发行版。Mudrik 在 VMware 虚拟机中运行 Ubuntu Server 24.04。',
            fr: 'Ubuntu est une distribution Linux populaire basée sur Debian. Mudrik exécute Ubuntu Server 24.04 dans une VM VMware.'
        },
        'kali': {
            en: 'Kali Linux is a Debian-derived Linux distribution designed for digital forensics and penetration testing. Mudrik runs Kali Rolling as a learner.',
            sw: 'Kali Linux ni usambazaji wa Linux unaotokana na Debian ulioundwa kwa uchunguzi wa kidijitali na upimaji wa kuingia. Mudrik huendesha Kali Rolling kama mwanafunzi.',
            ar: 'Kali Linux هو توزيع Linux مشتق من Debian مصمم للتحقيق الجنائي الرقمي واختبار الاختراق. يشغّل Mudrik Kali Rolling كمتعلم.',
            zh: 'Kali Linux 是一种基于 Debian 的 Linux 发行版，专为数字取证和渗透测试而设计。Mudrik 作为学习者运行 Kali Rolling。',
            fr: 'Kali Linux est une distribution Linux dérivée de Debian conçue pour l\'investigation numérique et les tests d\'intrusion. Mudrik exécute Kali Rolling en tant qu\'apprenant.'
        },
        'cisco': {
            en: 'Cisco is a global leader in networking hardware and software. Mudrik has hands-on experience with Cisco-related tasks during his ICE field placement.',
            sw: 'Cisco ni kiongozi wa kimataifa katika maunzi na programu za mtandao. Mudrik ana uzoefu wa vitendo wa kazi zinazohusiana na Cisco wakati wa mafunzo yake ya uwanjani ya ICE.',
            ar: 'Cisco هي شركة رائدة عالمياً في أجهزة وبرامج الشبكات. لدى Mudrik خبرة عملية في المهام المتعلقة بـ Cisco خلال تدريبه الميداني في ICE.',
            zh: 'Cisco 是网络硬件和软件领域的全球领导者。Mudrik 在 ICE 实地实习期间拥有与 Cisco 相关任务的实践经验。',
            fr: 'Cisco est un leader mondial du matériel et des logiciels réseau. Mudrik a une expérience pratique des tâches liées à Cisco lors de son stage ICE.'
        },
        'networking': {
            en: 'Computer networking is the practice of connecting computers to share resources and communicate. Mudrik has practical experience in networking, Cisco configuration, and troubleshooting.',
            sw: 'Mtandao wa kompyuta ni mazoezi ya kuunganisha kompyuta kushiriki rasilimali na kuwasiliana. Mudrik ana uzoefu wa vitendo katika mitandao, usanidi wa Cisco, na utatuzi wa matatizo.',
            ar: 'شبكات الحاسوب هي ممارسة ربط أجهزة الكمبيوتر لمشاركة الموارد والتواصل. لدى Mudrik خبرة عملية في الشبكات وتكوين Cisco واستكشاف الأخطاء وإصلاحها.',
            zh: '计算机网络是连接计算机以共享资源和通信的实践。Mudrik 在网络、Cisco 配置和故障排除方面拥有实践经验。',
            fr: 'La mise en réseau informatique est la pratique de connecter des ordinateurs pour partager des ressources et communiquer. Mudrik a une expérience pratique en réseaux, configuration Cisco et dépannage.'
        },
        'git': {
            en: 'Git is a distributed version control system for tracking changes in source code. Mudrik uses Git + GitHub for all his projects.',
            sw: 'Git ni mfumo wa udhibiti wa toleo uliosambazwa wa kufuatilia mabadiliko katika msimbo wa chanzo. Mudrik hutumia Git + GitHub kwa miradi yake yote.',
            ar: 'Git هو نظام تحكم في الإصدارات موزع لتتبع التغييرات في الكود المصدري. يستخدم Mudrik Git + GitHub لجميع مشاريعه.',
            zh: 'Git 是一个分布式版本控制系统，用于跟踪源代码的更改。Mudrik 在所有项目中使用 Git + GitHub。',
            fr: 'Git est un système de contrôle de version distribué pour suivre les modifications du code source. Mudrik utilise Git + GitHub pour tous ses projets.'
        },
        'github': {
            en: 'GitHub is a cloud platform for hosting Git repositories, collaboration, and CI/CD. Mudrik hosts all his projects at github.com/mudrikdau-ux.',
            sw: 'GitHub ni jukwaa la wingu la kuhifadhi hazina za Git, ushirikiano, na CI/CD. Mudrik huweka miradi yake yote katika github.com/mudrikdau-ux.',
            ar: 'GitHub هي منصة سحابية لاستضافة مستودعات Git والتعاون و CI/CD. يستضيف Mudrik جميع مشاريعه على github.com/mudrikdau-ux.',
            zh: 'GitHub 是用于托管 Git 仓库、协作和 CI/CD 的云平台。Mudrik 在 github.com/mudrikdau-ux 托管所有项目。',
            fr: 'GitHub est une plateforme cloud pour héberger des dépôts Git, collaborer et CI/CD. Mudrik héberge tous ses projets sur github.com/mudrikdau-ux.'
        },
        'github pages': {
            en: 'GitHub Pages is a static site hosting service from GitHub. Mudrik uses it to deploy frontend demos of his projects.',
            sw: 'GitHub Pages ni huduma ya kuhifadhi tovuti tuli kutoka GitHub. Mudrik hutumia kusambaza demo za frontend za miradi yake.',
            ar: 'GitHub Pages هي خدمة استضافة مواقع ثابتة من GitHub. يستخدمها Mudrik لنشر عروض الواجهة الأمامية لمشاريعه.',
            zh: 'GitHub Pages 是 GitHub 提供的静态站点托管服务。Mudrik 使用它来部署项目的前端演示。',
            fr: 'GitHub Pages est un service d\'hébergement de sites statiques de GitHub. Mudrik l\'utilise pour déployer les démos frontend de ses projets.'
        },
        'postman': {
            en: 'Postman is an API development and testing platform. Mudrik uses it to test all his REST APIs.',
            sw: 'Postman ni jukwaa la uendelezaji na upimaji wa API. Mudrik hutumia kujaribu REST APIs zake zote.',
            ar: 'Postman هي منصة تطوير واختبار API. يستخدمها Mudrik لاختبار جميع REST APIs الخاصة به.',
            zh: 'Postman 是一个 API 开发和测试平台。Mudrik 使用它来测试他的所有 REST API。',
            fr: 'Postman est une plateforme de développement et de test d\'API. Mudrik l\'utilise pour tester toutes ses API REST.'
        },
        'vs code': {
            en: 'Visual Studio Code is a free, open-source code editor by Microsoft. It is Mudrik\'s primary code editor.',
            sw: 'Visual Studio Code ni kihariri cha msimbo cha bure, chanzo huria cha Microsoft. Ni kihariri kikuu cha msimbo cha Mudrik.',
            ar: 'Visual Studio Code هو محرر كود مجاني ومفتوح المصدر من Microsoft. إنه محرر الكود الأساسي لـ Mudrik.',
            zh: 'Visual Studio Code 是 Microsoft 提供的免费开源代码编辑器。这是 Mudrik 的主要代码编辑器。',
            fr: 'Visual Studio Code est un éditeur de code gratuit et open source de Microsoft. C\'est l\'éditeur principal de Mudrik.'
        },
        'dbeaver': {
            en: 'DBeaver is a universal database tool for developers and DBAs. Mudrik uses DBeaver alongside MySQL Workbench.',
            sw: 'DBeaver ni zana ya hifadhidata ya ulimwengu kwa watengenezaji na DBAs. Mudrik hutumia DBeaver pamoja na MySQL Workbench.',
            ar: 'DBeaver هي أداة قاعدة بيانات شاملة للمطورين ومديري قواعد البيانات. يستخدم Mudrik DBeaver إلى جانب MySQL Workbench.',
            zh: 'DBeaver 是面向开发人员和 DBA 的通用数据库工具。Mudrik 将 DBeaver 与 MySQL Workbench 一起使用。',
            fr: 'DBeaver est un outil de base de données universel pour les développeurs et DBA. Mudrik utilise DBeaver avec MySQL Workbench.'
        },
        'mysql workbench': {
            en: 'MySQL Workbench is a unified visual tool for database architects, developers, and DBAs. Mudrik uses it for schema design.',
            sw: 'MySQL Workbench ni zana ya kuona iliyounganishwa kwa wasanifu wa hifadhidata, watengenezaji, na DBAs. Mudrik hutumia kwa ubunifu wa schema.',
            ar: 'MySQL Workbench هي أداة مرئية موحدة لمهندسي قواعد البيانات والمطورين ومديري قواعد البيانات. يستخدمها Mudrik لتصميم المخططات.',
            zh: 'MySQL Workbench 是面向数据库架构师、开发人员和 DBA 的统一可视化工具。Mudrik 使用它进行模式设计。',
            fr: 'MySQL Workbench est un outil visuel unifié pour les architectes de bases de données, développeurs et DBA. Mudrik l\'utilise pour la conception de schémas.'
        },
        'full-stack': {
            en: 'Full-stack development means working on both the frontend (UI) and backend (server, database, API). Mudrik is a full-stack developer working with HTML, CSS, JavaScript, Node.js, Express, and MySQL.',
            sw: 'Uendelezaji wa full-stack unamaanisha kufanya kazi kwenye frontend (UI) na backend (seva, hifadhidata, API). Mudrik ni msanidi full-stack anayefanya kazi na HTML, CSS, JavaScript, Node.js, Express, na MySQL.',
            ar: 'تطوير Full-Stack يعني العمل على كل من الواجهة الأمامية (UI) والواجهة الخلفية (الخادم، قاعدة البيانات، API). Mudrik مطور Full-Stack يعمل بـ HTML و CSS و JavaScript و Node.js و Express و MySQL.',
            zh: '全栈开发意味着同时处理前端（UI）和后端（服务器、数据库、API）。Mudrik 是一名全栈开发者，使用 HTML、CSS、JavaScript、Node.js、Express 和 MySQL。',
            fr: 'Le développement full-stack signifie travailler à la fois sur le frontend (UI) et le backend (serveur, base de données, API). Mudrik est un développeur full-stack travaillant avec HTML, CSS, JavaScript, Node.js, Express et MySQL.'
        },
        'frontend': {
            en: 'Frontend development focuses on the user-facing part of a website — layout, styling, and interactivity. Mudrik works with HTML, CSS, JavaScript, and Bootstrap.',
            sw: 'Uendelezaji wa frontend unazingatia sehemu inayomkabili mtumiaji wa tovuti — mpangilio, mitindo, na mwingiliano. Mudrik anafanya kazi na HTML, CSS, JavaScript, na Bootstrap.',
            ar: 'يركز تطوير الواجهة الأمامية على الجزء الذي يواجه المستخدم من الموقع — التخطيط والتنسيق والتفاعل. يعمل Mudrik بـ HTML و CSS و JavaScript و Bootstrap.',
            zh: '前端开发专注于网站面向用户的部分——布局、样式和交互。Mudrik 使用 HTML、CSS、JavaScript 和 Bootstrap。',
            fr: 'Le développement frontend se concentre sur la partie du site orientée utilisateur — mise en page, style et interactivité. Mudrik travaille avec HTML, CSS, JavaScript et Bootstrap.'
        },
        'backend': {
            en: 'Backend development focuses on the server-side — APIs, databases, authentication, and business logic. Mudrik works with Node.js, Express.js, and MySQL.',
            sw: 'Uendelezaji wa backend unazingatia upande wa seva — APIs, hifadhidata, uthibitishaji, na mantiki ya biashara. Mudrik anafanya kazi na Node.js, Express.js, na MySQL.',
            ar: 'يركز تطوير الواجهة الخلفية على جانب الخادم — APIs وقواعد البيانات والمصادقة ومنطق الأعمال. يعمل Mudrik بـ Node.js و Express.js و MySQL.',
            zh: '后端开发专注于服务器端——API、数据库、身份验证和业务逻辑。Mudrik 使用 Node.js、Express.js 和 MySQL。',
            fr: 'Le développement backend se concentre sur le côté serveur — API, bases de données, authentification et logique métier. Mudrik travaille avec Node.js, Express.js et MySQL.'
        },
        'database': {
            en: 'A database is an organized collection of structured data. Mudrik designs and manages relational databases using MySQL, MariaDB, and SQL.',
            sw: 'Hifadhidata ni mkusanyiko uliopangwa wa data iliyoundwa. Mudrik huunda na kusimamia hifadhidata za uhusiano kwa kutumia MySQL, MariaDB, na SQL.',
            ar: 'قاعدة البيانات هي مجموعة منظمة من البيانات المهيكلة. يصمم Mudrik ويدير قواعد البيانات العلائقية باستخدام MySQL و MariaDB و SQL.',
            zh: '数据库是有组织的结构化数据集合。Mudrik 使用 MySQL、MariaDB 和 SQL 设计和管理关系数据库。',
            fr: 'Une base de données est une collection organisée de données structurées. Mudrik conçoit et gère des bases de données relationnelles avec MySQL, MariaDB et SQL.'
        },
        'responsive design': {
            en: 'Responsive design makes a website adapt to different screen sizes. Mudrik uses CSS media queries, flexbox, grid, and Bootstrap to build responsive layouts.',
            sw: 'Muundo unaobadilika hufanya tovuti ibadilike kwa ukubwa tofauti wa skrini. Mudrik hutumia media queries za CSS, flexbox, grid, na Bootstrap kujenga mipangilio inayobadilika.',
            ar: 'التصميم المتجاوب يجعل الموقع يتكيف مع أحجام الشاشات المختلفة. يستخدم Mudrik استعلامات الوسائط CSS و flexbox و grid و Bootstrap لبناء تخطيطات متجاوبة.',
            zh: '响应式设计使网站适应不同的屏幕尺寸。Mudrik 使用 CSS 媒体查询、flexbox、grid 和 Bootstrap 构建响应式布局。',
            fr: 'Le design responsive permet à un site de s\'adapter à différentes tailles d\'écran. Mudrik utilise les media queries CSS, flexbox, grid et Bootstrap pour créer des mises en page responsives.'
        },
        'authentication': {
            en: 'Authentication is the process of verifying who a user is. Mudrik implements authentication using JWT, Email OTP, and bcrypt password hashing.',
            sw: 'Uthibitishaji ni mchakato wa kuthibitisha mtumiaji ni nani. Mudrik hutekeleza uthibitishaji kwa kutumia JWT, Email OTP, na bcrypt password hashing.',
            ar: 'المصادقة هي عملية التحقق من هوية المستخدم. يطبق Mudrik المصادقة باستخدام JWT و Email OTP و bcrypt لتجزئة كلمات المرور.',
            zh: '身份验证是验证用户身份的过程。Mudrik 使用 JWT、电子邮件 OTP 和 bcrypt 密码哈希实现身份验证。',
            fr: 'L\'authentification est le processus de vérification de l\'identité d\'un utilisateur. Mudrik implémente l\'authentification avec JWT, OTP par email et hachage de mot de passe bcrypt.'
        },
        'authorization': {
            en: 'Authorization determines what an authenticated user is allowed to do. Mudrik implements role-based access control (RBAC) in his projects.',
            sw: 'Uidhinishaji huamua kile mtumiaji aliyethibitishwa anaruhusiwa kufanya. Mudrik hutekeleza udhibiti wa ufikiaji unaotegemea jukumu (RBAC) katika miradi yake.',
            ar: 'التفويض يحدد ما يُسمح للمستخدم الموثق بفعله. يطبق Mudrik التحكم في الوصول المستند إلى الدور (RBAC) في مشاريعه.',
            zh: '授权决定经过身份验证的用户可以做什么。Mudrik 在他的项目中实现基于角色的访问控制 (RBAC)。',
            fr: 'L\'autorisation détermine ce qu\'un utilisateur authentifié est autorisé à faire. Mudrik implémente le contrôle d\'accès basé sur les rôles (RBAC) dans ses projets.'
        },
        'crud': {
            en: 'CRUD stands for Create, Read, Update, Delete — the four basic operations on data. Mudrik implements CRUD across all his database-driven projects.',
            sw: 'CRUD inamaanisha Create, Read, Update, Delete — shughuli nne za msingi kwenye data. Mudrik hutekeleza CRUD katika miradi yake yote inayoendeshwa na hifadhidata.',
            ar: 'CRUD تعني Create و Read و Update و Delete — العمليات الأربع الأساسية على البيانات. يطبق Mudrik CRUD في جميع مشاريعه المعتمدة على قواعد البيانات.',
            zh: 'CRUD 代表 Create（创建）、Read（读取）、Update（更新）、Delete（删除）——对数据的四种基本操作。Mudrik 在所有数据库驱动的项目中实现 CRUD。',
            fr: 'CRUD signifie Create, Read, Update, Delete — les quatre opérations de base sur les données. Mudrik implémente CRUD dans tous ses projets basés sur des bases de données.'
        },
        'programming': {
            en: 'Programming is the process of writing instructions that a computer can execute. Mudrik writes JavaScript (frontend + backend), SQL, and understands HTML/CSS markup.',
            sw: 'Programu ni mchakato wa kuandika maagizo ambayo kompyuta inaweza kutekeleza. Mudrik huandika JavaScript (frontend + backend), SQL, na anaelewa markup ya HTML/CSS.',
            ar: 'البرمجة هي عملية كتابة تعليمات يمكن للكمبيوتر تنفيذها. يكتب Mudrik JavaScript (الواجهة الأمامية والخلفية) و SQL، ويفهم ترميز HTML/CSS.',
            zh: '编程是编写计算机可执行指令的过程。Mudrik 编写 JavaScript（前端 + 后端）、SQL，并了解 HTML/CSS 标记。',
            fr: 'La programmation est le processus d\'écriture d\'instructions qu\'un ordinateur peut exécuter. Mudrik écrit JavaScript (frontend + backend), SQL, et comprend le balisage HTML/CSS.'
        },
        'web development': {
            en: 'Web development is the work involved in developing websites and web applications. Mudrik is a full-stack web developer from Zanzibar.',
            sw: 'Uendelezaji wa wavuti ni kazi inayohusika katika kuendeleza tovuti na programu za wavuti. Mudrik ni msanidi wa wavuti wa full-stack kutoka Zanzibar.',
            ar: 'تطوير الويب هو العمل المتضمن في تطوير المواقع وتطبيقات الويب. Mudrik مطور ويب Full-Stack من زنجبار.',
            zh: 'Web 开发是开发网站和 Web 应用所涉及的工作。Mudrik 是来自桑给巴尔的全栈 Web 开发者。',
            fr: 'Le développement web est le travail impliqué dans le développement de sites et d\'applications web. Mudrik est un développeur web full-stack de Zanzibar.'
        }
    };

    /* =========================================================
       4. UI STRINGS
       ========================================================= */
    const STRINGS = {
        en: {
            title: 'DAU Assistant',
            subtitle: 'Ask me about Mudrik or tech',
            greeting: 'Hi! 👋 I\'m Mudrik Dau\'s AI Portfolio Assistant. I can tell you about Mudrik\'s education, projects, technical skills, experience, services, or answer general technology questions. What would you like to explore?',
            placeholder: 'Ask anything…',
            fallback: 'I\'m not sure I understood that. Try asking about Mudrik\'s projects, skills, education, or any technology like Node.js, MySQL, or JWT.'
        },
        sw: {
            title: 'DAU Assistant',
            subtitle: 'Niulize kuhusu Mudrik au teknolojia',
            greeting: 'Habari! 👋 Mimi ni AI Portfolio Assistant wa Mudrik Dau. Naweza kukueleza kuhusu elimu ya Mudrik, miradi, ujuzi wa kiufundi, uzoefu, huduma, au kujibu maswali ya jumla ya teknolojia. Ungependa kujua nini?',
            placeholder: 'Uliza kitu chochote…',
            fallback: 'Sikuelewa vizuri. Jaribu kuuliza kuhusu miradi ya Mudrik, ujuzi, elimu, au teknolojia yoyote kama Node.js, MySQL, au JWT.'
        },
        ar: {
            title: 'مساعد DAU',
            subtitle: 'اسألني عن Mudrik أو التقنية',
            greeting: 'مرحباً! 👋 أنا مساعد الذكاء الاصطناعي لمحفظة Mudrik Dau. يمكنني إخبارك عن تعليم Mudrik، مشاريعه، مهاراته التقنية، خبرته، خدماته، أو الإجابة على أسئلة التقنية العامة. ماذا تريد أن تستكشف؟',
            placeholder: 'اسأل أي شيء…',
            fallback: 'لم أفهم ذلك جيداً. جرّب السؤال عن مشاريع Mudrik أو مهاراته أو تعليمه أو أي تقنية مثل Node.js أو MySQL أو JWT.'
        },
        zh: {
            title: 'DAU 助手',
            subtitle: '向我询问 Mudrik 或技术问题',
            greeting: '你好！👋 我是 Mudrik Dau 的 AI 作品集助手。我可以告诉你 Mudrik 的教育背景、项目、技术技能、经验、服务，或回答一般技术问题。你想了解什么？',
            placeholder: '问任何问题…',
            fallback: '我不太明白。试着询问 Mudrik 的项目、技能、教育，或任何技术，如 Node.js、MySQL 或 JWT。'
        },
        fr: {
            title: 'Assistant DAU',
            subtitle: 'Posez-moi des questions sur Mudrik ou la tech',
            greeting: 'Bonjour ! 👋 Je suis l\'assistant IA du portfolio de Mudrik Dau. Je peux vous parler de l\'éducation de Mudrik, de ses projets, de ses compétences techniques, de son expérience, de ses services, ou répondre à des questions technologiques générales. Que voulez-vous explorer ?',
            placeholder: 'Posez n\'importe quelle question…',
            fallback: 'Je n\'ai pas bien compris. Essayez de demander les projets de Mudrik, ses compétences, son éducation, ou une technologie comme Node.js, MySQL ou JWT.'
        }
    };

    /* =========================================================
       5. TEXT NORMALIZATION & FUZZY MATCHING
       ========================================================= */

    function normalize(text) {
        if (!text) return '';
        let s = String(text).toLowerCase().trim();

        // Arabic normalization
        s = s.replace(/[\u064B-\u065F\u0670]/g, '');
        s = s.replace(/[\u0622\u0623\u0625]/g, '\u0627');
        s = s.replace(/\u0649/g, '\u064A');
        s = s.replace(/\u0629/g, '\u0647');
        s = s.replace(/\u0624/g, '\u0648');
        s = s.replace(/\u0626/g, '\u064A');

        // Latin accents
        try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}

        // Remove punctuation (keep letters/numbers/space, Arabic + CJK ranges)
        s = s.replace(/[^\w\s\u0600-\u06FF\u4E00-\u9FFF]/g, ' ');
        s = s.replace(/\s+/g, ' ').trim();
        return s;
    }

    function tokenize(text) {
        const n = normalize(text);
        return n ? n.split(' ').filter(Boolean) : [];
    }

    function levenshtein(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;
        const al = a.length, bl = b.length;
        const prev = new Array(bl + 1);
        const curr = new Array(bl + 1);
        for (let j = 0; j <= bl; j++) prev[j] = j;
        for (let i = 1; i <= al; i++) {
            curr[0] = i;
            for (let j = 1; j <= bl; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
            }
            for (let j = 0; j <= bl; j++) prev[j] = curr[j];
        }
        return prev[bl];
    }

    function fuzzyWordMatch(userWord, targetWord) {
        if (!userWord || !targetWord) return false;
        if (userWord === targetWord) return true;

        const minLen = BOT_CONFIG.fuzzyMinLen;
        if (userWord.length < minLen && targetWord.length < minLen) return false;

        const lenDiff = Math.abs(userWord.length - targetWord.length);
        if (lenDiff > BOT_CONFIG.fuzzyTolerance + 1) return false;

        if (userWord.length >= 4 && targetWord.includes(userWord)) return true;
        if (targetWord.length >= 4 && userWord.includes(targetWord)) return true;

        const maxDist = Math.min(
            BOT_CONFIG.fuzzyTolerance,
            Math.max(1, Math.floor(targetWord.length / 3))
        );
        return levenshtein(userWord, targetWord) <= maxDist;
    }

    function containsKeyword(userText, keyword) {
        const userTokens = tokenize(userText);
        const keyTokens = tokenize(keyword);
        if (!userTokens.length || !keyTokens.length) return false;

        if (keyTokens.length === 1) {
            const k = keyTokens[0];
            return userTokens.some(ut => fuzzyWordMatch(ut, k));
        }
        const winSize = keyTokens.length;
        for (let i = 0; i <= userTokens.length - winSize; i++) {
            let allMatch = true;
            for (let j = 0; j < winSize; j++) {
                if (!fuzzyWordMatch(userTokens[i + j], keyTokens[j])) { allMatch = false; break; }
            }
            if (allMatch) return true;
        }
        return false;
    }

    function matchesAny(text, keywords) {
        if (!text || !keywords) return false;
        return keywords.some(kw => containsKeyword(text, kw));
    }

    /* =========================================================
       6. LANGUAGE DETECTION
       ========================================================= */
    function detectLanguage(text) {
        if (!text) return null;
        const t = text.trim();
        if (!t) return null;

        if (/[\u0600-\u06FF]/.test(t)) return 'ar';
        if (/[\u4E00-\u9FFF]/.test(t)) return 'zh';

        const norm = normalize(t);
        const tokens = norm.split(' ').filter(Boolean);

        const swMarkers = ['habari', 'mambo', 'shikamoo', 'hujambo', 'asante', 'karibu',
            'nini', 'vipi', 'je', 'unaweza', 'nisaidie', 'nina', 'nataka', 'kuhusu',
            'eleza', 'niambie', 'mimi', 'wewe', 'yeye', 'sisi', 'ninyi', 'wao',
            'tafadhali', 'samahani', 'kazi', 'elimu', 'ujuzi', 'miradi', 'lugha',
            'teknolojia', 'stashahada', 'shule', 'chuo', 'mwalimu', 'mwanafunzi'];

        const frMarkers = ['bonjour', 'salut', 'bonsoir', 'merci', 'comment',
            'pourquoi', 'quoi', 'qui', 'quel', 'quelle', 'je', 'tu', 'il',
            'elle', 'nous', 'vous', 'ils', 'elles', 'le', 'la', 'les', 'un',
            'une', 'des', 'et', 'ou', 'mais', 'avec', 'pour', 'sur', 'dans',
            'projet', 'competence', 'education', 'experience', 'technologie',
            'explique', 'parle', 'moi', 'connaissance'];

        let swScore = 0, frScore = 0;
        tokens.forEach(tk => {
            if (swMarkers.some(m => fuzzyWordMatch(tk, m))) swScore += 1;
            if (frMarkers.some(m => fuzzyWordMatch(tk, m))) frScore += 1;
        });

        if (swScore >= 2 && swScore > frScore) return 'sw';
        if (frScore >= 2 && frScore > swScore) return 'fr';

        return 'en';
    }

    /* =========================================================
       7. INTENT DETECTION — v3.1 FULLY MULTILINGUAL KEYWORDS
       ========================================================= */
    function findIntent(text) {
        const t = text || '';

        /* ---------- GREETING ---------- */
        if (matchesAny(t, [
            // English
            'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
            'whats up', 'how are you',
            // Swahili
            'habari', 'mambo', 'shikamoo', 'hujambo', 'asubuhi njema', 'mchana mwema', 'jioni njema',
            // French
            'bonjour', 'salut', 'bonsoir', 'comment allez vous', 'comment vas tu',
            // Arabic
            'مرحبا', 'اهلا', 'السلام عليكم', 'صباح الخير', 'مساء الخير', 'كيف حالك',
            // Chinese
            '你好', '您好', '早上好', '下午好', '晚上好', '嗨'
        ])) return { type: 'greeting' };

        /* ---------- THANKS ---------- */
        if (matchesAny(t, [
            'thank', 'thanks', 'thank you',
            'asante', 'asante sana',
            'merci', 'merci beaucoup',
            'شكرا', 'شكرا جزيلا',
            '谢谢', '多谢', '感谢'
        ])) return { type: 'thanks' };

        /* ---------- INTRO — WHO IS MUDRIK ---------- */
        if (matchesAny(t, [
            // English
            'who is mudrik', 'who is dau', 'about mudrik', 'tell me about mudrik',
            'introduce mudrik', 'mudrik dau', 'mudrik', 'dau',
            // Swahili
            'nani mudrik', 'mudrik ni nani', 'kuhusu mudrik', 'nifahamishe kuhusu mudrik',
            'niambie kuhusu mudrik', 'mudrik ni nani',
            // Arabic — includes both Arabic-only and mixed forms
            'من هو mudrik', 'من هو mudrik dau', 'من هو dau',
            'من هو mudrik؟', 'من هو',
            'عرفني على mudrik', 'حدثني عن mudrik', 'أخبرني عن mudrik',
            'معلومات عن mudrik', 'mudrik من هو',
            // Chinese
            '谁是 mudrik', 'mudrik 是谁', '介绍 mudrik', '介绍一下 mudrik',
            'mudrik 是谁？', '关于 mudrik', 'mudrik 的资料',
            // French
            'qui est mudrik', 'qui est dau', 'qui est mudrik dau',
            'a propos de mudrik', 'parle moi de mudrik', 'parle-moi de mudrik',
            'presente mudrik', 'présente mudrik', 'mudrik qui est'
        ])) return { type: 'intro' };

        /* ---------- IDENTITY — Quick facts ---------- */
        if (matchesAny(t, [
            'full name', 'birthday', 'born', 'date of birth', 'age',
            'where does mudrik live', 'location', 'country', 'zanzibar',
            'jina kamili', 'umri', 'alizaliwa', 'anapoishi', 'mahali',
            'nom complet', 'anniversaire', 'age', 'ou habite',
            'الاسم الكامل', 'عيد الميلاد', 'تاريخ الميلاد', 'العمر', 'أين يعيش',
            '全名', '生日', '出生日期', '年龄', '住在哪里'
        ])) return { type: 'identity' };

        /* ---------- EDUCATION ---------- */
        if (matchesAny(t, [
            'education', 'study', 'studies', 'university', 'school',
            'degree', 'bachelor', 'diploma', 'certificate', 'gpa', 'hsk',
            'elimu', 'shule', 'chuo', 'digrii', 'stashahada', 'masomo',
            'certificat', 'universite', 'ecole', 'diplome', 'etudes',
            'التعليم', 'الجامعة', 'المدرسة', 'الشهادة', 'التخرج', 'دراسة', 'يدرس',
            '教育', '大学', '学校', '学位', '证书', '学习'
        ])) return { type: 'education' };

        /* ---------- SKILLS ---------- */
        if (matchesAny(t, [
            'skill', 'skills', 'tech stack', 'technologies',
            'what can he do', 'ujuzi', 'ujuzi wake', 'teknolojia', 'anaweza kufanya',
            'competence', 'competences', 'technologies', 'que sait il faire',
            'المهارات', 'مهارات', 'التقنيات', 'تقنيات', 'ماذا يعرف', 'قدرات',
            '技能', '技术', '会什么', '能力', '技术栈'
        ])) return { type: 'skills' };

        /* ---------- EXPERIENCE ---------- */
        if (matchesAny(t, [
            'experience', 'work', 'job', 'career', 'internship',
            'placement', 'uzoefu', 'kazi', 'ajira', 'mafunzo',
            'experience', 'travail', 'emploi', 'stage',
            'الخبرة', 'خبرة', 'العمل', 'الوظيفة', 'تجربة', 'تدريب',
            '经验', '工作', '实习', '职业', '经历'
        ])) return { type: 'experience' };

        /* ---------- SPECIFIC PROJECTS (before generic) ---------- */
        if (matchesAny(t, ['cleanspark', 'csms', 'cleaning service', 'cleaning system'])) {
            return { type: 'project', name: 'CleanSpark' };
        }
        if (matchesAny(t, ['rasally', 'school staff', 'staff management', 'school system'])) {
            return { type: 'project', name: 'Rasally' };
        }
        if (matchesAny(t, ['lams', 'local administration', 'local admin',
            'community service', 'utawala wa mitaa'])) {
            return { type: 'project', name: 'LAMS' };
        }
        if (matchesAny(t, ['portfolio website', 'portfolio site', 'this site', 'this website'])) {
            return { type: 'project', name: 'Portfolio' };
        }

        /* ---------- PROJECTS (generic) ---------- */
        if (matchesAny(t, [
            'project', 'projects', 'built', 'made', 'created',
            'miradi', 'ameunda', 'amefanya', 'kazi zake',
            'projet', 'projets', 'construit', 'cree',
            'المشاريع', 'مشاريع', 'مشروع', 'بنى', 'أنشأ',
            '项目', '构建', '创建', '作品'
        ])) return { type: 'projects' };

        /* ---------- SERVICES ---------- */
        if (matchesAny(t, [
            'service', 'services', 'offer', 'hire', 'freelance',
            'huduma', 'anaotoa', 'huduma zake',
            'offre', 'service propose',
            'الخدمات', 'خدمات', 'خدمة', 'يقدم',
            '服务', '提供', '能做什么'
        ])) return { type: 'services' };

        /* ---------- CERTIFICATES ---------- */
        if (matchesAny(t, [
            'certificate', 'certificates', 'award', 'achievement',
            'stashahada', 'tuzo', 'mafanikio',
            'certificat', 'certificats', 'recompense',
            'الشهادات', 'شهادة', 'شهادات', 'جوائز', 'إنجازات',
            '证书', '奖项', '成就', '荣誉'
        ])) return { type: 'certificates' };

        /* ---------- CONTACT ---------- */
        if (matchesAny(t, [
            'contact', 'email', 'phone', 'whatsapp', 'github',
            'linkedin', 'reach', 'mawasiliano', 'barua pepe', 'simu',
            'contacter', 'telephone', 'courriel',
            'اتصال', 'البريد', 'الهاتف', 'واتساب', 'تواصل', 'بريد',
            '联系方式', '邮箱', '电话', '微信', '联系'
        ])) return { type: 'contact' };

        /* ---------- HOBBIES ---------- */
        if (matchesAny(t, [
            'hobby', 'hobbies', 'interest', 'free time', 'fun',
            'mashauri', 'burudani', 'michezo',
            'loisir', 'passe temps', 'interet',
            'الهوايات', 'هواية', 'هوايات', 'اهتمام',
            '爱好', '兴趣', '娱乐'
        ])) return { type: 'hobbies' };

        /* ---------- DEV ENVIRONMENT ---------- */
        if (matchesAny(t, [
            'pc', 'computer', 'laptop', 'specs', 'ram', 'cpu', 'gpu',
            'windows', 'environment', 'setup', 'kompyuta', 'vifaa',
            'ordinateur', 'configuration',
            'الكمبيوتر', 'الحاسوب', 'اللابتوب', 'مواصفات',
            '电脑', '配置', '笔记本', '环境'
        ])) return { type: 'environment' };

        /* ---------- FORBIDDEN ---------- */
        if (matchesAny(t, KNOWLEDGE.forbidden)) {
            return { type: 'unknown' };
        }

        /* ---------- GENERAL TECH ---------- */
        const norm = normalize(t);
        const tokens = norm.split(' ').filter(Boolean);
        for (const key of Object.keys(TECH_KB)) {
            const keyTokens = key.split(' ');
            if (norm.includes(key)) return { type: 'tech', key };
            if (keyTokens.length === 1) {
                if (tokens.some(tk => fuzzyWordMatch(tk, keyTokens[0]))) {
                    return { type: 'tech', key };
                }
            } else {
                for (let i = 0; i <= tokens.length - keyTokens.length; i++) {
                    let ok = true;
                    for (let j = 0; j < keyTokens.length; j++) {
                        if (!fuzzyWordMatch(tokens[i + j], keyTokens[j])) { ok = false; break; }
                    }
                    if (ok) return { type: 'tech', key };
                }
            }
        }

        return { type: 'unknown' };
    }

    /* =========================================================
       8. RESPONSE GENERATOR
       ========================================================= */
    function respond(intent, lang) {
        const L = LANGS.includes(lang) ? lang : 'en';
        const S = STRINGS[L];

        switch (intent.type) {
            case 'greeting':     return pickGreeting(L);
            case 'thanks':       return pickThanks(L);
            case 'intro':        return buildIntro(L);
            case 'identity':     return buildIdentity(L);
            case 'education':    return buildEducation(L);
            case 'skills':       return buildSkills(L);
            case 'experience':   return buildExperience(L);
            case 'projects':     return buildProjectsList(L);
            case 'project':      return buildProjectDetail(intent.name, L);
            case 'services':     return buildServices(L);
            case 'certificates': return buildCertificates(L);
            case 'contact':      return buildContact(L);
            case 'hobbies':      return buildHobbies(L);
            case 'environment':  return buildEnvironment(L);
            case 'tech':         return getTechReply(intent.key, L);
            case 'unknown':
            default:             return S.fallback;
        }
    }

    /* ---------- Greeting / Thanks ---------- */
    function pickGreeting(lang) {
        const greetings = {
            en: [
                'Hi! 👋 Welcome. I\'m Mudrik\'s AI Portfolio Assistant. I can tell you about Mudrik, his projects, technical skills, education, experience, services, or answer general technology questions. What would you like to explore?',
                'Hello! 😊 Great to see you. Ask me anything about Mudrik or technology.',
                'Hey there! 👋 How can I help you today? I know a lot about Mudrik and tech.'
            ],
            sw: [
                'Habari! 👋 Karibu. Mimi ni AI Portfolio Assistant wa Mudrik. Naweza kukueleza kuhusu Mudrik, miradi yake, ujuzi, elimu, uzoefu, huduma, au kujibu maswali ya teknolojia. Ungependa kujua nini?',
                'Mambo! 😊 Nimefurahi kukuona. Niulize kitu chochote kuhusu Mudrik au teknolojia.',
                'Shikamoo! 👋 Naweza kukusaidia vipi leo? Najua mengi kuhusu Mudrik na teknolojia.'
            ],
            ar: [
                'مرحباً! 👋 أهلاً بك. أنا مساعد الذكاء الاصطناعي لمحفظة Mudrik. يمكنني إخبارك عن Mudrik، مشاريعه، مهاراته، تعليمه، خبرته، خدماته، أو الإجابة على أسئلة التقنية. ماذا تريد أن تستكشف؟',
                'أهلاً! 😊 سعيد برؤيتك. اسألني أي شيء عن Mudrik أو التقنية.',
                'السلام عليكم! 👋 كيف يمكنني مساعدتك اليوم؟'
            ],
            zh: [
                '你好！👋 欢迎。我是 Mudrik 的 AI 作品集助手。我可以告诉你 Mudrik 的项目、技术技能、教育、经验、服务，或回答一般技术问题。你想了解什么？',
                '您好！😊 很高兴见到您。问我任何关于 Mudrik 或技术的问题。',
                '嗨！👋 今天我能帮您什么？'
            ],
            fr: [
                'Bonjour ! 👋 Bienvenue. Je suis l\'assistant IA du portfolio de Mudrik. Je peux vous parler de Mudrik, ses projets, compétences, éducation, expérience, services, ou répondre à des questions tech. Que voulez-vous explorer ?',
                'Salut ! 😊 Ravi de vous voir. Posez-moi n\'importe quelle question sur Mudrik ou la technologie.',
                'Bonjour ! 👋 Comment puis-je vous aider aujourd\'hui ?'
            ]
        };
        const arr = greetings[lang] || greetings.en;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function pickThanks(lang) {
        const thanks = {
            en: ['You\'re very welcome! 😊 I\'m glad I could help.', 'Happy to help! 😊', 'My pleasure! Feel free to ask anything else.'],
            sw: ['Karibu sana! 😊 Nafurahi nimeweza kukusaidia.', 'Furaha yangu! 😊', 'Karibu! Uliza kitu kingine chochote.'],
            ar: ['على الرحب والسعة! 😊 سعيد لأنني استطعت مساعدتك.', 'بكل سرور! 😊', 'يسعدني مساعدتك! اسأل أي شيء آخر.'],
            zh: ['不客气！😊 很高兴能帮助你。', '乐意效劳！😊', '不用谢！随时问其他问题。'],
            fr: ['Avec plaisir ! 😊 Je suis heureux d\'avoir pu vous aider.', 'Ravi de vous aider ! 😊', 'De rien ! N\'hésitez pas à demander autre chose.']
        };
        const arr = thanks[lang] || thanks.en;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /* ---------- Intro ---------- */
    function buildIntro(lang) {
        const I = KNOWLEDGE.identity;
        const map = {
            en: `**${I.fullName}** — professionally known as **${I.professionalName} (${I.aka})** — is an IT student and Full-Stack Developer from ${I.region}, ${I.country}.\n\nHe works with technologies such as **HTML, CSS, JavaScript, Node.js, Express.js, and MySQL**, and has developed projects including:\n\n• **CleanSpark** — Cleaning Service Management System\n• **Rasally** — School Staff Management System\n• **LAMS** — Local Administration Management System\n• **Portfolio Website** — this very site\n\nWould you like to know more about his education, skills, projects, or experience?`,
            sw: `**${I.fullName}** — anajulikana kama **${I.professionalName} (${I.aka})** — ni mwanafunzi wa IT na Full-Stack Developer kutoka ${I.region}, ${I.country}.\n\nAnafanya kazi na teknolojia kama **HTML, CSS, JavaScript, Node.js, Express.js, na MySQL**, na ameunda miradi inayojumuisha:\n\n• **CleanSpark** — Mfumo wa Usimamizi wa Huduma za Usafi\n• **Rasally** — Mfumo wa Usimamizi wa Wafanyakazi wa Shule\n• **LAMS** — Mfumo wa Usimamizi wa Utawala wa Mitaa\n• **Portfolio Website** — tovuti hii\n\nUngependa kujua zaidi kuhusu elimu, ujuzi, miradi, au uzoefu wake?`,
            ar: `**${I.fullName}** — المعروف مهنياً بـ **${I.professionalName} (${I.aka})** — طالب تقنية معلومات ومطور Full-Stack من ${I.region}، ${I.country}.\n\nيعمل بتقنيات مثل **HTML و CSS و JavaScript و Node.js و Express.js و MySQL**، وقد طور مشاريع تشمل:\n\n• **CleanSpark** — نظام إدارة خدمات التنظيف\n• **Rasally** — نظام إدارة موظفي المدارس\n• **LAMS** — نظام إدارة الحكم المحلي\n• **Portfolio Website** — هذا الموقع\n\nهل تريد معرفة المزيد عن تعليمه أو مهاراته أو مشاريعه أو خبرته؟`,
            zh: `**${I.fullName}** — 职业名为 **${I.professionalName} (${I.aka})** — 是来自 ${I.country} ${I.region} 的 IT 学生和全栈开发者。\n\n他使用的技术包括 **HTML、CSS、JavaScript、Node.js、Express.js 和 MySQL**，并开发了以下项目：\n\n• **CleanSpark** — 清洁服务管理系统\n• **Rasally** — 学校员工管理系统\n• **LAMS** — 地方行政管理系统\n• **Portfolio Website** — 本网站\n\n想了解更多关于他的教育、技能、项目或经验吗？`,
            fr: `**${I.fullName}** — connu professionnellement sous le nom de **${I.professionalName} (${I.aka})** — est un étudiant en informatique et développeur Full-Stack de ${I.region}, ${I.country}.\n\nIl travaille avec des technologies telles que **HTML, CSS, JavaScript, Node.js, Express.js et MySQL**, et a développé des projets dont :\n\n• **CleanSpark** — Système de gestion des services de nettoyage\n• **Rasally** — Système de gestion du personnel scolaire\n• **LAMS** — Système de gestion de l'administration locale\n• **Portfolio Website** — ce site\n\nVoulez-vous en savoir plus sur son éducation, compétences, projets ou expérience ?`
        };
        return map[lang] || map.en;
    }

    function buildIdentity(lang) {
        const I = KNOWLEDGE.identity;
        const map = {
            en: `**Quick facts about Mudrik:**\n\n• **Full name:** ${I.fullName}\n• **Professional name:** ${I.professionalName} (${I.aka})\n• **Date of birth:** ${I.dob}\n• **Country:** ${I.country}\n• **Location:** ${I.location}\n• **Role:** ${I.role}\n• **Email:** ${I.email}\n• **GitHub:** github.com/${I.github}\n• **LinkedIn:** linkedin.com/in/${I.linkedin}`,
            sw: `**Maelezo mafupi kuhusu Mudrik:**\n\n• **Jina kamili:** ${I.fullName}\n• **Jina la kitaalamu:** ${I.professionalName} (${I.aka})\n• **Tarehe ya kuzaliwa:** ${I.dob}\n• **Nchi:** ${I.country}\n• **Mahali:** ${I.location}\n• **Kazi:** ${I.role}\n• **Barua pepe:** ${I.email}\n• **GitHub:** github.com/${I.github}\n• **LinkedIn:** linkedin.com/in/${I.linkedin}`,
            ar: `**حقائق سريعة عن Mudrik:**\n\n• **الاسم الكامل:** ${I.fullName}\n• **الاسم المهني:** ${I.professionalName} (${I.aka})\n• **تاريخ الميلاد:** ${I.dob}\n• **البلد:** ${I.country}\n• **الموقع:** ${I.location}\n• **الدور:** ${I.role}\n• **البريد:** ${I.email}\n• **GitHub:** github.com/${I.github}\n• **LinkedIn:** linkedin.com/in/${I.linkedin}`,
            zh: `**Mudrik 的快速信息：**\n\n• **全名：** ${I.fullName}\n• **职业名：** ${I.professionalName} (${I.aka})\n• **出生日期：** ${I.dob}\n• **国家：** ${I.country}\n• **地点：** ${I.location}\n• **角色：** ${I.role}\n• **邮箱：** ${I.email}\n• **GitHub:** github.com/${I.github}\n• **LinkedIn:** linkedin.com/in/${I.linkedin}`,
            fr: `**Faits rapides sur Mudrik :**\n\n• **Nom complet :** ${I.fullName}\n• **Nom professionnel :** ${I.professionalName} (${I.aka})\n• **Date de naissance :** ${I.dob}\n• **Pays :** ${I.country}\n• **Lieu :** ${I.location}\n• **Rôle :** ${I.role}\n• **Email :** ${I.email}\n• **GitHub :** github.com/${I.github}\n• **LinkedIn :** linkedin.com/in/${I.linkedin}`
        };
        return map[lang] || map.en;
    }

    function buildEducation(lang) {
        const edu = KNOWLEDGE.education;
        const labels = {
            en: { completed: 'Completed', gpa: 'GPA', score: 'Score', result: 'Result' },
            sw: { completed: 'Imekamilika', gpa: 'GPA', score: 'Alama', result: 'Matokeo' },
            ar: { completed: 'مكتمل', gpa: 'المعدل', score: 'النتيجة', result: 'النتيجة' },
            zh: { completed: '已完成', gpa: 'GPA', score: '分数', result: '结果' },
            fr: { completed: 'Terminé', gpa: 'Moyenne', score: 'Score', result: 'Résultat' }
        };
        const L = labels[lang] || labels.en;
        const bullets = edu.map(e => {
            if (e.gpa) return `• **${e.level}** — ${e.institution} (${e.period || e.started + '–' + e.expected})\n   ${L.completed}: ${e.status} · ${L.gpa}: ${e.gpa}`;
            if (e.score) return `• **${e.level}** — ${L.score}: ${e.score} (${e.period})`;
            if (e.result) return `• **${e.level}** — ${e.location} · ${L.result}: ${e.result}`;
            return `• **${e.level}**`;
        }).join('\n\n');
        const headers = {
            en: '**Mudrik\'s Education:**', sw: '**Elimu ya Mudrik:**',
            ar: '**تعليم Mudrik:**', zh: '**Mudrik 的教育背景：**', fr: '**Éducation de Mudrik :**'
        };
        const closures = {
            en: 'He also achieved a **First Class result** in his Business Information certificate.',
            sw: 'Pia alipata **matokeo ya Daraja la Kwanza** katika stashahada yake ya Business Information.',
            ar: 'كما حصل على **نتيجة الدرجة الأولى** في شهادته في معلومات الأعمال.',
            zh: '他还在商业信息证书中获得了**一等成绩**。',
            fr: 'Il a également obtenu un **résultat de Première Classe** dans son certificat en Business Information.'
        };
        return `${headers[lang] || headers.en}\n\n${bullets}\n\n${closures[lang] || closures.en}`;
    }

    function buildSkills(lang) {
        const s = KNOWLEDGE.skills;
        const list = (arr) => arr.map(x => `• ${x}`).join('\n');
        const labels = {
            en: { frontend: 'Frontend', backend: 'Backend', databases: 'Databases', tools: 'Tools', other: 'Other' },
            sw: { frontend: 'Frontend', backend: 'Backend', databases: 'Hifadhidata', tools: 'Zana', other: 'Nyingine' },
            ar: { frontend: 'الواجهة الأمامية', backend: 'الواجهة الخلفية', databases: 'قواعد البيانات', tools: 'الأدوات', other: 'أخرى' },
            zh: { frontend: '前端', backend: '后端', databases: '数据库', tools: '工具', other: '其他' },
            fr: { frontend: 'Frontend', backend: 'Backend', databases: 'Bases de données', tools: 'Outils', other: 'Autres' }
        };
        const L = labels[lang] || labels.en;
        const headers = {
            en: '**Mudrik\'s Technical Skills:**', sw: '**Ujuzi wa Kiufundi wa Mudrik:**',
            ar: '**المهارات التقنية لـ Mudrik:**', zh: '**Mudrik 的技术技能：**',
            fr: '**Compétences techniques de Mudrik :**'
        };
        return `${headers[lang] || headers.en}\n\n**${L.frontend}:**\n${list(s.frontend)}\n\n**${L.backend}:**\n${list(s.backend)}\n\n**${L.databases}:**\n${list(s.databases)}\n\n**${L.tools}:**\n${list(s.tools)}\n\n**${L.other}:**\n${list(s.other)}`;
    }

    function buildExperience(lang) {
        const exp = KNOWLEDGE.experience;
        const headers = {
            en: '**Mudrik\'s Experience:**', sw: '**Uzoefu wa Mudrik:**',
            ar: '**خبرة Mudrik:**', zh: '**Mudrik 的经验：**', fr: '**Expérience de Mudrik :**'
        };
        const bullets = exp.map(e => {
            const role = (e.roleTranslations && e.roleTranslations[lang]) || e.role;
            let line = `• **${role}** — ${e.org}`;
            if (e.location) line += ` (${e.location})`;
            if (e.period) line += ` · ${e.period}`;
            if (e.duration) line += ` · ${e.duration}`;
            if (e.activities && e.activities.length) {
                line += '\n   ' + e.activities.slice(0, 3).map(a => `– ${a}`).join('\n   ');
            }
            return line;
        }).join('\n\n');
        return `${headers[lang] || headers.en}\n\n${bullets}`;
    }

    function buildProjectsList(lang) {
        const headers = {
            en: '**Mudrik\'s Projects:**', sw: '**Miradi ya Mudrik:**',
            ar: '**مشاريع Mudrik:**', zh: '**Mudrik 的项目：**', fr: '**Projets de Mudrik :**'
        };
        const suffixes = {
            en: 'Ask me about any of them for full details!',
            sw: 'Niulize kuhusu yoyote kwa maelezo kamili!',
            ar: 'اسألني عن أي منها للحصول على تفاصيل كاملة!',
            zh: '询问任何一个以获得完整详情！',
            fr: 'Demandez-moi n\'importe lequel pour plus de détails !'
        };
        const bullets = KNOWLEDGE.projects.map(pr => {
            const name = (pr.nameTranslations && pr.nameTranslations[lang]) || pr.name;
            const purpose = (pr.purposeTranslations && pr.purposeTranslations[lang]) || pr.purpose;
            return `• **${name}** — ${purpose}`;
        }).join('\n\n');
        return `${headers[lang] || headers.en}\n\n${bullets}\n\n${suffixes[lang] || suffixes.en}`;
    }

    function buildProjectDetail(name, lang) {
        const proj = KNOWLEDGE.projects.find(p => p.name.toLowerCase().includes(String(name).toLowerCase()));
        if (!proj) return STRINGS[lang].fallback;
        const projName = (proj.nameTranslations && proj.nameTranslations[lang]) || proj.name;
        const purpose = (proj.purposeTranslations && proj.purposeTranslations[lang]) || proj.purpose;
        const keyFeature = (proj.keyFeatureTranslations && proj.keyFeatureTranslations[lang]) || proj.keyFeature;
        const note = (proj.noteTranslations && proj.noteTranslations[lang]) || proj.note;
        const L = {
            en: { target: 'Target users', workflow: 'Workflow', tech: 'Technologies', key: 'Key feature', roles: 'Roles', features: 'Features' },
            sw: { target: 'Watumiaji walengwa', workflow: 'Mtiririko', tech: 'Teknolojia', key: 'Kipengele muhimu', roles: 'Majukumu', features: 'Vipengele' },
            ar: { target: 'المستخدمون المستهدفون', workflow: 'سير العمل', tech: 'التقنيات', key: 'الميزة الرئيسية', roles: 'الأدوار', features: 'الميزات' },
            zh: { target: '目标用户', workflow: '工作流程', tech: '技术', key: '关键功能', roles: '角色', features: '功能' },
            fr: { target: 'Utilisateurs cibles', workflow: 'Flux de travail', tech: 'Technologies', key: 'Fonctionnalité clé', roles: 'Rôles', features: 'Fonctionnalités' }
        }[lang] || { target: 'Target users', workflow: 'Workflow', tech: 'Technologies', key: 'Key feature', roles: 'Roles', features: 'Features' };
        let text = `**${projName}**\n\n${purpose || ''}\n`;
        if (proj.targetUsers) text += `\n**${L.target}:** ${proj.targetUsers}`;
        if (proj.workflow) text += `\n\n**${L.workflow}:** ${proj.workflow}`;
        if (proj.technologies) text += `\n\n**${L.tech}:** ${proj.technologies.join(', ')}`;
        if (keyFeature) text += `\n\n**${L.key}:** ${keyFeature}`;
        if (proj.roles) {
            if (Array.isArray(proj.roles)) text += `\n\n**${L.roles}:** ${proj.roles.join(', ')}`;
            else {
                text += `\n\n**${L.roles}:**`;
                Object.entries(proj.roles).forEach(([r, items]) => {
                    text += `\n• **${r}:** ${items.slice(0, 3).join(', ')}`;
                });
            }
        }
        if (proj.features && typeof proj.features === 'object' && !Array.isArray(proj.features)) {
            text += `\n\n**${L.features}:**`;
            Object.entries(proj.features).forEach(([k, v]) => {
                if (Array.isArray(v)) text += `\n• **${k}:** ${v.slice(0, 4).join(', ')}`;
            });
        }
        if (note) text += `\n\n_${note}_`;
        return text;
    }

    function buildServices(lang) {
        const list = (KNOWLEDGE.servicesTranslated[lang] || KNOWLEDGE.services).map(s => `• ${s}`).join('\n');
        const headers = {
            en: '**Services Mudrik offers:**', sw: '**Huduma anazotoa Mudrik:**',
            ar: '**الخدمات التي يقدمها Mudrik:**', zh: '**Mudrik 提供的服务：**',
            fr: '**Services offerts par Mudrik :**'
        };
        const suffixes = {
            en: `Want to discuss a project? Use the Contact page or email ${KNOWLEDGE.identity.email}.`,
            sw: `Unataka kujadili mradi? Tumia ukurasa wa Mawasiliano au barua pepe ${KNOWLEDGE.identity.email}.`,
            ar: `تريد مناقشة مشروع؟ استخدم صفحة الاتصال أو البريد ${KNOWLEDGE.identity.email}.`,
            zh: `想讨论项目？使用联系页面或邮箱 ${KNOWLEDGE.identity.email}。`,
            fr: `Vous voulez discuter d'un projet ? Utilisez la page Contact ou l'email ${KNOWLEDGE.identity.email}.`
        };
        return `${headers[lang] || headers.en}\n\n${list}\n\n${suffixes[lang] || suffixes.en}`;
    }

    function buildCertificates(lang) {
        const list = KNOWLEDGE.certificates.map(c => `• **${c.name}** — ${c.issuer}${c.year ? ' (' + c.year + ')' : ''}`).join('\n');
        const headers = {
            en: '**Mudrik\'s Certificates:**', sw: '**Stashahada za Mudrik:**',
            ar: '**شهادات Mudrik:**', zh: '**Mudrik 的证书：**', fr: '**Certificats de Mudrik :**'
        };
        const suffixes = {
            en: 'See the Certificates page for full details and images.',
            sw: 'Ona ukurasa wa Stashahada kwa maelezo kamili na picha.',
            ar: 'راجع صفحة الشهادات للحصول على التفاصيل الكاملة والصور.',
            zh: '查看证书页面获取完整详情和图片。',
            fr: 'Voir la page Certificats pour tous les détails et images.'
        };
        return `${headers[lang] || headers.en}\n\n${list}\n\n${suffixes[lang] || suffixes.en}`;
    }

    function buildContact(lang) {
        const I = KNOWLEDGE.identity;
        const map = {
            en: `**Contact Mudrik:**\n\n• 📧 Email: ${I.email}\n• 📱 Phone: ${I.phone}\n• 💬 WhatsApp: ${I.whatsapp}\n• 🐙 GitHub: github.com/${I.github}\n• 💼 LinkedIn: linkedin.com/in/${I.linkedin}\n• 📷 Instagram: @${I.instagram}\n\nOr use the Contact page on this portfolio.`,
            sw: `**Wasiliana na Mudrik:**\n\n• 📧 Barua pepe: ${I.email}\n• 📱 Simu: ${I.phone}\n• 💬 WhatsApp: ${I.whatsapp}\n• 🐙 GitHub: github.com/${I.github}\n• 💼 LinkedIn: linkedin.com/in/${I.linkedin}\n• 📷 Instagram: @${I.instagram}\n\nAu tumia ukurasa wa Mawasiliano.`,
            ar: `**اتصل بـ Mudrik:**\n\n• 📧 البريد: ${I.email}\n• 📱 الهاتف: ${I.phone}\n• 💬 واتساب: ${I.whatsapp}\n• 🐙 GitHub: github.com/${I.github}\n• 💼 LinkedIn: linkedin.com/in/${I.linkedin}\n• 📷 Instagram: @${I.instagram}`,
            zh: `**联系 Mudrik：**\n\n• 📧 邮箱：${I.email}\n• 📱 电话：${I.phone}\n• 💬 微信：${I.wechat}\n• 🐙 GitHub: github.com/${I.github}\n• 💼 LinkedIn: linkedin.com/in/${I.linkedin}\n• 📷 Instagram: @${I.instagram}`,
            fr: `**Contacter Mudrik :**\n\n• 📧 Email : ${I.email}\n• 📱 Téléphone : ${I.phone}\n• 💬 WhatsApp : ${I.whatsapp}\n• 🐙 GitHub : github.com/${I.github}\n• 💼 LinkedIn : linkedin.com/in/${I.linkedin}\n• 📷 Instagram : @${I.instagram}`
        };
        return map[lang] || map.en;
    }

    function buildHobbies(lang) {
        const map = {
            en: `**Mudrik's hobbies:** ${KNOWLEDGE.identity.hobbies.join(', ')}.`,
            sw: `**Mashauri ya Mudrik:** ${KNOWLEDGE.identity.hobbies.join(', ')}.`,
            ar: `**هوايات Mudrik:** ${KNOWLEDGE.identity.hobbies.join('، ')}.`,
            zh: `**Mudrik 的爱好：** ${KNOWLEDGE.identity.hobbies.join('、')}。`,
            fr: `**Loisirs de Mudrik :** ${KNOWLEDGE.identity.hobbies.join(', ')}.`
        };
        return map[lang] || map.en;
    }

    function buildEnvironment(lang) {
        const e = KNOWLEDGE.devEnvironment;
        const map = {
            en: `**Mudrik's Development Environment:**\n\n• 💻 **PC:** ${e.pc}\n• ⚙️ **OS:** ${e.os}\n• 🧠 **CPU:** ${e.cpu}\n• 🚀 **RAM:** ${e.ram}\n• 💾 **Storage:** ${e.storage}\n• 🎮 **GPU:** ${e.gpu}\n• 🖥️ **iGPU:** ${e.igpu}\n\n**Software:**\n• XAMPP ${e.software.xampp}\n• Node.js ${e.software.node}\n• npm ${e.software.npm}\n• Python ${e.software.python}\n• Ubuntu Server ${e.software.ubuntuServer}\n• Kali ${e.software.kali}\n• MariaDB ${e.software.mariadb}\n• NVIDIA Driver ${e.software.nvidiaDriver}\n• CUDA ${e.software.cuda}`,
            sw: `**Mazingira ya Maendeleo ya Mudrik:**\n\n• 💻 **PC:** ${e.pc}\n• ⚙️ **OS:** ${e.os}\n• 🧠 **CPU:** ${e.cpu}\n• 🚀 **RAM:** ${e.ram}\n• 💾 **Storage:** ${e.storage}\n• 🎮 **GPU:** ${e.gpu}`,
            ar: `**بيئة التطوير لـ Mudrik:**\n\n• 💻 **الكمبيوتر:** ${e.pc}\n• ⚙️ **نظام التشغيل:** ${e.os}\n• 🧠 **المعالج:** ${e.cpu}\n• 🚀 **RAM:** ${e.ram}\n• 💾 **التخزين:** ${e.storage}\n• 🎮 **GPU:** ${e.gpu}`,
            zh: `**Mudrik 的开发环境：**\n\n• 💻 **PC：** ${e.pc}\n• ⚙️ **操作系统：** ${e.os}\n• 🧠 **CPU：** ${e.cpu}\n• 🚀 **RAM：** ${e.ram}\n• 💾 **存储：** ${e.storage}\n• 🎮 **GPU：** ${e.gpu}`,
            fr: `**Environnement de développement de Mudrik :**\n\n• 💻 **PC :** ${e.pc}\n• ⚙️ **OS :** ${e.os}\n• 🧠 **CPU :** ${e.cpu}\n• 🚀 **RAM :** ${e.ram}\n• 💾 **Stockage :** ${e.storage}\n• 🎮 **GPU :** ${e.gpu}`
        };
        return map[lang] || map.en;
    }

    function getTechReply(key, lang) {
        const entry = TECH_KB[key];
        if (!entry) return STRINGS[lang].fallback;
        return entry[lang] || entry.en;
    }

    /* =========================================================
       9. STATE
       ========================================================= */
    let currentLang = 'en';
    let history = [];
    let isOpen = false;
    let isTyping = false;
    let lastUserLang = null;

    /* =========================================================
       10. DOM
       ========================================================= */
    let root, toggleBtn, panel, closeBtn, header, bodyEl, form, input, sendBtn, clearBtn, typingEl;

    function buildDOM() {
        if (document.getElementById('dauBotRoot')) return;
        root = document.createElement('div');
        root.id = 'dauBotRoot';
        root.className = 'dau-bot';
        root.setAttribute('aria-live', 'polite');
        root.innerHTML = `
            <button class="dau-bot__toggle" id="dauBotToggle" aria-label="Open assistant" type="button">
                <span class="dau-bot__toggle-icon"><i class="fa-solid fa-robot"></i></span>
                <span class="dau-bot__toggle-pulse"></span>
            </button>
            <div class="dau-bot__panel" id="dauBotPanel" role="dialog" aria-modal="false" aria-hidden="true">
                <header class="dau-bot__header">
                    <div class="dau-bot__brand">
                        <span class="dau-bot__brand-mark">D</span>
                        <div class="dau-bot__brand-text">
                            <span class="dau-bot__title" id="dauBotTitle">DAU Assistant</span>
                            <span class="dau-bot__subtitle" id="dauBotSubtitle">Ask me about Mudrik or tech</span>
                        </div>
                    </div>
                    <div class="dau-bot__actions">
                        <button class="dau-bot__action" id="dauBotClear" type="button" aria-label="Clear chat"><i class="fa-solid fa-trash-can"></i></button>
                        <button class="dau-bot__action" id="dauBotClose" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </header>
                <div class="dau-bot__body" id="dauBotBody" role="log" aria-live="polite"></div>
                <div class="dau-bot__typing" id="dauBotTyping" aria-hidden="true">
                    <span class="dau-bot__typing-dot"></span>
                    <span class="dau-bot__typing-dot"></span>
                    <span class="dau-bot__typing-dot"></span>
                </div>
                <form class="dau-bot__form" id="dauBotForm" autocomplete="off">
                    <input type="text" class="dau-bot__input" id="dauBotInput" placeholder="Ask anything…" aria-label="Message" maxlength="500" />
                    <button type="submit" class="dau-bot__send" id="dauBotSend" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>
                </form>
                <div class="dau-bot__langs" id="dauBotLangs">
                    <button type="button" data-lang="en" class="dau-bot__lang is-active">EN</button>
                    <button type="button" data-lang="sw" class="dau-bot__lang">SW</button>
                    <button type="button" data-lang="ar" class="dau-bot__lang">AR</button>
                    <button type="button" data-lang="zh" class="dau-bot__lang">ZH</button>
                    <button type="button" data-lang="fr" class="dau-bot__lang">FR</button>
                </div>
            </div>
        `;
        document.body.appendChild(root);
        toggleBtn = document.getElementById('dauBotToggle');
        panel     = document.getElementById('dauBotPanel');
        closeBtn  = document.getElementById('dauBotClose');
        clearBtn  = document.getElementById('dauBotClear');
        bodyEl    = document.getElementById('dauBotBody');
        form      = document.getElementById('dauBotForm');
        input     = document.getElementById('dauBotInput');
        sendBtn   = document.getElementById('dauBotSend');
        typingEl  = document.getElementById('dauBotTyping');
    }

    /* =========================================================
       11. RENDER
       ========================================================= */
    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function formatMessage(text) {
        if (!text) return '';
        let html = escapeHtml(text);
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function appendMessage(role, text) {
        const msg = document.createElement('div');
        msg.className = `dau-bot__msg dau-bot__msg--${role}`;
        const bubble = document.createElement('div');
        bubble.className = 'dau-bot__bubble';
        bubble.innerHTML = formatMessage(text);
        msg.appendChild(bubble);
        bodyEl.appendChild(msg);
        requestAnimationFrame(() => { bodyEl.scrollTop = bodyEl.scrollHeight; });
        return msg;
    }

    function showTyping(show) {
        isTyping = show;
        if (!typingEl) return;
        typingEl.classList.toggle('is-visible', show);
    }

    function saveHistory() {
        try {
            const trimmed = history.slice(-BOT_CONFIG.maxHistory);
            localStorage.setItem(BOT_CONFIG.storageKey, JSON.stringify(trimmed));
        } catch (e) {}
    }

    function loadHistory() {
        try {
            const raw = localStorage.getItem(BOT_CONFIG.storageKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) { return []; }
    }

    function renderHistory() {
        bodyEl.innerHTML = '';
        history.forEach(item => appendMessage(item.role, item.text));
        if (history.length === 0) {
            const S = STRINGS[currentLang] || STRINGS.en;
            appendMessage('bot', S.greeting);
            history.push({ role: 'bot', text: S.greeting });
            saveHistory();
        }
    }

    /* =========================================================
       12. SEND / RESPOND
       ========================================================= */
    async function handleSubmit(e) {
        if (e) e.preventDefault();
        const text = (input.value || '').trim();
        if (!text || isTyping) return;

        appendMessage('user', text);
        history.push({ role: 'user', text });
        saveHistory();
        input.value = '';

        const detected = detectLanguage(text);
        let replyLang = currentLang;

        if (detected && detected !== currentLang) {
            replyLang = detected;
            setLanguage(detected, { silent: true });
        } else if (detected) {
            replyLang = detected;
        } else if (lastUserLang) {
            replyLang = lastUserLang;
        }
        lastUserLang = replyLang;

        showTyping(true);

        const intent = findIntent(text);
        let reply = respond(intent, replyLang);

        if (BOT_CONFIG.useBackend && window.DAU_api && typeof window.DAU_api.request === 'function') {
            try {
                const backendRes = await window.DAU_api.request(BOT_CONFIG.backendEndpoint, {
                    method: 'POST',
                    body: { message: text, lang: replyLang, intent: intent.type }
                });
                if (backendRes && backendRes.reply) reply = backendRes.reply;
            } catch (err) {}
        }

        setTimeout(() => {
            showTyping(false);
            appendMessage('bot', reply);
            history.push({ role: 'bot', text: reply });
            saveHistory();
        }, BOT_CONFIG.responseDelay + Math.random() * BOT_CONFIG.typingDelay);
    }

    /* =========================================================
       13. LANGUAGE
       ========================================================= */
    function setLanguage(lang, opts = {}) {
        if (!LANGS.includes(lang)) lang = 'en';
        currentLang = lang;
        const S = STRINGS[lang] || STRINGS.en;
        const titleEl = document.getElementById('dauBotTitle');
        const subtitleEl = document.getElementById('dauBotSubtitle');
        if (titleEl) titleEl.textContent = S.title;
        if (subtitleEl) subtitleEl.textContent = S.subtitle;
        if (input) input.placeholder = S.placeholder;
        document.querySelectorAll('.dau-bot__lang').forEach(b => {
            b.classList.toggle('is-active', b.dataset.lang === lang);
        });
        try { localStorage.setItem(BOT_CONFIG.langKey, lang); } catch (e) {}
        if (panel) panel.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        if (!opts.silent && bodyEl) {
            bodyEl.innerHTML = '';
            const greeting = S.greeting;
            appendMessage('bot', greeting);
            history.push({ role: 'bot', text: greeting });
            saveHistory();
        }
    }

    /* =========================================================
       14. OPEN / CLOSE
       ========================================================= */
    function openBot() {
        isOpen = true;
        if (panel) { panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); }
        if (toggleBtn) toggleBtn.classList.add('is-active');
        try { localStorage.setItem(BOT_CONFIG.openKey, '1'); } catch (e) {}
        setTimeout(() => input && input.focus(), 250);
        if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function closeBot() {
        isOpen = false;
        if (panel) { panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); }
        if (toggleBtn) toggleBtn.classList.remove('is-active');
        try { localStorage.setItem(BOT_CONFIG.openKey, '0'); } catch (e) {}
    }

    function toggleBot() { isOpen ? closeBot() : openBot(); }

    function clearChat() {
        history = [];
        try { localStorage.removeItem(BOT_CONFIG.storageKey); } catch (e) {}
        if (bodyEl) bodyEl.innerHTML = '';
        const S = STRINGS[currentLang] || STRINGS.en;
        appendMessage('bot', S.greeting);
        history.push({ role: 'bot', text: S.greeting });
        saveHistory();
    }

    /* =========================================================
       15. INIT
       ========================================================= */
    function init() {
        buildDOM();
        try {
            const saved = localStorage.getItem(BOT_CONFIG.langKey);
            if (saved && LANGS.includes(saved)) currentLang = saved;
        } catch (e) {}
        history = loadHistory();
        toggleBtn.addEventListener('click', toggleBot);
        closeBtn.addEventListener('click', closeBot);
        clearBtn.addEventListener('click', clearChat);
        form.addEventListener('submit', handleSubmit);
        document.querySelectorAll('.dau-bot__lang').forEach(btn => {
            btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) closeBot();
        });
        setLanguage(currentLang, { silent: true });
        renderHistory();
        try {
            const wasOpen = localStorage.getItem(BOT_CONFIG.openKey);
            if (wasOpen === '1') openBot();
        } catch (e) {}
        document.addEventListener('dau:langChanged', (e) => {
            const newLang = e && e.detail && e.detail.lang;
            if (newLang && LANGS.includes(newLang)) setLanguage(newLang, { silent: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* =========================================================
       16. PUBLIC API
       ========================================================= */
    window.DAU_bot = {
        open: openBot,
        close: closeBot,
        toggle: toggleBot,
        clear: clearChat,
        setLanguage,
        ask: (text) => { if (!input) return; input.value = text; handleSubmit(); },
        get language() { return currentLang; },
        get history() { return history.slice(); },
        knowledge: KNOWLEDGE,
        techKB: TECH_KB,
        detectLanguage,
        findIntent,
        version: BOT_CONFIG.version
    };

})();