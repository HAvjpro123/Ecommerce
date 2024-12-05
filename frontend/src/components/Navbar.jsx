import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, Search, ShoppingCart, UserRound } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, userName, userId } = useContext(ShopContext)

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    const handleSearchClick = () => {
        setShowSearch(true);
        navigate('/collection');
    };

    const handleCart = () => {
        navigate('/cart')
        navigate(0)
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to={'/'}><img src={assets.cespinLogo} className='w-24' alt="logo" /></Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>TRANG CHỦ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-yellow-600 hidden ' />
                </NavLink>

                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>BỘ SƯU TẬP</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-yellow-600 hidden' />
                </NavLink>

                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>THƯƠNG HIỆU</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-yellow-600 hidden' />
                </NavLink>

                <NavLink to='/bloglist' className='flex flex-col items-center gap-1'>
                    <p>TIN TỨC</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-yellow-600 hidden' />
                </NavLink>

                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>LIÊN HỆ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-yellow-600 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <Search onClick={handleSearchClick} strokeWidth={1.5} className='cursor-pointer' />

                <div onClick={handleCart} className='relative'>
                    <ShoppingCart strokeWidth={1.5} className='cursor-pointer' />
                    <p className='absolute right-[-8px] bottom-[13px] w-4 text-center leading-4  bg-gradient-to-r from-yellow-600 to-yellow-400 text-white aspect-square rounded-full text-[10px]'>{getCartCount()}</p>
                </div>

                <div className='group relative'>
                    <UserRound onClick={() => token ? null : navigate('/login')} strokeWidth={1.5} className='cursor-pointer' />
                    {/* Dropdown Menu */}
                    {
                        token &&
                        <div className='absolute group-hover:block hidden z-10 dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded text-sm' >
                                <p className='text-yellow-600 '> {userName} </p>
                                <hr/>
                                {userId === '6728513cfc5631dbb27fe486'
                                ? <a className='cursor-pointer hover:text-black' href='https://cespin-admin.vercel.app/'>Quản lý cửa hàng</a>
                                : '' }
                                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Đơn đặt hàng</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>Đăng xuất</p>
                            </div>
                        </div>
                    }
                </div>

                <Menu onClick={() => setVisible(true)} strokeWidth={1.5} className='cursor-pointer sm:hidden' />
            </div>
            {/* Sidebar menu for small screen */}

            <div className={` top-0 right-0 bottom-0 overflow-hidden fixed min-h-screen z-10 bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <ChevronDown strokeWidth={1.5} className='rotate-90' />
                        <p>Quay lại</p>
                    </div>

                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>TRANG CHỦ</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>BỘ SƯU TẬP</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>THÔNG TIN</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/bloglist'>BLOG</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>LIÊN HỆ</NavLink>
                </div>
            </div>

        </div>
    )
}

export default Navbar