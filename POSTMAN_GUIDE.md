# 📮 دليل استخدام Postman Collection - Faez Khalas Portfolio API

## 🚀 كيفية الاستيراد والاستخدام

### 1. استيراد الـ Collection

#### الطريقة الأولى: من الملف

1. افتح Postman
2. اضغط على "Import" في الزاوية العلوية اليسرى
3. اختر "Upload Files"
4. حدد ملف `Faez_Khalas_Portfolio_API.postman_collection.json`
5. اضغط "Import"

#### الطريقة الثانية: من Raw Data

1. افتح Postman
2. اضغط على "Import"
3. اختر "Raw text"
4. انسخ محتوى ملف JSON والصقه
5. اضغط "Continue" ثم "Import"

### 2. إعداد المتغيرات

بعد الاستيراد، ستجد متغيرات Collection التالية:

- `base_url`: `http://localhost:5000` (غيرها حسب عنوان خادمك)
- `auth_token`: فارغ (سيتم تعبئته تلقائياً عند تسجيل الدخول)

#### تعديل المتغيرات:

1. اضغط على Collection name في الشريط الجانبي
2. اختر "Variables" tab
3. عدل قيم المتغيرات حسب بيئتك

---

## 📋 خطوات الاستخدام التدريجي

### الخطوة 1: إنشاء المشرف الأول

```
📁 Authentication > Setup First Admin
```

- سيتم حفظ الـ token تلقائياً في متغير `auth_token`
- يعمل فقط إذا لم يوجد مشرف مسبقاً

### الخطوة 2: تسجيل الدخول (إذا كان المشرف موجود)

```
📁 Authentication > Login Admin
```

- سيتم حفظ الـ token تلقائياً

### الخطوة 3: إرسال رسالة تجريبية

```
📁 Contacts > Public Endpoints > Send Contact Message
```

- سيتم حفظ معرف الرسالة في `contact_id`

### الخطوة 4: إنشاء مشروع

```
📁 Projects > Admin Endpoints > Create Project
```

- تحتاج إلى رفع ملفات صور
- سيتم حفظ معرف المشروع في `project_id`

---

## 🗂️ هيكل الـ Collection

### 🔐 Authentication

- **Setup First Admin**: إنشاء حساب المشرف الأول
- **Login Admin**: تسجيل دخول المشرف
- **Get Admin Profile**: جلب معلومات المشرف
- **Update Admin Profile**: تحديث معلومات المشرف
- **Change Password**: تغيير كلمة المرور

### 📁 Projects

#### 📖 Public Endpoints (للزوار)

- **Get All Projects**: جلب جميع المشاريع مع تصفية
- **Get Featured Projects**: المشاريع المميزة
- **Get Projects by Category**: مشاريع حسب الفئة
- **Search Projects**: البحث في المشاريع
- **Get Single Project**: جلب مشروع واحد

#### 🔒 Admin Endpoints (للمشرف)

- **Create Project**: إنشاء مشروع جديد
- **Update Project**: تحديث مشروع
- **Delete Project**: حذف مشروع
- **Update Project Order**: تحديث ترتيب المشروع
- **Toggle Project Status**: تفعيل/إلغاء تفعيل

### 📧 Contacts

#### 📖 Public Endpoints

- **Send Contact Message**: إرسال رسالة تواصل

#### 🔒 Admin Endpoints

- **Get All Contacts**: جلب جميع الرسائل
- **Get Contact Stats**: إحصائيات الرسائل
- **Get Unread Contacts**: الرسائل غير المقروءة
- **Search Contacts**: البحث في الرسائل
- **Get Single Contact**: جلب رسالة واحدة
- **Update Contact Status**: تحديث حالة الرسالة
- **Mark as Read/Unread**: تحديد كمقروءة/غير مقروءة
- **Delete Contact**: حذف رسالة

### 📤 File Upload

- **Upload Single Image**: رفع صورة واحدة
- **Delete Image**: حذف صورة

### 🔍 System

- **Health Check**: فحص حالة الخادم

---

## ⚡ الميزات الذكية في الـ Collection

### 🔄 حفظ التوكن تلقائياً

```javascript
// في Scripts > Test لـ Login و Setup
if (pm.response.code === 200 || pm.response.code === 201) {
  const response = pm.response.json();
  pm.collectionVariables.set("auth_token", response.token);
}
```

### 🆔 حفظ المعرفات

- `project_id`: يتم حفظه عند إنشاء مشروع
- `contact_id`: يتم حفظه عند إرسال رسالة

### 🔓 مصادقة تلقائية

جميع المسارات المحمية تستخدم الـ Bearer Token تلقائياً

---

## 🎯 أمثلة سيناريوهات شائعة

### إنشاء مشروع كامل

1. `Authentication > Login Admin`
2. `File Upload > Upload Single Image` (للغلاف)
3. `File Upload > Upload Single Image` (للصور إضافية)
4. `Projects > Create Project` (مع الصور المرفوعة)

### إدارة الرسائل

1. `Contacts > Get Unread Contacts`
2. `Contacts > Get Single Contact` (سيصبح مقروء)
3. `Contacts > Update Contact Status` (تغيير لـ "replied")

### البحث والتصفية

1. `Projects > Search Projects` (البحث بكلمة مفتاحية)
2. `Projects > Get Projects by Category` (تصفية بالفئة)
3. `Contacts > Search Contacts` (البحث في الرسائل)

---

## 🔧 نصائح للاستخدام

### 1. استخدام البيئات (Environments)

أنشئ بيئات مختلفة:

```json
{
  "name": "Development",
  "values": [
    { "key": "base_url", "value": "http://localhost:5000" },
    { "key": "auth_token", "value": "" }
  ]
}
```

```json
{
  "name": "Production",
  "values": [
    { "key": "base_url", "value": "https://api.faez-khalas.com" },
    { "key": "auth_token", "value": "" }
  ]
}
```

### 2. تشغيل Collection كاملة

1. Right-click على Collection name
2. اختر "Run collection"
3. حدد المسارات المطلوبة
4. اضغط "Run"

### 3. تصدير النتائج

- اضغط على "Export" لحفظ الـ Collection
- استخدم "Generate Code" لكود بلغات مختلفة

### 4. مشاركة Collection

- اضغط على "Share" للحصول على رابط مشاركة
- أو صدر ملف JSON للمشاركة

---

## 🚨 نصائح للتشخيص

### إذا لم يعمل الـ Authentication:

1. تأكد من صحة `base_url`
2. تحقق من إعداد الخادم والمنفذ
3. راجع رسالة الخطأ في Response

### إذا لم يتم حفظ الـ Token:

1. تحقق من Scripts > Test في مسار Login
2. تأكد من نجاح الاستجابة (200/201)
3. راجع Collection Variables

### لتسريع التطوير:

1. استخدم Pre-request Scripts لإعدادات إضافية
2. استخدم Tests للتحقق التلقائي
3. احفظ الاستجابات كـ Examples

---

## 📝 إضافة مسارات جديدة

### لإضافة endpoint جديد:

1. Right-click على المجلد المناسب
2. اختر "Add request"
3. أعط اسماً وصفياً
4. أضف الـ URL والمعاملات
5. أضف Body إذا كان مطلوباً
6. أضف Tests إذا كان مناسباً

### لتنظيم أفضل:

- استخدم مجلدات فرعية
- أضف وصف لكل request
- استخدم متغيرات لتجنب التكرار

---

## 🎉 الخلاصة

هذا الـ Postman Collection يوفر:

✅ **اختبار شامل** لجميع endpoints  
✅ **أتمتة التوكن** والمصادقة  
✅ **أمثلة واقعية** للبيانات  
✅ **تنظيم منطقي** للمسارات  
✅ **نصوص اختبار** تلقائية

**استخدم هذا Collection كنقطة انطلاق لتطوير واختبار API بسهولة وكفاءة!** 🚀
