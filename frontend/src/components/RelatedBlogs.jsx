import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState } from 'react'
import BlogCard from './BlogCard';
import { useNavigate } from 'react-router-dom';

const RelatedBlogs = ({ category }) => {
    const { blogs } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        if (blogs.length > 0) {

            let blogsCopy = blogs.slice();

            blogsCopy = blogsCopy.filter((item) => category === item.category)

            setRelated(blogsCopy.slice(0, 5));

        }
    }, [])
    return (
        <div className='my-4 px-2'>
            <div className='flex justify-between'>
                <p className='text-2xl text-gray-500 '>Bài viết liên quan</p>
                <p onClick={() => navigate('/bloglist')} className='underline my-auto text-yellow-600 cursor-pointer'>xem thêm</p>
            </div>
            

            <div className=''>
                {related.map((item, index) => (
                    <div key={index} className='my-4'>
                        <BlogCard  id={item._id}
                        image={item.image}
                        name={item.name}
                        view={item.view}
                        description={item.description} />
                    </div>
                    
                ))}
            </div>
        </div>
    )
}

export default RelatedBlogs