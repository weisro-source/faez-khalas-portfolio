# 🚀 البدء السريع - Faez Khalas Portfolio API

## خطوات التشغيل (5 دقائق)

### 1️⃣ تثبيت المعتمدات

```bash
npm install
```

### 2️⃣ إعداد البيئة

```bash
# نسخ ملف البيئة
cp env.example .env

# تحديث متغيرات البيئة (اختياري للتطوير)
# العقدة .env وغير المتغيرات حسب الحاجة
```

### 3️⃣ تشغيل قاعدة البيانات

```bash
# تأكد من تشغيل MongoDB على جهازك
# أو استخدم MongoDB Atlas (سحابي)

# إذا كان لديك Docker
docker run -d -p 27017:27017 --name mongodb mongo

# أو استخدم MongoDB Compass أو أي أداة إدارة
```

### 4️⃣ تشغيل الخادم

```bash
# للتطوير
npm run dev

# أو للإنتاج
npm start
```

### 5️⃣ إنشاء حساب المشرف

```bash
# باستخدام curl
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "فائز خلاص",
    "email": "admin@example.com",
    "password": "admin123456"
  }'

# أو باستخدام Postman/Insomnia
# POST: http://localhost:5000/api/auth/setup
```

---

## ✅ اختبار سريع

### تحقق من حالة الخادم

```bash
curl http://localhost:5000/api/health
```

### تسجيل دخول المشرف

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

### إرسال رسالة تجريبية

```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد تجريبي",
    "email": "test@example.com",
    "phone": "+966501234567",
    "message": "رسالة تجريبية للاختبار"
  }'
```

---

## 📁 هيكل سريع للمشروع

```
src/
├── app.js              # نقطة البداية
├── models/             # نماذج قاعدة البيانات
├── routes/             # مسارات API
├── controllers/        # منطق العمليات
├── middleware/         # الوسطاء (المصادقة، التحقق، إلخ)
└── config/             # إعدادات قاعدة البيانات
```

---

## 🔗 المسارات الأساسية

| المسار                 | الوصف              | نوع الوصول |
| ---------------------- | ------------------ | ---------- |
| `POST /api/auth/setup` | إنشاء المشرف الأول | عام        |
| `POST /api/auth/login` | تسجيل دخول المشرف  | عام        |
| `GET /api/projects`    | جلب المشاريع       | عام        |
| `POST /api/projects`   | إضافة مشروع        | محمي       |
| `POST /api/contacts`   | إرسال رسالة        | عام        |
| `GET /api/contacts`    | عرض الرسائل        | محمي       |

---

## 🛠️ أدوات مفيدة للتطوير

### Postman Collection

```json
{
  "info": { "name": "Faez Khalas API" },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:5000" },
    { "key": "token", "value": "{{auth_token}}" }
  ]
}
```

### VS Code Extensions المقترحة

- REST Client
- MongoDB for VS Code
- Postman
- Thunder Client

---

## 🚨 مشاكل شائعة وحلولها

### الخطأ: "Cannot connect to MongoDB"

```bash
# تأكد من تشغيل MongoDB
mongod --version

# أو تحديث رابط قاعدة البيانات في .env
MONGODB_URI=mongodb://localhost:27017/faez-khalas-portfolio
```

### الخطأ: "Port 5000 is already in use"

```bash
# غير المنفذ في .env
PORT=3001

# أو أوقف العملية التي تستخدم المنفذ
lsof -ti:5000 | xargs kill -9
```

### الخطأ: "JWT must be provided"

```bash
# تأكد من إرسال التوكن في الطلبات المحمية
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📊 بيانات تجريبية سريعة

### مشروع تجريبي

```javascript
const projectData = {
  name: "موقع إلكتروني تجريبي",
  description: "موقع تجريبي لاختبار النظام",
  category: "web",
  technologies: ["HTML", "CSS", "JavaScript"],
  featured: true,
};
```

### رسالة تجريبية

```javascript
const contactData = {
  name: "عميل تجريبي",
  email: "client@test.com",
  phone: "+966500000000",
  message: "رسالة تجريبية للاختبار",
};
```

---

## 🎯 الخطوات التالية

1. **اقرأ `README.md`** للتفاصيل الكاملة
2. **اطلع على `API_INSTRUCTIONS.md`** لأمثلة شاملة
3. **ابدأ بتطوير الواجهة الأمامية** باستخدام React/Vue/Angular
4. **اربط الواجهة بـ API** باستخدام fetch أو axios
5. **انشر المشروع** على Heroku أو Vercel أو AWS

---

## 📞 الدعم

- **الوثائق الكاملة**: `README.md`
- **أمثلة API**: `API_INSTRUCTIONS.md`
- **المشاكل**: افتح Issue في GitHub

**🎉 مبروك! API جاهز للاستخدام الآن!**
