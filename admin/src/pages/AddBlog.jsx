import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';  // Import Quill
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { Backdrop, Breadcrumbs, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css'; // Import styles for Quill
import Title from '../components/Title';
import { House } from 'lucide-react';
import { Link } from 'react-router-dom'



const AddBlog = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [category, setCategory] = useState("New");
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [tags, setTags] = useState([]);

  // Khai báo ref cho ReactQuill
  const quillRef = useRef(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('content', content);
      formData.append('createdBy', createdBy);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags))

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      const response = await axios.post(backendUrl + '/api/blog/addblog', formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setContent('');
        setCreatedBy('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/">
          <House size={15}></House>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/listblog"
        >
          Quản lý bài viết
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/addblog"
        >
          Tạo bài viết
        </Link>
      </Breadcrumbs>
        <Title text1={'TẠO'} text2={'BÀI VIẾT MỚI'}></Title>
        <p className='mb-2'>Tải Hình Ảnh</p>
        <div className='flex flex-wrap sm:flex-row gap-4 text-gray-500'>
          <label htmlFor='image1'>
            <img className='w-[133px] h-[133px] object-cover' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt='' />
            <input onChange={(e) => setImage1(e.target.files[0])} type='file' id='image1' hidden />
          </label>
          <label htmlFor='image2'>
            <img className='w-[133px] h-[133px] object-cover' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt='' />
            <input onChange={(e) => setImage2(e.target.files[0])} type='file' id='image2' hidden />
          </label>
          <label htmlFor='image3'>
            <img className='w-[133px] h-[133px] object-cover' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt='' />
            <input onChange={(e) => setImage3(e.target.files[0])} type='file' id='image3' hidden />
          </label>
          <label htmlFor='image4'>
            <img className='w-[133px] h-[133px] object-cover' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt='' />
            <input onChange={(e) => setImage4(e.target.files[0])} type='file' id='image4' hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Tên Bài Viết</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full rounded-sm px-3 py-2' type='text' placeholder='Nhập tên bài viết...' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Mô Tả Bài Viết</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full rounded-sm px-3 py-2' type='text' placeholder='Nhập mô tả bài viết...' required />
      </div>

      {/* Thay thế textarea bằng Quill editor */}
      <div className='w-full'>
        <p className='mb-2 rounded-sm'>Nội Dung</p>
        <ReactQuill
          ref={quillRef}  // Sử dụng ref để tham chiếu trực tiếp
          value={content}
          onChange={setContent}
          placeholder='Nhập nội dung bài viết và ảnh có kích thước dưới 1mb...'
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote'],
              ['link'],
              ['image'],
              [{ align: [] }],
              ['clean'],
            ],
          }}

        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Danh mục</p>
        <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2 rounded-sm'>
          <option value="New">Tin Mới</option>
          <option value="Fashion">Thời trang</option>
          <option value="Trending">Xu hướng</option>
          <option value="Question">Thắc mắc</option>
          <option value="Collection">Bộ sưu tập</option>
          <option value="Event">Sự kiện</option>
          <option value="Sale">Giảm giá</option>
        </select>
      </div>

      <div>
        <p className='mb-2'>Tag</p>
        <div className='flex flex-wrap gap-3'>
          <div onClick={() => setTags(prev => prev.includes("Tin mới") ? prev.filter(item => item !== "Tin mới") : [...prev, "Tin mới"])} className=''>
            <p className={`${tags.includes("Tin mới") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Tin mới</p>
          </div>

          <div onClick={() => setTags(prev => prev.includes("Thời trang") ? prev.filter(item => item !== "Thời trang") : [...prev, "Thời trang"])} className=''>
            <p className={`${tags.includes("Thời trang") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Thời trang</p>
          </div>

          <div onClick={() => setTags(prev => prev.includes("Xu hướng") ? prev.filter(item => item !== "Xu hướng") : [...prev, "Xu hướng"])} className=''>
            <p className={`${tags.includes("Xu hướng") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Xu hướng</p>
          </div>

          <div onClick={() => setTags(prev => prev.includes("Thắc mắc") ? prev.filter(item => item !== "Thắc mắc") : [...prev, "Thắc mắc"])} className=''>
            <p className={`${tags.includes("Thắc mắc") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Thắc mắc</p>
          </div>

          <div onClick={() => setTags(prev => prev.includes("Mùa xuân") ? prev.filter(item => item !== "Mùa xuân") : [...prev, "Mùa xuân"])} className=''>
            <p className={`${tags.includes("Mùa xuân") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Mùa xuân</p>
          </div>

          <div onClick={() => setTags(prev => prev.includes("Mùa hạ") ? prev.filter(item => item !== "Mùa hạ") : [...prev, "Mùa hạ"])} className=''>
            <p className={`${tags.includes("Mùa hạ") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Mùa hạ</p>
          </div>

          <div onClick={() => setTags(prev => prev.includes("Mùa thu") ? prev.filter(item => item !== "Mùa thu") : [...prev, "Mùa thu"])} className=''>
            <p className={`${tags.includes("Mùa thu") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Mùa thu</p>
          </div>

          <div onClick={() => setTags(prev => prev.includes("Mùa đông") ? prev.filter(item => item !== "Mùa đông") : [...prev, "Mùa đông"])} className=''>
            <p className={`${tags.includes("Mùa đông") ? "border-yellow-600" : "border-slate-300"} rounded-sm border px-3 py-1 cursor-pointer`}>Mùa đông</p>
          </div>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Người Tạo</p>
        <input onChange={(e) => setCreatedBy(e.target.value)} value={createdBy} className='w-full rounded-sm px-3 py-2' type='text' placeholder='Nhập tên người tạo bài viết...' required />
      </div>

      <button type='submit' className='w-auto rounded-sm py-3 px-4 mt-4 hover:text-gray-600 border hover:border-gray-600 text-yellow-600 border-yellow-600'>
        TẠO BÀI VIẾT
      </button>

      {/* Backdrop hiển thị khi loading */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </form>
  );
};

export default AddBlog;
