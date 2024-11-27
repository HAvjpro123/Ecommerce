import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    return (
        <div className='min-h-screen flex items-center border border-gray-300 justify-center'>
            <div className='bg-white px-12 py-7 border border-gray-300 h-96' >
                <h1 className='text-2xl font-bold mb-4 mt-8 text-gray-800'>CESPIN ADMIN</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email:</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='Nhập địa chỉ email...' required />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Mật khẩu:</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Nhập mật khẩu...' required />
                    </div>
                    <button className='mt-2 w-full py-2 px-4 font-medium text-gray-700 border border-gray-800' type='submit'>ĐĂNG NHẬP</button>
                </form>
            </div>
            <img className='max-h-96 border border-gray-300 border-l-0 hidden sm:block' src={assets.loginbanner} alt="" />
        </div>
    )
}

export default Login