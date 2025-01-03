import { TicketPlus } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
const FloatingButtonVoucher = () => {

    return (
        <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3">
            <Link to={'/addvoucher'}>
                <button
                    className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition duration-300 animate-ripple"
                >
                    <TicketPlus />
                </button>
            </Link>
        </div>
    );
};

export default FloatingButtonVoucher;
