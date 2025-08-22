# Faez Khalas Portfolio API

## المقدمة

API شامل لإدارة موقع تعريفي يتيح للمشرف إضافة مشاريع لمعرض الأعمال وإدارة طلبات المراسلة من الزوار.

## الميزات الرئيسية

### 🚀 إدارة المشاريع

- إضافة مشاريع جديدة مع صور وأوصاف
- تحديث وحذف المشاريع
- رفع صور متعددة لكل مشروع (صورة غلاف + معرض صور)
- تصنيف المشاريع (web, mobile, desktop, design, other)
- ترتيب المشاريع وتمييزها كمشاريع مختارة
- البحث والتصفية

### 📧 إدارة طلبات المراسلة

- استقبال رسائل الزوار
- تتبع حالة الرسائل (جديدة، مقروءة، تم الرد، مؤرشفة)
- إحصائيات شاملة
- البحث في الرسائل
- تسجيل معلومات إضافية (IP، User Agent)

### 🔐 نظام إدارة آمن

- مصادقة JWT للمشرف
- حماية من محاولات الدخول الفاشلة
- تشفير كلمات المرور
- تقييد الوصول للمسارات المحمية

### 📁 إدارة الملفات

- رفع وإدارة الصور
- تنظيم الملفات في مجلدات منفصلة
- التحقق من نوع وحجم الملفات
- حذف الملفات عند حذف المشاريع
- **إرجاع الصور مع Base URL**: جميع مسارات الصور ترجع مع الرابط الكامل

## التقنيات المستخدمة

- **Node.js** - بيئة تشغيل
- **Express.js** - إطار عمل الويب
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT** - المصادقة
- **Multer** - رفع الملفات
- **bcrypt** - تشفير كلمات المرور
- **express-validator** - التحقق من البيانات

## التثبيت والإعداد

### 1. استنساخ المشروع

```bash
git clone [repository-url]
cd faez-khalas-api
```

### 2. تثبيت المعتمدات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

انسخ ملف `env.example` إلى `.env` وقم بتحديث القيم:

```bash
cp env.example .env
```

```env
# Database
MONGODB_URI=mongodb://localhost:27017/faez-khalas-portfolio

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# File upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. إضافة البيانات التجريبية (اختياري) 🌱

```bash
# إضافة جميع البيانات (صور + مشاريع + رسائل + حساب مشرف)
npm run seed

# أو إضافة كل نوع منفصل
npm run seed:images    # الصور الحقيقية
npm run seed:projects  # المشاريع فقط
npm run seed:contacts  # الرسائل فقط
```

**بيانات تسجيل الدخول:**

- البريد الإلكتروني: `admin@faez-khalas.com`
- كلمة المرور: `admin123456`

### 5. تشغيل المشروع

#### في بيئة التطوير:

```bash
npm run dev
```

#### في بيئة الإنتاج:

```bash
npm start
```

## مثال على الاستجابة مع الصور 📷

```json
{
  "status": "success",
  "data": {
    "project": {
      "_id": "655d1f2e8b9c4d1234567890",
      "name": "منصة التجارة الإلكترونية الذكية",
      "coverImage": "http://localhost:5000/uploads/ecommerce-cover.jpg",
      "images": [
        "http://localhost:5000/uploads/ecommerce-1.jpg",
        "http://localhost:5000/uploads/ecommerce-2.jpg"
      ],
      "technologies": ["React", "Node.js", "MongoDB"]
    }
  }
}
```

> **ملاحظة**: جميع مسارات الصور ترجع مع Base URL الكامل تلقائياً

## API Endpoints

### 🔐 المصادقة (`/api/auth`)

- `POST /login` - تسجيل دخول المشرف
- `POST /setup` - إنشاء حساب المشرف الأول
- `GET /me` - معلومات المشرف الحالي (محمي)
- `PATCH /profile` - تحديث ملف المشرف (محمي)
- `PATCH /change-password` - تغيير كلمة المرور (محمي)

### 📁 المشاريع (`/api/projects`)

#### العامة (للزوار):

- `GET /` - جلب جميع المشاريع
- `GET /featured` - جلب المشاريع المميزة
- `GET /category/:category` - جلب المشاريع بفئة معينة
- `GET /search` - البحث في المشاريع
- `GET /:id` - جلب مشروع واحد

#### المحمية (للمشرف):

- `POST /` - إضافة مشروع جديد
- `PUT /:id` - تحديث مشروع
- `DELETE /:id` - حذف مشروع
- `PATCH /:id/order` - تحديث ترتيب المشروع
- `PATCH /:id/status` - تفعيل/إلغاء تفعيل المشروع

### 📧 طلبات المراسلة (`/api/contacts`)

#### العامة:

- `POST /` - إرسال رسالة جديدة

#### المحمية (للمشرف):

- `GET /` - جلب جميع الرسائل
- `GET /stats` - إحصائيات الرسائل
- `GET /unread` - الرسائل غير المقروءة
- `GET /search` - البحث في الرسائل
- `GET /:id` - جلب رسالة واحدة
- `PATCH /:id/status` - تحديث حالة الرسالة
- `PATCH /:id/read` - تحديد كمقروءة
- `PATCH /:id/unread` - تحديد كغير مقروءة
- `DELETE /:id` - حذف رسالة

### 📤 رفع الملفات (`/api/upload`)

- `POST /image` - رفع صورة واحدة (محمي)
- `DELETE /image` - حذف صورة (محمي)

## أمثلة على الاستخدام

### إنشاء حساب المشرف الأول

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "فائز خلاص",
    "email": "admin@example.com",
    "password": "securepassword123"
  }'
```

### تسجيل دخول المشرف

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123"
  }'
```

### إضافة مشروع جديد

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=موقع إلكتروني" \
  -F "description=موقع إلكتروني تفاعلي باستخدام React" \
  -F "category=web" \
  -F "technologies=[\"React\", \"Node.js\", \"MongoDB\"]" \
  -F "coverImage=@/path/to/cover.jpg" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### إرسال رسالة تواصل

```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "message": "مرحباً، أرغب في التواصل معك بخصوص مشروع.",
    "subject": "استفسار عن مشروع"
  }'
```

## هيكل المشروع

```
faez-khalas-api/
├── src/
│   ├── app.js                 # ملف التطبيق الرئيسي
│   ├── config/
│   │   └── database.js        # إعداد قاعدة البيانات
│   ├── models/
│   │   ├── Project.js         # نموذج المشاريع
│   │   ├── Contact.js         # نموذج طلبات المراسلة
│   │   └── Admin.js           # نموذج المشرف
│   ├── middleware/
│   │   ├── auth.js            # المصادقة والتفويض
│   │   ├── upload.js          # رفع الملفات
│   │   ├── validators.js      # التحقق من البيانات
│   │   └── errorHandler.js    # معالجة الأخطاء
│   ├── routes/
│   │   ├── projects.js        # مسارات المشاريع
│   │   ├── contacts.js        # مسارات طلبات المراسلة
│   │   ├── auth.js           # مسارات المصادقة
│   │   └── upload.js         # مسارات رفع الملفات
│   └── controllers/
│       ├── projectController.js    # متحكم المشاريع
│       ├── contactController.js    # متحكم طلبات المراسلة
│       ├── authController.js       # متحكم المصادقة
│       └── uploadController.js     # متحكم رفع الملفات
├── uploads/                   # مجلد الملفات المرفوعة
├── package.json
├── env.example               # نموذج متغيرات البيئة
└── README.md
```

## الأمان

### الممارسات المطبقة:

- تشفير كلمات المرور باستخدام bcrypt
- مصادقة JWT للوصول للمسارات المحمية
- التحقق من البيانات المدخلة
- حماية من محاولات الدخول الفاشلة
- تحديد معدل الطلبات (Rate Limiting)
- استخدام Helmet لحماية HTTP Headers
- التحقق من نوع وحجم الملفات المرفوعة

### توصيات للإنتاج:

- استخدم HTTPS دائماً
- قم بتحديث JWT_SECRET إلى قيمة عشوائية قوية
- استخدم قاعدة بيانات MongoDB مؤمنة
- قم بتفعيل firewall وقيود الشبكة
- راقب السجلات والأنشطة المشبوهة

## المساهمة

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يرجى فتح [issue](../../issues) في المستودع.
