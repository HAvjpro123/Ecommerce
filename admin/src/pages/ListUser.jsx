import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { Link } from 'react-router-dom'
import { ArrowUpAZ, ArrowUpDown, ArrowDownAZ, Trash, House, Info } from 'lucide-react';
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip, Breadcrumbs } from '@mui/material';

const ListUser = ({ token }) => {

    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [list, setList] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Số lượng bài viết trên mỗi trang
    const [selectedUser, setSelectedUser] = useState(null); // Lưu thông tin chi tiết sản phẩm được chọn

    // Trạng thái cho hộp thoại xác nhận
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const fetchList = async () => {
        setLoading(true); // Bắt đầu loading
        try {
            const response = await axios.get(backendUrl + '/api/user/listuser');
            if (response.data.success) {

                let sortedUsers = response.data.users;
                // Áp dụng sắp xếp nếu đã chọn cột sắp xếp
                if (sortField) {
                    sortedUsers = sortedUsers.sort((a, b) => {
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
                setList(sortedUsers);
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


    // Mở hộp thoại xác nhận xóa
    const openConfirmDialog = (id) => {
        setUserIdToDelete(id);
        setConfirmDialogOpen(true);
    };

    // Đóng hộp thoại xác nhận xóa
    const closeConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setUserIdToDelete(null);
    };

    // Xác nhận xóa bài viết
    const confirmDeleteVoucher = () => {
        if (userIdToDelete) {
            removeUser(userIdToDelete);
        }
        closeConfirmDialog();
    };

    // hàm xóa người dùng
    const removeUser = async (id) => {
        setLoading(true); // Bắt đầu loading
        try {
            const response = await axios.post(backendUrl + '/api/user/removeuser', { id }, { headers: { token } });

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

    // Hàm mở chi tiết sản phẩm
    const openUserDetails = (user) => {
        setSelectedUser(user);
    };

    useEffect(() => {
        fetchList();
    }, [sortField, sortOrder]);


    console.log(currentList);

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/">
                    <House size={15}></House>
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    to="/listuser"
                >
                    Quản lý người dùng
                </Link>
            </Breadcrumbs>
            <Title text1={'QUẢN LÝ'} text2={'NGƯỜI DÙNG'} />
            <div className='flex flex-col gap-2'>
                {/* Tiêu đề bảng danh sách */}
                <div className='grid rounded-md sm:grid-cols-[2fr_2fr_1.5fr_2fr_1fr_1fr]  grid-cols-[2fr_2fr_2fr_1fr] items-center py-1 gap-2 px-2 border bg-gray-200 text-sm '>
                    <b onClick={() => handleSort('name')} className='cursor-pointer flex items-center text-xs sm:text-sm gap-1'>
                        Tên người dùng {getSortIcon('name')}
                    </b>
                    <b onClick={() => handleSort('email')} className='cursor-pointer flex items-center text-xs sm:text-sm gap-1'>
                        Email {getSortIcon('email')}
                    </b>
                    <b onClick={() => handleSort('amountPurchased')} className='cursor-pointer justify-center flex items-center text-xs sm:text-sm gap-1'>
                        Thành viên {getSortIcon('amountPurchased')}
                    </b>
                    <b onClick={() => handleSort('date')} className='cursor-pointer items-center gap-1 hidden sm:flex '>
                        Ngày tạo {getSortIcon('date')}
                    </b>
                    <b onClick={() => handleSort('amountPurchased')} className='cursor-pointer items-center gap-1 hidden sm:flex'>
                        Chi tiêu {getSortIcon('amountPurchased')}
                    </b>
                    <b className='text-center text-xs sm:text-sm'>Thao tác</b>
                </div>
                {/* Danh sách voucher */}
                {
                    currentList.map((item, index) => (
                        <div className='grid rounded-md sm:grid-cols-[2fr_2fr_1.5fr_2fr_1fr_1fr] grid-cols-[2fr_2fr_2fr_1fr]  hover:border-yellow-600 items-center gap-2 p-2 border bg-white border-gray-300 sm:text-base text-xs' key={index}>
                            <p className='line-clamp-2'>{item.name}</p>
                            <p className='line-clamp-2'>{item.email}</p>
                            <p
                                className={`line-clamp-2 bg-gradient-to-r my-1 text-[9px] sm:text-sm sm:mx-8 mx-2 rounded-xl text-center py-2 shadow-md text-white 
                                    ${item.level === "Đồng" ? 'from-amber-500 to-amber-700'
                                        : item.level === 'Bạc'
                                            ? 'from-slate-400 to-slate-600'
                                            : item.level === 'Vàng'
                                                ? 'from-yellow-400 to-yellow-600'
                                                : item.level === 'Bạch Kim'
                                                    ? 'from-emerald-400 to-emerald-600'
                                                    : item.level === 'Kim Cương'
                                                        ? 'from-cyan-400 to-cyan-600'
                                                        : ''} `}
                            >{item.level}</p>

                            {item.date === undefined

                                ? <p className='line-clamp-2 hidden sm:block'>00:00, 0-0-0000</p>
                                : <p className='line-clamp-2 hidden sm:block'>{new Date(item.date).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}, {new Date(item.date).toLocaleDateString('vi-VN').replace(/\//g, '-')}</p>

                            }

                            {item.amountPurchased === undefined
                                ? <p className='line-clamp-2 hidden sm:block'>Chưa có </p>
                                : <p className='line-clamp-1 hidden sm:block'>{Number(item.amountPurchased).toLocaleString()}</p>
                            }

                            <p className='flex justify-center gap-2'>
                                <Tooltip title="Xóa" arrow>
                                    <Trash size={17} strokeWidth={1} className='hover:text-red-500 cursor-pointer' onClick={() => openConfirmDialog(item._id)} />
                                </Tooltip>
                                <button onClick={() => openUserDetails(item)} className='text-gray-600 hover:text-blue-500'>
                                    <Tooltip title="Thông tin người dùng" arrow>
                                        <Info size={18} strokeWidth={1} />
                                    </Tooltip>
                                </button>
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

            {/* Hộp thoại xác nhận xóa */}
            <Dialog
                open={confirmDialogOpen}
                onClose={closeConfirmDialog}
            >
                <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa người dùng này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog} color="inherit">Hủy bỏ</Button>
                    <Button onClick={confirmDeleteVoucher} variant='outlined' color="warning" >Đồng ý</Button>
                </DialogActions>
            </Dialog>

            {/* Hộp thoại hiển thị chi tiết sản phẩm */}
            <Dialog
                open={selectedUser !== null}
                onClose={() => setSelectedUser(null)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle className="text-2xl flex justify-between font-semibold text-gray-800 bg-gray-100 p-4 rounded-t-lg">
                    <p className='my-auto text-sm sm:text-xl'>Thông tin người dùng</p>
                    {selectedUser && (
                        <p

                            className={`line-clamp-2 bg-gradient-to-r rounded-md text-[9px] text-center sm:text-sm px-4 py-2 shadow-md text-white 
                                    ${selectedUser.level === "Đồng" ? 'from-amber-500 to-amber-700'
                                    : selectedUser.level === 'Bạc'
                                        ? 'from-slate-400 to-slate-600'
                                        : selectedUser.level === 'Vàng'
                                            ? 'from-yellow-400 to-yellow-600'
                                            : selectedUser.level === 'Bạch Kim'
                                                ? 'from-emerald-400 to-emerald-600'
                                                : selectedUser.level === 'Kim Cương'
                                                    ? 'from-cyan-400 to-cyan-600'
                                                    : ''} `}
                        >Thành viên {selectedUser.level}</p>
                    )}
                </DialogTitle>
                <DialogContent className="p-6 bg-white rounded-b-lg shadow-lg">
                    {selectedUser && (
                        <div>
                            <hr className='mb-4' />
                            <div className="space-y-4">

                                <p className="text-base text-gray-600"><strong>Tên khách hàng:</strong> {selectedUser.name}</p>
                                <p className="text-base text-gray-600"><strong>Email:</strong> {selectedUser.email}</p>
                                <div className='flex text-base text-gray-600'>
                                    <strong className='mr-2 '>Ngày tạo:</strong>  {selectedUser.date === undefined
                                        ? '00:00, 0-0-0000'
                                        : <strong className="text-base text-gray-600">{new Date(selectedUser.date).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}, {new Date(selectedUser.date).toLocaleDateString('vi-VN').replace(/\//g, '-')}</strong>
                                    }

                                </div>

                                <div className="text-base text-gray-600 flex"> {selectedUser.amountPurchased === undefined
                                    ? <p className='line-clamp-2  ml-1'><strong>Chi tiêu:</strong> Chưa có dữ liệu.</p> 
                                    : <p className='line-clamp-1  ml-1'><strong>Chi tiêu:</strong> {Number(selectedUser.amountPurchased).toLocaleString()}</p>
                                }</div>
                                <div className="text-base text-gray-600 flex"> {selectedUser.itemPurchased === undefined
                                    ? <p className='line-clamp-2  ml-1'><strong>Tổng sản phẩm đã mua:</strong> Chưa có dữ liệu.</p>
                                    : <p className='line-clamp-1  ml-1'><strong>Tổng sản phẩm đã mua:</strong> {Number(selectedUser.itemPurchased).toLocaleString()}</p>
                                }</div>


                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className="bg-gray-100 p-4 ">
                    <Button
                        onClick={() => setSelectedUser(null)}
                        color="warning"
                        variant="outlined"
                        className="text-white"
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default ListUser;
