const UserModel = require("../user/user.model");
const createHttpError = require("http-errors");
const { randomInt } = require("crypto");
const { AuthMessage } = require("./auth.messages");

class AuthService {
  #model = UserModel;
  async sendOTP(mobile) {
    const user = await this.#model.findOne({ mobile });
    const now = new Date().getTime();
    const otp = {
      code: randomInt(10000, 99999),
      expiresIn: now + 1000 * 60 * 2,
    };
    if (!user) {
      const newUser = await this.#model.create({ mobile, otp });
      return newUser;
    }
    if (user.otp && user.otp.expiresIn > now) {
      throw new createHttpError.BadRequest(AuthMessage.OtpCodeNotExpired);
    }
    user.otp = otp;
    await user.save();
    return user;
  }

  async checkOTP(mobile, code) {}
}
module.exports = AuthService;
