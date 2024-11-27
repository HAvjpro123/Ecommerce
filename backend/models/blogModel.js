import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true},
    image: { type: Array, required: true },
    view: { type: Number , required: true},
    category: { type: String, required: true },
    createdBy: { type: String, required: true },
    tags: { type: Array, required: true },
    date: { type: Date, required: true },
})

const blogModel = mongoose.models.blog || mongoose.model("blog", blogSchema)

export default blogModel