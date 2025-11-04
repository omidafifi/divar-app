// سرویس مربوط به مدیریت آگهی‌ها
const autoBind = require("auto-bind");
const OptionModel = require("../option/option.model");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const PostModel = require("./post.model");
const { PostMessage } = require("./post.message");
const CategoryModel = require("../category/category.model");

class PostService {
    #model;
    #optionModel;
    #categoryModel;
    
    constructor() {
        autoBind(this);
        this.#model = PostModel;
        this.#optionModel = OptionModel;
        this.#categoryModel = CategoryModel;
    }
    
    // دریافت آپشن‌های یک دسته‌بندی
    async getCategoryOptions(categoryId) {
        const optionsList = await this.#optionModel.find({ category: categoryId });
        return optionsList;
    }
    
    // ایجاد آگهی جدید
    async create(dto) {
        return await this.#model.create(dto);
    }
    
    // دریافت آگهی‌های یک کاربر
    async find(userId) {
        if (userId && isValidObjectId(userId)) {
            return await this.#model.find({ userId });
        }
        throw new createHttpError.BadRequest(PostMessage.RequestNotValid);
    }
    
    // جستجو و فیلتر آگهی‌ها
    async findAll(options) {
        let { category, search } = options;
        const query = {};
        
        // فیلتر بر اساس دسته‌بندی
        if (category) {
            const categoryData = await this.#categoryModel.findOne({ slug: category });
            
            if (categoryData) {
                let subCategories = await this.#categoryModel.find({ parents: categoryData._id }, { _id: 1 });
                subCategories = subCategories.map(item => item._id);
                
                query['category'] = {
                    $in: [categoryData._id, ...subCategories]
                };
            } else {
                // اگر دسته‌بندی در دیتابیس یافت نشد، آرایه خالی برمی‌گردانیم
                // (این برای دسته‌بندی‌های پیش‌فرض که هنوز در دیتابیس نیستند)
                return [];
            }
        }
        
        // جستجو در عنوان و محتوا
        if (search) {
            search = new RegExp(search, "ig");
            query['$or'] = [
                { title: search },
                { content: search },
            ];
        }
        
        const postsList = await this.#model.find(query, {}, { sort: { _id: -1 } });
        return postsList;
    }
    
    // بررسی وجود آگهی و دریافت جزئیات کامل
    async checkExist(postId) {
        if (!postId || !isValidObjectId(postId)) {
            throw new createHttpError.BadRequest(PostMessage.RequestNotValid);
        }
        
        const [postData] = await this.#model.aggregate([
            { $match: { _id: new Types.ObjectId(postId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    userMobile: "$user.mobile"
                }
            },
            {
                $project: {
                    user: 0
                }
            }
        ]);
        
        if (!postData) {
            throw new createHttpError.NotFound(PostMessage.NotFound);
        }
        
        return postData;
    }
    
    // حذف آگهی
    async remove(postId) {
        await this.checkExist(postId);
        await this.#model.deleteOne({ _id: postId });
    }
}

module.exports = new PostService();