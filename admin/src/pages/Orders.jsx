


import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App.jsx'
import { toast } from 'react-toastify'
import Title from '../components/Title.jsx'
import { House, Package2 } from 'lucide-react';
import { Printer, PrinterCheck, Trash } from 'lucide-react';  // Thêm PrinterCheck
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom'
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip, Breadcrumbs } from '@mui/material';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [printedOrders, setPrintedOrders] = useState({}); // Thêm state để theo dõi các đơn hàng đã in
  const [activeTab, setActiveTab] = useState('activeOrders'); // Tab mặc định
  const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho tìm kiếm

  // Trạng thái cho hộp thoại xác nhận
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Lọc danh sách đơn hàng
  const activeOrders = orders.filter((order) => order.status !== 'Đã hủy');
  const canceledOrders = orders.filter((order) => order.status === 'Đã hủy');

  // Hàm để lưu trạng thái in vào localStorage
  const savePrintedOrdersToLocalStorage = (orders) => {
    localStorage.setItem('printedOrders', JSON.stringify(orders));
  };

  // Hàm để lấy trạng thái in từ localStorage
  const getPrintedOrdersFromLocalStorage = () => {
    const storedOrders = localStorage.getItem('printedOrders');
    return storedOrders ? JSON.parse(storedOrders) : {};
  };

  // Fetch dữ liệu đơn hàng
  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
        console.log(response.data.orders);

      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Cập nhật trạng thái đơn hàng
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // Xử lý in đơn hàng
  const handlePrint = (orderId) => {
    const printContent = document.getElementById(`order-${orderId}`).innerHTML;

    // Mở cửa sổ mới để in
    const printWindow = window.open('', '_blank', 'width=650,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>In đơn hàng</title>
          <style>
            @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css');
          </style>
        </head>
        <body>
          <div>${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print(); // Gọi lệnh in khi cửa sổ đã tải xong

      // Cập nhật trạng thái đã in vào localStorage
      setPrintedOrders(prevState => {
        const updatedState = { ...prevState, [orderId]: true };
        savePrintedOrdersToLocalStorage(updatedState); // Lưu vào localStorage
        return updatedState;
      });
    };
  };

  // Dùng useEffect để lấy trạng thái đã in từ localStorage khi trang tải lại
  useEffect(() => {
    fetchAllOrders();
    const savedPrintedOrders = getPrintedOrdersFromLocalStorage();
    setPrintedOrders(savedPrintedOrders);
  }, [token]);

  //Hàm dùng để lọc sản phẩm dựa trên mã sản phẩm 
  const filteredOrders = (orders) =>
    orders.filter(order =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // hàm dùng để xóa sản phẩm
  const deleteOrder = async (id) => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.post(backendUrl + '/api/order/delete', { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // kết thúc loading
    }
  };

  // Mở hộp thoại xác nhận xóa
  const openConfirmDialog = (id) => {
    setOrderIdToDelete(id);
    setConfirmDialogOpen(true);
  };

  // Đóng hộp thoại xác nhận xóa
  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setOrderIdToDelete(null);
  };

  // Xác nhận xóa bài viết
  const confirmDeleteOrder = () => {
    if (orderIdToDelete) {
      deleteOrder(orderIdToDelete);
    }
    closeConfirmDialog();
  };


  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/">
          <House size={15}></House>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/"
        >
          Quản lý đơn hàng
        </Link>
      </Breadcrumbs>
      <Title text1={'DANH SÁCH'} text2={'ĐƠN HÀNG'}></Title>
      <div>
        {/* Thanh tìm kiếm */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-sm w-full"
          />
        </div>
        {/* Tabs */}
        <div className="flex mb-5">
          <button
            onClick={() => setActiveTab('activeOrders')}
            className={`px-6 py-2 font-medium border-b-2 ${activeTab === 'activeOrders' ? 'border-yellow-600 text-yellow-600' : 'border-gray-300 text-gray-500'
              }`}
          >
            Đơn hàng hiện tại ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('canceledOrders')}
            className={`px-6 py-2 font-medium border-b-2 ${activeTab === 'canceledOrders' ? 'border-yellow-600 text-yellow-600' : 'border-gray-300 text-gray-500'
              }`}
          >
            Đơn hàng đã hủy ({canceledOrders.length})
          </button>
        </div>

        {/* Nội dung Tab */}
        <div>
          {activeTab === 'activeOrders' &&
            filteredOrders(activeOrders).map((order, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start rounded-md border-2 bg-white border-gray-300 p-5 md:p-6 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              >
                {/* Giao diện đơn hàng */}
                <div id={`order-${order._id}`} className="hidden print:block">
                  {/* Dòng 1: 20% chiều cao */}
                  <div className="h-[20%] grid grid-cols-2">
                    {/* Cột 1: Thông tin người mua */}
                    <div className='border border-gray-500 p-4 border-r-0'>
                      <p className="font-medium mb-1">Thông tin người nhận:</p>
                      <p className='font-semibold'>{order.address.firstName + ' ' + order.address.lastName}</p>
                      <p>Đ/C: {order.address.street}, {order.address.state}, {order.address.district}, {order.address.city}, {order.address.zipcode}</p>
                      <p>SĐT: {order.address.phone}</p>
                    </div>
                    {/* Cột 2: Thông tin người gửi */}
                    <div className='border border-gray-500 p-4'>
                      <p className="font-medium mb-1">Thông tin người gửi:</p>
                      <p className='font-semibold'>CESPIN SHOP</p>
                      <p>Đ/C: 105 ABC, Tân Thời Đại, Đại Thừa Kỳ, TP.Mộng Mơ </p>
                      <p>SĐT: 0909898989</p>
                    </div>
                  </div>

                  {/* Dòng 2: 80% chiều cao */}
                  <div className="h-3/4 border border-t-0 border-gray-500 flex">
                    <div className='border-r border-gray-500 p-4 w-2/3 flex flex-col justify-between'>
                      <div>
                        <p className='text-sm sm:text-[15px] font-medium mb-2'>Tổng số lượng sản phẩm: {order.items.length}</p>
                        <p className="mb-1">Sản phẩm:</p>
                        <div>
                          {
                            order.items.map((item, index) => {
                              return (
                                <p className='text-base' key={index}>
                                  {index + 1}. {item.name}, Kích thước: {item.size}, <span>SL: {item.quantity}</span>
                                </p>
                              );
                            })
                          }

                          {order.items.length > 20 && <p>...</p>}
                        </div>
                      </div>
                      <div className='mt-auto'>
                        <p className='text-xs mt-auto mb-2'>* Lưu ý: Một vài sản phẩm sẽ không hiển thị vì khổ in không đủ. <br /></p>
                        <p className='p-2 text-xs border border-black '>Ghi chú: {order.address.description}</p>
                      </div>
                      
                    </div>

                    <div className="p-4 justify-items-center w-1/3 flex flex-col">
                      <QRCodeSVG bgColor="#ffffff" fgColor="#000000" className="mt-2 mx-auto" value={order._id} size={100} />
                      <p className="my-2 font-semibold text-sm mx-auto">{order._id}</p>
                      <p className="text-sm mx-auto">
                        Ngày đặt hàng:{" "}
                        {new Date(order.date).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      <div className="border border-black mt-auto ">
                        <p className='text-center'>Chữ ký người nhận:</p>
                        <br />
                        <br />
                      </div>

                    </div>
                  </div>

                  {/* Dòng 3: Phương thức thanh toán */}
                  <div className='h-[10%] border border-t-0 border-gray-500 p-4'>
                    <p className="font-medium">Phương thức thanh toán: {order.paymentMethod}</p>
                    <p>Tổng thu: {(order.paymentMethod === 'COD' ? order.amount : 0).toLocaleString()}{currency}</p>
                  </div>
                </div>
                {/* Các cột tương tự mã gốc */}
                {/* Cột 1 */}
                <div>
                  <Package2 size={40} strokeWidth={0.6} className="border border-gray-400 p-1" />
                </div>
                <div>
                  <p className="mb-2 font-medium line-clamp-2">
                    Mã đơn hàng: <span className="text-yellow-600">#{order._id}</span>
                  </p>
                  <hr className="mb-1 w-[60%]" />
                  <div>
                    <p>Sản phẩm:</p>
                    {order.items.slice(0, 3).map((item, index) => (
                      <p className="py-0.5" key={index}>
                        {index + 1}. {item.name}, Kích thước: {item.size}, <span>SL: {item.quantity}</span>
                        {index !== 2 && ','}
                      </p>
                    ))}
                    {order.items.length > 3 && <p>...</p>}
                  </div>
                  <p className="mt-3 mb-2 text-sm sm:text-[15px] font-medium">
                    {order.address.firstName + ' ' + order.address.lastName}
                  </p>
                  <div>
                    <p>Đ/C: {order.address.street + ','}</p>
                    <p>{order.address.state + ',' + order.address.district + ',' + order.address.city + ',' + order.address.zipcode}</p>
                  </div>
                  <p>SĐT: {order.address.phone}</p>
                </div>

                {/* Cột 2 */}
                <div>
                  <p className="text-sm sm:text-[15px] font-medium">Tổng số lượng: ({order.items.length})</p>
                  <p className="mt-3">Phương thức thanh toán: {order.paymentMethod}</p>
                  <p>Tình trạng thanh toán: {order.payment ? 'Hoàn tất' : 'Chờ thanh toán'}</p>
                  <p>
                    Ngày đặt:{' '}
                    {new Date(order.date).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    ,{' '}
                    {new Date(order.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Cột 3 */}
                <p className="text-sm sm:text-[15px] font-medium">
                  {order.amount.toLocaleString()}
                  {currency}
                </p>

                {/* Cột 4 */}
                <div>
                  <p className='mb-2 font-medium'>Trạng thái đơn hàng:</p>
                  <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className="p-2 font-semibold rounded-sm ">
                    <option value="Đã đặt">Đã đặt</option>
                    <option value="Đang đóng gói">Đang đóng gói</option>
                    <option value="Đã được gửi">Đã được gửi</option>
                    <option value="Đang vận chuyển">Đang vận chuyển</option>
                    <option value="Hoàn tất vận chuyển">Hoàn tất vận chuyển</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handlePrint(order._id)}
                      className={`bg-yellow-600 rounded-md duration-300 hover:text-gray-300 text-white p-2 mt-3 flex`}
                    >
                      {printedOrders[order._id] ? (
                        <PrinterCheck size={22} strokeWidth={1} className="mr-1" />
                      ) : (
                        <Printer size={22} strokeWidth={1} className="mr-1" />
                      )}
                      {printedOrders[order._id] ? 'In lại' : 'In đơn'}
                    </button>

                    <button
                      onClick={() => openConfirmDialog(order._id)}
                      className="bg-red-500 duration-300 hover:text-gray-300 text-white p-2 mt-3 flex rounded-md"
                    >
                      <Trash size={22} strokeWidth={1} className="mr-1" />
                      <p className='my-auto'>Xóa</p>

                    </button>
                  </div>
                </div>

              </div>
            ))}

          {activeTab === 'canceledOrders' &&
            filteredOrders(canceledOrders).map((order, index) => (
              // Hiển thị đơn hàng đã hủy (tương tự cấu trúc trên)
              <div
                key={index}
                className="rounded-md grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 bg-white border-gray-300 p-5 md:p-6 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              >
                {/* Giao diện đơn hàng */}
                <div id={`order-${order._id}`} className="hidden print:block">
                  {/* Dòng 1: 20% chiều cao */}
                  <div className="h-[20%] grid grid-cols-2">
                    {/* Cột 1: Thông tin người mua */}
                    <div className='border border-gray-500 p-4 border-r-0'>
                      <p className="font-medium mb-1">Thông tin người nhận:</p>
                      <p className='font-semibold'>{order.address.firstName + ' ' + order.address.lastName}</p>
                      <p>Đ/C: {order.address.street}, {order.address.state}, {order.address.district}, {order.address.city}, {order.address.zipcode}</p>
                      <p>SĐT: {order.address.phone}</p>
                    </div>
                    {/* Cột 2: Thông tin người gửi */}
                    <div className='border border-gray-500 p-4'>
                      <p className="font-medium mb-1">Thông tin người gửi:</p>
                      <p className='font-semibold'>CESPIN SHOP</p>
                      <p>Đ/C: 105 ABC, Tân Thời Đại, Đại Thừa Kỳ, TP.Mộng Mơ </p>
                      <p>SĐT: 0909898989</p>
                    </div>
                  </div>

                  {/* Dòng 2: 80% chiều cao */}
                  <div className="h-3/4 border border-t-0 border-gray-500 flex">
                    <div className='border-r border-gray-500 p-4 w-2/3 flex flex-col justify-between'>
                      <div>
                        <p className='text-sm sm:text-[15px] font-medium mb-2'>Tổng số lượng sản phẩm: {order.items.length}</p>
                        <p className="mb-1">Sản phẩm:</p>
                        <div>
                          {
                            order.items.map((item, index) => {
                              return (
                                <p className='text-base' key={index}>
                                  {index + 1}. {item.name}, Kích thước: {item.size}, <span>SL: {item.quantity}</span>
                                </p>
                              );
                            })
                          }

                          {order.items.length > 20 && <p>...</p>}
                        </div>
                      </div>

                      <div className='mt-auto'>
                        <p className='text-xs mt-auto mb-2'>* Lưu ý: Một vài sản phẩm sẽ không hiển thị vì khổ in không đủ. <br /></p>
                        <p className='p-2 text-xs border border-black '>Ghi chú: {order.address.description}</p>
                      </div>
                    </div>

                    <div className="p-4 justify-items-center w-1/3 flex flex-col">
                      <QRCodeSVG bgColor="#ffffff" fgColor="#000000" className="mt-2 mx-auto" value={order._id} size={100} />
                      <p className="my-2 font-semibold text-sm mx-auto">{order._id}</p>
                      <p className="text-sm mx-auto">
                        Ngày đặt hàng:{" "}
                        {new Date(order.date).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      <div className="border border-black mt-auto ">
                        <p className='text-center'>Chữ ký người nhận:</p>
                        <br />
                        <br />
                      </div>

                    </div>
                  </div>

                  {/* Dòng 3: Phương thức thanh toán */}
                  <div className='h-[10%] border border-t-0 border-gray-500 p-4'>
                    <p className="font-medium">Phương thức thanh toán: {order.paymentMethod}</p>
                    <p>Tổng thu: {(order.paymentMethod === 'COD' ? order.amount : 0).toLocaleString()}{currency}</p>
                  </div>
                </div>
                {/* Các cột tương tự mã gốc */}
                {/* Cột 1 */}
                <div>
                  <Package2 size={40} strokeWidth={0.6} className="border border-gray-400 p-1" />
                </div>
                <div>
                  <p className="mb-2 font-medium line-clamp-2">
                    Mã đơn hàng: <span className="text-yellow-600">#{order._id}</span>
                  </p>
                  <hr className="mb-1 w-[60%]" />
                  <div>
                    <p>Sản phẩm:</p>
                    {order.items.slice(0, 3).map((item, index) => (
                      <p className="py-0.5" key={index}>
                        {index + 1}. {item.name}, Kích thước: {item.size}, <span>SL: {item.quantity}</span>
                        {index !== 2 && ','}
                      </p>
                    ))}
                    {order.items.length > 3 && <p>...</p>}
                  </div>
                  <p className="mt-3 mb-2 text-sm sm:text-[15px] font-medium">
                    {order.address.firstName + ' ' + order.address.lastName}
                  </p>
                  <div>
                    <p>Đ/C: {order.address.street + ','}</p>
                    <p>{order.address.state + ',' + order.address.district + ',' + order.address.city + ',' + order.address.zipcode}</p>
                  </div>
                  <p>SĐT: {order.address.phone}</p>
                </div>

                {/* Cột 2 */}
                <div>
                  <p className="text-sm sm:text-[15px] font-medium">Tổng số lượng: ({order.items.length})</p>
                  <p className="mt-3">Phương thức thanh toán: {order.paymentMethod}</p>
                  <p>Tình trạng thanh toán: {order.payment ? 'Hoàn tất' : 'Chờ thanh toán'}</p>
                  <p>
                    Ngày đặt:{' '}
                    {new Date(order.date).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    ,{' '}
                    {new Date(order.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Cột 3 */}
                <p className="text-sm sm:text-[15px] font-medium">
                  {order.amount.toLocaleString()}
                  {currency}
                </p>

                {/* Cột 4 */}
                <div>
                  <p className='mb-2 font-medium'>Trạng thái đơn hàng:</p>
                  <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className="p-2 font-semibold">
                    <option value="Đã đặt">Đã đặt</option>
                    <option value="Đang đóng gói">Đang đóng gói</option>
                    <option value="Đã được gửi">Đã được gửi</option>
                    <option value="Đang vận chuyển">Đang vận chuyển</option>
                    <option value="Hoàn tất vận chuyển">Hoàn tất vận chuyển</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>

                  <div className='flex gap-2'>
                    <button
                      onClick={() => handlePrint(order._id)}
                      className={`bg-yellow-600 rounded-md duration-300 hover:text-gray-300 text-white my-auto p-2 mt-3 flex ${printedOrders[order._id] ? 'bg-green-600' : ''
                        }`}
                    >
                      {printedOrders[order._id] ? (
                        <PrinterCheck size={22} strokeWidth={1} className="mr-1" />
                      ) : (
                        <Printer size={22} strokeWidth={1} className="mr-1" />
                      )}
                      <p className='my-auto'>{printedOrders[order._id] ? 'In lại' : 'In đơn'}</p>
                    </button>
                    <button
                      onClick={() => openConfirmDialog(order._id)}
                      className="bg-red-500 duration-300 hover:text-gray-300 text-white p-2 mt-3 flex rounded-md"
                    >
                      <Trash size={22} strokeWidth={1} className="mr-1" />
                      <p className='my-auto'>Xóa</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Hộp thoại xác nhận xóa */}
      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
      >
        <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa đơn hàng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">Hủy bỏ</Button>
          <Button onClick={confirmDeleteOrder} variant='outlined' color="warning" >Đồng ý</Button>
        </DialogActions>
      </Dialog>

      {/* Backdrop hiển thị khi loading */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Orders;
