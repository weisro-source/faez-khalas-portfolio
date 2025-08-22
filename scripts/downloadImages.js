const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Sample project images from Unsplash (free to use)
const imageUrls = {
    // E-commerce project images
    ecommerce: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', // E-commerce cover
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', // Shopping cart
        'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80', // Online shopping
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'  // Mobile commerce
    ],

    // Task manager app images
    taskmanager: [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80', // Task management
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', // Mobile app UI
        'https://images.unsplash.com/photo-1611224923948-60a5e3f2d96d?w=800&q=80'  // Productivity
    ],

    // School management system
    school: [
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', // School building
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', // Students
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', // Education
        'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80'  // Online learning
    ],

    // Weather app images
    weather: [
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80', // Weather app
        'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80', // Weather forecast
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80'  // Mobile weather
    ],

    // E-learning platform
    elearning: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', // Online learning
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80', // Education platform
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80'  // Virtual classroom
    ],

    // Budget app images
    budget: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', // Finance app
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', // Budget tracking
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80'  // Financial planning
    ],

    // Hospital management
    hospital: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80', // Hospital
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80', // Medical care
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80'  // Healthcare
    ],

    // AR Shopping app
    arshopping: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // AR technology
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', // Mobile AR
        'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'  // Shopping experience
    ],

    // Photo editor
    photoeditor: [
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', // Photo editing
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Design software
        'https://images.unsplash.com/photo-1609921205586-7e8a57516512?w=800&q=80'  // Creative tools
    ],

    // Brand identity design
    brandidentity: [
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', // Brand design
        'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80', // Logo design
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80', // Design process
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80'  // Visual identity
    ]
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        console.log(`📥 تحميل: ${path.basename(filepath)}`);

        const protocol = url.startsWith('https:') ? https : http;

        const file = fs.createWriteStream(filepath);

        protocol.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    console.log(`✅ تم تحميل: ${path.basename(filepath)}`);
                    resolve();
                });

                file.on('error', (err) => {
                    fs.unlink(filepath, () => { }); // Delete the file on error
                    reject(err);
                });
            } else {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function downloadAllImages() {
    console.log('🖼️ بدء تحميل الصور الحقيقية للمشاريع...');
    console.log('='.repeat(50));

    let totalDownloaded = 0;
    let totalErrors = 0;

    try {
        for (const [projectType, urls] of Object.entries(imageUrls)) {
            console.log(`\n📁 تحميل صور ${projectType}:`);
            console.log('-'.repeat(30));

            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                const filename = `${projectType}-${i === 0 ? 'cover' : i}.jpg`;
                const filepath = path.join(uploadsDir, filename);

                try {
                    // Check if file already exists
                    if (fs.existsSync(filepath)) {
                        console.log(`ℹ️ موجود بالفعل: ${filename}`);
                        continue;
                    }

                    await downloadImage(url, filepath);
                    totalDownloaded++;

                    // Add a small delay to be respectful to the server
                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (error) {
                    console.error(`❌ خطأ في تحميل ${filename}:`, error.message);
                    totalErrors++;
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 ملخص التحميل:');
        console.log('='.repeat(50));
        console.log(`✅ تم تحميل: ${totalDownloaded} صورة`);
        console.log(`❌ أخطاء: ${totalErrors} صورة`);
        console.log(`📁 المجلد: ${uploadsDir}`);

        // List downloaded files
        const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.jpg'));
        console.log(`\n📋 الملفات المحملة (${files.length}):`);
        files.forEach(file => {
            const stats = fs.statSync(path.join(uploadsDir, file));
            const sizeKB = Math.round(stats.size / 1024);
            console.log(`   ${file} (${sizeKB} KB)`);
        });

        console.log('\n🎉 تم إنجاز تحميل الصور بنجاح!');
        console.log('\n💡 الخطوات التالية:');
        console.log('   1. شغل سكريبت المشاريع: npm run seed:projects');
        console.log('   2. أو شغل السكريبت الشامل: npm run seed');
        console.log('   3. ستستخدم المشاريع الصور الحقيقية تلقائياً');

    } catch (error) {
        console.error('❌ خطأ عام في التحميل:', error);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🖼️ أداة تحميل الصور الحقيقية للمشاريع

الاستخدام:
  node scripts/downloadImages.js [خيارات]

الخيارات:
  --help, -h         عرض هذه الرسالة

الوصف:
  تقوم بتحميل صور حقيقية من Unsplash لجميع المشاريع التجريبية.
  الصور مجانية الاستخدام ومناسبة للمحتوى.

المشاريع المدعومة:
  - منصة التجارة الإلكترونية (4 صور)
  - تطبيق إدارة المهام (3 صور)  
  - نظام إدارة المدارس (4 صور)
  - تطبيق الطقس (3 صور)
  - منصة التعلم الإلكتروني (3 صور)
  - تطبيق الميزانية (3 صور)
  - نظام إدارة المستشفيات (3 صور)
  - تطبيق الواقع المعزز (3 صور)
  - برنامج تحرير الصور (3 صور)
  - هوية بصرية (4 صور)

المجلد الهدف: uploads/

أمثلة:
  node scripts/downloadImages.js
`);
    process.exit(0);
}

// Check internet connection
console.log('🌐 فحص الاتصال بالإنترنت...');
require('https').get('https://www.google.com', (res) => {
    console.log('✅ الاتصال متاح، بدء التحميل...\n');
    downloadAllImages();
}).on('error', (err) => {
    console.error('❌ لا يوجد اتصال بالإنترنت:', err.message);
    console.log('💡 تأكد من الاتصال بالإنترنت وحاول مرة أخرى.');
    process.exit(1);
}); 