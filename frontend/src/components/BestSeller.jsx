import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        // Sắp xếp sản phẩm theo số lượng sold giảm dần
        const sortedProducts = [...products].sort((a, b) => b.sold - a.sold);

        // Lấy 5 sản phẩm có sold cao nhất
        const topSoldProducts = sortedProducts.slice(0, 5);

        // Trộn ngẫu nhiên danh sách topSoldProducts
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
        };

        shuffleArray(topSoldProducts);

        setBestSeller(topSoldProducts);
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'SẢN PHẨM'} text2={'BÁN CHẠY'}></Title>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Trang sức bán chạy kết hợp thiết kế tinh tế, chất liệu cao cấp và tính ứng dụng linh hoạt, dễ dàng tỏa sáng trong mọi dịp.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    bestSeller.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            image={item.image}
                            price={item.price}
                            sale={item.sale}
                            salePrice={item.salePrice}
                            sold={item.sold}
                            nameCode={item.nameCode}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default BestSeller;
