import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { ChevronDown } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import FloatingButtonTop from '../components/FloatingButonTop';

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subCategorySex, setSubCategorySex] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Số sản phẩm trên mỗi trang

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filterProducts.slice(startIndex, endIndex);

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategorySex = (e) => {

    if (subCategorySex.includes(e.target.value)) {
      setSubCategorySex(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategorySex(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search ) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    if (subCategorySex.length > 0) {
      productsCopy = productsCopy.filter(item => subCategorySex.includes(item.subCategorySex))
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default: 
        applyFilter();
        break;
    }

  }

  useEffect(() => { 
    applyFilter()
  }, [category, subCategory, subCategorySex, search, showSearch, products])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>LỌC SẢN PHẨM
          <ChevronRight className={`h-5 text-gray-500 sm:hidden ${showFilter ? 'rotate-90' : ''}`} />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CHẤT LIỆU SẢN PHẨM</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Gold'} onChange={toggleCategory} />Vàng
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Silver'} onChange={toggleCategory} />Bạc
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Platinum'} onChange={toggleCategory} />Bạch kim
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>LOẠI TRANG SỨC</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Ring'} onChange={toggleSubCategory} />Nhẫn
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Necklace'} onChange={toggleSubCategory} />Dây chuyền
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bracelet'} onChange={toggleSubCategory} />Vòng tay
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Earring'} onChange={toggleSubCategory} />Bông tai
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'ShakeHands'} onChange={toggleSubCategory} />Lắc tay
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Pendant'} onChange={toggleSubCategory} />Mặt dây chuyền
            </p>
          </div>
        </div>

        {/* SubCategory1 Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>GIỚI TÍNH</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleSubCategorySex} />Nam
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Woman'} onChange={toggleSubCategorySex} />Nữ
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Unisex'} onChange={toggleSubCategorySex} />Unisex
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kid'} onChange={toggleSubCategorySex} />Trẻ em
            </p>

          </div>
        </div>
      </div>

      {/* Right side*/}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'TẤT CẢ'} text2={'SẢN PHẨM'}></Title>
          {/* Right side*/}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sắp xếp theo: Có liên quan</option>
            <option value="low-high">Giá: Thấp đến Cao </option>
            <option value="high-low">Giá: Cao đến Thấp </option>
          </select>
        </div>

        {/* Map product */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            currentProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} sale={item.sale} salePrice={item.salePrice} sold={item.sold} nameCode={item.nameCode}/>
            ))
          }
        </div>
        
         {/* Pagination */}
         <div className="flex justify-center mt-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-3 py-1 border ${
                currentPage === index + 1 ? 'border-yellow-500 text-yellow-600' : 'bg-white text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

      </div>
      <FloatingButtonTop></FloatingButtonTop>
    </div>
  )
}

export default Collection