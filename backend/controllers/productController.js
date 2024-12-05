import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {

    try {

        const { name, nameCode, description, price, sale, salePrice, category, subCategory, subCategorySex, sizes, totalStock, onStock, sold, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image5 && req.files.image5[0]
        const image6 = req.files.image6 && req.files.image6[0]

        const images = [image1, image2, image3, image4, image5, image6].filter((item) => item !== undefined)

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const existingProduct = await productModel.findOne({ nameCode });
        if (existingProduct) {
            return res.json({ 
                success: false, 
                message: 'Mã sản phẩm đã tồn tại!' 
            });
        }

        const productData = {
            name,
            nameCode,
            description,
            price: Number(price),
            sale: Number(sale),
            salePrice: Number(price) - (Number(price) * Number(sale) / 100),
            category,
            subCategory,
            subCategorySex,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            totalStock: Number(totalStock),
            sold: Number(sold) === 0,
            onStock: Number(totalStock) > 0,
            bestseller: bestseller === "true" ? true : false,
            date: Date.now(),
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({success: true, message: "Thêm sản phẩm thành công"})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

const listProduct = async (req, res) => {
    try {
        // Lấy danh sách sản phẩm
        const products = await productModel.find({});

        // Kiểm tra và cập nhật các sản phẩm có totalStock = 0
        for (let product of products) {
            if (product.totalStock === 0) {
                // Cập nhật onStock = false nếu totalStock = 0
                await productModel.updateOne(
                    { _id: product._id }, 
                    { $set: { onStock: false } }
                );
            }
        }

        // Trả về danh sách sản phẩm sau khi cập nhật
        const updatedProducts = await productModel.find({});

        res.json({ success: true, products: updatedProducts });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// function for remove product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: 'Đã xóa sản phẩm'})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single product
const singleProduct = async (req, res) => {
    try {
        
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for update product
const updateProduct = async (req, res) => {
    try {
        const { productId, name, nameCode, description, price, sale, salePrice, category, subCategory, subCategorySex, sizes, totalStock, sold, bestseller } = req.body;

        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Sản phẩm không tồn tại" });
        }

        // Kiểm tra và cập nhật lại giá trị onStock nếu totalStock = 0
        const updatedOnStock = totalStock === 0 ? false : true;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];
        const image6 = req.files.image6 && req.files.image6[0];

        const images = [image1, image2, image3, image4, image5, image6].filter((item) => item !== undefined);

        let imageUrl = [];
        if (images.length > 0) {
            imageUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        // Cập nhật dữ liệu sản phẩm
        const updatedProductData = {
            name,
            nameCode,
            description,
            price: Number(price),
            sale: Number(sale),
            salePrice: Number(salePrice),
            category,
            subCategory,
            subCategorySex,
            sizes: JSON.parse(sizes),
            image: imageUrl.length > 0 ? imageUrl : product.image, // Giữ lại ảnh cũ nếu không có ảnh mới
            totalStock: Number(totalStock),
            sold: Number(sold),
            onStock: updatedOnStock,
            bestseller: bestseller === "true" ? true : false,
            date: Date.now(),
        };

        // Cập nhật sản phẩm trong cơ sở dữ liệu
        await productModel.findByIdAndUpdate(productId, updatedProductData);

        res.json({ success: true, message: "Cập nhật sản phẩm thành công" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id, name, nameCode, description, price, sale, salePrice, totalStock } = req.body;

        if (!id || !name || !nameCode || !description || isNaN(Number(price)) || isNaN(Number(sale)) || isNaN(Number(salePrice)) || isNaN(Number(totalStock))) {
            return res.json({
                success: false,
                message: "Các trường id, name, nameCode, description, price, sale, salePrice, totalStock là bắt buộc và phải hợp lệ."
            });
        }
        
        // Kiểm tra mã sản phẩm tồn tại nhưng không phải của sản phẩm hiện tại
        const existingProduct = await productModel.findOne({ nameCode, _id: { $ne: id } });
        if (existingProduct) {
            return res.json({ 
                success: false, 
                message: 'Mã sản phẩm đã tồn tại!' 
            });
        }

        // Tính toán giá trị của onStock dựa trên totalStock
        const onStock = Number(totalStock) > 0;

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { 
                name, 
                nameCode, 
                description, 
                price: Number(price), 
                sale: Number(sale), 
                salePrice: Number(salePrice), 
                totalStock: Number(totalStock),
                onStock // Gán giá trị onStock
            },
            { new: true } // Trả về giá trị đã cập nhật
        );

        if (!updatedProduct) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm để chỉnh sửa!" });
        }

        res.json({ success: true, message: "Cập nhật sản phẩm thành công!", product: updatedProduct });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        const { productId, userId, userName, rating, comment } = req.body;

        if (!productId || !userId || !userName || !rating || !comment) {
            return res.json({
                success: false,
                message: "Tất cả các trường là bắt buộc.",
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm." });
        }
        // Thêm đánh giá mới
        product.reviews.push({
            userId,
            userName,
            rating,
            comment,
            isReviewed: true,
        });

        await product.save();

        res.json({ success: true, message: "Đánh giá sản phẩm thành công!", reviews: product.reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProduct, addProduct, removeProduct, singleProduct, updateProduct, editProduct, addReview }