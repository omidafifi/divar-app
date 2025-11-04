// تنظیمات اصلی پروژه - فایل اصلی ورود به برنامه
const express = require("express");
const dotenv = require("dotenv");
const SwaggerConfig = require("./src/config/swagger.config");
const mainRouter = require("./src/app.routes");
const NotFoundHandler = require("./src/common/exception/not-found.handler");
const AllExceptionHandler = require("./src/common/exception/all-exception.handler");
const cookieParser = require("cookie-parser");
const expressEjsLayouts = require("express-ejs-layouts");
const moment = require("jalali-moment");
const methodOverride = require("method-override");

// بارگذاری متغیرهای محیطی
dotenv.config();

// تابع اصلی برای راه‌اندازی سرور
async function initializeServer() {
    const app = express();
    const serverPort = process.env.PORT;
    
    // اتصال به دیتابیس MongoDB
    require("./src/config/mongoose.config");
    
    // تنظیمات middleware ها
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
    app.use(express.static("public"));
    app.use(expressEjsLayouts);
    app.use(methodOverride('_method'));
    
    // تنظیمات موتور رندرینگ EJS
    app.set("view engine", "ejs");
    app.set("layout", "./layouts/panel/main.ejs");
    app.set("layout extractScripts", true);
    app.set("layout extractStyles", true);
    
    // استفاده از روت‌های اصلی
    app.use(mainRouter);
    
    // افزودن moment به locals برای استفاده در view ها
    app.locals.moment = moment;
    
    // تنظیمات Swagger
    SwaggerConfig(app);
    
    // هندلرهای خطا
    NotFoundHandler(app);
    AllExceptionHandler(app);
    
    // راه‌اندازی سرور
    app.listen(serverPort, () => {
        console.log(`✅ سرور با موفقیت راه‌اندازی شد: http://localhost:${serverPort}`);
    });
}

initializeServer();
