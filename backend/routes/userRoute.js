import express from 'express';
import { loginUser, registerUser, adminLogin, checkGoogleAccount, listUser, removeUser } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/check-google-account', checkGoogleAccount)
userRouter.get('/listuser', listUser)
userRouter.post('/removeuser', adminAuth, removeUser);


export default userRouter;