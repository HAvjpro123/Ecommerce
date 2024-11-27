import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, sale, salePrice, nameCode, sold }) => {

    const { currency } = useContext(ShopContext)

    const formatSold = (sold) => {
        if (sold >= 1000) {
            return `${Math.floor(sold / 1000)}k+`;
        }
        return sold;
    };

    return (
        <Link className='text-gray-700 cursor-pointer hover:border-gray-700 border' to={`/product/${id}`}>
            <div className='overflow-hidden '>
                <img className='w-full h-56 object-cover' src={image[0]} alt="productimage" />
            </div>
            <div className='p-3'>
                <p className='pt-3 pb-1 text-base truncate overflow-hidden text-ellipsis whitespace-nowrap'>{name}</p>
                <p className=' text-center text-lg text-yellow-600 font-medium'>{(price).toLocaleString()}{currency}</p>

                {sale > 0 && (
                    <div className='flex justify-center gap-1 italic'>
                        <p className='text-base text-gray-400 font-medium line-through '>{(salePrice).toLocaleString()}{currency}</p>
                        <p className='text-base text-gray-400 font-medium'>({sale}%)</p>
                    </div>
                )}
                <div className='flex text-[11px] text-gray-500 mt-4 justify-between'>
                    <p>MSP: {nameCode}</p>
                    <p>({formatSold(sold)}) đã bán</p>
                </div>
            </div>

        </Link>
    )
}

export default ProductItem