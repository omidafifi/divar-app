// کنترلر مربوط به مدیریت آگهی‌ها
const autoBind = require("auto-bind");
const { PostMessage } = require("./post.message");
const HttpCodes = require("http-codes");
const postService = require("./post.service");
const CategoryModel = require("../category/category.model");
const createHttpError = require("http-errors");
const { Types } = require("mongoose");
const { removePropertyInObject } = require("../../common/utils/functions");
const { getAddressDetail } = require("../../common/utils/http");
const utf8 = require("utf8");

class PostController {
    #service;
    success_message;
    
    constructor() {
        autoBind(this);
        this.#service = postService;
    }
    
    // نمایش صفحه ایجاد آگهی
    async createPostPage(req, res, next) {
        try {
            let { slug } = req.query;
            let showBack = false;
            let match = { parent: null };
            let options, categoryData;
            
            if (slug) {
                slug = slug.trim();
                categoryData = await CategoryModel.findOne({ slug });
                if (!categoryData) {
                    throw new createHttpError.NotFound(PostMessage.NotFound);
                }
                
                options = await this.#service.getCategoryOptions(categoryData._id);
                if (options.length === 0) {
                    options = null;
                }
                
                showBack = true;
                match = {
                    parent: categoryData._id
                };
            }
            
            const categoriesList = await CategoryModel.aggregate([
                {
                    $match: match
                }
            ]);
            
            res.render("./pages/panel/create-post.ejs", {
                categories: categoriesList,
                showBack,
                category: categoryData?._id.toString(),
                options,
            });
        } catch (error) {
            next(error);
        }
    }
    
    // ایجاد آگهی جدید
    async create(req, res, next) {
        try {
            const userId = req.user._id;
            const images = req?.files?.map(image => image?.path?.slice(7));
            const { title_post: title, description: content, lat, lng, category, amount } = req.body;
            
            // استخراج آپشن‌ها از body
            const options = removePropertyInObject(req.body, [
                "amount", 
                'title_post', 
                "description", 
                "lat", 
                "lng", 
                "category", 
                "images"
            ]);
            
            // دیکد کردن کلیدهای UTF-8
            for (let key in options) {
                let value = options[key];
                delete options[key];
                key = utf8.decode(key);
                options[key] = value;
            }
            
            // دریافت جزئیات آدرس از API نقشه
            const { address, province, city, district } = await getAddressDetail(lat, lng);
            
            await this.#service.create({
                userId,
                title,
                amount,
                content,
                coordinate: [lat, lng],
                category: new Types.ObjectId(category),
                images,
                options,
                address,
                province,
                city,
                district
            });
            
            this.success_message = PostMessage.Created;
            return res.redirect('/post/my');
        } catch (error) {
            console.error("خطا در ایجاد آگهی:", error);
            next(error);
        }
    }
    
    // دریافت لیست آگهی‌های کاربر
    async findMyPosts(req, res, next) {
        try {
            const userId = req.user._id;
            const postsList = await this.#service.find(userId);
            
            res.render("./pages/panel/posts.ejs", {
                posts: postsList,
                count: postsList.length,
                success_message: this.success_message,
                error_message: null
            });
            
            this.success_message = null;
        } catch (error) {
            next(error);
        }
    }
    
    // حذف آگهی
    async remove(req, res, next) {
        try {
            const { id } = req.params;
            await this.#service.remove(id);
            this.success_message = PostMessage.Deleted;
            return res.redirect('/post/my');
        } catch (error) {
            next(error);
        }
    }
    
    // نمایش جزئیات یک آگهی
    async showPost(req, res, next) {
        try {
            const { id } = req.params;
            const postData = await this.#service.checkExist(id);
            
            // دریافت دسته‌بندی‌ها برای نمایش در sidebar
            const categoriesList = await CategoryModel.find({ parent: { $exists: false } });
            
            // افزودن categories به res.locals برای استفاده در layout
            res.locals.categories = categoriesList;
            res.locals.layout = "./layouts/website/main.ejs";
            
            res.render("./pages/home/post.ejs", {
                post: postData,
                categories: categoriesList
            });
        } catch (error) {
            next(error);
        }
    }
    
    // نمایش لیست تمام آگهی‌ها
    async postList(req, res, next) {
        try {
            const queryParams = req.query;
            const postsList = await this.#service.findAll(queryParams);
            
            // دریافت دسته‌بندی‌ها برای نمایش در sidebar
            const categoriesList = await CategoryModel.find({ parent: { $exists: false } });
            
            // افزودن categories به res.locals برای استفاده در layout و include
            res.locals.categories = categoriesList;
            res.locals.currentCategory = queryParams.category || null;
            res.locals.layout = "./layouts/website/main.ejs";
            
            // لاگ برای دیباگ
            console.log("📋 Query Parameters:", queryParams);
            console.log("📦 تعداد آگهی‌ها:", postsList.length);
            console.log("📂 تعداد دسته‌بندی‌ها:", categoriesList.length);
            
            res.render("./pages/home/index.ejs", {
                posts: postsList,
                categories: categoriesList,
                currentCategory: queryParams.category || null
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostController();