




















const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Project = require('../src/models/Project');
const connectDB = require('../src/config/database');

// Function to check if images exist, fallback to placeholder if not
const fs = require('fs');
const path = require('path');

function getImagePath(imageName) {
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);
    if (fs.existsSync(imagePath)) {
        return `/uploads/${imageName}`;
    }
    // Fallback to a placeholder or default image
    return `/uploads/placeholder-${imageName}`;
}

// Sample project data with realistic Arabic content
const sampleProjects = [
    {
        name: "منصة التجارة الإلكترونية الذكية",
        description: "منصة تجارة إلكترونية متكاملة تدعم اللغة العربية مع نظام إدارة المخزون الذكي ونظام دفع آمن. تتضمن لوحة تحكم شاملة للبائعين، نظام تقييم المنتجات، وخدمة العملاء المباشرة. المنصة مُحسنة للأجهزة المحمولة وتدعم التكامل مع منصات التواصل الاجتماعي.",
        coverImage: getImagePath("ecommerce-cover.jpg"),
        images: [
            getImagePath("ecommerce-1.jpg"),
            getImagePath("ecommerce-2.jpg"),
            getImagePath("ecommerce-3.jpg")
        ],
        technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Redis", "JWT", "Socket.io"],
        projectUrl: "https://smart-ecommerce-demo.com",
        githubUrl: "https://github.com/faezkhalas/smart-ecommerce",
        category: "web",
        status: "completed",
        featured: true,
        order: 1,
        isActive: true
    },
    {
        name: "تطبيق إدارة المهام الذكي",
        description: "تطبيق جوال لإدارة المهام والمشاريع يدعم العمل الجماعي مع إشعارات ذكية وتتبع الإنتاجية. يتضمن نظام تقويم متقدم، إحصائيات مفصلة للأداء، والتزامن السحابي. التطبيق يدعم الوضع المظلم ويعمل بدون إنترنت.",
        coverImage: getImagePath("taskmanager-cover.jpg"),
        images: [
            getImagePath("taskmanager-1.jpg"),
            getImagePath("taskmanager-2.jpg")
        ],
        technologies: ["React Native", "Firebase", "Redux", "AsyncStorage", "Push Notifications"],
        projectUrl: "https://play.google.com/store/apps/details?id=com.smarttasks",
        githubUrl: "https://github.com/faezkhalas/smart-tasks-app",
        category: "mobile",
        status: "completed",
        featured: true,
        order: 2,
        isActive: true
    },
    {
        name: "نظام إدارة المدارس الشامل",
        description: "نظام إدارة شامل للمدارس يشمل إدارة الطلاب والمعلمين والدرجات والحضور. يتضمن بوابة للأولياء لمتابعة أداء أطفالهم، نظام مراسلة داخلي، وتقارير تحليلية مفصلة. النظام يدعم التقويم الهجري والميلادي.",
        coverImage: getImagePath("school-cover.jpg"),
        images: [
            getImagePath("school-1.jpg"),
            getImagePath("school-2.jpg"),
            getImagePath("school-3.jpg")
        ],
        technologies: ["Vue.js", "Laravel", "MySQL", "Bootstrap", "Chart.js", "PDF Generator"],
        projectUrl: "https://school-management-demo.com",
        githubUrl: "https://github.com/faezkhalas/school-management",
        category: "web",
        status: "completed",
        featured: false,
        order: 3,
        isActive: true
    },
    {
        name: "تطبيق الطقس الذكي",
        description: "تطبيق طقس متقدم يعرض توقعات دقيقة مع رادار الطقس المباشر وإنذارات الطقس القاسي. يتضمن خرائط تفاعلية، توقعات لمدة 10 أيام، ومؤشرات جودة الهواء. التطبيق يدعم المواقع المتعددة والتنبيهات المخصصة.",
        coverImage: getImagePath("weather-cover.jpg"),
        images: [
            getImagePath("weather-1.jpg"),
            getImagePath("weather-2.jpg")
        ],
        technologies: ["Swift", "Core Location", "WeatherAPI", "MapKit", "Core Animation"],
        projectUrl: "https://apps.apple.com/app/smart-weather-pro",
        githubUrl: "https://github.com/faezkhalas/smart-weather-ios",
        category: "mobile",
        status: "completed",
        featured: false,
        order: 4,
        isActive: true
    },
    {
        name: "منصة التعلم الإلكتروني التفاعلية",
        description: "منصة تعلم إلكتروني شاملة تدعم الفصول الافتراضية والكورسات التفاعلية. تتضمن نظام اختبارات متقدم، متابعة التقدم، وشهادات إلكترونية. المنصة تدعم البث المباشر والتسجيل التلقائي للمحاضرات.",
        coverImage: getImagePath("elearning-cover.jpg"),
        images: [
            getImagePath("elearning-1.jpg"),
            getImagePath("elearning-2.jpg")
        ],
        technologies: ["Angular", "NestJS", "PostgreSQL", "WebRTC", "Socket.io", "FFmpeg"],
        projectUrl: "https://interactive-learning-platform.com",
        githubUrl: "https://github.com/faezkhalas/interactive-learning",
        category: "web",
        status: "in-progress",
        featured: true,
        order: 5,
        isActive: true
    },
    {
        name: "تطبيق إدارة الميزانية الشخصية",
        description: "تطبيق ذكي لإدارة الميزانية الشخصية مع تتبع النفقات التلقائي وتحليل الإنفاق. يتضمن أهداف ادخارية، تنبيهات الميزانية، وتقارير مالية مفصلة. التطبيق يدعم العملات المتعددة والتصنيف الذكي للمعاملات.",
        coverImage: getImagePath("budget-cover.jpg"),
        images: [
            getImagePath("budget-1.jpg"),
            getImagePath("budget-2.jpg")
        ],
        technologies: ["Flutter", "SQLite", "Charts Flutter", "Local Authentication"],
        projectUrl: "https://smart-budget-tracker.com",
        githubUrl: "https://github.com/faezkhalas/smart-budget-flutter",
        category: "mobile",
        status: "completed",
        featured: false,
        order: 6,
        isActive: true
    },
    {
        name: "نظام إدارة المستشفيات",
        description: "نظام شامل لإدارة المستشفيات يشمل حجز المواعيد، إدارة الملفات الطبية، والصيدلية الداخلية. يتضمن نظام فوترة متقدم، تتبع المخزون الطبي، وتقارير الأداء. النظام متوافق مع معايير الخصوصية الطبية.",
        coverImage: getImagePath("hospital-cover.jpg"),
        images: [
            getImagePath("hospital-1.jpg"),
            getImagePath("hospital-2.jpg")
        ],
        technologies: ["Django", "PostgreSQL", "Docker", "Redis", "Celery", "Bootstrap 5"],
        projectUrl: "https://hospital-management-demo.com",
        githubUrl: "https://github.com/faezkhalas/hospital-management",
        category: "web",
        status: "in-progress",
        featured: false,
        order: 7,
        isActive: true
    },
    {
        name: "تطبيق الواقع المعزز للتسوق",
        description: "تطبيق ثوري يستخدم الواقع المعزز لتجربة التسوق الافتراضي. يمكن للمستخدمين تجربة المنتجات في بيئتهم الحقيقية قبل الشراء. التطبيق يدعم مسح الباركود والبحث البصري والمشاركة الاجتماعية للتجارب.",
        coverImage: getImagePath("arshopping-cover.jpg"),
        images: [
            getImagePath("arshopping-1.jpg"),
            getImagePath("arshopping-2.jpg")
        ],
        technologies: ["Unity", "ARCore", "ARKit", "C#", "Firebase", "Computer Vision"],
        projectUrl: "https://ar-shopping-experience.com",
        githubUrl: "https://github.com/faezkhalas/ar-shopping-app",
        category: "mobile",
        status: "planned",
        featured: true,
        order: 8,
        isActive: true
    },
    {
        name: "برنامج تحرير الصور المتقدم",
        description: "برنامج تحرير صور احترافي للحاسوب مع أدوات متقدمة للتعديل والفلاتر الذكية. يدعم الطبقات المتعددة، فرش مخصصة، وأدوات الذكاء الاصطناعي لتحسين الصور. البرنامج يدعم جميع صيغ الصور الشائعة ويتضمن مكتبة قوالب جاهزة.",
        coverImage: getImagePath("photoeditor-cover.jpg"),
        images: [
            getImagePath("photoeditor-1.jpg"),
            getImagePath("photoeditor-2.jpg")
        ],
        technologies: ["Electron", "Canvas API", "WebGL", "TypeScript", "Webpack"],
        projectUrl: "https://advanced-photo-editor.com",
        githubUrl: "https://github.com/faezkhalas/advanced-photo-editor",
        category: "desktop",
        status: "completed",
        featured: false,
        order: 9,
        isActive: true
    },
    {
        name: "هوية بصرية لشركة تقنية ناشئة",
        description: "تصميم هوية بصرية شاملة لشركة تقنية ناشئة تتضمن الشعار، البطاقات التجارية، وتصميم الموقع الإلكتروني. العمل يشمل دليل الهوية البصرية، قوالب العروض التقديمية، وتصاميم وسائل التواصل الاجتماعي.",
        coverImage: getImagePath("brandidentity-cover.jpg"),
        images: [
            getImagePath("brandidentity-1.jpg"),
            getImagePath("brandidentity-2.jpg"),
            getImagePath("brandidentity-3.jpg")
        ],
        technologies: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "InDesign"],
        projectUrl: "https://behance.net/gallery/brand-identity-startup",
        githubUrl: null,
        category: "design",
        status: "completed",
        featured: false,
        order: 10,
        isActive: true
    }
];

async function seedProjects() {
    try {
        console.log('🌱 بدء إضافة بيانات المشاريع التجريبية...');

        // Connect to database
        await connectDB();
        console.log('✅ تم الاتصال بقاعدة البيانات');

        // Clear existing projects (optional - comment out if you want to keep existing data)
        await Project.deleteMany({});
        console.log('🗑️ تم حذف المشاريع الموجودة');

        // Insert sample projects
        const insertedProjects = await Project.insertMany(sampleProjects);
        console.log(`✅ تم إضافة ${insertedProjects.length} مشروع بنجاح`);

        // Display summary
        console.log('\n📊 ملخص المشاريع المضافة:');
        const categorySummary = await Project.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    featured: { $sum: { $cond: ['$featured', 1, 0] } }
                }
            }
        ]);

        categorySummary.forEach(cat => {
            const categoryName = {
                web: 'مواقع ويب',
                mobile: 'تطبيقات جوال',
                desktop: 'برامج حاسوب',
                design: 'تصاميم',
                other: 'أخرى'
            };
            console.log(`   ${categoryName[cat._id]}: ${cat.count} مشروع (${cat.featured} مميز)`);
        });

        const statusSummary = await Project.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📈 حسب الحالة:');
        statusSummary.forEach(status => {
            const statusName = {
                completed: 'مكتمل',
                'in-progress': 'قيد التطوير',
                planned: 'مخطط'
            };
            console.log(`   ${statusName[status._id]}: ${status.count} مشروع`);
        });

        console.log('\n🎉 تم إنجاز عملية إضافة البيانات بنجاح!');
        console.log('\n💡 يمكنك الآن:');
        console.log('   1. اختبار API للمشاريع في Postman');
        console.log('   2. عرض المشاريع في التطبيق');
        console.log('   3. اختبار البحث والتصفية');

    } catch (error) {
        console.error('❌ خطأ في إضافة البيانات:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 تم قطع الاتصال مع قاعدة البيانات');
        process.exit(0);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌱 أداة إضافة بيانات المشاريع التجريبية

الاستخدام:
  node scripts/seedProjects.js [خيارات]

الخيارات:
  --keep-existing    الاحتفاظ بالمشاريع الموجودة
  --help, -h         عرض هذه الرسالة

أمثلة:
  node scripts/seedProjects.js
  node scripts/seedProjects.js --keep-existing
`);
    process.exit(0);
}

// Check if we should keep existing data
if (args.includes('--keep-existing')) {
    console.log('ℹ️ سيتم الاحتفاظ بالمشاريع الموجودة');
    // Modify the script to not delete existing projects
    const originalFunction = seedProjects;
    seedProjects = async function () {
        try {
            console.log('🌱 بدء إضافة بيانات المشاريع التجريبية...');

            // Connect to database
            await connectDB();
            console.log('✅ تم الاتصال بقاعدة البيانات');

            // Don't clear existing projects
            console.log('ℹ️ تم تخطي حذف المشاريع الموجودة');

            // Insert sample projects
            const insertedProjects = await Project.insertMany(sampleProjects);
            console.log(`✅ تم إضافة ${insertedProjects.length} مشروع بنجاح`);

            // Rest of the function remains the same...
            const categorySummary = await Project.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        featured: { $sum: { $cond: ['$featured', 1, 0] } }
                    }
                }
            ]);

            console.log('\n📊 ملخص جميع المشاريع:');
            categorySummary.forEach(cat => {
                const categoryName = {
                    web: 'مواقع ويب',
                    mobile: 'تطبيقات جوال',
                    desktop: 'برامج حاسوب',
                    design: 'تصاميم',
                    other: 'أخرى'
                };
                console.log(`   ${categoryName[cat._id]}: ${cat.count} مشروع (${cat.featured} مميز)`);
            });

            console.log('\n🎉 تم إنجاز عملية إضافة البيانات بنجاح!');

        } catch (error) {
            console.error('❌ خطأ في إضافة البيانات:', error);
        } finally {
            await mongoose.connection.close();
            console.log('🔌 تم قطع الاتصال مع قاعدة البيانات');
            process.exit(0);
        }
    };
}

// Run the seeding function
seedProjects(); 