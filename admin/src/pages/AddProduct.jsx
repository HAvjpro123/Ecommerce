import React, { useState } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios'
import { backendUrl } from '../App';
import { Backdrop, Breadcrumbs, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { House } from 'lucide-react';
import { Link } from 'react-router-dom'


const AddProduct = ({ token }) => {

  const [loading, setLoading] = useState(false); // Trạng thái loading

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [image5, setImage5] = useState(false)
  const [image6, setImage6] = useState(false)

  const [name, setName] = useState("");
  const [nameCode, setNameCode] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [sale, setSale] = useState("");
  const [category, setCategory] = useState("Gold");
  const [subCategory, setSubCategory] = useState("Ring");
  const [subCategorySex, setSubCategorySex] = useState("Men");
  const [totalStock, setTotalStock] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true); // Bắt đầu loading

    try {

      const formData = new FormData()

      formData.append("name", name)
      formData.append("nameCode", nameCode)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("salePrice", salePrice)
      formData.append("sale", sale)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("subCategorySex", subCategorySex)
      formData.append("bestseller", bestseller)
      formData.append("totalStock", totalStock)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)
      image5 && formData.append("image5", image5)
      image6 && formData.append("image6", image6)

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setNameCode('')
        setDescription('')
        setPrice('')
        setSalePrice('')
        setSale('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setImage5(false)
        setImage6(false)
        setTotalStock('')
        setLoading(false); // Kết thúc loading
      } else {
        toast.error(response.data.message)
        setLoading(false); // Kết thúc loading
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 ' >
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" to="/">
            <House size={15}></House>
          </Link>
          <Link
            underline="hover"
            color="inherit"
            to="/list"
          >
            Quản lý sản phẩm
          </Link>
          <Link
            underline="hover"
            color="inherit"
            to="/add"
          >
            Thêm sản phẩm
          </Link>
        </Breadcrumbs>
        <Title text1={'THÊM'} text2={'SẢN PHẨM MỚI'}></Title>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Tên Sản Phẩm</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-3 py-2 rounded-sm' type="text" placeholder='Nhập tên sản phẩm...' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Mô Tả Sản Phẩm</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full px-3 py-2 rounded-sm' type="text" placeholder='Nhập mô tả sản phẩm...' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-6'>
        <div className='w-full'>
          <p className='mb-2'>Chất Liệu</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2 rounded-sm '>
            <option value="Gold">Vàng</option>
            <option value="Silver">Bạc</option>
            <option value="Platinum">Bạch kim</option>
          </select>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Phân loại</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 rounded-sm'>
            <option value="Ring">Nhẫn</option>
            <option value="Necklace">Dây chuyền</option>
            <option value="Bracelet">Vòng tay</option>
            <option value="Earring">Bông tai</option>
            <option value="ShakeHands">Lắc tay</option>
            <option value="Pendant">Mặt dây chuyền</option>
          </select>
        </div>

        <div className=' w-full'>
          <p className='mb-2'>Giới tính</p>
          <select onChange={(e) => setSubCategorySex(e.target.value)} value={subCategorySex} className='w-full px-3 py-2 rounded-sm'>
            <option value="Men">Nam</option>
            <option value="Woman">Nữ</option>
            <option value="Unisex">Unisex</option>
            <option value="Kid">Trẻ em</option>
          </select>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Mã Sản Phẩm</p>
          <input onChange={(e) => setNameCode(e.target.value)} value={nameCode} className='w-full px-3 py-2 rounded-sm' type="text" placeholder='Nhập mã sản phẩm...' required />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-6'>
        <div className='w-full' >
          <p className='mb-2'>Giá sản phẩm</p>
          <input onChange={(e) => setSalePrice(e.target.value)} value={salePrice} className='w-full px-3 py-2 rounded-sm' type="number" placeholder='Giá sản phẩm (VND)' min="0" required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>% Giảm giá</p>
          <input onChange={(e) => setSale(e.target.value)} value={sale} className='w-full px-3 py-2 rounded-sm' type="number" placeholder='Nhập % giảm giá...' min="0" max="100" required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Số lượng</p>
          <input onChange={(e) => setTotalStock(e.target.value)} value={totalStock} className='w-full px-3 py-2 rounded-sm' type="number" placeholder='Nhập số lượng sản phẩm...' min="0" required />
        </div>

        <div className='flex gap-2 my-auto pt-2 sm:pt-8 w-full'>
          <input style={{ outline: '0px' }} onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Thêm nhãn 'Sản phẩm bán chạy'</label>
        </div>
      </div>

      <div>
        <p className='mb-2'>Kích thước</p>
        <div className='flex flex-wrap gap-3'>
          <div onClick={() => setSizes(prev => prev.includes("8") ? prev.filter(item => item !== "8") : [...prev, "8"])} className=''>
            <p className={`${sizes.includes("8") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>8</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("9") ? prev.filter(item => item !== "9") : [...prev, "9"])} className=''>
            <p className={`${sizes.includes("9") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>9</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("10") ? prev.filter(item => item !== "10") : [...prev, "10"])} className=''>
            <p className={`${sizes.includes("10") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>10</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("11") ? prev.filter(item => item !== "11") : [...prev, "11"])} className=''>
            <p className={`${sizes.includes("11") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>11</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("12") ? prev.filter(item => item !== "12") : [...prev, "12"])} className=''>
            <p className={`${sizes.includes("12") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>12</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("13") ? prev.filter(item => item !== "13") : [...prev, "13"])} className=''>
            <p className={`${sizes.includes("13") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>13</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("14") ? prev.filter(item => item !== "14") : [...prev, "14"])} className=''>
            <p className={`${sizes.includes("14") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>14</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("15") ? prev.filter(item => item !== "15") : [...prev, "15"])} className=''>
            <p className={`${sizes.includes("15") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>15</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("16") ? prev.filter(item => item !== "16") : [...prev, "16"])} className=''>
            <p className={`${sizes.includes("16") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>16</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("17") ? prev.filter(item => item !== "17") : [...prev, "17"])} className=''>
            <p className={`${sizes.includes("17") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>17</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("18") ? prev.filter(item => item !== "18") : [...prev, "18"])} className=''>
            <p className={`${sizes.includes("18") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>18</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("19") ? prev.filter(item => item !== "19") : [...prev, "19"])} className=''>
            <p className={`${sizes.includes("19") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>19</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("20") ? prev.filter(item => item !== "20") : [...prev, "20"])} className=''>
            <p className={`${sizes.includes("20") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>20</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("21") ? prev.filter(item => item !== "21") : [...prev, "21"])} className=''>
            <p className={`${sizes.includes("21") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>21</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("22") ? prev.filter(item => item !== "22") : [...prev, "22"])} className=''>
            <p className={`${sizes.includes("22") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>22</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("23") ? prev.filter(item => item !== "23") : [...prev, "23"])} className=''>
            <p className={`${sizes.includes("23") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>23</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("24") ? prev.filter(item => item !== "24") : [...prev, "24"])} className=''>
            <p className={`${sizes.includes("24") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>24</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("25") ? prev.filter(item => item !== "25") : [...prev, "25"])} className=''>
            <p className={`${sizes.includes("25") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>25</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("26") ? prev.filter(item => item !== "26") : [...prev, "26"])} className=''>
            <p className={`${sizes.includes("26") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>26</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("27") ? prev.filter(item => item !== "27") : [...prev, "27"])} className=''>
            <p className={`${sizes.includes("27") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>27</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("28") ? prev.filter(item => item !== "28") : [...prev, "28"])} className=''>
            <p className={`${sizes.includes("28") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>28</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("29") ? prev.filter(item => item !== "29") : [...prev, "29"])} className=''>
            <p className={`${sizes.includes("29") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>29</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("30") ? prev.filter(item => item !== "30") : [...prev, "30"])} className=''>
            <p className={`${sizes.includes("30") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>30</p>
          </div>

        </div>
      </div>

      <div>
        <p className='mb-2'>Tải Hình Ảnh</p>
        <div className='flex flex-wrap sm:flex-row gap-4 text-gray-500'>
          <label htmlFor="image1" className=''>
            <img className='w-[133px] h-[133px] object-cover' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>

          <label htmlFor="image2" className=''>
            <img className='w-[133px] h-[133px] object-cover' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>

          <label htmlFor="image3" className=''>
            <img className='w-[133px] h-[133px] object-cover' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>

          <label htmlFor="image4" className=''>
            <img className='w-[133px] h-[133px] object-cover' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>

          <label htmlFor="image5" className=''>
            <img className='w-[133px] h-[133px] object-cover' src={!image5 ? assets.upload_area : URL.createObjectURL(image5)} alt="" />
            <input onChange={(e) => setImage5(e.target.files[0])} type="file" id='image5' hidden />
          </label>

          <label htmlFor="image6" className=''>
            <img className='w-[133px] h-[133px] object-cover' src={!image6 ? assets.upload_area : URL.createObjectURL(image6)} alt="" />
            <input onChange={(e) => setImage6(e.target.files[0])} type="file" id='image6' hidden />
          </label>
        </div>
      </div>


      <button type='submit' className='w-auto rounded-sm py-3 px-4 mt-4 hover:text-gray-600 border hover:border-gray-600 text-yellow-600 border-yellow-600'>THÊM SẢN PHẨM</button>

      {/* Backdrop hiển thị khi loading */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  )
}

export default AddProduct