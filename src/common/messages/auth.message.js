// پیام‌های مربوط به احراز هویت و دسترسی
const AuthorizationMessage = Object.freeze({
  Login: "لطفا ابتدا وارد حساب کاربری خود شوید",
  LoginAgain: "لطفا مجددا وارد حساب کاربری خود شوید",
  Unauthorized: "دسترسی غیرمجاز - لطفا وارد حساب کاربری خود شوید",
  NotFoundAccount: "حساب کاربری یافت نشد",
  InvalidToken: "توکن معتبر نیست",
});

module.exports = AuthorizationMessage;
