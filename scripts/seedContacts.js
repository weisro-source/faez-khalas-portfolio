const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Contact = require('../src/models/Contact');
const connectDB = require('../src/config/database');

// Sample contact data with realistic Arabic content
const sampleContacts = [
    {
        name: "أحمد محمد العلي",
        email: "ahmed.ali@example.com",
        phone: "+966501234567",
        subject: "استفسار عن تطوير موقع إلكتروني",
        message: "السلام عليكم ورحمة الله وبركاته، أتمنى أن تكونوا بخير. أريد الاستفسار عن تطوير موقع إلكتروني لشركتي الناشئة في مجال التجارة الإلكترونية. نحتاج إلى موقع احترافي يدعم اللغة العربية ونظام دفع آمن. هل يمكنكم تزويدي بعرض سعر مبدئي ومدة التنفيذ المتوقعة؟",
        status: "new",
        priority: "high",
        isRead: false
    },
    {
        name: "فاطمة سالم الزهراني",
        email: "fatima.alzahrani@gmail.com",
        phone: "+966556789123",
        subject: "طلب تطوير تطبيق جوال",
        message: "مرحباً، أعمل في مجال التعليم وأريد تطوير تطبيق جوال تعليمي للأطفال. التطبيق يجب أن يكون تفاعلياً ويدعم الألعاب التعليمية. لدي فكرة واضحة عن المحتوى والتصميم المطلوب. أرجو التواصل معي لمناقشة التفاصيل والتكلفة.",
        status: "read",
        priority: "medium",
        isRead: true
    },
    {
        name: "عبدالرحمن خالد القحطاني",
        email: "abdulrahman.k@company.com",
        phone: "+966543219876",
        subject: "نظام إدارة شركة",
        message: "نحن شركة متوسطة الحجم نبحث عن نظام إدارة شامل يشمل إدارة الموظفين، المخزون، والمحاسبة. النظام يجب أن يكون قابل للتخصيص ويدعم التقارير المالية المفصلة. نفضل أن يكون النظام سحابياً مع إمكانية الوصول من الهاتف المحمول.",
        status: "replied",
        priority: "high",
        isRead: true,
        notes: "تم إرسال عرض سعر مفصل وحجز موعد للقاء"
    },
    {
        name: "نورا عبدالله الحربي",
        email: "nora.alharbi@edu.sa",
        phone: "+966598765432",
        subject: "موقع إلكتروني تعليمي",
        message: "أعمل في إحدى الجامعات وأحتاج إلى تطوير منصة تعلم إلكتروني للطلاب. المنصة يجب أن تدعم الفصول الافتراضية، رفع الواجبات، والاختبارات الإلكترونية. لدينا ميزانية محددة ونريد البدء في أقرب وقت ممكن.",
        status: "new",
        priority: "medium",
        isRead: false
    },
    {
        name: "محمد صالح العتيبي",
        email: "m.alotaibi@business.com",
        phone: "+966512345678",
        subject: "تطبيق إدارة المخزون",
        message: "لدينا مخازن متعددة ونحتاج إلى تطبيق لإدارة المخزون يدعم الباركود وتتبع المنتجات. التطبيق يجب أن يعمل على الأجهزة اللوحية ويتزامن مع النظام المحاسبي الحالي. هل لديكم خبرة في هذا المجال؟",
        status: "read",
        priority: "medium",
        isRead: true
    },
    {
        name: "سارة أحمد الشهري",
        email: "sara.alshahri@clinic.com",
        phone: "+966587654321",
        subject: "نظام إدارة عيادة طبية",
        message: "أدير عيادة طبية متخصصة وأريد نظام إدارة شامل يشمل حجز المواعيد، الملفات الطبية، والفوترة. النظام يجب أن يكون آمناً ومتوافقاً مع معايير الخصوصية الطبية في المملكة. أرجو إرسال معلومات عن خدماتكم.",
        status: "new",
        priority: "low",
        isRead: false
    },
    {
        name: "خالد عمر البقمي",
        email: "khalid.albaqami@restaurant.com",
        phone: "+966523456789",
        subject: "تطبيق توصيل طعام",
        message: "أملك سلسلة مطاعم وأريد تطبيق توصيل طعام مع نظام تتبع الطلبات ودفع إلكتروني. التطبيق يجب أن يدعم عدة مطاعم ويكون سهل الاستخدام للعملاء وسائقي التوصيل. ما هي الميزات التي يمكنكم تقديمها؟",
        status: "replied",
        priority: "high",
        isRead: true,
        notes: "عميل مهتم، تم إرسال عرض فني مفصل وعينات من التطبيقات السابقة"
    },
    {
        name: "ريم سعد الدوسري",
        email: "reem.aldosari@fashion.com",
        phone: "+966534567890",
        subject: "متجر إلكتروني للأزياء",
        message: "أعمل في مجال الأزياء وأريد إنشاء متجر إلكتروني احترافي يعرض المنتجات بشكل جميل ويدعم الدفع الآمن. المتجر يجب أن يكون متجاوباً مع الهواتف الذكية ويدعم إدارة المخزون والطلبات. كم تستغرق عملية التطوير؟",
        status: "new",
        priority: "medium",
        isRead: false
    },
    {
        name: "عبدالعزيز فهد الراشد",
        email: "abdulaziz.alrashed@construction.com",
        phone: "+966545678901",
        subject: "نظام إدارة مشاريع البناء",
        message: "شركتنا متخصصة في المقاولات والبناء. نحتاج إلى نظام إدارة مشاريع يتتبع التقدم، التكاليف، والمواد. النظام يجب أن يدعم التقارير المالية والجدولة الزمنية. هل يمكنكم تطوير نظام مخصص لاحتياجاتنا؟",
        status: "read",
        priority: "medium",
        isRead: true
    },
    {
        name: "هند ناصر الغامدي",
        email: "hind.alghamdi@beauty.com",
        phone: "+966556789012",
        subject: "تطبيق حجز مواعيد صالون",
        message: "أملك صالون تجميل وأريد تطبيق يمكن العملاء من حجز المواعيد ومشاهدة الخدمات المتاحة. التطبيق يجب أن يرسل تذكيرات وينظم جدول العمل. أفضل أن يكون التطبيق بسيطاً وسهل الاستخدام. ما هي التكلفة المتوقعة؟",
        status: "archived",
        priority: "low",
        isRead: true,
        notes: "عميل ألغى المشروع لأسباب مالية"
    }
];

async function seedContacts() {
    try {
        console.log('📧 بدء إضافة بيانات رسائل التواصل التجريبية...');

        // Connect to database
        await connectDB();
        console.log('✅ تم الاتصال بقاعدة البيانات');

        // Clear existing contacts (optional)
        await Contact.deleteMany({});
        console.log('🗑️ تم حذف الرسائل الموجودة');

        // Insert sample contacts with random dates
        const contactsWithDates = sampleContacts.map((contact, index) => {
            // Create dates spread over the last 30 days
            const daysAgo = Math.floor(Math.random() * 30);
            const createdAt = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));

            return {
                ...contact,
                createdAt,
                updatedAt: contact.status === 'new' ? createdAt : new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
            };
        });

        const insertedContacts = await Contact.insertMany(contactsWithDates);
        console.log(`✅ تم إضافة ${insertedContacts.length} رسالة بنجاح`);

        // Display summary
        console.log('\n📊 ملخص الرسائل المضافة:');

        const statusSummary = await Contact.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        statusSummary.forEach(status => {
            const statusName = {
                new: 'جديدة',
                read: 'مقروءة',
                replied: 'تم الرد',
                archived: 'مؤرشفة'
            };
            console.log(`   ${statusName[status._id]}: ${status.count} رسالة`);
        });

        const prioritySummary = await Contact.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n⭐ حسب الأولوية:');
        prioritySummary.forEach(priority => {
            const priorityName = {
                low: 'منخفضة',
                medium: 'متوسطة',
                high: 'عالية'
            };
            console.log(`   ${priorityName[priority._id]}: ${priority.count} رسالة`);
        });

        const unreadCount = await Contact.countDocuments({ isRead: false });
        console.log(`\n📬 الرسائل غير المقروءة: ${unreadCount} رسالة`);

        console.log('\n🎉 تم إنجاز عملية إضافة البيانات بنجاح!');
        console.log('\n💡 يمكنك الآن:');
        console.log('   1. اختبار API للرسائل في Postman');
        console.log('   2. عرض الرسائل في لوحة التحكم');
        console.log('   3. اختبار البحث والتصفية');
        console.log('   4. اختبار تحديث حالة الرسائل');

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
📧 أداة إضافة بيانات رسائل التواصل التجريبية

الاستخدام:
  node scripts/seedContacts.js [خيارات]

الخيارات:
  --keep-existing    الاحتفاظ بالرسائل الموجودة
  --help, -h         عرض هذه الرسالة

أمثلة:
  node scripts/seedContacts.js
  node scripts/seedContacts.js --keep-existing
`);
    process.exit(0);
}

// Check if we should keep existing data
if (args.includes('--keep-existing')) {
    console.log('ℹ️ سيتم الاحتفاظ بالرسائل الموجودة');
    // Override the function to not delete existing contacts
    const originalSeedContacts = seedContacts;
    seedContacts = async function () {
        try {
            console.log('📧 بدء إضافة بيانات رسائل التواصل التجريبية...');

            await connectDB();
            console.log('✅ تم الاتصال بقاعدة البيانات');
            console.log('ℹ️ تم تخطي حذف الرسائل الموجودة');

            const contactsWithDates = sampleContacts.map((contact, index) => {
                const daysAgo = Math.floor(Math.random() * 30);
                const createdAt = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));

                return {
                    ...contact,
                    createdAt,
                    updatedAt: contact.status === 'new' ? createdAt : new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
                };
            });

            const insertedContacts = await Contact.insertMany(contactsWithDates);
            console.log(`✅ تم إضافة ${insertedContacts.length} رسالة بنجاح`);

            const totalContacts = await Contact.countDocuments();
            console.log(`📊 إجمالي الرسائل في النظام: ${totalContacts}`);

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
seedContacts(); 