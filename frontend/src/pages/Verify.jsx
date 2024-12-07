import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')


    const verifyPayment = async () => {
        try {
            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })

            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
                setTimeout(() => {
                    navigate(0)
                }, 4000);
            } else {
                navigate('/cart')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    useEffect(() => {
    }, [token])

    return (
        <div class="flex items-center justify-center   mt-20 ">

            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-lg max-w-sm w-full transform transition-all scale-100 ">

                <div class="flex items-center justify-center bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 mx-auto shadow-md">

                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>


                <h2 class="text-center mt-4 text-xl font-semibold text-gray-700">Thanh toán thành công</h2>

                <p class="text-center mt-2 text-gray-500 text-sm">Cảm ơn bạn đã mua sắm! Đơn hàng của bạn đang được xử lý.</p>


                <div class="mt-4 flex justify-center">
                    <button onClick={verifyPayment} class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white  shadow-lg transition ease-in-out duration-200 transform hover:scale-105">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>

    )
}

export default Verify