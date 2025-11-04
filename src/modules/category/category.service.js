// سرویس مربوط به مدیریت دسته‌بندی‌ها
const autoBind = require("auto-bind");
const CategoryModel = require("./category.model");
const OptionModel = require("../option/option.model");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const { CategoryMessage } = require("./category.message");
const { default: slugify } = require("slugify");

class CategoryService {
    #model;
    #optionModel;
    
    constructor() {
        autoBind(this);
        this.#model = CategoryModel;
        this.#optionModel = OptionModel;
    }
    
    // دریافت تمام دسته‌بندی‌های والد (بدون پدر)
    async find() {
        return await this.#model.find({ parent: { $exists: false } });
    }
    
    // حذف دسته‌بندی و تمام آپشن‌های مرتبط
    async remove(id) {
        await this.checkExistById(id);
        
        // حذف آپشن‌های مرتبط و سپس خود دسته‌بندی
        await this.#optionModel.deleteMany({ category: id }).then(async () => {
            await this.#model.deleteMany({ _id: id });
        });
        
        return true;
    }
    
    // ایجاد دسته‌بندی جدید
    async create(categoryDto) {
        // اگر دسته‌بندی پدر مشخص شده باشد
        if (categoryDto?.parent && isValidObjectId(categoryDto.parent)) {
            const parentCategory = await this.checkExistById(categoryDto.parent);
            categoryDto.parent = parentCategory._id;
            
            // ساخت آرایه parents برای دسترسی سریع به سلسله مراتب
            categoryDto.parents = [
                ...new Set(
                    ([parentCategory._id.toString()].concat(
                        parentCategory.parents.map(id => id.toString())
                    )).map(id => new Types.ObjectId(id))
                )
            ];
        }
        
        // ساخت slug از نام یا استفاده از slug ارائه شده
        if (categoryDto?.slug) {
            categoryDto.slug = slugify(categoryDto.slug);
            await this.alreadyExistBySlug(categoryDto.slug);
        } else {
            categoryDto.slug = slugify(categoryDto.name);
        }
        
        const newCategory = await this.#model.create(categoryDto);
        return newCategory;
    }
    
    // بررسی وجود دسته‌بندی با ID
    async checkExistById(id) {
        const categoryData = await this.#model.findById(id);
        if (!categoryData) {
            throw new createHttpError.NotFound(CategoryMessage.NotFound);
        }
        return categoryData;
    }
    
    // بررسی وجود دسته‌بندی با slug
    async checkExistBySlug(slug) {
        const categoryData = await this.#model.findOne({ slug });
        if (!categoryData) {
            throw new createHttpError.NotFound(CategoryMessage.NotFound);
        }
        return categoryData;
    }
    
    // بررسی اینکه دسته‌بندی با این slug از قبل وجود ندارد
    async alreadyExistBySlug(slug) {
        const existingCategory = await this.#model.findOne({ slug });
        if (existingCategory) {
            throw new createHttpError.Conflict(CategoryMessage.AlreadyExist);
        }
        return null;
    }
}

module.exports = new CategoryService();