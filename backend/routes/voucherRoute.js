import express from 'express';
import {listVoucher, addVoucher, removeVoucher, singleVoucher, updateVoucherTotal, editVoucher} from '../controllers/voucherController.js';
import adminAuth from '../middleware/adminAuth.js';

const voucherRouter = express.Router();

voucherRouter.post('/addvoucher', adminAuth, addVoucher);
voucherRouter.post('/removevoucher', adminAuth, removeVoucher);
voucherRouter.get('/listvoucher', listVoucher);
voucherRouter.post('/singlevoucher', singleVoucher);  // Check single voucher
voucherRouter.post('/update-total', updateVoucherTotal);
voucherRouter.post('/editvoucher', adminAuth, editVoucher);


export default voucherRouter