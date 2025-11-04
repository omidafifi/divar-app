// کنترلر مربوط به مدیریت آپشن‌های دسته‌بندی
const autoBind = require("auto-bind");
const optionService = require("./option.service");
const { OptionMessage } = require("./option.message");
const HttpCodes = require("http-codes");

class OptionController {
    #service;
    
    constructor() {
        autoBind(this);
        this.#service = optionService;
    }
    
    // ایجاد آپشن جدید
    async create(req, res, next) {
        try {
            const { title, key, guid, enum: list, type, category, required } = req.body;
            await this.#service.create({ title, key, guid, enum: list, type, category, required });
            
            return res.status(HttpCodes.CREATED).json({
                message: OptionMessage.Created
            });
        } catch (error) {
            next(error);
        }
    }
    
    // به‌روزرسانی آپشن
    async update(req, res, next) {
        try {
            const { title, key, guid, enum: list, type, category, required } = req.body;
            const { id } = req.params;
            await this.#service.update(id, { title, key, guid, enum: list, type, category, required });
            
            return res.json({
                message: OptionMessage.Updated
            });
        } catch (error) {
            next(error);
        }
    }
    
    // دریافت آپشن‌های یک دسته‌بندی با ID
    async findByCategoryId(req, res, next) {
        try {
            const { categoryId } = req.params;
            const optionsList = await this.#service.findByCategoryId(categoryId);
            return res.json(optionsList);
        } catch (error) {
            next(error);
        }
    }
    
    // دریافت آپشن با ID
    async findById(req, res, next) {
        try {
            const { id } = req.params;
            const optionData = await this.#service.findById(id);
            return res.json(optionData);
        } catch (error) {
            next(error);
        }
    }
    
    // حذف آپشن
    async removeById(req, res, next) {
        try {
            const { id } = req.params;
            await this.#service.removeById(id);
            
            return res.json({
                message: OptionMessage.Deleted
            });
        } catch (error) {
            next(error);
        }
    }
    
    // دریافت آپشن‌های یک دسته‌بندی با slug
    async findByCategorySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const optionsList = await this.#service.findByCategorySlug(slug);
            return res.json(optionsList);
        } catch (error) {
            next(error);
        }
    }
    
    // دریافت تمام آپشن‌ها
    async find(req, res, next) {
        try {
            const optionsList = await this.#service.find();
            return res.json(optionsList);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OptionController();