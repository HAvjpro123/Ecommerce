

import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { discountAmount, navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    district: '',
    zipcode: '',
    phone: '',
    description: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const getOrderTotal = () => {
    const cartAmount = getCartAmount();
    const totalAmount = cartAmount + delivery_fee - discountAmount;
    return totalAmount > 0 ? totalAmount : 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getOrderTotal(),
        currency: 'VND',
      };

      // const sendConfirmationEmail = (orderDetails) => {
      //   const order_date = new Date();
      //   const formattedDate = order_date.toLocaleString('vi-VN', {
      //     year: 'numeric',
      //     month: 'long',
      //     day: 'numeric',
      //     hour: '2-digit',
      //     minute: '2-digit',
      //   });
      //   // Tạo thông tin gửi mail
      //   const templateParams = {
      //     user_address: `${formData.street}, ${formData.state}, ${formData.district}, ${formData.city},`, // Địa chỉ giao hàng
      //     user_email: formData.email,
      //     user_name: `${formData.firstName} ${formData.lastName}`,
      //     order_total: getOrderTotal().toLocaleString(),
      //     order_items: orderDetails.map(
      //       (item) => `${item.name} (Kích thước: ${item.size}) - SL:${item.quantity} x ${(item.price).toLocaleString()} VND`
      //     ).join('\n'),
      //     order_date: formattedDate
      //   };

      //   // Gửi email thông qua EmailJS
      //   emailjs
      //     .send(
      //       'service_7huxl8s', // Thay bằng Service ID của bạn
      //       'template_y1myswj', // Thay bằng Template ID của bạn
      //       templateParams,
      //       'tLhyccwDPOr2pJPcB' // Thay bằng User ID của bạn
      //     )
      //     .then(
      //       () => toast.success(`Xác nhận đơn hàng đã gửi tới ${formData.email}`),
      //       (error) => toast.error('Gửi email thất bại: ' + error.text)
      //     );
      // };

      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
          if (response.data.success) {
            console.log(response.data);

            setCartItems({});
            toast.success('Đặt hàng thành công!');
            // sendConfirmationEmail(orderItems); // Gửi email xác nhận
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
          if (responseStripe.data.success) {
            // sendConfirmationEmail(orderItems);
            const { session_url } = responseStripe.data;

            window.location.replace(session_url);

            toast.warning('Chuyển hướng sang thanh toán Stripe!');
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case 'paypal':
          const responsePaypal = await axios.post(backendUrl + '/api/order/paypal', orderData, { headers: { token } });
          if (responsePaypal.data.success) {
            const { approval_url } = responsePaypal.data;
            window.location.replace(approval_url);
            toast.warning('Chuyển hướng sang thanh toán Paypal!');
            // sendConfirmationEmail(orderItems);
          } else {
            toast.error(responsePaypal.data.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'THÔNG TIN'} text2={'GIAO HÀNG'}></Title>
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Họ" />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Tên" />
        </div>
        <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email" />
        <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Địa chỉ nhà" />
        <div className='flex gap-3  '>
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phường/Xã' />
          <input required onChange={onChangeHandler} name='district' value={formData.district} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Quận/Huyện' />
        </div>
        <div className='flex gap-3  '>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Thành phố' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Số điện thoại' />
        <textarea onChange={onChangeHandler} name='description' value={formData.description} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Ghi chú đơn hàng' />
      </div>
      {/* RIGHT SIDE */}
      <div className='mt-4'>

        <div className='min-w-80'>
          <CartTotal discountAmount={discountAmount}></CartTotal>
        </div>

        <div className='mt-12'>
          <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'}></Title>
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''} `}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('paypal')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paypal' ? 'bg-green-400' : ''} `}></p>
              <img className='h-5 mx-4' src={assets.paypal} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''} `}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>THANH TOÁN COD</p>
            </div>
          </div>

          <div className='mt-8 border p-4 border-yellow-600 max-w-[600px] '>
            <p>Chúng tôi sẽ XÁC NHẬN đơn hàng bằng EMAIL hoặc ĐIỆN THOẠI. Bạn vui lòng kiểm tra EMAIL hoặc NGHE MÁY ngay khi đặt hàng thành công và CHỜ NHẬN HÀNG.</p>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-gray-800 text-white px-16 py-3 text-sm'>ĐẶT HÀNG</button>
          </div>


        </div>

      </div>
    </form>
  );
};

export default PlaceOrder;