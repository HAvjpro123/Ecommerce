import React, { useContext, useEffect } from 'react'
import LatestBlogs from '../components/LastestBlogs'
import { ShopContext } from '../context/ShopContext';
import NewsletterBox from '../components/NewsletterBox';


const BlogList = () => {

  const { blogs} = useContext(ShopContext);

  useEffect(() => {
   
  }, [blogs])

  return (
    <div >
      <LatestBlogs></LatestBlogs>
      <div className='mt-20 border-t border-gray-300 pt-20'>
        <NewsletterBox></NewsletterBox>
      </div>
      123
    </div>
  )
}

export default BlogList