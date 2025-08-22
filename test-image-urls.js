// Test script to verify image URLs are returned with base URL
const axios = require('axios');

const baseUrl = 'http://localhost:5000'; // Change to your server URL

async function testImageUrls() {
    console.log('🧪 اختبار إرجاع الصور مع Base URL');
    console.log('='.repeat(50));

    try {
        // Test 1: Get all projects
        console.log('\n1️⃣ اختبار جلب جميع المشاريع:');
        const allProjectsResponse = await axios.get(`${baseUrl}/api/projects`);

        if (allProjectsResponse.data.data.projects.length > 0) {
            const firstProject = allProjectsResponse.data.data.projects[0];
            console.log(`✅ صورة الغلاف: ${firstProject.coverImage}`);
            console.log(`✅ الصور: ${firstProject.images.join(', ')}`);

            // Check if URLs include base URL
            const hasBaseUrl = firstProject.coverImage.includes(baseUrl);
            console.log(hasBaseUrl ? '✅ يحتوي على Base URL' : '❌ لا يحتوي على Base URL');
        } else {
            console.log('⚠️ لا توجد مشاريع');
        }

        // Test 2: Get featured projects
        console.log('\n2️⃣ اختبار المشاريع المميزة:');
        const featuredResponse = await axios.get(`${baseUrl}/api/projects/featured`);

        if (featuredResponse.data.data.projects.length > 0) {
            const featuredProject = featuredResponse.data.data.projects[0];
            console.log(`✅ صورة مميزة: ${featuredProject.coverImage}`);

            const hasBaseUrl = featuredProject.coverImage.includes(baseUrl);
            console.log(hasBaseUrl ? '✅ يحتوي على Base URL' : '❌ لا يحتوي على Base URL');
        } else {
            console.log('⚠️ لا توجد مشاريع مميزة');
        }

        // Test 3: Get single project (if any exists)
        console.log('\n3️⃣ اختبار مشروع واحد:');
        if (allProjectsResponse.data.data.projects.length > 0) {
            const projectId = allProjectsResponse.data.data.projects[0]._id;
            const singleProjectResponse = await axios.get(`${baseUrl}/api/projects/${projectId}`);

            const project = singleProjectResponse.data.data.project;
            console.log(`✅ صورة المشروع: ${project.coverImage}`);
            console.log(`✅ عدد الصور: ${project.images.length}`);

            const hasBaseUrl = project.coverImage.includes(baseUrl);
            console.log(hasBaseUrl ? '✅ يحتوي على Base URL' : '❌ لا يحتوي على Base URL');
        }

        // Test 4: Search projects
        console.log('\n4️⃣ اختبار البحث:');
        const searchResponse = await axios.get(`${baseUrl}/api/projects/search?q=تطبيق`);

        if (searchResponse.data.data.projects.length > 0) {
            const searchProject = searchResponse.data.data.projects[0];
            console.log(`✅ نتيجة البحث: ${searchProject.name}`);
            console.log(`✅ صورة النتيجة: ${searchProject.coverImage}`);

            const hasBaseUrl = searchProject.coverImage.includes(baseUrl);
            console.log(hasBaseUrl ? '✅ يحتوي على Base URL' : '❌ لا يحتوي على Base URL');
        } else {
            console.log('⚠️ لا توجد نتائج بحث');
        }

        console.log('\n🎉 انتهى الاختبار بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('💡 تأكد من تشغيل الخادم على المنفذ 5000');
            console.log('💡 شغل الأمر: npm run dev');
        }
    }
}

// Run the test
testImageUrls(); 