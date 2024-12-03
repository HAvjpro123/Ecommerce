import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import axios from 'axios';
import { backendUrl, currency } from '../App.jsx';
import { toast } from 'react-toastify';
import { Boxes, FilePen, HandCoins, Package } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardChart = ({ token }) => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProductsSold, setTotalProductsSold] = useState(0);
    const [productSalesData, setProductSalesData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchOrdersData = async () => {
        if (!token) {
            return null;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
            if (response.data.success) {
                const orders = response.data.orders;
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const monthlyOrders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
                });

                const totalOrdersCount = monthlyOrders.length;
                const totalRevenueAmount = monthlyOrders.reduce((acc, order) => acc + order.amount, 0);
                const productCountMap = {};
                let totalProducts = 0;

                monthlyOrders.forEach(order => {
                    order.items.forEach(item => {
                        totalProducts += item.quantity;
                        if (productCountMap[item.nameCode]) {
                            productCountMap[item.nameCode] += item.quantity;
                        } else {
                            productCountMap[item.nameCode] = item.quantity;
                        }
                    });
                });

                const productSalesArray = Object.keys(productCountMap).map(productName => ({
                    nameCode: productName,
                    quantity: productCountMap[productName],
                }));

                setTotalOrders(totalOrdersCount);
                setTotalRevenue(totalRevenueAmount);
                setTotalProductsSold(totalProducts);
                setProductSalesData(productSalesArray);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchPostsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/blog/listblog');
            if (response.data.success) {
                const posts = response.data.blogs || [];
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const postsThisMonth = posts.filter(post => {
                    const postDate = new Date(post.date);
                    return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
                });

                setTotalPosts(postsThisMonth.length);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchOrdersData();
        fetchPostsData();
        const date = new Date();
        const monthNames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        setCurrentMonth(monthNames[date.getMonth()]);
    }, [token, fetchOrdersData, ]);

    const barData = {
        labels: productSalesData.map(product => product.nameCode),
        datasets: [
            {
                label: 'Số lượng bán',
                data: productSalesData.map(product => product.quantity),
                backgroundColor: 'rgba(255, 193, 7, 0.6)',
                borderColor: '#FFC107',
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: Math.max(...productSalesData.map(product => product.quantity)) || 1,
            },
        },
    };

    return (
        <div className="flex-col grid gap-6 sm:grid-cols-[2fr_3fr]">
            {/* Thống kê tổng quan */}
            <div className="bg-white sm:border border-b py-4 border-gray-300 sm:p-6  rounded-sm">
                <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-yellow-600 pl-2 mb-6">
                    Tổng Quan Tháng {currentMonth}
                </h2>
                <div className="space-y-4">
                    <StatCard icon={<Package size={24} />} label="Tổng số đơn hàng" value={totalOrders} color="bg-green-500" />
                    <StatCard icon={<HandCoins size={24} />} label="Tổng doanh thu" value={`${totalRevenue.toLocaleString()} ${currency}`} color="bg-red-500" />
                    <StatCard icon={<Boxes size={24} />} label="Số sản phẩm đã bán" value={totalProductsSold} color="bg-blue-500" />
                    <StatCard icon={<FilePen size={24} />} label="Bài viết trong tháng" value={totalPosts} color="bg-purple-500" />
                </div>
            </div>

            {/* Thống kê sản phẩm đã bán */}
            <div className="bg-white sm:border border-b py-4 border-gray-300 sm:p-6 rounded-sm">
                <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-yellow-600 pl-2 mb-6">
                    Thống Kê Sản Phẩm Tháng {currentMonth}
                </h2>
                {productSalesData.length > 0 ? (
                    <Bar data={barData} options={barOptions} />
                ) : (
                    <p className="text-gray-500 text-center">Chưa có dữ liệu sản phẩm</p>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg shadow-sm ${color} text-white`}>
        <div className="w-12 h-12 flex justify-center items-center rounded-full bg-white bg-opacity-20">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    </div>
);

export default DashboardChart;
