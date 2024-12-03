import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        setLatestProducts(products.reverse().slice(0, 10)) 
    }, [products])


    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'SẢN PHẨM'} text2={'MỚI NHẤT'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Trang sức mới nhất từ CESPIN là sự kết hợp hoàn hảo giữa thiết kế hiện đại và tinh hoa thủ công, mang đến vẻ đẹp tinh tế, độc đáo và đậm dấu ấn cá nhân.
                </p>
            </div>

            {/* Render products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    latestProducts.slice(0, 5).map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} sale={item.sale} salePrice={item.salePrice} sold={item.sold} nameCode={item.nameCode}/>
                    )) 
                }
               
            </div>
        </div>
    )
}

export default LatestCollection