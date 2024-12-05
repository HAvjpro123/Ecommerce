import { ChevronUp } from 'lucide-react';
import React from 'react';

const FloatingButtonTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Hiệu ứng mượt
    });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center space-y-3">
      <button
        onClick={scrollToTop}
        className="relative overflow-hidden w-10 h-10 bg-transparent flex items-center justify-center shadow-lg border text-gray-400 border-gray-400 transition duration-300"
      >
        <ChevronUp size={25} strokeWidth={1} />
      </button>
    </div>
  );
};

export default FloatingButtonTop;
