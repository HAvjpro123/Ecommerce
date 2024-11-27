import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderPaypal, allOrders, userOrders, updateStatus, verifyStripe, verifyPaypal, cancelOrder, deleteOrder} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/paypal', authUser, placeOrderPaypal)

// User Features
orderRouter.post('/userorders', authUser, userOrders)

// Verify payment 
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyPaypal', authUser, verifyPaypal)

// cancel order
orderRouter.post('/cancel', authUser, cancelOrder);

// Delete order
orderRouter.post('/delete', adminAuth, deleteOrder);
export default orderRouter





