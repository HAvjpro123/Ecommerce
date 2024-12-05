import React from 'react'
import { Menu } from 'lucide-react'
import { assets } from '../assets/assets'
import { Inbox } from 'lucide-react';

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
        
      >
       <Inbox size={20} strokeWidth={1.5} className='text-gray-500 mx-6' />
      </button>
    </div>
  )
}

export default Navbar
