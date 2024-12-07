import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import { OAuth2Client } from 'google-auth-library';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Route: Đăng nhập người dùng
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token, message: 'Đăng nhập thành công', user: { id: user._id, name: user.name } });
        } else {
            res.json({ success: false, message: 'Thông tin xác thực không hợp lệ' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route: Đăng ký người dùng
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'Email đã tồn tại.' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Vui lòng nhập đúng định dạng mail.' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Vui lòng đổi mật khẩu có độ phức tạp cao hơn.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            date: Date.now(),
            level: 'Đồng',
            amountPurchased: 0,
            itemPurchased: 0,
        });

        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({ success: true, token, message: 'Đăng ký thành công' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route: Đăng nhập admin
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Thông tin không hợp lệ" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route: Kiểm tra tài khoản Google
const checkGoogleAccount = async (req, res) => {
    try {
        const { googleToken } = req.body;

        // Xác thực Google Token
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const { email, name } = payload;

        let user = await userModel.findOne({ email });

        if (user) {
            return res.json({ exists: true, email: user.email, name: user.name, id: user._id });
        }

        // Nếu chưa tồn tại, trả về thông tin để tạo tài khoản
        res.json({ exists: false, email, name });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Google Token không hợp lệ' });
    }
};

const listUser = async (req, res) => {
    try {

        const users = await userModel.find({});
        res.json({ success: true, users })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const removeUser = async (req, res) => {
    try {

        await userModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Đã xóa người dùng' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const updateUserLevel = async (userId, amountPurchased) => {
    try {
        let newLevel = 'Đồng';

        if (amountPurchased > 20000000) {
            newLevel = 'Kim cương';
        } else if (amountPurchased > 15000000) {
            newLevel = 'Bạch kim';
        } else if (amountPurchased > 10000000) {
            newLevel = 'Vàng';
        } else if (amountPurchased > 5000000) {
            newLevel = 'Bạc';
        }

        await userModel.findByIdAndUpdate(userId, { level: newLevel });
    } catch (error) {
        console.error('Error updating user level:', error);
    }
};



export { loginUser, registerUser, adminLogin, checkGoogleAccount, listUser, removeUser};
