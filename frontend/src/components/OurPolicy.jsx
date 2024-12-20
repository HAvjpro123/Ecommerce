import React from 'react';
import { RefreshCcwDot } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import { Headset } from 'lucide-react';

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-8 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700 '>
      {/* Chính sách đổi trả dễ dàng */}
      <div className='flex flex-col items-center'>
        <div className='p-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-xl mb-5 transform hover:scale-105 transition-all'>
          <RefreshCcwDot size={38} className='text-white' />
        </div>
        <p className='font-semibold text-lg text-gray-800 mb-2'>CHÍNH SÁCH ĐỔI TRẢ DỄ DÀNG</p>
        <p className='text-gray-500'>Chúng tôi cung cấp chính sách đổi trả dễ dàng.</p>
      </div>

      {/* Chính sách đổi trả trong vòng 7 ngày */}
      <div className='flex flex-col items-center'>
        <div className='p-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-xl mb-5 transform hover:scale-105 transition-all'>
          <CircleCheckBig size={38} className='text-white ' />
        </div>
        <p className='font-semibold text-lg text-gray-800 mb-2'>CHÍNH SÁCH ĐỔI TRẢ TRONG VÒNG 7 NGÀY</p>
        <p className='text-gray-500'>Chúng tôi cung cấp chính sách trả hàng miễn phí trong 7 ngày.</p>
      </div>

      {/* Hỗ trợ khách hàng tốt nhất */}
      <div className='flex flex-col items-center'>
        <div className='p-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-xl mb-5 transform hover:scale-105 transition-all'>
          <Headset size={38} className='text-white' />
        </div>
        <p className='font-semibold text-lg text-gray-800 mb-2'>LUÔN HỖ TRỢ KHÁCH HÀNG TỐT NHẤT</p>
        <p className='text-gray-500'>Chúng tôi luôn cung cấp hỗ trợ khách hàng 24/7.</p>
      </div>
    </div>
  );
}

export default OurPolicy;
