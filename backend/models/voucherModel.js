import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    discount: { type: Number , required: true},
    total: { type: Number , required: true},
    createdBy: { type: String, required: true },
    date: { type: Date, required: true },
})

const voucherModel = mongoose.models.voucher || mongoose.model("voucher", voucherSchema)

export default voucherModel