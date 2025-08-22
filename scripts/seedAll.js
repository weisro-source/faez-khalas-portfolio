const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Project = require('../src/models/Project');
const Contact = require('../src/models/Contact');
const Admin = require('../src/models/Admin');
const connectDB = require('../src/config/database');
const bcrypt = require('bcrypt');

// Import data from other seed files
const { spawn } = require('child_process');
const path = require('path');

async function seedAll() {
    try {
        console.log('🌱 بدء إضافة جميع البيانات التجريبية...');
        console.log('='.repeat(50));

        // Connect to database
        await connectDB();
        console.log('✅ تم الاتصال بقاعدة البيانات');

        // Check if admin exists
        const adminExists = await Admin.findOne();
        if (!adminExists) {
            console.log('\n👤 إنشاء حساب المشرف...');
            const hashedPassword = await bcrypt.hash('admin123456', 12);

            const admin = new Admin({
                name: 'فائز خلاص',
                email: 'admin@faez-khalas.com',
                password: hashedPassword
            });

            await admin.save();
            console.log('✅ تم إنشاء حساب المشرف');
            console.log('📧 البريد الإلكتروني: admin@faez-khalas.com');
            console.log('🔑 كلمة المرور: admin123456');
        } else {
            console.log('ℹ️ حساب المشرف موجود بالفعل');
        }

        console.log('\n🖼️ تحميل الصور الحقيقية...');
        console.log('-'.repeat(30));

        // Download images first
        await new Promise((resolve, reject) => {
            const imageScript = spawn('node', [path.join(__dirname, 'downloadImages.js')], {
                stdio: 'inherit'
            });

            imageScript.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    console.log('⚠️ تحذير: فشل تحميل الصور، سيتم استخدام أسماء افتراضية');
                    resolve(); // Continue even if image download fails
                }
            });
        });

        console.log('\n📁 إضافة المشاريع...');
        console.log('-'.repeat(30));

        // Run projects seeding
        await new Promise((resolve, reject) => {
            const projectScript = spawn('node', [path.join(__dirname, 'seedProjects.js')], {
                stdio: 'inherit'
            });

            projectScript.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Projects seeding failed with code ${code}`));
                }
            });
        });

        console.log('\n📧 إضافة رسائل التواصل...');
        console.log('-'.repeat(30));

        // Run contacts seeding
        await new Promise((resolve, reject) => {
            const contactScript = spawn('node', [path.join(__dirname, 'seedContacts.js')], {
                stdio: 'inherit'
            });

            contactScript.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Contacts seeding failed with code ${code}`));
                }
            });
        });

        // Final summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 ملخص شامل للبيانات المضافة');
        console.log('='.repeat(50));

        const projectsCount = await Project.countDocuments();
        const contactsCount = await Contact.countDocuments();
        const adminsCount = await Admin.countDocuments();

        console.log(`👤 المديرون: ${adminsCount}`);
        console.log(`📁 المشاريع: ${projectsCount}`);
        console.log(`📧 الرسائل: ${contactsCount}`);

        // Featured projects
        const featuredProjects = await Project.countDocuments({ featured: true });
        console.log(`⭐ المشاريع المميزة: ${featuredProjects}`);

        // Unread messages
        const unreadMessages = await Contact.countDocuments({ isRead: false });
        console.log(`📬 الرسائل غير المقروءة: ${unreadMessages}`);

        console.log('\n🎉 تم إنجاز جميع العمليات بنجاح!');
        console.log('\n💡 الخطوات التالية:');
        console.log('   1. شغل الخادم: npm run dev');
        console.log('   2. اختبر تسجيل الدخول في Postman');
        console.log('   3. استكشف APIs المختلفة');
        console.log('   4. اختبر البحث والتصفية');

        console.log('\n🔗 روابط مفيدة:');
        console.log('   📖 Postman Collection: Faez_Khalas_Portfolio_API.postman_collection.json');
        console.log('   📚 API Documentation: API_INSTRUCTIONS.md');
        console.log('   🚀 Quick Start Guide: QUICK_START.md');

    } catch (error) {
        console.error('❌ خطأ في إضافة البيانات:', error);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 تم قطع الاتصال مع قاعدة البيانات');
        process.exit(0);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌱 أداة إضافة جميع البيانات التجريبية

الاستخدام:
  node scripts/seedAll.js [خيارات]

الخيارات:
  --help, -h         عرض هذه الرسالة

الوصف:
  تقوم هذه الأداة بإضافة:
  - حساب المشرف الافتراضي
  - 10 مشاريع متنوعة
  - 10 رسائل تواصل عينة

البيانات المضافة:
  👤 المشرف:
     البريد: admin@faez-khalas.com
     كلمة المرور: admin123456

  📁 المشاريع:
     - مواقع ويب (4 مشاريع)
     - تطبيقات جوال (4 مشاريع)
     - برامج حاسوب (1 مشروع)
     - تصاميم (1 مشروع)

  📧 الرسائل:
     - رسائل جديدة وقديمة
     - أولويات مختلفة
     - حالات متنوعة

أمثلة:
  node scripts/seedAll.js
`);
    process.exit(0);
}

console.log(`
🌱 مرحباً بك في أداة إضافة البيانات التجريبية الشاملة

📋 سيتم إضافة:
   👤 حساب المشرف (إذا لم يكن موجوداً)
   📁 10 مشاريع متنوعة ومتقنة
   📧 10 رسائل تواصل واقعية

⚠️  تحذير: سيتم حذف جميع البيانات الموجودة!

⏱️  المدة المتوقعة: 10-15 ثانية

🚀 بدء العملية...
`);

// Small delay for dramatic effect
setTimeout(() => {
    seedAll();
}, 2000); 