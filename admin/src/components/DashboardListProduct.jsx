import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { ArrowUpAZ, ArrowUpDown, ArrowDownAZ, Search, Info } from 'lucide-react';
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Tooltip } from '@mui/material'; // Import Tooltip từ MUI


const DashboardListProduct = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [searchTerm, setSearchTerm] = useState(""); // Trạng thái để lưu trữ từ khóa tìm kiếm
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // Lưu thông tin chi tiết sản phẩm được chọn

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                let sortedProducts = response.data.products;
                if (sortField) {
                    sortedProducts = sortedProducts.sort((a, b) => {
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
                setList(sortedProducts);
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

    // Hàm dùng để xóa sản phẩm
    const removeProduct = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
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
            setLoading(false);
        }
    };

    // lọc sản phẩm
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // hiển thị icon theo chế đọ lọc
    const getSortIcon = (field) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? <ArrowUpAZ size={15} strokeWidth={1.5} className='text-gray-600' /> : <ArrowDownAZ size={15} strokeWidth={1.5} className='text-gray-600' />;
        }
        return <ArrowUpDown className='text-gray-400' size={15} strokeWidth={1.5} />;
    };

    const filteredList = list.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())); // Lọc danh sách theo từ khóa tìm kiếm
    const currentList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredList.length / pageSize);

    // chuyển đến trang sau
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    // chuyển đến trang trước
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    // đóng thông báo khi hủy xóa sản phẩm
    const closeConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setProductIdToDelete(null);
    };

    // xóa sản phẩm theo id đã chọn
    const confirmDeleteProduct = () => {
        if (productIdToDelete) {
            removeProduct(productIdToDelete);
        }
        closeConfirmDialog();
    };

    // Hàm mở chi tiết sản phẩm
    const openProductDetails = (product) => {
        setSelectedProduct(product);
    };

    useEffect(() => {
        fetchList();
    }, [sortField, sortOrder]);

    return (
        <div className=''>
            <div>
                <div className='border-l-4 border-yellow-600 mb-4'>
                    <p className='sm:text-xl text-base font-semibold ml-2 text-gray-700'>DANH SÁCH <span className='text-gray-500'>SẢN PHẨM</span></p>
                </div>
            </div>
            {/* Thanh tìm kiếm */}
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 mb-5 w-full '>
                <input
                    type="text"
                    placeholder="Tìm tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none bg-inherit border-none text-sm"
                    style={{ outline: '0px' }}
                />
                <Search strokeWidth={1} />
            </div>

            <div className='flex flex-col gap-2'>
                {/* Tiêu đề bảng */}
                <div className='grid sm:grid-cols-[1fr_1fr_3fr_1fr_1fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_3fr_1fr] items-center py-1 px-2 gap-2 border bg-gray-100 text-sm'>
                    <b onClick={() => handleSort('nameCode')} className='cursor-pointer flex items-center gap-1'>
                        ID {getSortIcon('nameCode')}
                    </b>
                    <b className='flex items-center '>
                        Hình ảnh
                    </b>
                    <b onClick={() => handleSort('name')} className='cursor-pointer items-center gap-1 flex'>
                        Tên sản phẩm {getSortIcon('name')}
                    </b>
                    <b onClick={() => handleSort('category')} className='cursor-pointer items-center gap-1 hidden sm:flex '>
                        Chất liệu {getSortIcon('category')}
                    </b>
                    <b onClick={() => handleSort('totalStock')} className='cursor-pointer items-center gap-1 hidden sm:flex'>
                        Số lượng {getSortIcon('totalStock')}
                    </b>
                    <b onClick={() => handleSort('onStock')} className='cursor-pointer items-center gap-1 hidden sm:flex'>
                        Tình trạng {getSortIcon('onStock')}
                    </b>
                    <b onClick={() => handleSort('price')} className='cursor-pointer items-center gap-1 hidden sm:flex'>
                        Giá {getSortIcon('price')}
                    </b>
                    <b className='text-center'>Thao tác</b>
                </div>

                {/* Danh sách sản phẩm */}
                {
                    currentList.map((item, index) => (
                        <div className='grid sm:grid-cols-[1fr_1fr_3fr_1fr_1fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_3fr_1fr] items-center gap-2 py-1 px-2 border sm:text-base text-xs' key={index}>
                            <p className='line-clamp-2'>#{item.nameCode}</p>
                            <img className='w-12 h-12 object-cover' src={item.image[0]} alt="" />
                            <p className='line-clamp-2'>{item.name}</p>
                            <p className='hidden sm:block line-clamp-1'>{item.category}</p>
                            <p className='hidden sm:block line-clamp-1'>{item.totalStock}</p>
                            <p className='hidden sm:block line-clamp-1'>{item.onStock ? 'Còn hàng' : 'Hết hàng'}</p>
                            <p className='hidden sm:block line-clamp-1'>{(item.price).toLocaleString()}{currency}</p>
                            <div className='flex justify-center gap-3'>
                                <button onClick={() => openProductDetails(item)} className='text-gray-600 hover:text-blue-500'>
                                    <Tooltip title="Thông tin sản phẩm" arrow>
                                        <Info size={17} strokeWidth={1} />
                                    </Tooltip>
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Điều khiển phân trang */}
            <div className='flex justify-center gap-4 mt-4 border-t border-gray-300 text-sm sm:text-base'>
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 pt-2 mt-4 ${currentPage === 1 ? 'text-gray-400' : 'text-yellow-600'} cursor-pointer`}
                >
                    Trang trước
                </button>
                <div className='pt-2 mt-4 '>Trang {currentPage} / {totalPages}</div>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 pt-2 mt-4 ${currentPage === totalPages ? 'text-gray-400' : 'text-yellow-600'} cursor-pointer`}
                >
                    Trang sau
                </button>
            </div>

            {/* Hộp thoại hiển thị chi tiết sản phẩm */}
            <Dialog
                open={selectedProduct !== null}
                onClose={() => setSelectedProduct(null)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle className="text-2xl font-semibold text-gray-800 bg-gray-100 p-4 rounded-t-lg">
                    Chi tiết sản phẩm
                </DialogTitle>
                <DialogContent className="p-6 bg-white rounded-b-lg shadow-lg">
                    {selectedProduct && (
                        <div>
                            <p className="text-lg font-semibold text-gray-800 mb-4">Danh sách hình ảnh:</p>
                            <div className="flex flex-wrap gap-4 mb-6">
                                {selectedProduct?.image?.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`image-${index}`}
                                        className="w-32 h-32 object-cover rounded-sm shadow-md transition-all transform hover:scale-105"
                                    />
                                ))}
                            </div>
                            <hr className='mb-4' />
                            <div className="space-y-4">
                                <p className="text-base text-gray-600"><strong>Tên sản phẩm:</strong> {selectedProduct.name}</p>
                                <p className="text-base text-gray-600"><strong>Mã sản phẩm:</strong> {selectedProduct.nameCode}</p>
                                <p className="text-base text-gray-600"><strong>Mô tả sản phẩm:</strong> {selectedProduct.description}</p>
                                <p className="text-base text-gray-600"><strong>Giá:</strong> {(selectedProduct.price).toLocaleString()}{currency}</p>
                                <p className="text-base text-gray-600"><strong>Giá khuyến mãi:</strong> {(selectedProduct.salePrice).toLocaleString()}{currency}</p>
                                <p className="text-base text-gray-600"><strong>(%) giảm giá:</strong> {selectedProduct.sale}%</p>
                                <p className="text-base text-gray-600"><strong>Chất liệu:</strong> {selectedProduct.category}</p>
                                <p className="text-base text-gray-600"><strong>Phân loại:</strong> {selectedProduct.subCategory}</p>
                                <p className="text-base text-gray-600"><strong>Giới tính:</strong> {selectedProduct.subCategorySex}</p>
                                <p className="text-base text-gray-600"><strong>Kích thước:</strong> {selectedProduct.sizes.join(", ")}</p>
                                <p className="text-base text-gray-600"><strong>Tổng số lượng:</strong> {selectedProduct.totalStock}</p>
                                <p className="text-base text-gray-600"><strong>Số lượng đã bán:</strong> {selectedProduct.sold}</p>
                                <p className="text-base text-gray-600"><strong>Tình trạng:</strong> {selectedProduct.onStock ? 'Còn hàng' : 'Hết hàng'}</p>
                                <p className="text-base text-gray-600"><strong>Nhãn 'Sản phẩm bán chạy':</strong> {selectedProduct.bestseller ? 'Có' : 'Không'}</p>
                                <p className="text-base text-gray-600">
                                    <strong>Ngày thêm:</strong> {new Date(selectedProduct.date).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}, {new Date(selectedProduct.date).toLocaleDateString('vi-VN').replace(/\//g, '-')}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className="bg-gray-100 p-4 ">
                    <Button
                        onClick={() => setSelectedProduct(null)}
                        color="warning"
                        variant="outlined"
                        className="text-white"
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default DashboardListProduct;
