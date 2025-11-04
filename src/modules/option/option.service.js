// سرویس مربوط به مدیریت آپشن‌های دسته‌بندی
const autoBind = require("auto-bind");
const OptionModel = require("./option.model");
const createHttpError = require("http-errors");
const { OptionMessage } = require("./option.message");
const { default: slugify } = require("slugify");
const categoryService = require("../category/category.service");
const { isTrue, isFalse } = require("../../common/utils/functions");
const { isValidObjectId } = require("mongoose");

class OptionService {
    #model;
    #categoryService;
    
    constructor() {
        autoBind(this);
        this.#model = OptionModel;
        this.#categoryService = categoryService;
    }
    
    // دریافت تمام آپشن‌ها
    async find() {
        const optionsList = await this.#model
            .find({}, { __v: 0 }, { sort: { _id: -1 } })
            .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
        return optionsList;
    }
    
    // ایجاد آپشن جدید
    async create(optionDto) {
        const categoryData = await this.#categoryService.checkExistById(optionDto.category);
        optionDto.category = categoryData._id;
        optionDto.key = slugify(optionDto.key, { trim: true, replacement: "_", lower: true });
        
        // بررسی یکتا بودن key در دسته‌بندی
        await this.alreadyExistByCategoryAndKey(optionDto.key, categoryData._id);
        
        // تبدیل enum از string به array در صورت نیاز
        if (optionDto?.enum && typeof optionDto.enum === "string") {
            optionDto.enum = optionDto.enum.split(",");
        } else if (!Array.isArray(optionDto.enum)) {
            optionDto.enum = [];
        }
        
        // تنظیم فیلد required
        if (isTrue(optionDto?.required)) {
            optionDto.required = true;
        }
        if (isFalse(optionDto?.required)) {
            optionDto.required = false;
        }
        
        const newOption = await this.#model.create(optionDto);
        return newOption;
    }
    
    // به‌روزرسانی آپشن
    async update(id, optionDto) {
        const existingOption = await this.checkExistById(id);
        
        // بررسی و تغییر دسته‌بندی در صورت نیاز
        if (optionDto.category && isValidObjectId(optionDto.category)) {
            const categoryData = await this.#categoryService.checkExistById(optionDto.category);
            optionDto.category = categoryData._id;
        } else {
            delete optionDto.category;
        }
        
        // به‌روزرسانی key و بررسی یکتایی
        if (optionDto.slug) {
            optionDto.key = slugify(optionDto.key, { trim: true, replacement: "_", lower: true });
            let categoryId = existingOption.category;
            if (optionDto.category) {
                categoryId = optionDto.category;
            }
            await this.alreadyExistByCategoryAndKey(optionDto.key, categoryId, id);
        }
        
        // پردازش enum
        if (optionDto?.enum && typeof optionDto.enum === "string") {
            optionDto.enum = optionDto.enum.split(",");
        } else if (!Array.isArray(optionDto.enum)) {
            delete optionDto.enum;
        }
        
        // تنظیم فیلد required
        if (isTrue(optionDto?.required)) {
            optionDto.required = true;
        } else if (isFalse(optionDto?.required)) {
            optionDto.required = false;
        } else {
            delete optionDto?.required;
        }
        
        return await this.#model.updateOne({ _id: id }, { $set: optionDto });
    }
    
    // دریافت آپشن با ID
    async findById(id) {
        return await this.checkExistById(id);
    }
    
    // حذف آپشن با ID
    async removeById(id) {
        await this.checkExistById(id);
        return await this.#model.deleteOne({ _id: id });
    }
    
    // دریافت آپشن‌های یک دسته‌بندی با ID
    async findByCategoryId(category) {
        return await this.#model
            .find({ category }, { __v: 0 })
            .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
    }
    
    // دریافت آپشن‌های یک دسته‌بندی با slug
    async findByCategorySlug(slug) {
        const optionsData = await this.#model.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $addFields: {
                    categorySlug: "$category.slug",
                    categoryName: "$category.name",
                    categoryIcon: "$category.icon",
                }
            },
            {
                $project: {
                    category: 0,
                    __v: 0
                }
            },
            {
                $match: {
                    categorySlug: slug
                }
            }
        ]);
        return optionsData;
    }
    
    // بررسی وجود آپشن با ID
    async checkExistById(id) {
        const optionData = await this.#model.findById(id);
        if (!optionData) {
            throw new createHttpError.NotFound(OptionMessage.NotFound);
        }
        return optionData;
    }
    
    // بررسی یکتایی key در دسته‌بندی
    async alreadyExistByCategoryAndKey(key, category, exceptionId = null) {
        const existingOption = await this.#model.findOne({ category, key, _id: { $ne: exceptionId } });
        if (existingOption) {
            throw new createHttpError.Conflict(OptionMessage.AlreadyExist);
        }
        return null;
    }
}

module.exports = new OptionService();