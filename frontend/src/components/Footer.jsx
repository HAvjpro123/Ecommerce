import React from 'react'
import { assets } from '../assets/assets'
import { Facebook } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Youtube } from 'lucide-react';
import { Mail } from 'lucide-react';

const Footer = () => {
    return (
        <div className=''>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.cespinLogo} className='mb-5 w-32 ' alt="" />
                    <p className='text-base w-full md:w-2/3 text-gray-800 '>© 2024 Công Ty Cổ Phần Vàng Bạc Đá Quý HAVJPRO</p>
                    <p className='w-full md:w-2/3 text-gray-600'>
                        105 Nguyễn Văn A, P.123, Q.Thủ Đức, TP.Hồ Chí Minh
                    </p>
                    <p className='w-full md:w-2/3 text-gray-600'>
                        ĐT: <span className='text-yellow-600'>099 9999999</span> - FAX: <span className='text-yellow-600'>098 9898989</span>
                    </p>
                    <br />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        <span className='text-yellow-600 cursor-pointer'>Website được thực hiện bởi sinh viên Nguyễn Hoàng Anh, MSSV: 2100008188</span>
                        . Đề tài được Thầy Phạm Văn Đăng phê duyệt và thực hiện từ ngày 15/10/2024.
                        <span className='text-yellow-600 cursor-pointer'>Khoa CNTT, chuyên ngành Kỹ Thuật Phần Mềm.</span>
                    </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>VỀ CESPIN</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li className='cursor-pointer hover:text-yellow-600'>Câu chuyện của CESPIN</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Tuyển dụng</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Xuất khẩu</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Kinh doanh sỉ</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Quà tặng doanh nghiệp</li>
                    </ul>
                </div>

                <div >
                    <p className='text-xl font-medium mb-5'>DỊCH VỤ KHÁCH HÀNG</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li className='cursor-pointer hover:text-yellow-600'>Hướng dẫn đo size</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Mua hàng trả góp</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Hướng dẫn mua hàng và thanh toán</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Cẩm nang trang sức</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Câu hỏi thường gặp</li>
                    </ul>
                </div>

                <div >
                    <p className='text-xl font-medium mb-5'>CHÍNH SÁCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li className='cursor-pointer hover:text-yellow-600'>Chính sách hoàn tiền</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Chính sách giao hàng</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Chính sách đổi trả</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Chính sách bảo mật thông tin khách hàng</li>
                        <li className='cursor-pointer hover:text-yellow-600'>Chính sách xử lý dữ liệu cá nhân</li>
                    </ul>
                </div>

                <div >
                    <p className='text-xl font-medium mb-5'>KẾT NỐI VỚI CHÚNG TÔI</p>
                    <ul className='flex flex-row gap-4 text-gray-600'>
                        <li className='cursor-pointer hover:text-yellow-600'><Facebook size={35} /></li>
                        <li className='cursor-pointer hover:text-yellow-600'><Instagram size={35} /></li>
                        <li className='cursor-pointer hover:text-yellow-600' ><Youtube size={40} /></li>
                        <li className='cursor-pointer hover:text-yellow-600'><Mail size={35} /></li>
                    </ul>
                </div>

                <div>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62694.92003089854!2d106.71194253621223!3d10.854672110320415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d85e042bf04b%3A0xbb26baec1664394d!2zVGjhu6cgxJDhu6ljLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1732605969808!5m2!1svi!2s" className='sm:w-[280px] w-full sm:h-[280px] h-[340px]' loading="lazy"></iframe>
                </div>

            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ cespin.com - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer