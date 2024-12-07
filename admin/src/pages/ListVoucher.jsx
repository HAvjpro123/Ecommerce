import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { Link } from 'react-router-dom'
import { ArrowUpAZ, ArrowUpDown, ArrowDownAZ, Trash, Edit, House } from 'lucide-react';
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip, Breadcrumbs } from '@mui/material';
import FloatingButtonVoucher from '../components/FloatingButtonVoucher';

const ListVoucher = ({ token }) => {

  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [list, setList] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Số lượng bài viết trên mỗi trang
  const [editDialogOpen, setEditDialogOpen] = useState(false); // Trạng thái hộp thoại chỉnh sửa
  const [editingVoucher, setEditingVoucher] = useState(null);


  // Trạng thái cho hộp thoại xác nhận
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [voucherIdToDelete, setVoucherIdToDelete] = useState(null);

  const fetchList = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(backendUrl + '/api/voucher/listvoucher');
      if (response.data.success) {
        let sortedVouchers = response.data.vouchers;
        // Áp dụng sắp xếp nếu đã chọn cột sắp xếp
        if (sortField) {
          sortedVouchers = sortedVouchers.sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];
            if (typeof fieldA === 'string') {
              return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            } else if (typeof fieldA === 'number') {
              return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
            }
            return 0;
          });
        }
        setList(sortedVouchers);
        console.log(response.data);

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };


  const openEditDialog = (voucher) => {
    setEditingVoucher(voucher);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingVoucher(null);
  };

  const handleEditVoucher = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/voucher/editvoucher',
        {
          id: editingVoucher._id,
          name: editingVoucher.name,
          discount: editingVoucher.discount,
          total: editingVoucher.total,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      closeEditDialog();
    }
  };


  // Mở hộp thoại xác nhận xóa
  const openConfirmDialog = (id) => {
    setVoucherIdToDelete(id);
    setConfirmDialogOpen(true);
  };

  // Đóng hộp thoại xác nhận xóa
  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setVoucherIdToDelete(null);
  };

  // Xác nhận xóa bài viết
  const confirmDeleteVoucher = () => {
    if (voucherIdToDelete) {
      removeVoucher(voucherIdToDelete);
    }
    closeConfirmDialog();
  };

  // hàm xóa sản phẩm
  const removeVoucher = async (id) => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.post(backendUrl + '/api/voucher/removevoucher', { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Hàm chuyển đổi thứ tự sắp xếp và đặt cột sắp xếp
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Xác định icon sắp xếp hiển thị cho mỗi cột
  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? <ArrowUpAZ size={15} strokeWidth={1.5} className='text-gray-600' /> : <ArrowDownAZ size={15} strokeWidth={1.5} className='text-gray-600' />;
    }
    return <ArrowUpDown size={15} strokeWidth={1.5} className='text-gray-400' />;
  };

  const currentList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(list.length / pageSize);

  // hàm chuyển đến trang trước
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // hàm chuyển đến trang sau
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  useEffect(() => {
    fetchList();
  }, [sortField, sortOrder]);

  return (
    <>
    <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/">
          <House size={15}></House>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/listvoucher"
        >
          Quản lý mã giảm giá
        </Link>
      </Breadcrumbs>
      <Title text1={'QUẢN LÝ'} text2={'MÃ GIẢM GIÁ'} />
      <div className='flex flex-col gap-2'>
        {/* Tiêu đề bảng danh sách */}
        <div className='grid rounded-md sm:grid-cols-[1fr_1fr_1fr_1fr_1fr]  grid-cols-[1fr_1fr_1fr_1fr] items-center py-1 gap-2 px-2 border bg-gray-200 text-sm '>
          <b onClick={() => handleSort('name')} className='cursor-pointer flex items-center gap-1 text-xs sm:text-sm'>
            Tên voucher {getSortIcon('name')}
          </b>
          <b onClick={() => handleSort('discount')} className='cursor-pointer flex items-center gap-1 text-xs sm:text-sm'>
            Giảm giá {getSortIcon('discount')}
          </b>
          <b onClick={() => handleSort('total')} className='cursor-pointer flex items-center gap-1 text-xs sm:text-sm'>
            Số lượng {getSortIcon('total')}
          </b>
          <b onClick={() => handleSort('createdBy')} className='cursor-pointer items-center gap-1 hidden sm:flex'>
            Người tạo {getSortIcon('createdBy')}
          </b>
          <b className='text-center text-xs sm:text-sm'>Thao tác</b>
        </div>
        {/* Danh sách voucher */}
        {
          currentList.map((item, index) => (
            <div className='grid rounded-md sm:grid-cols-[1fr_1fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr]  hover:border-yellow-600 items-center gap-2 p-2 border bg-white border-gray-300 sm:text-base text-xs' key={index}>
              <p className='line-clamp-2 '>{item.name}</p>
              <p>{(item.discount).toLocaleString()}{currency}</p>
              <p>{(item.total).toLocaleString()}</p>
              <p className='hidden sm:block'>{item.createdBy}</p>
              <p className='flex justify-center gap-2'>
                <Tooltip title="Chỉnh sửa" arrow>
                  <Edit size={18} strokeWidth={1} className='hover:text-yellow-500 cursor-pointer' onClick={() => openEditDialog(item)} />
                </Tooltip>
                <Tooltip title="Xóa" arrow>
                  <Trash size={17} strokeWidth={1} className='hover:text-red-500 cursor-pointer' onClick={() => openConfirmDialog(item._id)} />
                </Tooltip>
              </p>

            </div>
          ))
        }
      </div>

      {/* Điều hướng phân trang */}
      <div className='flex justify-center gap-4 mt-4 border-t border-gray-300 text-sm sm:text-base'>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 pt-2 mt-4 ${currentPage === 1 ? 'text-gray-400' : 'text-yellow-600'} cursor-pointer`}
        >
          Trang trước
        </button>
        <div className='pt-2 mt-4'>Trang {currentPage} / {totalPages}</div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 pt-2 mt-4 ${currentPage === totalPages ? 'text-gray-400' : 'text-yellow-600'} cursor-pointer`}
        >
          Trang sau
        </button>
      </div>

      {/* Backdrop hiển thị khi loading */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>


      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cập nhật thông tin cho mã giảm giá.
          </DialogContentText>
          <div className="flex flex-col gap-1 mt-4">
            <p>Tên mã giảm giá:</p>
            <input
              type="text"
              value={editingVoucher?.name || ''}
              onChange={(e) => setEditingVoucher({ ...editingVoucher, name: e.target.value })}
              placeholder="Nhập tên mã giảm giá..."
              className="border p-2"
            />
            <p className='mt-2'>Giá giảm:</p>
            <input
              type="number"
              value={editingVoucher?.discount || ''}
              onChange={(e) => setEditingVoucher({ ...editingVoucher, discount: Number(e.target.value) })}
              placeholder="Nhập giá giảm..."
              className="border p-2"
              min="0" 
            />
            <p className='mt-2'>Nhập số lượng:</p>
            <input
              type="number"
              value={editingVoucher?.total || ''}
              onChange={(e) => setEditingVoucher({ ...editingVoucher, total: Number(e.target.value) })}
              placeholder="Nhập số lượng..."
              className="border p-2"
              min="0" 
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="inherit">Hủy bỏ</Button>
          <Button onClick={handleEditVoucher} variant="outlined" color="primary">Cập nhật</Button>
        </DialogActions>
      </Dialog>



      {/* Hộp thoại xác nhận xóa */}
      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
      >
        <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa mã giảm giá này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">Hủy bỏ</Button>
          <Button onClick={confirmDeleteVoucher} variant='outlined' color="warning" >Đồng ý</Button>
        </DialogActions>
      </Dialog>
      <FloatingButtonVoucher></FloatingButtonVoucher>
    </>
  );
};

export default ListVoucher;
