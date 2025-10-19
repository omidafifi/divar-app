const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const SwaggerConfig = require("./config/swagger.config");
const { mainRouter } = require("./app.routes");
const { NotFoundHandler } = require("./common/not-found.handler");
const { AllExceptionHandler } = require("./common/all-exeption.hanlder");
dotenv.config();
async function main() {
  const app = express();
  const port = process.env.PORT;
  require("./config/mongoose.config");

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

  SwaggerConfig(app);
  app.use(mainRouter);
  NotFoundHandler(app);
  AllExceptionHandler(app);
  app.listen(port, () => {
    console.log(`server: http://localhost:${port}`);
  });
}
main();
