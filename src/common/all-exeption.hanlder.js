function AllExceptionHandler(app) {
  app.use((err, req, res, next) => {
    let status = err?.status ?? err?.statusCode ?? err?.code;
    if (status || isNaN(+status) || status > 511 || status < 200) code = 500;
    res.status(status).json({
      message: err?.message ?? err?.stack ?? "Internal Server Error"
    });
  });
}

module.exports = {
  AllExceptionHandler,
};
