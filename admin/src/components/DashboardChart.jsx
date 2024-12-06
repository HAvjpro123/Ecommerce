import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import { backendUrl, currency } from '../App.jsx';
import { toast } from 'react-toastify';
import { Boxes, FilePen, HandCoins, Package } from 'lucide-react';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

// Component DashboardChart hiển thị biểu đồ tổng quan
const DashboardChart = ({ token }) => {
    // Khai báo các state để lưu trữ dữ liệu cần thiết
    const [totalOrders, setTotalOrders] = useState(0); // Tổng số đơn hàng hiện tại
    const [totalRevenue, setTotalRevenue] = useState(0); // Tổng doanh thu hiện tại
    const [totalProductsSold, setTotalProductsSold] = useState(0); // Tổng số sản phẩm đã bán
    const [productSalesData, setProductSalesData] = useState([]); // Dữ liệu doanh số bán hàng
    const [currentMonth, setCurrentMonth] = useState(''); // Tháng hiện tại
    const [totalPosts, setTotalPosts] = useState(0); // Tổng số bài đăng
    const [monthlyRevenue, setMonthlyRevenue] = useState([]); // Doanh thu theo từng tháng
    const [monthlyOrderRevenue, setMonthlyOrderRevenue] = useState([]); // Số lượng đơn hàng trong tháng
    const [lastMonthOrders, setLastMonthOrders] = useState(0); // Số lượng đơn hàng tháng trước
    const [lastMonthRevenue, setLastMonthRevenue] = useState(0); // Doanh thu tháng trước
    const [lastMonthProductsSold, setLastMonthProductsSold] = useState(0); // Số sản phẩm đã bán trong tháng trước
    const [lastMonthPosts, setLastMonthPosts] = useState(0); // Số bài đăng tháng trước

    // Hàm lấy dữ liệu đơn hàng từ API
    const fetchOrdersData = async () => {
        if (!token) return; // Nếu không có token thì thoát
        try {
            const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
            if (response.data.success) {
                const orders = response.data.orders; // Lấy danh sách đơn hàng
                const currentYear = new Date().getFullYear(); // Năm hiện tại
                const currentMonth = new Date().getMonth(); // Tháng hiện tại (0-11)
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Tháng trước
                const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear; // Năm của tháng trước

                // Tính toán doanh thu theo từng tháng
                const revenueByMonth = Array(12).fill(0);
                orders.forEach(order => {
                    const orderDate = new Date(order.date);
                    if (orderDate.getFullYear() === currentYear) {
                        const month = orderDate.getMonth();
                        revenueByMonth[month] += order.amount;
                    }
                });
                setMonthlyRevenue(revenueByMonth);

                // Hàm lọc đơn hàng theo tháng và năm
                const filterOrders = (month, year) =>
                    orders.filter(order => {
                        const date = new Date(order.date);
                        return date.getMonth() === month && date.getFullYear() === year;
                    });

                // Lấy dữ liệu đơn hàng của tháng hiện tại và tháng trước
                const currentMonthOrders = filterOrders(currentMonth, currentYear);
                const lastMonthOrdersData = filterOrders(lastMonth, lastMonthYear);

                // Tính số lượng đơn hàng theo từng ngày trong tháng
                const daysWithOrders = [];
                const ordersByDay = Array(31).fill(0);
                currentMonthOrders.forEach(order => {
                    const orderDate = new Date(order.date);
                    const day = orderDate.getDate(); // Ngày trong tháng
                    if (!daysWithOrders.includes(day)) {
                        daysWithOrders.push(day); // Thêm ngày chưa tồn tại
                    }
                    ordersByDay[day - 1] += 1; // Tăng số lượng đơn hàng của ngày đó
                });
                setMonthlyOrderRevenue(ordersByDay);
                setProductSalesData(daysWithOrders);

                // Tính toán tổng đơn hàng và doanh thu
                const totalOrdersCount = currentMonthOrders.length;
                const totalRevenueAmount = currentMonthOrders.reduce(
                    (sum, order) => sum + order.amount, 0
                );
                const lastMonthRevenueAmount = lastMonthOrdersData.reduce(
                    (sum, order) => sum + order.amount, 0
                );
                const lastMonthOrdersCount = lastMonthOrdersData.length;

                // Tính tổng sản phẩm bán được
                const calculateProducts = ordersList =>
                    ordersList.reduce((products, order) =>
                        products + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);
                const currentMonthProducts = calculateProducts(currentMonthOrders);
                const lastMonthProducts = calculateProducts(lastMonthOrdersData);

                // Cập nhật các state liên quan
                setTotalOrders(totalOrdersCount);
                setLastMonthOrders(lastMonthOrdersCount);
                setTotalRevenue(totalRevenueAmount);
                setLastMonthRevenue(lastMonthRevenueAmount);
                setTotalProductsSold(currentMonthProducts);
                setLastMonthProductsSold(lastMonthProducts);
            } else {
                toast.error(response.data.message); // Hiển thị lỗi nếu API trả về thất bại
            }
        } catch (error) {
            toast.error(error.message); // Hiển thị lỗi nếu gọi API thất bại
        }
    };

    // Hàm lấy dữ liệu bài đăng từ API
    const fetchPostsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/blog/listblog`);
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

    // Tính toán phần trăm thay đổi giữa hai giá trị
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return current > 0 ? "+∞%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };

    // Hàm định dạng doanh thu
    const formatRevenue = (amount) => {
        if (amount >= 1_000_000) {
            return `${(amount / 1_000_000).toFixed(1)}M+`;
        } else if (amount >= 1_000) {
            return `${(amount / 1_000).toFixed(1)}K+`;
        }
        return amount.toString();
    };

    // Tạo màu gradient cho biểu đồ
    const generateGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgb(250 204 21)');
        gradient.addColorStop(1, 'rgb(234 179 8)');
        return gradient;
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchOrdersData();
        fetchPostsData();
        const date = new Date();
        const monthNames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        setCurrentMonth(monthNames[date.getMonth()]);
    }, [token]);

    // Cấu hình dữ liệu cho biểu đồ Bar
    const barData = {
        labels: productSalesData,
        datasets: [
            {
                label: 'Số lượng đơn hàng trong ngày',
                data: monthlyOrderRevenue,
                backgroundColor: (context) => {
                    const { chart } = context;
                    if (!chart.chartArea) return 'rgba(234, 179, 8, 0.5)';
                    return generateGradient(chart.ctx, chart.chartArea);
                },
            },
        ],
    };

    const barOptions = {
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                grid: { color: '#e5e7eb' },
                ticks: {
                    callback: function (value) {
                        if (value >= 1_000_000) return `${value / 1_000_000}M`;
                        else if (value >= 1_000) return `${value / 1_000}K`;
                        return value;
                    },
                },
            },
        },
    };

    // Cấu hình dữ liệu cho biểu đồ Line
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
            legend: { display: true },
            tooltip: { enabled: true },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                grid: { color: '#e5e7eb' },
                ticks: {
                    callback: function (value) {
                        if (value >= 1_000_000) return `${value / 1_000_000}M`;
                        else if (value >= 1_000) return `${value / 1_000}K`;
                        return value;
                    },
                },
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
                                        className={`text-[10px] ${totalPosts >= lastMonthPosts ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {calculatePercentageChange(totalPosts, lastMonthPosts)}
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
