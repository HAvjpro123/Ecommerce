import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Eye, Heart } from 'lucide-react';
import axios from 'axios';
import { Card, CardActions, CardContent, CardMedia } from '@mui/material';

export default function BlogCard({ id, image, name, view, description, date }) {
    const { backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const [localView, setLocalView] = useState(view);

    const handleView = async () => {
        try {
            await axios.patch(`${backendUrl}/api/blog/increaseView`, { blogId: id });
            const updatedViewCount = localView + 1;
            setLocalView(updatedViewCount);
            localStorage.setItem(`view-${id}`, updatedViewCount);
        } catch (error) {
            console.error('Lỗi khi tăng lượt xem:', error);
        }
    };

    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(id)) {
            const updatedFavorites = favorites.filter((favoriteId) => favoriteId !== id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setIsFavorite(false);
        } else {
            favorites.push(id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(true);
        }
    };

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.includes(id));

        const storedView = localStorage.getItem(`view-${id}`);
        if (storedView) {
            setLocalView(parseInt(storedView, 10));
        } else {
            setLocalView(view); // Giá trị mặc định từ props
        }
        handleView()
    }, [id, view]);




    // Định dạng ngày tháng
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Card sx={{ maxWidth: 345, boxShadow: 'none' }} className="border rounded-none hover:border-gray-400">
            <Link to={`/blog/${id}`} onClick={() => { handleView() }}>
                <CardMedia sx={{ height: 140 }} image={image[0]} title={description} />
            </Link>
            <CardContent>
                <Link to={`/blog/${id}`} onClick={() => { handleView() }}>
                    <p className="line-clamp-2 text-lg font-medium my-2">{name}</p>
                    <p className="line-clamp-2 text-sm font-medium my-2">{formattedDate}</p> {/* Hiển thị ngày đã định dạng */}
                    <p className="line-clamp-2 text-gray-500">{description}</p>
                </Link>
            </CardContent>
            <CardActions className="mx-2 justify-between gap-1">
                <Heart
                    size={20}
                    strokeWidth={1}
                    onClick={handleToggleFavorite}
                    className={`cursor-pointer mb-1 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                />
                <div className="flex gap-1">
                    <p className="text-gray-400 my-auto">{localView}.0k</p>
                    <Eye size={15} className="mt-1 text-gray-400" />
                </div>
            </CardActions>
        </Card>
    );
}
