// کنترلر مربوط به مدیریت کاربران
const NodeEnv = require("../../common/constant/env.enum");
const { AuthMessage } = require("./user.messages");
const userService = require("./user.service");
const autoBind = require("auto-bind");

class UserController {
    #service;
    
    constructor() {
        autoBind(this);
        this.#service = userService;
    }
    
    // دریافت اطلاعات کاربر فعلی
    async whoami(req, res, next) {
        try {
            const currentUser = req.user;
            return res.json(currentUser);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();