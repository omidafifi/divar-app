// پیام‌های مربوط به ماژول احراز هویت
const AuthMessage = {
    SendOtpSuccessfully: "کد تایید با موفقیت ارسال شد",
    NotFound: "کاربری با این شماره موبایل یافت نشد",
    OtpCodeNotExpired: "کد تایید قبلی هنوز منقضی نشده است، لطفا بعدا تلاش کنید",
    OtpCodeExpired: "کد تایید منقضی شده است، لطفا کد جدید دریافت کنید",
    OtpCodeIsIncorrect: "کد تایید وارد شده صحیح نیست",
    LoginSuccessfully: "ورود با موفقیت انجام شد",
    LogoutSuccessfully: "خروج با موفقیت انجام شد",
};

module.exports = {
    AuthMessage,
};