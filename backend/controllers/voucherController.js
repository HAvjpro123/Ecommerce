import voucherModel from "../models/voucherModel.js"

// function for add product
const addVoucher = async (req, res) => {
    try {
        const { name, discount, total, createdBy } = req.body;

        // Kiểm tra các giá trị bắt buộc
        if (!name || !createdBy || isNaN(Number(discount)) || isNaN(Number(total))) {
            return res.json({
                success: false,
                message: "Các trường name, createdBy, discount và total là bắt buộc và phải hợp lệ."
            });
        }

        const voucherData = {
            name,
            discount: Number(discount),
            total: Number(total),
            createdBy,
            date: Date.now(),
        };

        const voucher = new voucherModel(voucherData);
        await voucher.save();

        res.json({ success: true, message: "Thêm mã giảm giá thành công" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for list blog
const listVoucher = async (req, res) => {
    try {

        const vouchers = await voucherModel.find({});
        res.json({ success: true, vouchers })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for remove blog
const removeVoucher = async (req, res) => {
    try {

        await voucherModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Đã xóa mã giảm giá' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single blog
const singleVoucher = async (req, res) => {
    try {

        const { voucherId } = req.body
        const voucher = await voucherModel.findById(voucherId)
        res.json({ success: true, voucher })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const updateVoucherTotal = async (req, res) => {
    try {
        const { id } = req.body;

        // Tìm và giảm số lượng mã giảm giá
        const voucher = await voucherModel.findById(id);
        if (!voucher) {
            return res.json({ success: false, message: 'Không tìm thấy mã giảm giá!' });
        }

        if (voucher.total <= 0) {
            return res.json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng!' });
        }

        voucher.total -= 1;
        await voucher.save();

        res.json({ success: true, message: 'Cập nhật số lượng mã giảm giá thành công!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const editVoucher = async (req, res) => {
    try {
        const { id, name, discount, total } = req.body;

        if (!id || !name || isNaN(Number(discount)) || isNaN(Number(total))) {
            return res.json({
                success: false,
                message: "Các trường id, name, discount và total là bắt buộc và phải hợp lệ."
            });
        }

        const updatedVoucher = await voucherModel.findByIdAndUpdate(
            id,
            { name, discount: Number(discount), total: Number(total) },
            { new: true } // Trả về giá trị đã cập nhật
        );

        if (!updatedVoucher) {
            return res.json({ success: false, message: "Không tìm thấy mã giảm giá để chỉnh sửa!" });
        }

        res.json({ success: true, message: "Cập nhật mã giảm giá thành công!", voucher: updatedVoucher });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export { updateVoucherTotal, listVoucher, addVoucher, removeVoucher, singleVoucher, editVoucher };