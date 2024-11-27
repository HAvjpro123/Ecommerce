import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { ArrowUpAZ, ArrowUpDown, ArrowDownAZ, Search, Trash, Info } from 'lucide-react';
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip } from '@mui/material';

const ListBlog = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState(""); // Thêm biến trạng thái cho từ khóa tìm kiếm

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null); // Lưu thông tin chi tiết sản phẩm được chọn


  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + '/api/blog/listblog');
      if (response.data.success) {
        let sortedBlogs = response.data.blogs;
        if (sortField) {
          sortedBlogs = sortedBlogs.sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];
            if (typeof fieldA === 'string') {
              return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            } else if (typeof fieldA === 'number') {
              return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
            }
            return 0;
          });
        }
        setList(sortedBlogs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (id) => {
    setBlogIdToDelete(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setBlogIdToDelete(null);
  };

  const confirmDeleteBlog = () => {
    if (blogIdToDelete) {
      removeBlog(blogIdToDelete);
    }
    closeConfirmDialog();
  };

  const removeBlog = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + '/api/blog/removeblog', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? <ArrowUpAZ size={15} strokeWidth={1.5} className='text-gray-600' /> : <ArrowDownAZ size={15} strokeWidth={1.5} className='text-gray-600' />;
    }
    return <ArrowUpDown size={15} strokeWidth={1.5} className='text-gray-400' />;
  };

  // Lọc danh sách blog theo từ khóa tìm kiếm
  const filteredList = list.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredList.length / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Hàm mở chi tiết sản phẩm
  const openBlogDetails = (blog) => {
    setSelectedBlog(blog);
  };

  useEffect(() => {
    fetchList();
  }, [sortField, sortOrder]);

  return (
    <>

      <Title text1={'QUẢN LÝ'} text2={'BÀI VIẾT'} />
      {/* Ô nhập liệu tìm kiếm */}
      <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 mb-5 w-full rounded-sm'>
        <input
          type="text"
          placeholder="Tìm tiêu đề bài viết..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none bg-inherit border-none text-md "
          style={{ outline: '0px' }}
        />
        <Search strokeWidth={1} />
      </div>


      <div className='flex flex-col gap-2'>
        <div className='grid sm:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] grid-cols-[1fr_3fr_1fr_1fr]  items-center py-1 gap-2 px-2 border bg-gray-100 text-sm'>
          <b className='cursor-pointer flex items-center gap-1'>Ảnh bìa</b>
          <b onClick={() => handleSort('name')} className='cursor-pointer flex items-center gap-1'>
            Tiêu đề {getSortIcon('name')}
          </b>
          <b onClick={() => handleSort('view')} className='cursor-pointer items-center gap-1 hidden sm:flex'>
            Lượt xem {getSortIcon('view')}
          </b>
          <b onClick={() => handleSort('date')} className='cursor-pointer items-center gap-1 flex'>
            Ngày đăng {getSortIcon('date')}
          </b>
          <b onClick={() => handleSort('createdBy')} className='cursor-pointer  items-center gap-1 hidden sm:flex'>
            Người viết {getSortIcon('createdBy')}
          </b>
          <b className='text-center'>Thao tác</b>
        </div>

        {
          currentList.map((item, index) => (
            <div className='grid sm:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] grid-cols-[1fr_3fr_1fr_1fr]  hover:border-yellow-600 items-center gap-2 p-2 border sm:text-base text-xs' key={index}>
              <img className='w-12 h-12 object-cover' src={item.image[0]} alt="" />
              <p className='line-clamp-2'>{item.name}</p>
              <p className='hidden sm:block line-clamp-1'>{item.view}</p>
              <p className='line-clamp-2'>
                {new Date(item.date).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}, {new Date(item.date).toLocaleDateString('vi-VN').replace(/\//g, '-')}{" "}
              </p>
              <p className='hidden sm:block'>{item.createdBy}</p>

              <div className='flex justify-center sm:gap-3 gap-2'>
                <p onClick={() => openConfirmDialog(item._id)} >
                  <Tooltip title="Xóa" arrow>
                    <Trash  size={17} className='mx-auto hover:text-red-500 md:text-center cursor-pointer' strokeWidth={1} />
                  </Tooltip>
                </p>
                <button onClick={() => openBlogDetails(item)} className='text-gray-600 hover:text-blue-500'>
                  <Tooltip title="Thông tin bài viết" arrow>
                    <Info  size={17} strokeWidth={1} />
                  </Tooltip>
                </button>
              </div>
            </div>
          ))
        }
      </div>

      <div className='flex justify-center gap-4 mt-4 border-t border-gray-300 text-sm sm:text-base'>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 pt-2 mt-4 ${currentPage === 1 ? 'text-gray-400' : 'text-yellow-600'} cursor-pointer`}
        >
          Trang trước
        </button>
        <div className='pt-2 mt-4'>Trang {currentPage} / {totalPages}</div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 pt-2 mt-4 ${currentPage === totalPages ? 'text-gray-400' : 'text-yellow-600'} cursor-pointer`}
        >
          Trang sau
        </button>
      </div>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa bài viết này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">Hủy</Button>
          <Button onClick={confirmDeleteBlog} variant='outlined' color="warning">Xác nhận</Button>
        </DialogActions>
      </Dialog>

      {/* Hộp thoại hiển thị chi tiết sản phẩm */}
      <Dialog
        open={selectedBlog !== null}
        onClose={() => setSelectedBlog(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="text-2xl font-semibold text-gray-800 bg-gray-100 p-4 rounded-t-lg">
          Thông tin bài viết
        </DialogTitle>
        <DialogContent className="p-6 bg-white rounded-b-lg shadow-lg">
          {selectedBlog && (
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-4">Danh sách ảnh bìa:</p>
              <div className="flex flex-wrap gap-4 mb-6">
                {selectedBlog?.image?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`image-${index}`}
                    className="w-32 h-32 object-cover rounded-sm shadow-md transition-all transform hover:scale-105"
                  />
                ))}
              </div>
              <hr className='mb-6' />
              <div className="space-y-4">
                <p className="text-base text-gray-600"><strong>Tên bài viết:</strong> {selectedBlog.name}</p>
                <p className="text-base text-gray-600"><strong>Mô tả bài viết:</strong> {selectedBlog.description}</p>
                <p className="text-base text-gray-600"><strong>Người viết:</strong> {selectedBlog.createdBy}</p>
                <p className="text-base text-gray-600">
                  <strong>Ngày thêm:</strong> {new Date(selectedBlog.date).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}, {new Date(selectedBlog.date).toLocaleDateString('vi-VN').replace(/\//g, '-')}
                </p>
                <hr />
                <div className="text-base text-gray-600">
                  <strong>Nội dung:</strong>

                  <div className='mt-2 content' dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                </div>

              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-100 p-4 ">
          <Button
            onClick={() => setSelectedBlog(null)}
            color="warning"
            variant="outlined"
            className="text-white"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ListBlog;
