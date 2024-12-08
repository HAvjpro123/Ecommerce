import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);


  const images = [
    assets.homebanner1,
    assets.homebanner2,
    assets.homebanner3,
    assets.homebanner4,
    

  ]
  // Xử lý khi chuyển qua slide kế tiếp
  const goToNextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  // Xử lý khi quay về slide trước đó
  const goToPrevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden ">
      {/* Slide hình ảnh */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className="w-auto h-auto object-cover"
          />
        ))}
      </div>

      {/* Nút điều hướng */}
      <button
        onClick={goToPrevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-5xl hover:text-gray-600  text-gray-400 px-3 py-2 "
      >
        ‹
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-5xl hover:text-gray-600  text-gray-400 px-3 py-2 "
      >
        ›
      </button>

    
    </div>
  );
};

export default Carousel;
