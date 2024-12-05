import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import BlogCard from './BlogCard';
import Title from './Title';

const LatestBlogs = () => {
  const { blogs } = useContext(ShopContext);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [showAll, setShowAll] = useState(false); // Trạng thái để kiểm soát hiển thị

  useEffect(() => {
    setLatestBlogs(blogs);
  }, [blogs, latestBlogs, showAll]);

  // Số bài viết muốn hiển thị ban đầu
  const displayedBlogs = showAll ? latestBlogs.reverse() : latestBlogs.reverse().slice(0, 8);

  return (
    <div className="px-4 md:px-8 lg:px-16">
      {/* Tiêu đề */}
      <div className="py-8 text-3xl">
        <Title text1={'TIN TỨC'} text2={'MỚI NHẤT'} />
        <p className="w-3/4 text-xs sm:text-sm md:text-base text-gray-600">
        Khám phá xu hướng thời trang và trang sức mới nhất, nơi sự tinh tế và sáng tạo hòa quyện,<br /> mang đến vẻ đẹp hiện đại và đẳng cấp cho phong cách của bạn.
        </p>
      </div>

      {/* Bố cục tạp chí */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {displayedBlogs.map((item, index) => (      
          <div key={index}>
            <BlogCard
              id={item._id}
              image={item.image}
              name={item.name}
              view={item.view}
              description={item.description}
              date={item.date}
              category={item.category}
            />
          </div>
        ))}
      </div>

      {/* Nút xem thêm */}
      {!showAll && latestBlogs.length > 8 && (
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 border border-yellow-600 text-yellow-600"
            onClick={() => setShowAll(true)}
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestBlogs;
