
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, Backdrop, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const labels = {
  1: 'Tệ',
  2: 'Chưa hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Tuyệt vời',
};

const Orders = () => {
  const { backendUrl, token, currency, userId, userName } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Trạng thái dialog

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const [isReviewDialog, setIsReviewDialog] = useState(false); // Mở/đóng dialog đánh giá
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đã chọn
  const [rating, setRating] = useState(0); // Đánh giá sao
  const [comment, setComment] = useState(''); // Bình luận
  const [ratings, setRatings] = useState(Array(selectedOrder?.items.length).fill(0));
  const [comments, setComments] = useState(Array(selectedOrder?.items.length).fill(''));
  const [value, setValue] = React.useState(1);
  const [hover, setHover] = useState(Array(selectedOrder?.items.length).fill(-1));
  const [loading, setLoading] = useState(false); // Trạng thái loading



  // fetch dữ liệu order của người dùng 
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
          payment: order.payment,
          review: order.review
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

  // Thông báo mail khi có đơn hàng mới
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

  // Mở dialog xem thông tin đơn hàng
  const handleViewOrder = (order) => {
    setSelectedOrder(order); // Lưu thông tin đơn hàng vào trạng thái
    setIsDialogOpen(true); // Mở dialog
  };

  // Đóng dialog xem thông tin đơn hàng
  const closeDialog = () => {
    setIsDialogOpen(false); // Đóng dialog
    setSelectedOrder(null); // Xóa thông tin đơn hàng
  };

  // Hủy đơn hàng
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

  // Mở dialog xác nhận hủy đơn hàng
  const handleCancelOrder = (order) => {
    setCancelOrderId(order.orderId); // Lưu lại ID đơn hàng cần hủy
    setIsCancelDialogOpen(true); // Mở hộp thoại xác nhận
  };

  // Xác nhận hủy đơn hàng
  const confirmCancelOrder = () => {
    if (cancelOrderId) {
      cancelOrder(cancelOrderId); // Gọi API hủy đơn hàng
      setIsCancelDialogOpen(false); // Đóng hộp thoại
      setCancelOrderId(null); // Xóa ID đã lưu
    }
  };

  // Hàm mở dialog đánh giá
  const handleReview = (order) => {
    setSelectedOrder(order);
    setIsReviewDialog(true);
  };

  // Hàm đóng dialog đánh giá
  const closeReviewDialog = () => {
    setIsReviewDialog(false);
    setSelectedOrder(null);
    setRating(0);
    setComment('');
  };

  const handleHoverChange = (newHover, index) => {
    const updatedHover = [...hover];
    updatedHover[index] = newHover;
    setHover(updatedHover);
  };


  // Xử lý khi thay đổi đánh giá hoặc bình luận
  const handleRatingChange = (value, index) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = value;
    setRatings(updatedRatings);
  };

  const handleCommentChange = (value, index) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    setComments(updatedComments);
  };

  // Hàm xử lý gửi đánh giá
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem tất cả các sản phẩm đã được đánh giá chưa
    const hasUnratedProduct = ratings.some((rating) => rating === 0);
    if (hasUnratedProduct) {
      toast.error('Bạn cần đánh giá chất lượng sản phẩm trước khi gửi!');
      return;
    }

    const reviews = selectedOrder.items.map((item, index) => ({
      productId: item._id, // ID của sản phẩm
      userId: userId, // ID của người dùng
      userName: userName, // Tên người dùng
      rating: ratings[index], // Rating cho sản phẩm này
      comment: comments[index], // Bình luận cho sản phẩm này
    }));


    try {
      setLoading(true)
      const response = await fetch(backendUrl + `/api/order/${selectedOrder.orderId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews }),
      });

      if (response.ok) {
        toast.success('Đánh giá thành công');
        // Cập nhật trạng thái review cho đơn hàng đã chọn
        const updatedOrderData = orderData.map((order) =>
          order.orderId === selectedOrder.orderId ? { ...order, review: true } : order
        );
        setOrderData(updatedOrderData); // Cập nhật lại danh sách đơn hàng
        closeReviewDialog();
        await loadOrderData();
      } else {
        toast.error('Có lỗi xảy ra khi đánh giá');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false)

    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  useEffect(() => {
    if (selectedOrder) {
      setRatings(selectedOrder.items.map(() => 0)); // Gán 0 cho tất cả sản phẩm
      setComments(selectedOrder.items.map(() => '')); // Gán chuỗi rỗng cho tất cả sản phẩm
      setHover(selectedOrder.items.map(() => -1)); // Gán -1 cho hover
    }
  }, [selectedOrder]);


  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'ĐƠN HÀNG'} text2={'ĐÃ ĐẶT'}></Title>
      </div>

      {/* Hiển thị danh sach đơn hàng  */}
      <div>
        {orderData.map((order, index) => (
          <div
            key={index}
            className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <div className='flex justify-start max-w-80'>
                <div>
                  {order.items.length > 0 && order.items[0].image[0] && (
                    <img
                      className="w-16 h-16 sm:h-20 sm:w-20"
                      src={order.items[0].image[0]}
                      alt={order.items[0].name}
                    />
                  )}
                </div>
                <div className='w-full'>
                  <p >Mã đơn hàng: <span className='text-yellow-600 font-medium'>#{order.orderId}</span></p>
                  <p className="mt-1">
                    Ngày đặt hàng: <span className="text-gray-400">
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

              <div className='min-w-16 sm:my-auto sm:mx-auto  '>
                <p
                  className={`text-center rounded-sm border py-1.5 px-2 text-[10px] sm:text-sm sm:my-auto sm:mx-auto ${order.status === 'Đã hủy'
                    ? 'border-red-500 text-red-500'
                    : 'border-green-500 text-green-500'
                    }`}
                >
                  {order.status}
                </p>
              </div>

            </div>
            <hr className="sm:hidden" />
            <div className="md:w-1/2 flex justify-between sm:justify-end gap-2">

              <div className='flex gap-2'>
                {/* Nút hủy đơn hàng */}
                {
                  order.status === 'Hoàn tất vận chuyển'
                    ? ''
                    : <button
                      onClick={() => handleCancelOrder(order)} // Xử lý hủy đơn hàng
                      className={`border px-4 py-2 text-[10px] sm:text-sm font-medium rounded-sm ${order.status === 'Đã hủy' || order.status === 'Đã hoàn thành'
                        ? 'border-red-300 text-red-300 cursor-not-allowed' // Đã hủy hoặc đã hoàn thành
                        : 'border-red-500 text-red-500 hover:border-red-300 hover:text-red-300 cursor-pointer duration-200' // Có thể hủy
                        }`}
                      disabled={order.status === 'Đã hủy' || order.status === 'Đã hoàn thành'}
                    >
                      Hủy đơn hàng
                    </button>
                }

                {/* Nút đánh giá */}
                <button
                  onClick={() => handleReview(order)} // Gọi hàm để mở form đánh giá
                  className={`border px-4 py-2 text-[10px] sm:text-sm font-medium rounded-sm ${order.status === 'Hoàn tất vận chuyển'
                    ? order.review
                      ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                      : 'border-yellow-600 text-yellow-600 hover:border-yellow-500 hover:text-yellow-500'
                    : 'hidden' // Ẩn nút nếu không phải trạng thái "Hoàn tất vận chuyển"
                    }`}
                  disabled={order.review} // Vô hiệu hóa nếu đã đánh giá
                >
                  {order.review ? 'Đã đánh giá' : 'Đánh giá'}
                </button>

                {/* Nút xem chi tiết đơn hàng */}
                <button
                  onClick={() => handleViewOrder(order)} // gọi hàm xem thông tin đơn hàng
                  className="border border-gray-300 px-4 py-2 text-[10px] sm:text-sm font-medium rounded-sm "
                >
                  Thông tin đơn hàng
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Dialog đánh giá sản phẩm */}
      {isReviewDialog && (
        <Dialog open={isReviewDialog} onClose={closeReviewDialog} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-sm shadow-xl max-w-lg w-full p-2">
            <DialogTitle className="text-gray-800 border-b pb-3">
              <p className="text-gray-700 font-bold">Đánh giá sản phẩm</p>
            </DialogTitle>
            {selectedOrder && (
              <DialogContent className="text-gray-600 space-y-2">
                <form onSubmit={handleReviewSubmit} className='w-full sm:w-96'>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2 mt-4 bg-gray-100 p-4 rounded">
                      <div className="flex items-center gap-4">
                        <img src={item.image[0]} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                        <div>
                          <p className="text-sm text-gray-700">{item.name}</p>
                        </div>
                      </div>

                      <hr className='my-2 border border-gray-200' />

                      <div className='flex gap-3'>
                        <label className='text-sm'>Chất lượng sản phẩm</label>
                        <Rating
                          size='small'
                          name={`rating-${index}`}
                          value={ratings[index] || 0}
                          onChange={(e, newValue) => handleRatingChange(newValue, index)}
                          onChangeActive={(event, newHover) => handleHoverChange(newHover, index)}
                        />
                        {hover[index] !== -1 ? (
                          <p className='text-sm'>{labels[hover[index]]}</p>
                        ) : (
                          <p className='text-sm'>{labels[ratings[index]] || 'Chưa đánh giá'}</p>
                        )}
                      </div>

                      <hr className='my-2' />

                      <div>
                        <textarea
                          required
                          className="w-full p-2 border rounded h-32"
                          value={comments[index]}
                          onChange={(e) => handleCommentChange(e.target.value, index)}
                          placeholder='Hãy chia sẻ những điều bạn thích về sản phẩm này với người mua khác nhé.'
                        ></textarea>
                      </div>
                    </div>
                  ))}
                  <p className='text-gray-400 text-sm mt-2'>*Đánh giá của bạn sẽ được hiển thị dưới tên {userName}</p>
                  <DialogActions className='mt-4 -mr-6 -mb-4'>
                    <button onClick={closeReviewDialog} className="rounded-sm  px-4 py-2 border border-yellow-600 text-yellow-600 hover:border-gray-600 hover:text-gray-600 transition">
                      Đóng
                    </button>
                    <button type="submit" className="px-4 py-2  bg-yellow-600 text-white rounded-sm hover:bg-yellow-700 transition">
                      Gửi đánh giá
                    </button>

                  </DialogActions>

                </form>

              </DialogContent>
            )}
          </div>

          {/* Backdrop hiển thị khi loading */}
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Dialog>
      )}

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
        <div className="bg-white rounded-sm shadow-2xl p-2">
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

                  <li key={index}
                    className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg"
                  >
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <Link to={`/product/${item._id}`}>
                      <div className='w-full'>
                        <p className="text-sm text-gray-700">
                          {item.name} - MSP: {item.nameCode}
                        </p>
                        <p className="text-sm text-gray-700">(Size: {item.size}) - SL: {item.quantity}</p>
                        <p className='text-yellow-600'>{item.price.toLocaleString()}{currency}</p>
                        <p className="text-sm text-gray-700"></p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </DialogContent>
          )}
          <DialogActions className="mt-4 flex justify-end">
            <button
              onClick={closeDialog}
              className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded-sm hover:border-gray-600 hover:text-gray-600 transition"
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
