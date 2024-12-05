import React, { useContext, useEffect } from 'react'
import LatestBlogs from '../components/LastestBlogs'
import { ShopContext } from '../context/ShopContext';
import NewsletterBox from '../components/NewsletterBox';
import FloatingButtonTop from '../components/FloatingButonTop';


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
      <FloatingButtonTop></FloatingButtonTop>
    </div>
  )
}

export default BlogList