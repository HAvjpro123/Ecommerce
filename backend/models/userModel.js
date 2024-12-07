import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    date: { type: Date},
    amountPurchased: { type: Number},
    itemPurchased: { type: Number},
    level: { type: String, default: 'Đồng'},
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel