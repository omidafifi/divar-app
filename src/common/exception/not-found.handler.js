// هندلر برای مسیرهای پیدا نشده (404)
function NotFoundHandler(app) {
    app.use((req, res, next) => {
        res.status(404).json({
            message: "مسیر درخواستی یافت نشد"
        });
    });
}

module.exports = NotFoundHandler;