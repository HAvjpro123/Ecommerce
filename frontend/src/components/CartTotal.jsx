import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import Title2 from './Title2';

const CartTotal = ({ discountAmount }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  // Chỉ tính toán các giá trị, không thay đổi trạng thái.
  const cartAmount = getCartAmount();
  const totalOrder = cartAmount === 0 ? 0 : cartAmount + delivery_fee - discountAmount;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title2 text1="TỔNG" text2="ĐƠN HÀNG"></Title2>
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Tạm tính</p>
          <p>{cartAmount.toLocaleString()}{currency}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Phí vận chuyển</p>
          <p>{delivery_fee.toLocaleString()}{currency}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Giảm giá</p>
          <p className="text-yellow-600">- {discountAmount.toLocaleString()}{currency}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Tổng cộng</b>
          <b className="text-yellow-600">{totalOrder.toLocaleString()}{currency}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
