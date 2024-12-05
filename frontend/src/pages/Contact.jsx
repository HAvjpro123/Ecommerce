import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import FloatingButtonTop from '../components/FloatingButonTop'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'LIÊN HỆ VỚI'} text2={'CHÚNG TÔI'}></Title>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-xl text-gray-600'>Cửa hàng của chúng tôi</p>
            <p className='text-gray-500'> 123 Nguyễn Văn A <br /> Phú Quý, Thủ Đức, TP.Hồ Chí Minh</p>
            <p className='text-gray-500'>Liên hệ: <span className=' cursor-pointer text-yellow-600'>(090) 999-8888</span>  <br />Email: <span className=' cursor-pointer text-yellow-600'>admin@cespin.com</span> </p>
            <p className='font-semibold text-xl text-gray-600'>Doanh nghiệp thuộc CESPIN</p>
            <p className='text-gray-500'>Tìm hiểu thêm về đội ngũ của chúng tôi và các thông báo mới.</p>
            <button className='border border-gray-500 text-gray-500 px-8 py-4 text-sm hover:border-yellow-600 hover:text-yellow-600  transition-all duration-300'>Tìm hiểu thêm</button>
        </div>
      </div>
      <FloatingButtonTop></FloatingButtonTop>
    </div>
  )
}

export default Contact