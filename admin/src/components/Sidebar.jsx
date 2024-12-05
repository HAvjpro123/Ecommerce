import React from 'react';
import { NavLink } from 'react-router-dom';
import { CirclePlus, Archive, FilePenLine, LayoutDashboard, BookCopy, ClipboardList, Tickets, TicketPlus } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, setToken }) => {
  return (
    <div
      className={`fixed md:static top-0 left-0 z-50 w-[100%] md:w-[15%] min-h-screen bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 border-r`}
    >
      {/* Close button for small screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-500 hover:text-gray-700 absolute top-4 right-4 text-2xl"
      >
        ✕
      </button>

      <div className="flex flex-col gap-2 pt-6 px-4 text-[15px] mt-10 sm:mt-0">
        {/* Sidebar Links */}
        {
          [
            { to: '/', icon: LayoutDashboard, label: 'Bảng điều khiển' },
            { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
            { to: '/list', icon: Archive, label: 'Sản phẩm' },
            { to: '/listblog', icon: BookCopy, label: 'Bài viết' },
            { to: '/listvoucher', icon: Tickets, label: 'Mã giảm giá' },
          ].map(({ to, icon: Icon, label }, index) => (
            <NavLink
              key={index}
              to={to}
              className={({ isActive }) =>
                `rounded-md text-xs font-thin flex items-center gap-3 px-3 py-3 text-gray-600 border border-gray-300 hover:text-gray-800 transition ${isActive ? 'active' : ''
                }`
              }
              onClick={toggleSidebar}
            >
              <Icon strokeWidth={1.5} size={25} className="icon p-1 " />
              <p className="font-medium">{label}</p>
            </NavLink>

          ))
        }
        <hr className='my-1'/>
        <button
          onClick={() => setToken('')}
          className='border-gray-600 border rounded-md text-gray-600 hover:border-yellow-600 hover:text-yellow-600 py-1 p-3 sm:px-5 sm:py-2 text-xs font-medium'
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
