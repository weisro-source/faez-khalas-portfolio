# دليل استخدام API - Faez Khalas Portfolio

## الخطوات الأولى

### 1. تشغيل المشروع

```bash
# تثبيت المعتمدات
npm install

# نسخ ملف البيئة
cp env.example .env

# تحديث متغيرات البيئة في ملف .env
# ثم تشغيل المشروع
npm run dev
```

### 2. إنشاء حساب المشرف الأول

**ضروري جداً**: يجب إنشاء حساب المشرف قبل البدء في استخدام النظام.

```bash
POST /api/auth/setup
Content-Type: application/json

{
  "name": "فائز خلاص",
  "email": "admin@faez-khalas.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "تم إنشاء حساب المشرف بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "admin": {
      "_id": "64f7...",
      "name": "فائز خلاص",
      "email": "admin@faez-khalas.com",
      "role": "super-admin"
    }
  }
}
```

### 3. تسجيل الدخول

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@faez-khalas.com",
  "password": "securepassword123"
}
```

**احفظ الـ Token** - ستحتاجه لجميع العمليات الإدارية!

---

## إدارة المشاريع

### إضافة مشروع جديد

```bash
POST /api/projects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

# البيانات المطلوبة:
name: "موقع التجارة الإلكترونية"
description: "موقع متكامل للتجارة الإلكترونية مع لوحة تحكم للإدارة"
category: "web"
status: "completed"
featured: true
technologies: ["React", "Node.js", "MongoDB", "Stripe"]
projectUrl: "https://demo-ecommerce.com"
githubUrl: "https://github.com/username/ecommerce-project"
coverImage: [ملف الصورة]
images: [ملفات الصور - حتى 8 صور]
```

### جلب المشاريع (عام - للموقع)

```bash
# جميع المشاريع مع التصفح
GET /api/projects?page=1&limit=10&sort=-createdAt

# المشاريع المميزة
GET /api/projects/featured

# مشاريع بفئة معينة
GET /api/projects/category/web

# البحث في المشاريع
GET /api/projects/search?q=react&page=1&limit=5
```

### تحديث مشروع

```bash
PUT /api/projects/:projectId
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

# يمكن إرسال البيانات المراد تحديثها فقط
name: "اسم محدث للمشروع"
description: "وصف محدث"
replaceImages: true  # لاستبدال جميع الصور، أو false لإضافة صور جديدة
```

### حذف مشروع

```bash
DELETE /api/projects/:projectId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## إدارة طلبات المراسلة

### إرسال رسالة (عام - من الموقع)

```bash
POST /api/contacts
Content-Type: application/json

{
  "name": "أحمد محمد علي",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "subject": "استفسار عن خدمات التطوير",
  "message": "مرحباً، أرغب في الاستفسار عن خدمات تطوير المواقع والتطبيقات."
}
```

### جلب الرسائل (إداري)

```bash
# جميع الرسائل
GET /api/contacts?page=1&limit=10&sort=-createdAt
Authorization: Bearer YOUR_JWT_TOKEN

# تصفية حسب الحالة
GET /api/contacts?status=new&page=1
Authorization: Bearer YOUR_JWT_TOKEN

# الرسائل غير المقروءة
GET /api/contacts/unread?limit=5
Authorization: Bearer YOUR_JWT_TOKEN

# إحصائيات الرسائل
GET /api/contacts/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

### تحديث حالة الرسالة

```bash
PATCH /api/contacts/:contactId/status
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "replied",
  "notes": "تم الرد على العميل عبر البريد الإلكتروني"
}
```

### البحث في الرسائل

```bash
GET /api/contacts/search?q=أحمد&page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## رفع الملفات

### رفع صورة واحدة

```bash
POST /api/upload/image
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

image: [ملف الصورة]
```

### حذف صورة

```bash
DELETE /api/upload/image
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "imageUrl": "/uploads/image-filename.jpg"
}
```

---

## أمثلة عملية بـ JavaScript

### إنشاء مشروع جديد من الواجهة الأمامية

```javascript
const createProject = async (projectData) => {
  const formData = new FormData();

  // إضافة البيانات النصية
  formData.append("name", projectData.name);
  formData.append("description", projectData.description);
  formData.append("category", projectData.category);
  formData.append("technologies", JSON.stringify(projectData.technologies));

  // إضافة الصور
  formData.append("coverImage", projectData.coverImage);
  projectData.images.forEach((image) => {
    formData.append("images", image);
  });

  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      console.log("تم إنشاء المشروع بنجاح:", result.data.project);
    } else {
      console.error("خطأ:", result.message);
    }
  } catch (error) {
    console.error("خطأ في الشبكة:", error);
  }
};
```

### جلب المشاريع للعرض في الموقع

```javascript
const fetchProjects = async (page = 1, category = null) => {
  try {
    let url = `/api/projects?page=${page}&limit=9`;

    if (category) {
      url = `/api/projects/category/${category}?page=${page}&limit=9`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success") {
      return {
        projects: result.data.projects,
        pagination: result.data.pagination,
      };
    }
  } catch (error) {
    console.error("خطأ في جلب المشاريع:", error);
    return { projects: [], pagination: {} };
  }
};
```

### إرسال رسالة تواصل

```javascript
const sendContactMessage = async (contactData) => {
  try {
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("تم إرسال رسالتك بنجاح. سنتواصل معك قريباً");
      return true;
    } else {
      alert("حدث خطأ: " + result.message);
      return false;
    }
  } catch (error) {
    console.error("خطأ في إرسال الرسالة:", error);
    alert("حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى");
    return false;
  }
};
```

---

## استيراد البيانات التجريبية

### مثال على بيانات مشروع

```json
{
  "name": "تطبيق إدارة المهام",
  "description": "تطبيق شامل لإدارة المهام والمشاريع مع واجهة مستخدم حديثة وميزات متقدمة للفرق",
  "category": "web",
  "status": "completed",
  "featured": true,
  "technologies": [
    "React",
    "Redux",
    "Node.js",
    "Express",
    "MongoDB",
    "Socket.io"
  ],
  "projectUrl": "https://tasks-manager-demo.com",
  "githubUrl": "https://github.com/username/tasks-manager"
}
```

### مثال على بيانات رسالة تواصل

```json
{
  "name": "سارة أحمد",
  "email": "sara.ahmed@example.com",
  "phone": "+966555123456",
  "subject": "طلب تطوير موقع إلكتروني",
  "message": "السلام عليكم، لدي مشروع موقع إلكتروني لشركة ناشئة وأرغب في الحصول على عرض سعر. الموقع سيكون عبارة عن منصة للخدمات مع لوحة تحكم للإدارة."
}
```

---

## معالجة الأخطاء الشائعة

### 401 - غير مخول

```json
{
  "status": "error",
  "message": "غير مخول للوصول، الرجاء تسجيل الدخول"
}
```

**الحل**: تأكد من إرسال الـ JWT Token في header

### 400 - بيانات غير صحيحة

```json
{
  "status": "error",
  "message": "بيانات غير صحيحة",
  "errors": ["اسم المشروع مطلوب", "صورة الغلاف مطلوبة"]
}
```

**الحل**: تحقق من البيانات المرسلة وتأكد من إرسال جميع الحقول المطلوبة

### 413 - حجم الملف كبير

```json
{
  "status": "error",
  "message": "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت"
}
```

**الحل**: قم بضغط الصورة أو تقليل حجمها

---

## نصائح لاستخدام أفضل

### 1. تحسين الصور

- استخدم صيغ WebP أو JPEG للصور
- احرص على ألا يتجاوز حجم الصورة 5 ميجابايت
- استخدم أبعاد مناسبة (1200x800 للصور الرئيسية)

### 2. إدارة الـ Tokens

```javascript
// حفظ الـ token
localStorage.setItem("token", result.token);

// استخدام الـ token في الطلبات
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
};
```

### 3. التعامل مع التصفح

```javascript
const handlePagination = (currentPage, totalPages) => {
  return {
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextPage: currentPage + 1,
    prevPage: currentPage - 1,
  };
};
```

### 4. البحث والتصفية

```javascript
const buildProjectsUrl = (filters) => {
  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.page) params.append("page", filters.page);
  if (filters.search)
    return `/api/projects/search?q=${filters.search}&${params}`;

  return `/api/projects?${params}`;
};
```

---

## الخلاصة

هذا API يوفر نظاماً متكاملاً لإدارة موقع تعريفي مع:

✅ **إدارة المشاريع**: إضافة، تعديل، حذف، وتنظيم المشاريع  
✅ **طلبات المراسلة**: استقبال وإدارة رسائل الزوار  
✅ **رفع الملفات**: نظام آمن لرفع وإدارة الصور  
✅ **المصادقة**: نظام آمن لحماية المناطق الإدارية  
✅ **البحث والتصفية**: إمكانيات بحث متقدمة  
✅ **الإحصائيات**: تقارير شاملة عن النشاط

**استخدم هذا الدليل كمرجع أثناء التطوير وستجد جميع ما تحتاجه لبناء موقع تعريفي متكامل!**
