// مدل دسته‌بندی‌ها در دیتابیس
const { Schema, Types, model } = require("mongoose");

const CategorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    icon: { type: String, required: true },
    parent: { type: Types.ObjectId, ref: "Category", required: false },
    parents: { type: [Types.ObjectId], required: false, default: [] },
}, { versionKey: false, id: false, toJSON: { virtuals: true } });

// Virtual برای دسترسی به دسته‌های فرزند
CategorySchema.virtual("children", {
    ref: "Category",
    localField: "_id",
    foreignField: "parent"
});

// تابع برای populate خودکار فرزندان
function autoPopulate(next) {
    this.populate([{ path: "children" }]);
    next();
}

// اعمال autoPopulate به متدهای find و findOne
CategorySchema.pre("find", autoPopulate).pre("findOne", autoPopulate);

const CategoryModel = model("Category", CategorySchema);
module.exports = CategoryModel;