// تنظیمات Swagger برای مستندسازی API
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function SwaggerConfig(app) {
    // ساخت مستندات Swagger
    const swaggerDoc = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.1",
            info: {
                title: "Divar Backend API",
                description: "API مستندات پروژه دیوار - مستندسازی کامل تمامی endpoint ها",
                version: "1.0.0",
            },
        },
        apis: [process.cwd() + "/src/modules/**/*.swagger.js"]
    });
    
    // راه‌اندازی رابط کاربری Swagger
    const swaggerSetup = swaggerUi.setup(swaggerDoc, {});
    app.use("/swagger", swaggerUi.serve, swaggerSetup);
}

module.exports = SwaggerConfig;