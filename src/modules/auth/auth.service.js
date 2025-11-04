// سرویس مربوط به احراز هویت کاربران
const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");
const createHttpError = require("http-errors");
const { AuthMessage } = require("./auth.messages");
const { randomInt } = require("crypto");
require("dotenv").config();
const jwt = require("jsonwebtoken");

class AuthService {
    #model;
    
    constructor() {
        autoBind(this);
        this.#model = UserModel;
    }
    
    // ارسال کد OTP به شماره موبایل کاربر
    async sendOTP(mobile) {
        const existingUser = await this.#model.findOne({ mobile });
        const currentTime = new Date().getTime();
        
        // تولید کد تصادفی 5 رقمی
        const otpData = {
            code: randomInt(10000, 99999),
            expiresIn: currentTime + (1000 * 60 * 2) // 2 دقیقه اعتبار
        };
        
        // اگر کاربر وجود نداشت، ایجاد کاربر جدید
        if (!existingUser) {
            const newUser = await this.#model.create({ mobile, otp: otpData });
            return newUser;
        }
        
        // بررسی اینکه کد قبلی منقضی نشده باشد
        if (existingUser.otp && existingUser.otp.expiresIn > currentTime) {
            throw new createHttpError.BadRequest(AuthMessage.OtpCodeNotExpired);
        }
        
        // به‌روزرسانی کد OTP
        existingUser.otp = otpData;
        await existingUser.save();
        return existingUser;
    }
    
    // بررسی صحت کد OTP
    async checkOTP(mobile, code) {
        const userData = await this.checkExistByMobile(mobile);
        const currentTime = new Date().getTime();
        
        // بررسی انقضای کد
        if (userData?.otp?.expiresIn < currentTime) {
            throw new createHttpError.Unauthorized(AuthMessage.OtpCodeExpired);
        }
        
        // بررسی صحت کد
        if (userData?.otp?.code !== code) {
            throw new createHttpError.Unauthorized(AuthMessage.OtpCodeIsIncorrect);
        }
        
        // تایید شماره موبایل در صورت نیاز
        if (!userData.verifiedMobile) {
            userData.verifiedMobile = true;
        }
        
        // تولید توکن دسترسی با payload شامل mobile و userId
        const tokenPayload = { 
            mobile: userData.mobile, 
            userId: userData._id.toString(),
            iat: Math.floor(Date.now() / 1000) // زمان صدور توکن
        };
        const accessToken = this.signToken(tokenPayload);
        userData.accessToken = accessToken;
        await userData.save();
        
        return accessToken;
    }
    
    // بررسی وجود کاربر با شماره موبایل
    async checkExistByMobile(mobile) {
        const userData = await this.#model.findOne({ mobile });
        if (!userData) {
            throw new createHttpError.NotFound(AuthMessage.NotFound);
        }
        return userData;
    }
    
    // تولید توکن JWT با الگوریتم HS384 و مدت اعتبار 365 روز
    signToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { 
            expiresIn: "365d",
            algorithm: "HS384"
        });
    }
}

module.exports = new AuthService();