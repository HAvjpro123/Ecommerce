import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import { backendUrl, currency } from '../App.jsx';
import { toast } from 'react-toastify';
import { Boxes, FilePen, HandCoins, Package } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const DashboardChart = ({ token }) => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProductsSold, setTotalProductsSold] = useState(0);
    const [productSalesData, setProductSalesData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [monthlyOrderRevenue, setMonthlyOrderRevenue] = useState([]);
    const [lastMonthOrders, setLastMonthOrders] = useState(0);
    const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
    const [lastMonthProductsSold, setLastMonthProductsSold] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);

    const fetchOrdersData = async () => {
        if (!token) return;
        try {
            const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
            if (response.data.success) {
                const orders = response.data.orders;
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth();
                const currentDay = new Date().getDay()
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

                // Calculate monthly revenue
                const revenueByMonth = Array(12).fill(0);

                orders.forEach(order => {
                    const orderDate = new Date(order.date);
                    if (orderDate.getFullYear() === currentYear) {
                        const month = orderDate.getMonth();
                        revenueByMonth[month] += order.amount;
                    }
                });

                setMonthlyRevenue(revenueByMonth);

                // Filter orders by months
                const filterOrders = (month, year) =>
                    orders.filter(order => {
                        const date = new Date(order.date);
                        return date.getMonth() === month && date.getFullYear() === year;
                    });

                const currentMonthOrders = filterOrders(currentMonth, currentYear);
                const lastMonthOrdersData = filterOrders(lastMonth, lastMonthYear);

                // Tạo danh sách các ngày có đơn hàng
                const daysWithOrders = [];
                const ordersByDay = Array(31).fill(0);

                currentMonthOrders.forEach(order => {
                    const orderDate = new Date(order.date);
                    const day = orderDate.getDate(); // Lấy ngày trong tháng
                    if (!daysWithOrders.includes(day)) {
                        daysWithOrders.push(day); // Chỉ thêm ngày chưa có trong danh sách
                    }
                    ordersByDay[day - 2] += 1; // Tăng số lượng đơn hàng của ngày đó
                });

                setMonthlyOrderRevenue(ordersByDay);
                // Cập nhật dữ liệu cho biểu đồ
                setProductSalesData(daysWithOrders); // Lưu trữ ngày có đơn hàng

                // Filter orders by month

                // Calculate total orders and revenue
                const totalOrdersCount = currentMonthOrders.length;
                const totalRevenueAmount = currentMonthOrders.reduce((sum, order) => sum + order.amount, 0);

                const lastMonthRevenueAmount = lastMonthOrdersData.reduce((sum, order) => sum + order.amount, 0);
                const lastMonthOrdersCount = lastMonthOrdersData.length;

                // Calculate total products sold
                let currentMonthProducts = 0;
                let lastMonthProducts = 0;

                const calculateProducts = ordersList => {
                    let products = 0;
                    ordersList.forEach(order =>
                        order.items.forEach(item => {
                            products += item.quantity;
                        })
                    );
                    return products;
                };

                currentMonthProducts = calculateProducts(currentMonthOrders);
                lastMonthProducts = calculateProducts(lastMonthOrdersData);

                setTotalOrders(totalOrdersCount);
                setLastMonthOrders(lastMonthOrdersCount);

                setTotalRevenue(totalRevenueAmount);
                setLastMonthRevenue(lastMonthRevenueAmount);

                setTotalProductsSold(currentMonthProducts);
                setLastMonthProductsSold(lastMonthProducts);
                console.log("Current Month Orders:", currentMonthOrders);
                console.log("Orders By Day:", ordersByDay);
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
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

                const filterPosts = (month, year) =>
                    posts.filter(post => {
                        const date = new Date(post.date);
                        return date.getMonth() === month && date.getFullYear() === year;
                    });

                const postsThisMonth = filterPosts(currentMonth, currentYear);
                const postsLastMonth = filterPosts(lastMonth, lastMonthYear);

                setTotalPosts(postsThisMonth.length);
                setLastMonthPosts(postsLastMonth.length);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return current > 0 ? "+∞%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };

    // Hàm đổi đơn vị tiền tệ
    const formatRevenue = (amount) => {
        if (amount >= 1_000_000) {
            return `${(amount / 1_000_000).toFixed(1)}M+`;
        } else if (amount >= 1_000) {
            return `${(amount / 1_000).toFixed(1)}K+`;
        }
        return amount.toString();
    };

    // Hàm thay màu cột của bar
    const generateGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgb(250 204 21)'); // Màu ở đáy
        gradient.addColorStop(1, 'rgb(234 179 8)'); // Màu ở đỉnh
        return gradient;
    };

    useEffect(() => {
        fetchOrdersData();
        fetchPostsData();
        const date = new Date();
        const monthNames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        setCurrentMonth(monthNames[date.getMonth()]);
    }, [token]);

    const barData = {
        labels: productSalesData,
        datasets: [
            {
                label: 'Số lượng đơn hàng trong ngày',
                data: monthlyOrderRevenue,
                backgroundColor: (context) => {
                    const { chart } = context;
                    if (!chart.chartArea) return 'rgba(234, 179, 8, 0.5)'; // Màu mặc định
                    return generateGradient(chart.ctx, chart.chartArea);
                },

            },
        ],
    };

    const barOptions = {
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e5e7eb',
                },
                ticks: {
                    callback: function (value) {
                        if (value >= 1_000_000) {
                            return `${value / 1_000_000}M`; // Giá trị >= 1 triệu sẽ hiển thị M
                        } else if (value >= 1_000) {
                            return `${value / 1_000}K`; // Giá trị >= 1 nghìn sẽ hiển thị K
                        }
                        return value; // Giá trị nhỏ hơn 1 nghìn giữ nguyên
                    },
                }
            },
        },
    };

    const lineData = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: monthlyRevenue,
                backgroundColor: 'rgb(250 204 21)',
                borderColor: 'rgb(234 179 8)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const lineOptions = {
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e5e7eb',
                },
                ticks: {
                    callback: function (value) {
                        if (value >= 1_000_000) {
                            return `${value / 1_000_000}M`; // Giá trị >= 1 triệu sẽ hiển thị M
                        } else if (value >= 1_000) {
                            return `${value / 1_000}K`; // Giá trị >= 1 nghìn sẽ hiển thị K
                        }
                        return value; // Giá trị nhỏ hơn 1 nghìn giữ nguyên
                    },
                }
            },
        },
    };

    return (
        <div>
            <div className='mb-4'>
                {/* Thống kê tổng quan */}
                <div className=" rounded-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-md border border-gray-300 p-4 flex justify-between items-center">
                            <div className="font-medium">
                                <p className="text-sm text-gray-500">Tổng số đơn hàng</p>
                                <p className="text-xl font-bold mt-1">
                                    +{totalOrders.toLocaleString()}
                                </p>
                                <div>
                                    <span
                                        className={`text-[10px] ${totalOrders >= lastMonthOrders ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {calculatePercentageChange(totalOrders, lastMonthOrders)}
                                    </span> <span className='text-[10px] text-gray-400'>so với tháng trước</span>
                                </div>

                            </div>
                            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md shadow-md">
                                <Package size={25} className="text-gray-100" />
                            </div>
                        </div>
                        <div className="bg-white rounded-md border border-gray-300 p-4 flex justify-between items-center">
                            <div className="font-medium">
                                <p className="text-sm text-gray-500">Tổng doanh thu</p>
                                <p className="text-xl font-bold mt-1">
                                    {formatRevenue(totalRevenue)}
                                </p>
                                <div>
                                    <span
                                        className={`text-[10px] ${totalRevenue >= lastMonthRevenue ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {calculatePercentageChange(totalRevenue, lastMonthRevenue)}
                                    </span> <span className='text-[10px] text-gray-400'>so với tháng trước</span>
                                </div>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md shadow-md">
                                <HandCoins size={25} className="text-gray-100" />
                            </div>
                        </div>
                        <div className="bg-white rounded-md border border-gray-300 p-4 flex justify-between items-center">
                            <div className="font-medium ">
                                <p className="text-sm text-gray-500">Số sản phẩm đã bán</p>
                                <p className="text-xl font-bold mt-1">
                                    +{totalProductsSold.toLocaleString()}
                                </p>
                                <div>
                                    <span
                                        className={`text-[10px] ${totalProductsSold >= lastMonthProductsSold ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {calculatePercentageChange(totalProductsSold, lastMonthProductsSold)}
                                    </span> <span className='text-[10px] text-gray-400'>so với tháng trước</span>
                                </div>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md shadow-md">
                                <Boxes size={25} className="text-gray-100" />
                            </div>
                        </div>
                        <div className="bg-white rounded-md border border-gray-300 p-4 flex justify-between items-center">
                            <div className="font-medium">
                                <p className="text-sm text-gray-500 mt-1">Bài viết trong tháng</p>
                                <p className="text-xl font-bold">
                                    {totalPosts}
                                </p>
                                <div>
                                    <span
                                        className={`text-[10px] ${totalProductsSold >= lastMonthProductsSold ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {calculatePercentageChange(totalProductsSold, lastMonthProductsSold)}
                                    </span> <span className='text-[10px] text-gray-400'>so với tháng trước</span>
                                </div>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md shadow-md">
                                <FilePen size={25} className="text-gray-100" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex-col grid gap-4  sm:grid-cols-[3fr_3fr]">

                {/* Thống kê sản phẩm đã bán */}
                <div className="bg-white sm:p-6 rounded-md border border-gray-300">
                    <div className='text-center sm:text-start'>
                        <h2 className="text-lg font-semibold text-gray-600 mb-4 p-2 sm:p-0">
                            LƯỢT BÁN TRONG THÁNG {currentMonth}
                        </h2>
                    </div>

                    {monthlyRevenue.reduce((a, b) => a + b, 0) > 0 ? (
                        <Bar data={barData} options={barOptions} className='px-2 sm:px-0' />
                    ) : (
                        <p className="text-gray-500 text-center">Chưa có dữ liệu đơn hàng</p>
                    )}
                </div>

                {/* Biểu đồ đường doanh thu */}
                <div className="bg-white sm:p-6 rounded-md border border-gray-300">
                    <div className='text-center sm:text-start'>
                        <h2 className="text-lg font-semibold text-gray-600 mb-4 p-2 sm:p-0">
                            TỔNG QUAN DOANH THU
                        </h2>
                    </div>
                    <Line data={lineData} options={lineOptions} className='px-2 sm:px-0' />
                </div>
            </div>
        </div>

    );
};

export default DashboardChart;
