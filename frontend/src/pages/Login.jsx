import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Backdrop, CircularProgress } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {

  const [loading, setLoading] = useState(false);

  const [currentState, setCurrentState] = useState('ĐĂNG NHẬP');
  const { token, setToken, navigate, backendUrl, setUserName, setUserId } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      if (currentState === 'ĐĂNG KÝ') {

        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          toast.success(response.data.message)
          setLoading(false)
          setCurrentState('ĐĂNG NHẬP')
        } else {
          toast.error(response.data.message)
          setLoading(false)
        }

      } else {

        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          setUserName(response.data.user.name); // Lưu tên người dùng
          setUserId(response.data.user.id); // Lưu ID người dùng
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userName', response.data.user.name);
          localStorage.setItem('userId', response.data.user.id);
          console.log(response.data);
          setLoading(false)
          toast.success(response.data.message)
        } else {
          toast.error(response.data.message)
          setLoading(false)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      setLoading(false)
    }
  }

  const handleLoginSuccess = async (response) => {
    setLoading(true);
    try {
      const googleToken = response.credential;

      // Gửi yêu cầu tới API để kiểm tra tài khoản Google
      const checkResponse = await axios.post(`${backendUrl}/api/user/check-google-account`, {
        googleToken,
      });

      if (checkResponse.data.exists) {
        // Tài khoản Google đã tồn tại, đăng nhập
        const loginResponse = await axios.post(`${backendUrl}/api/user/login`, {
          email: checkResponse.data.email,
          password: '123123123',
        });

        if (loginResponse.data.success) {
          setToken(loginResponse.data.token);
          setUserName(loginResponse.data.user.name); // Lưu tên người dùng
          setUserId(loginResponse.data.user.id); // Lưu ID người dùng
          localStorage.setItem('token', loginResponse.data.token)
          localStorage.setItem('userName', loginResponse.data.user.name);
          localStorage.setItem('userId', loginResponse.data.user.id);
          console.log(loginResponse.data);
          toast.success('Đăng nhập thành công!')
        } else {
          toast.error('Đăng nhập thất bại!');
        }
      } else {
        // Tạo tài khoản mới với thông tin từ Google
        const registerResponse = await axios.post(`${backendUrl}/api/user/register`, {
          name: checkResponse.data.name || 'Người dùng Google',
          email: checkResponse.data.email,
          password: '123123123',
        });

        if (registerResponse.data.success) {
          setToken(registerResponse.data.token);
          localStorage.setItem('token', registerResponse.data.token);

          toast.success('Tạo tài khoản và đăng nhập thành công!');
        } else {
          toast.error('Tạo tài khoản thất bại!');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi khi xử lý đăng nhập Google.');
    } finally {
      setLoading(false);
    }
  };


  const handleLoginFailure = (error) => {
    console.error(error);
  };

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-4 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <hr className='border-none h-[1px] w-4 bg-gray-600' />
        <p className='text-2xl text-gray-700 font-medium'>{currentState} TÀI KHOẢN</p>
        <hr className='border-none h-[1px] w-4 bg-gray-600' />
      </div>
      {currentState === 'ĐĂNG NHẬP' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Tên đăng nhập' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer hover:text-yellow-600 '>Quên mật khẩu?</p>
        {
          currentState === 'ĐĂNG NHẬP'
            ? <p onClick={() => setCurrentState('ĐĂNG KÝ')} className='cursor-pointer hover:text-yellow-600 duration-200'>Tạo tài khoản</p>
            : <p onClick={() => setCurrentState('ĐĂNG NHẬP')} className='cursor-pointer hover:text-yellow-600 duration-200'>Đã có tài khoản</p>
        }
      </div>
      <button className='hover:border-gray-500 border hover:text-gray-500 text-black border-black duration-200 font-semibold px-8 py-2 mt-4 w-full'>{currentState === 'ĐĂNG NHẬP' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}</button>

      {
        currentState === 'ĐĂNG NHẬP'
          ?
          <div className='flex w-full gap-2 items-center my-2'>
            <p className='w-full  h-[1px] sm:h-[1px] bg-gray-400'></p>
            <p className='text-gray-500 font-medium'>HOẶC</p>
            <p className='w-full h-[1px] sm:h-[1px] bg-gray-400'></p>
          </div>
          : ''
      }

      {
        currentState === 'ĐĂNG NHẬP'
          ? <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
          : ''
      }

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>

  )
}

export default Login