import { v2 as cloudinary } from "cloudinary"
import blogModel from "../models/blogModel.js"

// function for add product
const addBlog = async (req, res) => {
    try {
      const { name, description, content, createdBy, view, tags, category } = req.body;
  
      const image1 = req.files?.image1 && req.files.image1[0];
      const image2 = req.files?.image2 && req.files.image2[0];
      const image3 = req.files?.image3 && req.files.image3[0];
      const image4 = req.files?.image4 && req.files.image4[0];
  
      const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
  
      let imageUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
          return result.secure_url;
        })
      );
  
      const blogData = {
        name,
        description,
        content,  // Nội dung HTML được gửi từ Quill
        image: imageUrl,
        category,
        createdBy,
        tags: JSON.parse(tags),
        view: Number(view) === 0,
        date: Date.now(),
      };
  
      const blog = new blogModel(blogData);
      await blog.save();
  
      res.json({ success: true, message: "Thêm bài viết thành công" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

// function for list blog
const listBlog = async (req, res) => {
    try {
        
        const blogs = await blogModel.find({});
        res.json({success:true, blogs})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for remove blog
const removeBlog = async (req, res) => {
    try {
        
        await blogModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: 'Đã xóa bài viết'})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single blog
const singleBlog = async (req, res) => {
    try {
        
        const {blogId} = req.body
        const blog = await blogModel.findById(blogId)
        res.json({ success: true, blog})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// function for increasing view count of a blog
const increaseView = async (req, res) => {
    try {
        const { blogId } = req.body;
        
        // Tìm bài viết theo ID và cập nhật lượt xem
        const blog = await blogModel.findById(blogId);
        
        if (blog) {
            // Tăng số lượt xem lên 1
            blog.view += 1;
            await blog.save();
            
            res.json({ success: true, message: 'Lượt xem đã được cập nhật', blog });
        } else {
            res.json({ success: false, message: 'Không tìm thấy bài viết' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export { increaseView, listBlog, addBlog, removeBlog, singleBlog};