import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { Backdrop, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const AddVoucher = ({ token }) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [total, setTotal] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const voucherData = {
        name,
        discount,
        total,
        createdBy,
      };

      const response = await axios.post(`${backendUrl}/api/voucher/addvoucher`, voucherData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDiscount('');
        setTotal('');
        setCreatedBy('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      <div className='w-full'>
      <Title text1={'THÊM'} text2={'VOUCHER MỚI'} />
        <p className='mb-2'>Tên Voucher</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='w-full px-3 py-2 rounded-sm'
          type="text"
          placeholder='Nhập tên voucher...'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Giảm giá</p>
        <input
          onChange={(e) => setDiscount(e.target.value)}
          value={discount}
          className='w-full px-3 py-2 rounded-sm'
          type="number"
          placeholder='Nhập số tiền giảm ...'
          min="0"
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Số lượng voucher</p>
        <input
          onChange={(e) => setTotal(e.target.value)}
          value={total}
          className='w-full px-3 py-2 rounded-sm'
          type="number"
          placeholder='Nhập số lượng voucher...'
          min="0"
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Người tạo</p>
        <input
          onChange={(e) => setCreatedBy(e.target.value)}
          value={createdBy}
          className='w-full px-3 py-2 rounded-sm'
          type="text"
          placeholder='Người tạo voucher...'
          required
        />
      </div>

      <button
        type='submit'
        className='w-auto py-3 px-4 mt-4 hover:text-gray-600 border hover:border-gray-600 text-yellow-600 border-yellow-600 rounded-sm'
      >
        THÊM VOUCHER
      </button>

      {/* Backdrop hiển thị khi loading */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  );
};

export default AddVoucher;
