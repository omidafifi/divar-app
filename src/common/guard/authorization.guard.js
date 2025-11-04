// Guard برای احراز هویت و بررسی توکن کاربران
const createHttpError = require("http-errors");
const AuthorizationMessage = require("../messages/auth.message");
const jwt = require("jsonwebtoken");
const UserModel = require("../../modules/user/user.model");
require("dotenv").config();

const Authorization = async (req, res, next) => {
    try {
        // دریافت توکن از کوکی
        const userToken = req?.cookies?.access_token;
        if (!userToken) {
            throw new createHttpError.Unauthorized(AuthorizationMessage.Login);
        }
        
        // بررسی و اعتبارسنجی توکن با الگوریتم HS384
        const tokenData = jwt.verify(userToken, process.env.JWT_SECRET_KEY, {
            algorithms: ["HS384"]
        });
        
        // بررسی ساختار توکن (support both id and userId for backward compatibility)
        const userId = tokenData.userId || tokenData.id;
        
        if (typeof tokenData === "object" && userId) {
            // دریافت اطلاعات کاربر از دیتابیس (بدون فیلدهای حساس)
            const userData = await UserModel.findById(
                userId, 
                { accessToken: 0, otp: 0, __v: 0, updatedAt: 0, verifiedMobile: 0 }
            ).lean();
            
            if (!userData) {
                throw new createHttpError.Unauthorized(AuthorizationMessage.NotFoundAccount);
            }
            
            // افزودن اطلاعات کاربر به request
            req.user = userData;
            return next();
        }
        
        throw new createHttpError.Unauthorized(AuthorizationMessage.InvalidToken);
    } catch (error) {
        next(error);
    }
};

module.exports = Authorization;