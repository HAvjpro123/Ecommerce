import React from 'react'
import { Menu } from 'lucide-react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken, toggleSidebar }) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between bg-white shadow-md'>
      
      {/* Left Section: Menu + Logo */}
      <div className='flex items-center gap-4'>
        {/* Menu button for small screens */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-gray-600 hover:text-yellow-600"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
        
        {/* Logo */}
        <img className='w-[max(6%,80px)]' src={assets.cespinLogo} alt="" />
      </div>

      {/* Right Section: Logout Button */}
      <button 
        onClick={() => setToken('')} 
        className='border-gray-600 border rounded-md text-gray-600 hover:border-yellow-600 hover:text-yellow-600 py-1 px-2 sm:px-5 sm:py-2 text-xs sm:text-sm'
      >
        Đăng xuất
      </button>
    </div>
  )
}

export default Navbar
