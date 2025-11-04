// هندلر مرکزی برای مدیریت تمام خطاها
function AllExceptionHandler(app) {
    app.use((err, req, res, next) => {
        let statusCode = err?.status ?? err?.statusCode ?? err?.code;
        
        // بررسی اعتبار کد وضعیت HTTP
        if (!statusCode || isNaN(+statusCode) || statusCode > 511 || statusCode < 200) {
            statusCode = 500;
        }
        
        res.status(statusCode).json({
            message: err?.message ?? err?.stack ?? "خطای داخلی سرور"
        });
    });
}

module.exports = AllExceptionHandler;