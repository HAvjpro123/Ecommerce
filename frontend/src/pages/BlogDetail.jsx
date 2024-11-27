import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Breadcrumbs } from '@mui/material';
import RelatedBlogs from '../components/RelatedBlogs';

const BlogDetail = () => {

    const { blogId } = useParams()
    const { blogs } = useContext(ShopContext);
    const [blogData, setBlogData] = useState(false);
    const [image, setImage] = useState('')
    const navigate = useNavigate()


    const fetchBlogData = async () => {
        blogs.map((item) => {
            if (item._id === blogId) {
                setBlogData(item)
                setImage(item.image[0])
                return null;
            }
        })
    }

    useEffect(() => {
        fetchBlogData()
    }, [blogId, blogData])

    return blogData ? (
        <div >
            <div className='sm:grid-cols-[3fr_1fr] grid flex-wrap gap-2'>
                <div className='w-full sm:border-r sm:pr-4'>
                    <div className='sm:flex justify-between text-lg my-4 '>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" className='text-gray-500 text-lg' to="/">
                                Trang chủ
                            </Link>
                            <Link
                                underline="hover"
                                color="inherit"
                                to="/bloglist"
                                className='text-gray-500 text-lg'
                            > {blogData.category}
                            </Link>
                            <span className='text-yellow-600 text-lg '>Bài viết</span>
                        </Breadcrumbs>
                        <p className='text-gray-500'>Ngày đăng: {new Date(blogData.date).toLocaleDateString('vi-VN', {
                            weekday: 'long', // Hiển thị thứ
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}, {new Date(blogData.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div className='my-4'>
                        <p className='text-4xl font-semibold'>{blogData.name}</p>
                    </div>
                    <div className='flex justify-between text-lg my-4'>
                        <p className='text-gray-500'>Danh mục:
                            {blogData.tags.map((item, index) => (
                                <span onClick={() => navigate('/bloglist')} className='text-yellow-600 cursor-pointer' key={index}> {item},</span>
                            ))}
                        </p>
                        <p className='text-gray-500'>Đăng bởi: <span className='text-black'>{blogData.createdBy}</span>, Lượt xem: {blogData.view}  </p>
                    </div>
                    <div>
                        <p className='text-xl font-semibold'>{blogData.description}</p>
                    </div>     

                    <div className='mt-10 text-gray-500 content' dangerouslySetInnerHTML={{ __html: blogData.content }} />
                </div>
                <div className='w-full'>
                    <RelatedBlogs category={blogData.category}></RelatedBlogs>
                </div>
            </div>


        </div>
    ) : <div className='opacity-0'>

    </div>
}

export default BlogDetail