import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { Box, Breadcrumbs, Tab, Backdrop, CircularProgress } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Truck } from 'lucide-react';
import { Headset } from 'lucide-react';
import { Package2 } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts'
import { toast } from 'react-toastify'


const Product = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [loading, setLoading] = useState(false);
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])


  return productData ? (
    <div className='border-t-2 pt-8 transition-opacity ease-in duration-500 opacity-100'>
      <div role="presentation" onClick={handleClick} className='mb-12 flex'>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" to="/">
            Trang chủ
          </Link>
          <Link
            underline="hover"
            color="inherit"
            to="/collection"
          >
            {productData.category}
          </Link>
          <span sx={{ color: 'text.primary' }}>{productData.name}</span>
        </Breadcrumbs>
      </div>
      {/*--------- Product Data---------  */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/*---------  Product Image --------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full max-h-[70vh]  '>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[20%] sm:h-[22%] object-cover sm:w-full sm:mb-3 mr-3 sm:mr-0 flex-shrink-0 cursor-pointer ' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-[44vh] sm:w-[50vw] sm:h-[70vh] object-cover' src={image} alt="" />
          </div>
        </div>

        {/* --------- Product Info---------  */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <p className='text-lg font-thin mt-2'>Mã: {productData.nameCode}</p>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_dull_icon} alt="" className='w-3.5' />
            <p className='pl-2 text-lg'>(222)</p>
            <p>|</p>
            <p className='pl-2 text-lg'>{productData.sold} đã bán</p>
          </div>

          {/* Price*/}
          <div className='flex gap-4'>
            <p className='mt-5 text-4xl font-medium text-yellow-600' >{(productData.price).toLocaleString()}{currency}</p>
            <p className='mt-5 text-lg font-medium text-gray-400 line-through italic' >{(productData.salePrice).toLocaleString()}{currency}</p>
            <p className='mt-5 text-lg font-medium text-yellow-600 italic' >({productData.sale}%)</p>
          </div>

          <p className='text-lg font-thin mt-5'>
            Trang thái: {productData.onStock ? 'Còn hàng' : 'Hết hàng'}
          </p>

          <div className='flex flex-col gap-4 my-5'>
            <p className='text-lg font-thin '>Kích thước</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} className={`border py-2.5 px-4 bg-gray-100 ${item === size ? 'border-yellow-600' : ''}`} key={index}>{item}</button>
              ))}
            </div>
          </div>
          {
            productData.onStock ? (
              <button
                onClick={async () => {
                  setLoading(true); // Bật Backdrop
                  try {
                    await addToCart(productData._id, size);
                  } finally {
                    setLoading(false); // Tắt Backdrop sau khi hoàn tất
                    toast.success('Đã thêm sản phẩm vào giỏ hàng!')
                  }
                }}
                className="bg-gray-800 border border-white text-white px-8 py-3 text-sm hover:bg-white hover:border hover:border-yellow-600 hover:text-black duration-300"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-500 cursor-not-allowed border border-white text-white px-8 py-3 text-sm"
              >
                HẾT HÀNG
              </button>
            )
          }


          <p className='text-sm font-thin mt-8'>Hotline: <span className='text-orange-600'>090 999 8888</span></p>
          <hr className='mt-2 sm:w-4/5' />

          <Box sx={{ width: '100%', typography: 'body1', color: 'black' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'gray', }} >
                <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="inherit"
                  sx={{ '& .MuiTabs-indicator': { backgroundColor: 'rgb(202 138 4)', }, }}
                >
                  <Tab className='text-sm' label="Ưu đãi" value="1" sx={{ color: 'gray', }} />
                  <Tab label="Chính sách" value="2" sx={{ color: 'gray', }} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className='space-y-2 '>
                  <p className='-mx-6 text-gray-600 font-medium '> ✔ Giảm 5% giá trị đơn hàng khi thanh toán qua Paypal. <span className='text-yellow-600 cursor-pointer'> Xem chi tiết</span></p>
                  <p className='-mx-6 text-gray-600 font-medium '> ✔ Giảm 10% khi mua đơn hàng có giá trị trên 5.000.000đ. <span className='text-yellow-600 cursor-pointer'> Xem chi tiết</span></p>
                  <p className='-mx-6 text-gray-600 font-medium'>✔ Mua 2 sản phẩm bất kì để được tặng kèm những phần quà hấp dẫn. <span className='text-yellow-600 cursor-pointer'> Xem chi tiết</span></p>
                </div>

              </TabPanel>
              <TabPanel value="2">
                <div className='space-y-2'>
                  <p className='-mx-6 text-gray-600 font-medium flex'><span className='text-yellow-600 mr-2'><Truck size={20} strokeWidth={2} /></span> MIỄN PHÍ giao trong 3 giờ.</p>
                  <p className='-mx-6 text-gray-600 font-medium flex'><span className='text-yellow-600 mr-2'><Headset size={20} strokeWidth={2} /></span> Luôn phục vụ 24/7.</p>
                  <p className='-mx-6 text-gray-600 font-medium flex'><span className='text-yellow-600 mr-2'><Package2 size={20} strokeWidth={2} /> </span>Chính sách đổi trả dễ dàng trong vòng 48 giờ.</p>
                </div>

              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>

      {/* Description n Review Section */}
      <div className=''>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Mô tả</b>
          <p className='border px-5 py-3 text-sm'>Đánh giá (500)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat error, nemo necessitatibus architecto, odit sed inventore similique modi ad culpa laboriosam repellendus illum pariatur! Reprehenderit minus ipsam aliquid ut quae.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam aperiam minima velit doloribus error nemo. Tempore quam ratione eaque amet sint, illo aliquam perferendis debitis velit officia nostrum libero laboriosam.</p>
        </div>
      </div>

      {/* Display related product */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>


    </div>

  ) : <div className='opacity-0'>

  </div>
}

export default Product