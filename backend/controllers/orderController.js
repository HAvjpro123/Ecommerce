import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'
import paypal from '@paypal/checkout-server-sdk';
import productModel from "../models/productModel.js";


// global variables
const currency = 'vnd'
const deliveryCharge = 300

// getway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const paypalenvironment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET_KEY
);
const payPalClient = new paypal.core.PayPalHttpClient(paypalenvironment);

const updateUserLevel = (user) => {
    if (user.amountPurchased > 20000000) return "Kim Cương";
    if (user.amountPurchased > 15000000) return "Bạch Kim";
    if (user.amountPurchased > 10000000) return "Vàng";
    if (user.amountPurchased > 5000000) return "Bạc";
    return "Đồng";
};

// placing order using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Giảm số lượng sản phẩm trong kho và tăng sold
        for (const item of items) {
            await productModel.findByIdAndUpdate(item._id, {
                $inc: { totalStock: -item.quantity, sold: item.quantity },
            });
        }

        // Tính tổng giá trị và số lượng sản phẩm
        const totalAmount = items.reduce((sum, item) => {
            return (typeof item.price === "number" && typeof item.quantity === "number")
                ? sum + item.price * item.quantity
                : sum;
        }, 0);

        const totalItems = items.reduce((sum, item) => {
            return (typeof item.quantity === "number") ? sum + item.quantity : sum;
        }, 0);

        // Cập nhật amountPurchased và itemPurchased
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }

        user.amountPurchased = user.amountPurchased || 0;
        user.itemPurchased = user.itemPurchased || 0;

        user.amountPurchased += totalAmount;
        user.itemPurchased += totalItems;

        user.level = updateUserLevel(user);

        // Xóa dữ liệu giỏ hàng và lưu thông tin user
        user.cartData = {};
        await user.save();

        res.json({ success: true, message: "Đã đặt hàng thành công" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// placing order using Stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Chỉ dùng tổng hóa đơn làm line_item
        const line_items = [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: "Tổng hóa đơn"
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ];

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Verify  Stripe
const verifyStripe = async (req, res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            const order = await orderModel.findById(orderId);
            // Giảm số lượng sản phẩm trong kho
            for (const item of order.items) {
                await productModel.findByIdAndUpdate(item._id, {
                    $inc: { totalStock: -item.quantity, sold: item.quantity },
                });
            }
            // Tính tổng giá trị và số lượng sản phẩm
            const totalAmount = order.items.reduce((sum, item) => {
                return (typeof item.price === "number" && typeof item.quantity === "number")
                    ? sum + item.price * item.quantity
                    : sum;
            }, 0);

            const totalItems = order.items.reduce((sum, item) => {
                return (typeof item.quantity === "number") ? sum + item.quantity : sum;
            }, 0);

            // Cập nhật amountPurchased và itemPurchased
            const user = await userModel.findById(userId);
            if (!user) {
                return res.json({ success: false, message: "Người dùng không tồn tại" });
            }

            user.amountPurchased = user.amountPurchased || 0;
            user.itemPurchased = user.itemPurchased || 0;

            user.amountPurchased += totalAmount;
            user.itemPurchased += totalItems;

            user.level = updateUserLevel(user);

            // Xóa dữ liệu giỏ hàng và lưu thông tin user
            user.cartData = {};
            await user.save();
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Placing order using PayPal method
const placeOrderPaypal = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Paypal",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Create PayPal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD", // Adjust currency as needed
                        value: (amount / 25915).toFixed(2), // Convert VND to USD
                    },
                },
            ],
            application_context: {
                brand_name: "Your Brand",
                landing_page: "BILLING",
                user_action: "PAY_NOW",
                return_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            },
        });

        const order = await payPalClient.execute(request);

        res.json({
            success: true,
            orderID: order.result.id,
            approval_url: order.result.links.find((link) => link.rel === "approve").href,
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify PayPal payment
const verifyPaypal = async (req, res) => {
    try {
        const { orderId, paypal_order_id, userId } = req.body;

        const request = new paypal.orders.OrdersGetRequest(paypal_order_id);
        const order = await payPalClient.execute(request);

        if (order.result.status === "COMPLETED") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(order.result.purchase_units[0].reference_id, { cartData: {} });
            const dbOrder = await orderModel.findById(orderId);

            // Giảm số lượng sản phẩm trong kho
            for (const item of dbOrder.items) {
                await productModel.findByIdAndUpdate(item._id, {
                    $inc: { totalStock: -item.quantity, sold: item.quantity },
                });
            }
                    // Tính tổng giá trị và số lượng sản phẩm
                    const totalAmount = dbOrder.items.reduce((sum, item) => {
                        return (typeof item.price === "number" && typeof item.quantity === "number")
                            ? sum + item.price * item.quantity
                            : sum;
                    }, 0);
        
                    const totalItems = dbOrder.items.reduce((sum, item) => {
                        return (typeof item.quantity === "number") ? sum + item.quantity : sum;
                    }, 0);
        
                    // Cập nhật amountPurchased và itemPurchased
                    const user = await userModel.findById(userId);
                    if (!user) {
                        return res.json({ success: false, message: "Người dùng không tồn tại" });
                    }
        
                    user.amountPurchased = user.amountPurchased || 0;
                    user.itemPurchased = user.itemPurchased || 0;
        
                    user.amountPurchased += totalAmount;
                    user.itemPurchased += totalItems;
        
                    user.level = updateUserLevel(user);
        
                    // Xóa dữ liệu giỏ hàng và lưu thông tin user
                    user.cartData = {};
                    await user.save();
            res.json({ success: true, message: "Thanh toán thành công" });
        } else {
            res.json({ success: false, message: "Thanh toán chưa hoàn tất" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// All orders data for Admin Panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// User orders data for Frontend
const userOrders = async (req, res) => {
    try {

        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// update order status form Admin Panel
const updateStatus = async (req, res) => {
    try {

        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Kiểm tra đơn hàng tồn tại
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.status === "Đã hoàn thành") {
            return res.status(400).json({ success: false, message: "Không thể hủy đơn hàng đã hoàn thành." });
        }

        // Cập nhật trạng thái thành "Đã hủy"
        order.status = "Đã hủy";
        await order.save();

        res.json({ success: true, message: "Đơn hàng đã được hủy thành công." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
};

// function for delete order
const deleteOrder = async (req, res) => {
    try {

        await orderModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Đã xóa đơn hàng' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const orderReview = async (req, res) => {
    const { orderId } = req.params;
    const { reviews } = req.body; // Mảng chứa các đánh giá cho từng sản phẩm

    try {
        // Tìm đơn hàng
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Duyệt qua từng sản phẩm trong đơn hàng và cập nhật đánh giá
        for (const review of reviews) {
            const { productId, userId, userName, rating, comment } = review;

            const product = await productModel.findById(productId);
            if (!product) {
                continue; // Bỏ qua nếu sản phẩm không tồn tại
            }

            product.reviews.push({
                userId,
                userName,
                rating,
                comment,
                reviewDate: new Date(),
            });

            await product.save();

            // Cập nhật trạng thái đã đánh giá cho đơn hàng
            order.review = true; // Đánh dấu đơn hàng đã được đánh giá
            await order.save();
        }

        res.status(200).json({ message: 'Đánh giá thành công cho tất cả sản phẩm' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật đánh giá' });
    }
};


export { placeOrder, placeOrderStripe, placeOrderPaypal, allOrders, userOrders, updateStatus, verifyStripe, verifyPaypal, cancelOrder, deleteOrder, orderReview }