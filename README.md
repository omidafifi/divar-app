# 🏠 پروژه دیوار - سیستم مدیریت آگهی

پروژه کامل وبسایت مشابه دیوار با قابلیت‌های احراز هویت، مدیریت دسته‌بندی‌ها، آگهی‌ها و رابط کاربری داینامیک.

## 📋 فهرست مطالب

- [ویژگی‌ها](#ویژگی‌ها)
- [تکنولوژی‌ها](#تکنولوژی‌ها)
- [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
- [ساختار پروژه](#ساختار-پروژه)
- [API Endpoints](#api-endpoints)
- [مستندات API](#مستندات-api)
- [متغیرهای محیطی](#متغیرهای-محیطی)
- [نویسنده](#نویسنده)

## ✨ ویژگی‌ها

### 🔐 احراز هویت
- سیستم احراز هویت با OTP (کد یکبار مصرف)
- مدیریت توکن‌های JWT با الگوریتم HS384
- ذخیره‌سازی امن توکن‌ها در Cookie
- مدیریت جلسه کاربری (Session Management)

### 📂 مدیریت دسته‌بندی‌ها
- ایجاد و مدیریت دسته‌بندی‌های چندسطحی
- پشتیبانی از دسته‌بندی‌های والد و فرزند
- سیستم فیلتر داینامیک بر اساس دسته‌بندی
- نمایش دسته‌بندی‌ها در sidebar به صورت داینامیک

### 📝 مدیریت آگهی‌ها
- ایجاد آگهی با قابلیت آپلود چند تصویر
- مدیریت آگهی‌های کاربر
- جستجو و فیلتر پیشرفته آگهی‌ها
- نمایش جزئیات کامل آگهی
- حذف آگهی

### 🎨 رابط کاربری
- رابط کاربری داینامیک با EJS
- پنل مدیریت برای کاربران
- نمایش لیست آگهی‌ها با فیلتر
- نمایش نقشه برای انتخاب موقعیت جغرافیایی
- طراحی واکنش‌گرا (Responsive)

### 🛠️ قابلیت‌های فنی
- مستندسازی کامل API با Swagger
- مدیریت خطاهای جامع
- سیستم آپلود فایل با Multer
- یکپارچه‌سازی با API نقشه (Map.ir)
- پشتیبانی از زبان فارسی در تمام پیام‌ها

## 🛠️ تکنولوژی‌ها

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File Upload
- **EJS** - Template Engine

### Frontend
- **EJS** - Server-side Rendering
- **Bootstrap** - UI Framework
- **jQuery** - JavaScript Library
- **SweetAlert2** - Alert Library
- **Map.ir** - Map Integration

### ابزارها
- **Swagger** - API Documentation
- **Nodemon** - Development Tool
- **dotenv** - Environment Variables

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (v14 یا بالاتر)
- MongoDB (محلی یا Atlas)
- npm یا yarn

### مراحل نصب

1. **کلون کردن پروژه**
```bash
git clone https://github.com/omidafifi/divar-app.git
cd divar-app
```

2. **نصب وابستگی‌ها**
```bash
npm install
```

3. **تنظیم متغیرهای محیطی**
فایل `.env` را در ریشه پروژه ایجاد کنید و متغیرهای زیر را تنظیم کنید:

```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/divar
JWT_SECRET_KEY=your-super-secret-jwt-key
COOKIE_SECRET_KEY=your-super-secret-cookie-key
NODE_ENV=development
GEOLOCATION_API_URL=https://map.ir/reverse
GEOLOCATION_API_TOKEN=your-map-api-token
```

4. **راه‌اندازی سرور**
```bash
npm start
```

سرور در آدرس `http://localhost:3000` (یا پورت تعریف شده در `.env`) راه‌اندازی می‌شود.

## 📁 ساختار پروژه

```
divar-app/
├── src/
│   ├── modules/          # ماژول‌های اصلی پروژه
│   │   ├── auth/         # احراز هویت
│   │   ├── user/         # مدیریت کاربران
│   │   ├── category/     # مدیریت دسته‌بندی‌ها
│   │   ├── option/       # مدیریت آپشن‌های دسته‌بندی
│   │   └── post/         # مدیریت آگهی‌ها
│   ├── common/           # فایل‌های مشترک
│   │   ├── constant/     # ثوابت
│   │   ├── exception/    # هندلرهای خطا
│   │   ├── guard/        # Guard های احراز هویت
│   │   ├── messages/     # پیام‌های سیستم
│   │   └── utils/        # توابع کمکی
│   ├── config/           # فایل‌های کانفیگ
│   │   ├── mongoose.config.js
│   │   └── swagger.config.js
│   └── app.routes.js     # روت‌های اصلی
├── views/                # فایل‌های EJS
│   ├── layouts/          # Layout های اصلی
│   └── pages/            # صفحات
├── public/               # فایل‌های استاتیک
├── main.js               # فایل اصلی ورود به برنامه
└── package.json
```

## 🔌 API Endpoints

### احراز هویت (Authentication)
```
POST   /auth/send-otp      # ارسال کد تایید
POST   /auth/check-otp     # بررسی کد تایید و ورود
GET    /auth/logout        # خروج از حساب کاربری
```

### کاربران (Users)
```
GET    /user/whoami        # دریافت اطلاعات کاربر فعلی
```

### دسته‌بندی‌ها (Categories)
```
POST   /category           # ایجاد دسته‌بندی جدید
GET    /category           # دریافت لیست دسته‌بندی‌ها
DELETE /category/:id       # حذف دسته‌بندی
```

### آپشن‌ها (Options)
```
POST   /option             # ایجاد آپشن جدید
GET    /option             # دریافت لیست آپشن‌ها
GET    /option/:id         # دریافت آپشن با ID
PUT    /option/:id         # به‌روزرسانی آپشن
DELETE /option/:id         # حذف آپشن
GET    /option/category/:categoryId  # دریافت آپشن‌های یک دسته‌بندی
GET    /option/category-slug/:slug   # دریافت آپشن‌ها با slug دسته‌بندی
```

### آگهی‌ها (Posts)
```
GET    /post/create        # صفحه ایجاد آگهی (نیاز به لاگین)
POST   /post/create        # ایجاد آگهی جدید (نیاز به لاگین)
GET    /post/my            # لیست آگهی‌های کاربر (نیاز به لاگین)
GET    /post/:id           # نمایش جزئیات آگهی
DELETE /post/delete/:id    # حذف آگهی (نیاز به لاگین)
GET    /                   # لیست تمام آگهی‌ها (صفحه اصلی)
```

## 📚 مستندات API

مستندات کامل API با استفاده از Swagger در دسترس است:

**لینک مستندات:** `http://localhost:3000/swagger`

در این صفحه می‌توانید تمام endpoint ها، پارامترها، نمونه درخواست‌ها و پاسخ‌ها را مشاهده کنید.

## 🔧 متغیرهای محیطی

| متغیر | توضیحات | مثال |
|------|---------|------|
| `PORT` | پورت سرور | `3000` |
| `MONGODB_URL` | آدرس اتصال به MongoDB | `mongodb://localhost:27017/divar` |
| `JWT_SECRET_KEY` | کلید مخفی برای JWT | `your-secret-key` |
| `COOKIE_SECRET_KEY` | کلید مخفی برای Cookie | `your-cookie-secret` |
| `NODE_ENV` | محیط اجرا | `development` یا `production` |
| `GEOLOCATION_API_URL` | آدرس API نقشه | `https://map.ir/reverse` |
| `GEOLOCATION_API_TOKEN` | توکن API نقشه | `your-api-token` |

## 📝 نمونه استفاده

### ارسال کد OTP
```bash
curl -X POST http://localhost:3000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "09123456789"}'
```

### بررسی کد OTP
```bash
curl -X POST http://localhost:3000/auth/check-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "09123456789", "code": "12345"}'
```

### ایجاد دسته‌بندی
```bash
curl -X POST http://localhost:3000/category \
  -H "Content-Type: application/json" \
  -d '{
    "name": "املاک",
    "slug": "amlak",
    "icon": "/home/img/home.svg"
  }'
```

## 🎯 ویژگی‌های کلیدی پیاده‌سازی شده

✅ سیستم احراز هویت کامل با OTP  
✅ مدیریت دسته‌بندی‌های چندسطحی  
✅ سیستم آپلود تصاویر  
✅ جستجو و فیلتر پیشرفته  
✅ نمایش نقشه برای انتخاب موقعیت  
✅ پنل مدیریت کاربری  
✅ مستندسازی کامل API  
✅ مدیریت خطاهای جامع  
✅ پشتیبانی کامل از زبان فارسی  

## 👨‍💻 نویسنده

**Omid**

- GitHub: [@omidafifi](https://github.com/omidafifi)

## 📄 لایسنس

ISC

---

⭐ اگر این پروژه برایتان مفید بود، یک ستاره به آن بدهید!

