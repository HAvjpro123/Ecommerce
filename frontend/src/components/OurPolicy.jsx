import React from 'react'
import { RefreshCcwDot } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import { Headset } from 'lucide-react';
const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <RefreshCcwDot size={46} className='m-auto mb-5'/>
            <p className='font-semibold'>CHÍNH SÁCH ĐỔI TRẢ DỄ DÀNG</p>
            <p className='text-gray-400'>chúng tôi cung cấp chính sách đổi trả dễ dàng.</p>
        </div>

        <div>
            <CircleCheckBig size={46} className='m-auto mb-5'/>
            <p className='font-semibold'>CHÍNH SÁCH ĐỔI TRẢ TRONG VÒNG 7 NGÀY</p>
            <p className='text-gray-400'>chúng tôi cung cấp chính sách trả hàng miễn phí trong 7 ngày.</p>
        </div>

        <div>
            <Headset size={46} className='m-auto mb-5'/>
            <p className='font-semibold'>LUÔN HỖ TRỢ KHÁCH HÀNG TỐT NHẤT</p>
            <p className='text-gray-400'>chúng tôi luôn cung cấp hỗ trợ khách hàng 24/7.</p>
        </div>
     
    </div>
  )
}

export default OurPolicy