import React from 'react';
import { NavLink } from 'react-router-dom';
import { CirclePlus, Archive, FilePenLine, LayoutDashboard, BookCopy, ClipboardList, Tickets, TicketPlus } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed md:static top-0 left-0 z-50 w-[100%] md:w-[15%] min-h-screen bg-white shadow-md transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 border-r`}
    >
      {/* Close button for small screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-500 hover:text-gray-700 absolute top-4 right-4 text-2xl"
      >
        ✕
      </button>

      <div className="flex flex-col gap-4 pt-6 px-6 text-[15px] mt-10 sm:mt-0">
        {/* Sidebar Links */}
        {[
          { to: '/', icon: LayoutDashboard, label: 'Bảng điều khiển' },
          { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
          { to: '/add', icon: CirclePlus, label: 'Thêm sản phẩm' },
          { to: '/addblog', icon: FilePenLine, label: 'Tạo bài viết' },
          { to: '/addvoucher', icon: TicketPlus, label: 'Tạo mã giảm giá' },
          { to: '/list', icon: Archive, label: 'Sản phẩm' },
          { to: '/listblog', icon: BookCopy, label: 'Bài viết' },
          { to: '/listvoucher', icon: Tickets, label: 'Mã giảm giá' },
        ].map(({ to, icon: Icon, label }, index) => (
          <NavLink
            key={index}
            to={to}
            className="rounded-sm flex items-center gap-3 px-4 py-3 text-gray-600 border hover:border-yellow-600 hover:text-gray-800 transition"
            onClick={toggleSidebar}
          >
            <Icon strokeWidth={1.5} size={20} className="text-yellow-600" />
            <p className="font-medium">{label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
