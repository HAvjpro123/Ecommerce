import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameCode: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sale: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    subCategorySex: { type: String, required: true },
    sizes: { type: Array, required: true },
    totalStock: { type: Number, required: true },
    sold: { type: Number, required: true },
    onStock: { type: Boolean },
    bestseller: { type: Boolean },
    date: { type: Date, required: true },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
            userName: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
            reviewDate: { type: Date, default: Date.now },
        }
    ],
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel