import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: [String], required: true },
    category: { type: String},  // Trường category bắt buộc
    createdBy: { type: String, required: true },
    tags: { type: [String], required: true },
    view: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
});


const blogModel = mongoose.models.blog || mongoose.model("blog", blogSchema)

export default blogModel