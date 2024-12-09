import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { ArrowRight, ShoppingBag, Trash } from 'lucide-react';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import FloatingButtonTop from '../components/FloatingButonTop';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { discountAmount, setDiscountAmount, products, currency, cartItems, updateQuantity, navigate, vouchers, backendUrl } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false); // Thêm trạng thái để theo dõi việc áp dụng mã giảm giá

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleVoucherApply = async () => {
    const voucher = vouchers.find((v) => v.name === voucherCode);
    if (voucher) {
      if (voucher.total > 0) {
        setDiscountAmount(voucher.discount); // Cập nhật discountAmount vào context
        setVoucherApplied(true); // Đánh dấu là đã áp dụng mã giảm giá
        console.log(`Voucher applied: ${voucher.discount}`);

        try {
          // Call API to update voucher total
          const response = await fetch(backendUrl + '/api/voucher/update-total', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: voucher._id }),
          });
          const data = await response.json();

          if (data.success) {
            toast.success(`Áp dụng mã giảm giá thành công! Giảm ${voucher.discount.toLocaleString()}${currency}`);
          } else {
            toast.error(data.message);
            setVoucherApplied(false); // Nếu có lỗi, hủy bỏ trạng thái đã áp dụng mã
          }
        } catch (error) {
          console.error('Error updating voucher total:', error);
          toast.error('Có lỗi xảy ra khi áp dụng mã giảm giá!');
          setVoucherApplied(false); // Nếu lỗi xảy ra, hủy bỏ trạng thái đã áp dụng mã
        }
      } else {
        toast.error('Mã giảm giá đã hết lượt sử dụng!');
        setVoucherApplied(false); // Nếu mã không còn hiệu lực, đặt lại trạng thái
      }
    } else {
      toast.error('Mã giảm giá không hợp lệ!');
      setVoucherApplied(false); // Nếu mã không hợp lệ, đặt lại trạng thái
    }
  };

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'GIỎ'} text2={'HÀNG'} />
      </div>
      <div className='sm:grid-cols-[2fr_1fr] grid flex-wrap gap-6'>
        <div className='w-full'>
          {cartData.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p><ShoppingBag size={70} strokeWidth={1} className='mx-auto mb-2' /></p>
              <p>Giỏ hàng của bạn đang trống.</p>
            </div>
          ) : (
            cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);

              // Kiểm tra nếu sản phẩm không tồn tại
              if (!productData) {
                return (
                  <div key={index} className="py-4 border-t border-b text-gray-700">
                    <p>Sản phẩm không tồn tại hoặc đã bị xóa.</p>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <Link to={`/product/${productData._id}`}>
                      <img
                        className="w-16 sm:w-20"
                        src={productData.image[0]}
                        alt={productData.name}
                      />
                    </Link>
                    <Link to={`/product/${productData._id}`}>
                      <div>
                        <p className="text-sm lg:text-lg font-medium line-clamp-2">
                          {productData.name}
                        </p>
                        <div className="items-center gap-2 mt-2">
                          <p>
                            {productData.price.toLocaleString()}
                            {currency}
                          </p>
                          <p className="py-2">
                            Kích thước:{' '}
                            <span className="px-1 sm:px-3 sm:py-1 border border-gray-300">
                              {item.size}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>

                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === '' || e.target.value === '0'
                        ? null
                        : updateQuantity(item._id, item.size, Number(e.target.value))
                    }
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <Tooltip title="Xóa">
                    <Trash
                      strokeWidth={1}
                      size={18}
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="cursor-pointer hover:text-red-600"
                    />
                  </Tooltip>
                </div>
              );
            })
          )}

          <div className='flex-col space-y-2 mt-10 text-sm text-gray-600'>
            <p className='flex'>Lưu ý:</p>
            <p className='flex gap-1'><ArrowRight size={20} strokeWidth={1} /> Sản phẩm được đổi 1 lần duy nhất, không hỗ trợ trả.</p>
            <p className='flex gap-1'><ArrowRight size={20} strokeWidth={1} /> Sản phẩm phải còn đủ tem mác, chưa qua sử dụng.</p>
            <p className='flex gap-1'><ArrowRight size={20} strokeWidth={1} /> Sản phẩm nguyên giá được đổi trong 7 ngày.</p>
            <p className='flex gap-1'><ArrowRight size={20} strokeWidth={1} /> Sản phẩm sale không hỗ trợ đổi trả.</p>
          </div>

        </div>

        <div className='flex sm:my-0 my-10 w-full'>
          <div className='w-full'>
            <CartTotal discountAmount={discountAmount} />
            <div className='w-full mt-4'>
              <div className=' flex gap-2'>
                <input
                  type='text'
                  placeholder='Nhập mã giảm giá'
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className='border outline-1 p-2 w-full h-10'
                />
                <button
                  onClick={handleVoucherApply}
                  className='border border-yellow-600 text-yellow-600 h-10 min-w-20 px-2 py-2'
                  disabled={voucherApplied} // Vô hiệu hóa nút nếu mã đã được áp dụng
                >
                  Áp dụng
                </button>
              </div>
              <div className='mt-4'>
                <p className='font-semibold text-sm'>Thông tin giao hàng</p>
                <p className='text-xs my-1 text-gray-600'>Đối với những sản phẩm có sẵn tại khu vực, CESPIN sẽ giao hàng trong vòng 2-7 ngày. Đối với những sản phẩm không có sẵn, thời gian giao hàng sẽ được nhân viên CESPIN thông báo đến quý khách.</p>
              </div>
              <button
                onClick={() => navigate('/place-order')}
                disabled={cartData.length === 0} // Vô hiệu hóa nút nếu không có sản phẩm
                className={`${cartData.length === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 cursor-pointer'
                  } text-white text-sm my-8 px-8 py-3`}
              >
                TIẾN HÀNH THANH TOÁN
              </button>
            </div>
          </div>
        </div>
      </div>
      <FloatingButtonTop></FloatingButtonTop>
    </div>
  );
};

export default Cart;
