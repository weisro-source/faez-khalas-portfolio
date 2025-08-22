const { getFullImageUrl, transformProjectImages } = require('./src/utils/imageUtils');

// Test the transformation function directly
console.log('🧪 اختبار دالة تحويل الصور');
console.log('='.repeat(40));

const testProject = {
    _id: 'test123',
    name: 'مشروع تجريبي',
    coverImage: '/uploads/test-cover.jpg',
    images: ['/uploads/test-1.jpg', '/uploads/test-2.jpg']
};

const baseUrl = 'http://localhost:5000';

console.log('📝 المشروع الأصلي:');
console.log('صورة الغلاف:', testProject.coverImage);
console.log('الصور:', testProject.images);

console.log('\n🔄 بعد التحويل:');
const transformed = transformProjectImages(testProject, baseUrl);
console.log('صورة الغلاف:', transformed.coverImage);
console.log('الصور:', transformed.images);

console.log('\n✅ اختبار دالة getFullImageUrl:');
console.log('تحويل مسار واحد:', getFullImageUrl('/uploads/test.jpg', baseUrl));
console.log('تحويل مسار بدون /:', getFullImageUrl('uploads/test.jpg', baseUrl));
console.log('مسار كامل URL:', getFullImageUrl('https://example.com/image.jpg', baseUrl));
console.log('مسار فارغ:', getFullImageUrl(null, baseUrl)); 