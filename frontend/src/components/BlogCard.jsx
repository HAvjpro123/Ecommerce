import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Eye } from 'lucide-react';
import axios from 'axios';
import { Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material'


export default function BlogCard({ id, image, name, view, description, date }) {
    const { backendUrl } = useContext(ShopContext);
    const navigate = useNavigate(); // Sử dụng hook useNavigate

    const [loading, setLoading] = useState(false)

    const handleView = async (id) => {
        try {
            await axios.post(`${backendUrl}/api/blog/increaseView`, { blogId: id });
        } catch (error) {
            console.error('Lỗi khi tăng lượt xem:', error);
        }
    };

    // Cập nhật trạng thái yêu thích từ localStorage
    useEffect(() => {

    }, [id, view]);

    // Định dạng ngày tháng
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Hàm xử lý điều hướng đến blog chi tiết và tăng lượt xem
    const handleNavigate = () => {
        handleView(id); // Tăng lượt xem khi nhấn vào blog
        setLoading(true)  // Bật Backdrop khi nhấn vào sản phẩm
        setTimeout(() => {
            setLoading(false) 
            navigate(`/blog/${id}`); // Điều hướng đến trang chi tiết blog
            window.scrollTo(0, 0) 
        }, 500);
    };

    return (
        <Card sx={{ maxWidth: 345, boxShadow: 'none' }} onClick={handleNavigate}  className="border rounded-none cursor-pointer hover:border-gray-400">
            {/* Thay vì dùng <Link>, dùng onClick với navigate */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CardMedia sx={{ height: 140 }} image={image[0]} title={description} />
            <CardContent>
                <p className="line-clamp-2 text-lg font-medium my-2" onClick={handleNavigate}>
                    {name}
                </p>
                <p className="line-clamp-2 text-gray-500">{description}</p>
            </CardContent>
            <CardActions className="mx-2 justify-between gap-1">
                <p className="line-clamp-2 text-sm font-medium my-2 text-gray-400">{formattedDate}</p> {/* Hiển thị ngày đã định dạng */}
                <div className="flex gap-1">
                    <p className="text-gray-400 my-auto">{view}</p>
                    <Eye size={15} className="mt-1 text-gray-400" />
                </div>
            </CardActions>
        </Card>
    );
}
