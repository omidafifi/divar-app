// کنترلر مربوط به مدیریت دسته‌بندی‌ها
const autoBind = require("auto-bind");
const categoryService = require("./category.service");
const { CategoryMessage } = require("./category.message");
const HttpCodes = require("http-codes");

class CategoryController {
    #service;
    
    constructor() {
        autoBind(this);
        this.#service = categoryService;
    }
    
    // ایجاد دسته‌بندی جدید
    async create(req, res, next) {
        try {
            const { name, icon, slug, parent } = req.body;
            await this.#service.create({ name, icon, slug, parent });
            
            return res.status(HttpCodes.CREATED).json({
                message: CategoryMessage.Created
            });
        } catch (error) {
            next(error);
        }
    }
    
    // دریافت لیست دسته‌بندی‌ها
    async find(req, res, next) {
        try {
            const categoriesList = await this.#service.find();
            return res.json(categoriesList);
        } catch (error) {
            next(error);
        }
    }
    
    // حذف دسته‌بندی
    async remove(req, res, next) {
        try {
            const { id } = req.params;
            await this.#service.remove(id);
            
            return res.json({
                message: CategoryMessage.Deleted
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();