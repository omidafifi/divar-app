const { Router } = require("express");
const AuthController = require("./auth.controller");

const router = Router();
const authController = new AuthController();

router.post("/send-otp", authController.sendOTP.bind(authController));
router.post("/check-otp", authController.checkOTP.bind(authController));

module.exports = {
  AuthRouter: router,
};
