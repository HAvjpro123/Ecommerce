import React, { useState } from 'react';
import { Tooltip } from '@mui/material'; // Import Tooltip từ MUI
import { assets } from '../assets/assets';
import { MessagesSquare, PhoneCall } from 'lucide-react';

const FloatingButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleButtons = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3">
            {isOpen && (
                <div className="flex flex-col space-y-6 mb-4">

                    <button
                        onClick={() => window.open('https://zaloapp.com/qr/p/16qoqffrai06d', '_blank')}
                        className="bg-gray-200 hover:bg-gray-300 text-black rounded-full w-14 h-14 shadow-md transition duration-300"
                    >
                        <Tooltip title="Zalo" arrow placement="left">
                            <img src={assets.zalo} alt="zalo" className="object-cover rounded-full" />
                        </Tooltip>
                    </button>

                    <button
                        onClick={() => window.open('https://m.me/hoanganh190503', '_blank')}
                        className="bg-gray-200 hover:bg-gray-300 text-black rounded-full w-14 h-14 shadow-md transition duration-300"
                    >
                        <Tooltip title="Messenger" arrow placement="left">
                            <img src={assets.messenger} alt="messengerr" className="object-cover " />
                        </Tooltip>
                    </button>

                    <button href='/' className="bg-gray-200 hover:bg-gray-300 text-black rounded-full w-14 h-14 shadow-md transition duration-300">
                        <Tooltip title="Hotline: 1800 98 98" arrow placement="left">
                            <img src={assets.phone} alt="hotline" className='object-cover rounded-full' />
                        </Tooltip>
                    </button>
                </div>
            )}
            <button
                onClick={toggleButtons}
                className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition duration-300 animate-ripple"
            >
                {/* Làn sóng tỏa ra từ viền */}
                <span className="absolute top-0 left-0 w-full h-full rounded-full animate-ripple"></span>

                <Tooltip title="Liên hệ" arrow placement="left">
                    {/* Bọc icon và văn bản vào trong một div hoặc span */}
                    <div className="flex flex-col items-center justify-center">
                        <MessagesSquare strokeWidth={1.5} size={20} className="mb-0.5" />
                        <p className="text-[12px]">liên hệ</p>
                    </div>
                </Tooltip>
            </button>
        </div>
    );
};

export default FloatingButton;
