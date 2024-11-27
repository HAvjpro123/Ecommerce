
import { createContext, useEffect, useState } from "react";
// import { products, blogs, vouchers } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'đ';
    const delivery_fee = 30000;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const totalView = 'lượt xem'
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [discountAmount, setDiscountAmount] = useState(0); 

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Vui lòng chọn kích thước sản phẩm!');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {

            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {

            }

        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
          const itemInfo = products.find((product) => product._id === items);
          if (!itemInfo) continue; // Bỏ qua sản phẩm không tồn tại
      
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          }
        }
        return totalAmount;
      };
      
      
    // lấy danh sách bài viết
    const getBlogsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/blog/listblog')
            if (response.data.success) {
                setBlogs(response.data.blogs)
                console.log(response.data.blogs);
                
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    // lấy đanh sách voucher
    const getVouchersData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/voucher/listvoucher')
            if (response.data.success) {
                setVouchers(response.data.vouchers)
                console.log(response.data.vouchers);
                
            } else {
                toast.error(response.data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    //lấy danh sách sản phẩm
    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response =  await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getProductsData()
        getBlogsData()
        getVouchersData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        products, currency, delivery_fee, blogs, totalView, vouchers,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, discountAmount, setDiscountAmount
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;