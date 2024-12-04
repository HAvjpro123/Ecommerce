import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddProduct from './pages/AddProduct'
import ListProduct from './pages/ListProduct'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddBlog from './pages/AddBlog'
import ListBlog from './pages/ListBlog'
import AddVoucher from './pages/AddVoucher'
import ListVoucher from './pages/ListVoucher'
import AdminChat from './pages/AdminChat'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'đ'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '' );
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer />
      { token === ''
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} toggleSidebar={toggleSidebar} />
          <hr />
          <div className='flex w-full bg-gray-100'>
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className='w-[85%] mx-auto pr-6 ml-[max(5vh,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Dashboard token={token} />}></Route>
                <Route path='/add' element={<AddProduct token={token} />}></Route>
                <Route path='/list' element={<ListProduct token={token} />}></Route>
                <Route path='/orders' element={<Orders token={token} />}></Route>
                <Route path='/addblog' element={<AddBlog token={token} />}></Route>
                <Route path='/listblog' element={<ListBlog token={token} />}></Route>
                <Route path='/addvoucher' element={<AddVoucher token={token} />}></Route>
                <Route path='/listvoucher' element={<ListVoucher token={token} />}></Route>
                <Route path='/chat' element={<AdminChat token={token} />}></Route>
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App
