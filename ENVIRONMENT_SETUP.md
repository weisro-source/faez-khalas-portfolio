# إعداد متغيرات البيئة (Environment Setup)

## نظرة عامة

تم إنشاء ثلاثة ملفات قوالب لمتغيرات البيئة لتلبية احتياجات مختلفة:

- `env.production.template` - للنشر على الخادم (Production)
- `env.development.template` - للتطوير المحلي (Local Development)
- `env.local.template` - للإعدادات الشخصية للمطورين

## الإعداد السريع

### 1. للتطوير المحلي

```bash
# انسخ قالب التطوير إلى .env
cp env.development.template .env
```

### 2. للنشر على الخادم

```bash
# انسخ قالب الإنتاج إلى .env.production
cp env.production.template .env.production
```

### 3. للإعدادات المحلية الشخصية

```bash
# انسخ القالب المحلي إلى .env.local
cp env.local.template .env.local
```

## الإعدادات المطلوبة

### للإنتاج (Production) ⚠️ مهم جداً

قبل النشر، يجب تغيير هذه القيم:

1. **قاعدة البيانات:**

   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/faez-khalas-portfolio
   ```

2. **أمان JWT:**

   ```
   JWT_SECRET=your-very-strong-secret-key-here
   ```

3. **بيانات المدير:**

   ```
   ADMIN_EMAIL=your-admin@yourdomain.com
   ADMIN_PASSWORD=your-strong-password
   ```

4. **النطاقات المسموحة:**
   ```
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

### للتطوير المحلي

- قاعدة البيانات المحلية: `mongodb://localhost:27017/faez-khalas-portfolio-dev`
- منافذ التطوير: `localhost:3000`, `localhost:5173`, إلخ

## استخدام البيئات المختلفة

### تشغيل التطوير المحلي

```bash
npm run dev
# سيستخدم .env تلقائياً
```

### تشغيل الإنتاج

```bash
NODE_ENV=production npm start
# تأكد من وجود .env.production
```

## الملفات المتجاهلة

جميع ملفات `.env*` متجاهلة في Git لحماية المعلومات الحساسة:

- `.env`
- `.env.local`
- `.env.production`
- `.env.development`

## نصائح الأمان

1. **لا تشارك ملفات .env مطلقاً**
2. **استخدم كلمات مرور قوية للإنتاج**
3. **غيّر JWT_SECRET في الإنتاج**
4. **استخدم MongoDB Atlas للإنتاج**
5. **فعّل HTTPS في الإنتاج**

## استكشاف الأخطاء

### خطأ الاتصال بقاعدة البيانات

- تأكد من تشغيل MongoDB محلياً للتطوير
- تحقق من صحة MONGODB_URI للإنتاج

### خطأ JWT

- تأكد من تعيين JWT_SECRET
- تحقق من انتهاء صلاحية التوكن

### خطأ CORS

- أضف النطاق المطلوب إلى ALLOWED_ORIGINS
- تأكد من استخدام البروتوكول الصحيح (http/https)
