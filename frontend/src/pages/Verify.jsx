import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Check, ArchiveX  } from 'lucide-react';

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
            } 
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    const handlenavigateOrder = () => {
        navigate('/orders')
        setTimeout(() => {
            navigate(0)
        }, 4000);
    }

    const handlenavigateCart = () => {
        navigate('/cart')

        navigate(0)
    }
    useEffect(() => {
        verifyPayment();
    }, [success, orderId, token]);

    return (
        <div className="flex items-center justify-center mt-20 ">
            {
                success === 'true'
                    ? <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg max-w-sm w-full transform transition-all scale-100 ">

                        <div className="flex items-center justify-center bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 mx-auto shadow-md">

                        <Check size={30} strokeWidth={2}></Check>
                        </div>


                        <h2 className="text-center mt-4 text-xl font-semibold text-gray-700">Thanh toán thành công</h2>

                        <p className="text-center mt-2 text-gray-500 text-sm">Cảm ơn bạn đã mua sắm! Đơn hàng #{orderId} của bạn đang được xử lý.</p>


                        <div className="mt-4 flex justify-center">
                            <button onClick={handlenavigateOrder}  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white  shadow-lg transition ease-in-out duration-200 transform hover:scale-105">
                               Xem chi tiết
                            </button>
                        </div>
                    </div>
                    : <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg max-w-sm w-full transform transition-all scale-100 ">

                        <div className="flex items-center justify-center bg-yellow-100 text-yellow-600 p-4 rounded-full w-16 h-16 mx-auto shadow-md">
                            <ArchiveX  size={30} strokeWidth={2}></ArchiveX >
                            
                        </div>


                        <h2 className="text-center mt-4 text-xl font-semibold text-gray-700">Hủy đơn hàng</h2>

                        <p className="text-center mt-2 text-gray-500 text-sm">Đơn hàng #{orderId} của bạn đang được hủy thành công.</p>


                        <div className="mt-4 flex justify-center">
                            <button onClick={handlenavigateCart}   className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white  shadow-lg transition ease-in-out duration-200 transform hover:scale-105">
                                Đi tới giỏ hàng
                            </button>
                        </div>
                    </div>
            }

        </div>
    )
}

export default Verify