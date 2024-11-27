
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';


const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu thông tin đơn hàng được chọn
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Trạng thái dialog
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrders = response.data.orders.map((order) => ({
          orderId: order._id,
          status: order.status,
          paymentMethod: order.paymentMethod,
          date: order.date,
          items: order.items,
          email: order.address.email,
          firstName: order.address.firstName,
          lastName: order.address.lastName,
          street: order.address.street,
          state: order.address.state,
          district: order.address.district,
          city: order.address.city,
          amount: order.amount,
          phone: order.address.phone,
          description: order.address.description,
        }));

        setOrderData(allOrders.reverse());

        const latestOrder = allOrders[0];
        const lastSentOrderId = localStorage.getItem('lastSentOrderId');

        if (latestOrder && latestOrder.orderId !== lastSentOrderId) {
          sendConfirmationEmail(latestOrder); // Gửi email cho đơn hàng mới nhất
          localStorage.setItem('lastSentOrderId', latestOrder.orderId); // Cập nhật trạng thái đã gửi email
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    }
  };

  const sendConfirmationEmail = (orderDetails) => {
    if (!orderDetails) {
      console.error('Không tìm thấy thông tin đơn hàng');
      return;
    }

    const templateParams = {
      user_email: orderDetails.email,
      user_name: `${orderDetails.firstName} ${orderDetails.lastName}`,
      user_address: `${orderDetails.street}, ${orderDetails.state}, ${orderDetails.district}, ${orderDetails.city}`,
      order_id: orderDetails.orderId,
      order_date: new Date(orderDetails.date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      order_items: orderDetails.items
        .map(
          (item, index) =>
            `${index + 1}. ${item.name} (Size: ${item.size}) - SL: ${item.quantity} x ${item.price.toLocaleString()} VND`
        )
        .join('\n'),
      order_total: orderDetails.amount.toLocaleString(),
    };

    emailjs
      .send(
        'service_7huxl8s', // Thay bằng Service ID của bạn
        'template_y1myswj', // Thay bằng Template ID của bạn
        templateParams,
        'tLhyccwDPOr2pJPcB' // Thay bằng User ID của bạn
      )
      .then(
        () => {
          toast.success('Xác nhận đơn hàng đã gửi tới email của bạn.');
        },
        (error) => toast.error('Gửi email thất bại: ' + error.text)
      );
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order); // Lưu thông tin đơn hàng vào trạng thái
    setIsDialogOpen(true); // Mở dialog
  };

  const closeDialog = () => {
    setIsDialogOpen(false); // Đóng dialog
    setSelectedOrder(null); // Xóa thông tin đơn hàng
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Đơn hàng đã được hủy thành công!');
        loadOrderData(); // Tải lại danh sách đơn hàng
      } else {
        toast.error(response.data.message || 'Hủy đơn hàng thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      toast.error('Lỗi server, vui lòng thử lại sau.');
    }
  };

  const handleCancelOrder = (order) => {
    setCancelOrderId(order.orderId); // Lưu lại ID đơn hàng cần hủy
    setIsCancelDialogOpen(true); // Mở hộp thoại xác nhận
  };

  const confirmCancelOrder = () => {
    if (cancelOrderId) {
      cancelOrder(cancelOrderId); // Gọi API hủy đơn hàng
      setIsCancelDialogOpen(false); // Đóng hộp thoại
      setCancelOrderId(null); // Xóa ID đã lưu
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'ĐƠN HÀNG'} text2={'ĐÃ ĐẶT'}></Title>
      </div>

      <div>
        {orderData.map((order, index) => (
          <div
            key={index}
            className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <div>
                {order.items.length > 0 && order.items[0].image[0] && (
                  <img
                    className="w-16 h-16 sm:h-20 sm:w-20"
                    src={order.items[0].image[0]}
                    alt={order.items[0].name}
                  />
                )}
              </div>
              <div>
                <p className="text-base ">Mã đơn hàng: <span className='text-yellow-600 font-medium'>#{order.orderId}</span></p>
                <p className="mt-1">
                  Ngày đặt hàng:
                  <span className="text-gray-400">
                    {new Date(order.date).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    ,{' '}
                    {new Date(order.date).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
                <p className="mt-1">Phương thức thanh toán: {order.paymentMethod}</p>
                <p className="mt-1">Số lượng sản phẩm: {order.items.length}</p>
              </div>
            </div>
            <hr className="sm:hidden" />
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p
                  className={`min-w-2 h-8 text-center rounded-sm border py-1.5 px-2 text-sm ${order.status === 'Đã hủy'
                    ? 'border-red-500 text-red-500'
                    : 'border-green-500 text-green-500'
                    }`}
                >
                  {order.status}
                </p>
              </div>
              <div className='flex gap-2'>
                 <button
                onClick={() => handleViewOrder(order)} // Gọi hàm khi nhấn nút
                className="border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm "
              >
                Thông tin đơn hàng
              </button>
              <button
                onClick={() => handleCancelOrder(order)} // Xử lý hủy đơn hàng
                className={`border px-4 py-2 text-sm font-medium rounded-sm ${order.status === 'Đã hủy' || order.status === 'Đã hoàn thành'
                    ? 'border-red-300 text-red-300 cursor-not-allowed' // Đã hủy hoặc đã hoàn thành
                    : 'border-red-500 text-red-500 hover:border-red-300 hover:text-red-300 cursor-pointer duration-200' // Có thể hủy
                  }`}
                disabled={order.status === 'Đã hủy' || order.status === 'Đã hoàn thành'}
              >
                Hủy đơn hàng
              </button>
              </div>
             
            </div>
          </div>
        ))}
      </div>
      {/* Dialog hủy đơn hàng */}
      <Dialog open={isCancelDialogOpen} onClose={() => setIsCancelDialogOpen(false)}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCancelDialogOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button onClick={confirmCancelOrder} color="error" variant='outlined'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog hiển thị chi tiết đơn hàng */}
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-sm shadow-xl max-w-lg w-full p-2">
          <DialogTitle className="text-gray-800 border-b pb-3">
            <p className='text-gray-700 font-bold'>THÔNG TIN ĐƠN HÀNG</p>
          </DialogTitle>
          {selectedOrder && (
            <DialogContent className="text-gray-600 mt-4 space-y-4">
              <p>
                <strong>Tình trạng thanh toán:</strong>{" "}
                {selectedOrder.payment ? (
                  <span className="text-green-600 font-bold">Đã thanh toán</span>
                ) : (
                  <span className="text-yellow-600 font-bold">Chờ thanh toán</span>
                )}
              </p>
              <p>
                <strong>Tổng thanh toán:</strong>{" "}
                <span className="text-yellow-600 font-bold">
                  {selectedOrder.amount.toLocaleString()} VND
                </span>
              </p>
              <p>
                <strong>Ngày đặt hàng:</strong>{" "}
                {new Date(selectedOrder.date).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <strong>Ghi chú:</strong> {selectedOrder.description}
              </p>
              <p>
                <strong>Sản phẩm đã đặt:</strong>
              </p>
              <ul className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg"
                  >
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <p className="text-sm text-gray-700">
                      {item.name} (Size: {item.size}) - SL: {item.quantity} x{" "}
                      {item.price.toLocaleString()} VND
                    </p>
                  </li>
                ))}
              </ul>
            </DialogContent>
          )}
          <DialogActions className="mt-4 flex justify-end">
            <button
              onClick={closeDialog}
              className="px-4 py-2 border border-yellow-600 text-yellow-600  hover:border-gray-600 hover:text-gray-600 transition"
            >
              Đóng
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default Orders;
