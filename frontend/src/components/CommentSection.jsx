import React, { useState } from 'react';
import { Avatar, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const colors = [
  '#FF5733', // Đỏ cam
  '#33FF57', // Xanh lá
  '#3357FF', // Xanh dương
  '#FF33A6', // Hồng
  '#A633FF', // Tím
  '#33FFF6', // Xanh nhạt
  '#FFC733', // Vàng
];

const getColor = (name) => {
  if (!name) return '#ccc'; // Màu mặc định nếu không có tên
  const charCode = name.charCodeAt(0); // Lấy mã Unicode của ký tự đầu tiên
  return colors[charCode % colors.length]; // Chọn màu theo chỉ số
};


const CommentsSection = ({ reviews }) => {
  // Cài đặt số lượng bình luận mỗi trang
  const reviewsPerPage = 5;
  
  // Số trang bắt đầu là 1
  const [currentPage, setCurrentPage] = useState(1);
  
  // Tính số trang cần thiết
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  // Cắt danh sách bình luận theo trang hiện tại
  const currentReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Hàm thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      {currentReviews.length > 0 ? (
        currentReviews.map((review, index) => (
          <div key={index} className="border-b py-2 my-2">
            <div className="flex gap-4">
              <Avatar
                alt={review.userName}
                sx={{
                  bgcolor: getColor(review.userName),
                  color: '#fff',
                }}
              >
                {review.userName ? review.userName.charAt(0).toUpperCase() : '?'}
              </Avatar>
              <div className="gap-2">
                <p className="font-medium text-sm">{review.userName}</p>
                <Rating className="-ml-1 mt-1" size="small" value={review.rating} readOnly />
                {/* Hiển thị reviewDate dưới định dạng ngày tháng năm giờ phút */}
                <p className="text-sm">
                  {new Date(review.reviewDate).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}, {new Date(review.reviewDate).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-base mt-4 mb-2 text-gray-700">{review.comment}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">Chưa có đánh giá nào cho sản phẩm này.</p>
      )}

      {/* Hiển thị các nút điều hướng trang */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='p-2 border border-yellow-600 text-yellow-600  rounded-sm'
        >
          Quay lại
        </button>
        <span className="self-center">{`Trang ${currentPage} / ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-yellow-600  text-yellow-600 ounded-sm"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
