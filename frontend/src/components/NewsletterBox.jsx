import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const NewsletterBox = () => {
    const form = useRef();
    const [message, setMessage] = useState('');

    const onSubmitHandler = (event) => {
        event.preventDefault();

        // Lấy giá trị email từ form
        const emailValue = form.current.user_email.value;

        emailjs
            .sendForm(
                'service_7huxl8s', // Thay bằng Service ID của bạn
                'template_j300odp', // Thay bằng Template ID của bạn
                form.current,
                'tLhyccwDPOr2pJPcB' // Thay bằng User ID (hoặc Public Key) của bạn
            )
            .then(
                (result) => {
                    toast.success(`Đã gửi thành công đến email: ${emailValue}!`);
                    setMessage('Email đã được gửi thành công!');
                },
                (error) => {
                    toast.error('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.');
                    setMessage('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.');
                }
            );
    };

    return (
        <div className="text-center">
            <p className="text-2xl font-medium text-gray-800">
                Đăng ký ngay và nhận voucher giảm giá tới 50%
            </p>
            <p className="text-gray-400 mt-3">
                Luôn cập nhật tới bạn những thông tin mới nhất về sản phẩm và những mã giảm giá cực hot.
            </p>
            <form
                ref={form}
                onSubmit={onSubmitHandler}
                className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 pl-3 border border-gray-400"
            >
                <input
                    className="w-full sm:flex-1 outline-none "
                    type="email"
                    name="user_email" // Quan trọng để EmailJS lấy email từ input
                    placeholder="Nhập địa chỉ mail của bạn..."
                    required
                />
                <button type="submit" className=" bg-gradient-to-r from-yellow-500 to-yellow-600  text-white text-md px-10 py-4">
                    Đăng ký
                </button>
            </form>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default NewsletterBox;
