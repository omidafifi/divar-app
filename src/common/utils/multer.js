// تنظیمات Multer برای آپلود تصاویر
const multer = require('multer');
const fs = require("fs");
const path = require('path');
const createHttpError = require('http-errors');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ایجاد پوشه upload در صورت عدم وجود
        fs.mkdirSync(path.join(process.cwd(), "public", "upload"), { recursive: true });
        cb(null, "public/upload");
    },
    filename: function (req, file, cb) {
        // لیست فرمت‌های مجاز
        const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
        
        if (allowedFormats.includes(file.mimetype)) {
            const fileExtension = path.extname(file.originalname);
            const fileName = new Date().getTime().toString() + fileExtension;
            cb(null, fileName);
        } else {
            cb(new createHttpError.BadRequest("فرمت فایل تصویر صحیح نیست!"));
        }
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 3 * 1000 * 1000 // حداکثر 3 مگابایت
    },
});

module.exports = {
    upload
};