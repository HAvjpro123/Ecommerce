import React, { useContext, useEffect, useState, useNavigate } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { Box, Breadcrumbs, Tab, Backdrop, CircularProgress, Rating, Avatar } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Truck } from 'lucide-react';
import { Headset } from 'lucide-react';
import { Package2 } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts'
import StarIcon from '@mui/icons-material/Star';
import CommentsSection from '../components/CommentSection'
import FloatingButtonTop from '../components/FloatingButonTop';

const Product = () => {

  const [value, setValue] = React.useState('1');
  const [loading, setLoading] = useState(false);
  const { productId } = useParams()
  const { products, currency, addToCart, navigate, buyNow } = useContext(ShopContext)
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  // Tổng số lượt bán 
  const totalReviews = productData ? productData.reviews.length : 0;

  // Tính rating trung bình
  const calculateAverageRating = () => {
    if (productData.reviews.length === 0) return 0; // Nếu không có đánh giá, trả về 0

    const totalRating = productData.reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((totalRating / productData.reviews.length).toFixed(1)); // Trả về số, không phải chuỗi
  };


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
            Bộ sưu tập
          </Link>
          <span sx={{ color: 'text.primary' }}>{productData.name}</span>
        </Breadcrumbs>
      </div>
      {/*--------- Product Data---------  */}
      <div className='flex gap-12 sm:gap-8 flex-col sm:flex-row'>
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
          <p className='text-lg font-thin mt-2'>MSP: {productData.nameCode}</p>
          <div className='flex items-center text-base gap-1 mt-2 text-gray-600'>
            <p className='mt-1'>{calculateAverageRating()}</p>
            <Rating precision={0.5} value={calculateAverageRating()} readOnly size="small" className='my-auto' />
            <p>|</p>
            {/* hiện thị chỗ này */}
            <p className=' mx-1 '>({totalReviews}) đánh giá</p>
            <p>|</p>
            <p className=' mx-1 '>{(productData.sold).toLocaleString()} đã bán</p>
          </div>


          {/* Price*/}
          <div className='flex gap-4 my-0 sm:my-2'>
            <p className='mt-5 text-4xl font-medium text-yellow-600' >{(productData.price).toLocaleString()}{currency}</p>
            {productData.sale === 0
              ? ''
              : <p className='mt-5 text-lg font-medium text-gray-400 line-through italic' >{(productData.salePrice).toLocaleString()}{currency}</p>
            }
            {productData.sale === 0
              ? ''
              :<p className='mt-5 text-lg font-medium text-yellow-600 italic' >({productData.sale}%)</p>
            }
          </div>

          <p className='text-lg font-thin mt-5'>
            Trạng thái: <span className='text-gray-600 font-semibold'>{productData.onStock ? 'Còn hàng' : 'Hết hàng'}</span>
          </p>

          <div className='flex flex-col gap-4 my-4'>
            <p className='text-lg font-thin '>Kích thước</p>
            <div className='flex gap-2'>
              {productData.sizes
                .sort((a, b) => a - b) // Sắp xếp mảng từ nhỏ đến lớn
                .map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    className={`border py-2.5 px-4 bg-gray-100 ${item === size ? 'border-yellow-600' : ''}`}
                    key={index}
                  >
                    {item}
                  </button>
                ))}
            </div>
          </div>
          {
            productData.onStock ? (
              <div className='grid sm:grid-cols-[3fr_2fr] grid-cols-[2fr_1fr] gap-2 my-6'>
                <button
                  onClick={async () => {
                    setLoading(true); // Bật Backdrop
                    try {
                      await addToCart(productData._id, size);
                    } finally {
                      setLoading(false); // Tắt Backdrop sau khi hoàn tất
                    }
                  }}
                  className="bg-gray-800 border text-white px-4 py-3 text-sm  duration-300"
                >
                  THÊM VÀO GIỎ HÀNG
                </button>

                <button
                  onClick={async () => {
                    setLoading(true); // Bật Backdrop
                    try {
                      await buyNow(productData._id, size);
                    } finally {
                      setLoading(false); // Tắt Backdrop sau khi hoàn tất
                    }
                  }}
                  className=" border border-gray-500 text-gray-700 px-4 py-3 text-sm duration-300"
                >
                  MUA NGAY
                </button>
              </div>

            ) : (
              <button
                disabled
                className="bg-gray-500 cursor-not-allowed border border-white text-white px-8 py-3 text-sm"
              >
                HẾT HÀNG
              </button>
            )
          }


          <p className='text-sm font-thin mt-8'>Hotline: <span className='text-orange-600'>1800 1234</span></p>
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

      {/* Mô tả sản phẩm */}
      <div className='mt-10'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Mô tả sản phẩm</b>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
        </div>
      </div>

      {/* Tiêu đề đánh giá sản phẩm */}
      <div className='flex mt-8'>
        <b className='border px-5 py-3 text-sm'>Đánh giá sản phẩm</b>
      </div>

      {/* Hiển thị bình luận*/}
      <div className='grid sm:grid-cols-[2.5fr_1fr] grid-cols-1 gap-4 border text-sm text-gray-500'>
        <CommentsSection reviews={productData.reviews} />

        {/* Hiển thị số lượng sao đánh giá */}
        <div className=' sm:border-l p-6'>
          <p className='font-medium text-gray-700 text-lg'>THỐNG KÊ ĐÁNH GIÁ</p>
          <p className='font-medium text-gray-500 text-base mt-2'>{totalReviews} đánh giá từ khách hàng</p>
          <div className='space-y-2 mt-4'>
            {['5', '4', '3', '2', '1'].map((star, index) => {
              const count = productData.reviews.filter((review) => review.rating === parseInt(star)).length;
              const width = (count / productData.reviews.length) * 100; // Tính phần trăm số lượng đánh giá cho sao
              const color = ['rgb(74 222 128)', 'rgb(96 165 250)', 'rgb(250 204 21)', 'rgb(251 146 60)', 'rgb(239 68 68)'][index]; // Màu sắc cho mỗi thanh
              return (
                <div key={star} className='flex items-center gap-2'>
                  
                  <p className='w-8 flex text-sm text-gray-600'>{star}<StarIcon sx={{ fontSize: 18, color: 'rgb(250 204 21)' }} ></StarIcon></p>
                  
                  <div className='w-full bg-gray-200 h-2.5 rounded-full'>
                    <div
                      className={`h-full rounded-full`}
                      style={{ width: `${width}%`, backgroundColor: color }}
                    />
                  </div>
                  <p className='ml-2 text-sm'>({count})</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>



      {/* Display related product */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <FloatingButtonTop></FloatingButtonTop>
    </div >

  ) : <div className='opacity-0'>

  </div>
}

export default Product