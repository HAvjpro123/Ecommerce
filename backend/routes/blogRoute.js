import express from 'express';
import {listBlog, addBlog, removeBlog, singleBlog, editBlog, increaseView} from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const blogRouter = express.Router();

blogRouter.post('/addblog', adminAuth, upload.fields([{name: 'image1', maxCount: 1},{name: 'image2', maxCount: 1},{name: 'image3', maxCount: 1},{name: 'image4', maxCount: 1}]),addBlog);
blogRouter.post('/removeblog', adminAuth, removeBlog);
blogRouter.post('/singleblog', singleBlog);
blogRouter.get('/listblog', listBlog);
// Route để chỉnh sửa bài viết
blogRouter.patch('/editblog', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), editBlog);
blogRouter.patch('/increaseView', increaseView);  // API tăng lượt xem
export default blogRouter
