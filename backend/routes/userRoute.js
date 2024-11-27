import express from 'express';
import { loginUser, registerUser, adminLogin, checkGoogleAccount } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/check-google-account', checkGoogleAccount)

export default userRouter;