const Product = require("../models/product");
const mongoose = require("mongoose");
const {validateProductInput} = require("../utils/validator")

// POST /products: Create new products.
//
// GET /products: Get list of all products with pagination.
//
//     GET /products/:id: Get a single product by its ID.
//
//     PUT /products/:id: Update product details.
//
//     DELETE /products/:id: Delete a product.
//
//     POST /products/:id/stock: Update stock levels based on incoming or outgoing transactions.


const addNewProduct = async (req, res) => {
    try {

        const {productName, category, price, quantity, supplierId, expiryDate} = req.body;

        // validator the users input
        const errors = validateProductInput(req.body);
        if (errors) {
            return res.status(400).json({
                success: false,
                message: errors.join(", ")
            })
        }

        // Create the product

        const product = await Product({
            productName,
            category,
            price,
            quantity,
            supplierId,
            expiryDate
        })

        // save the product
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product Created Successfully',
            data: product
        })


    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: 'Something went wrong'
        })
    }
};
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;


        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const totalProduct = await Product.countDocuments();
        const totalPages = Math.ceil(totalProduct / limit);


        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const products = await Product.find().sort(sortObj).skip(skip).limit(limit);

        if (products.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Products Fetched Successfully',
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalProduct: totalProduct,
                },
                data: products,
            });
        }

        console.log("No products found");

    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Something went wrong while fetching products',
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        // Get the product id
        const currentProductId = req.params.id;

        // Check if currentProductId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(currentProductId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const {productName, category, price, quantity, supplierId, expiryDate} = req.body;

        // Get the id of the user that is trying to update the product
        const userId = req.userInfo.userID;

        // Find the product you want to update
        const product = await Product.findById(currentProductId);

        console.log(product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // check if the product was uploaded by the person trying to delete it
        if(product.supplierId.toString() !== userId){
            return res.status(404).json({
                success: false,
                message: "You are not authorized to delete this product"
            })
        }

        // Update only the fields that are provided by the user
        if (productName !== undefined) product.productName = productName;
        if (category !== undefined) product.category = category;
        if (price !== undefined) product.price = price;
        if (quantity !== undefined) product.quantity = quantity;
        if (supplierId !== undefined) product.supplierId = supplierId;
        if (expiryDate !== undefined) product.expiryDate = expiryDate;

        // Save the updated product
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: "Something went wrong while updating the products",
        });
    }
};

const deleteProduct = async (req, res) => {
    try{
        const currentProductId = req.params.id;

        // Check if currentProductId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(currentProductId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const userId = req.userInfo.userID;

        const product = await Product.findById(currentProductId);

        // Check if the product you're trying to delete exists
        if(!product){
            return res.status(400).json({
                success: false ,
                message: "Product you are trying to delete can not be found"
            });
        }

        // check if the product was uploaded by the person trying to delete it
        if(product.supplierId.toString() !== userId){
            return res.status(404).json({
                success: false,
                message: "You are not authorizated to delete this product"
            })
        }

        // Find the product with the id and delete it
        await Product.findByIdAndDelete(currentProductId);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })

    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            message: "Something went wrong while deleting products",
        });
    }
};

const addProductToStock = async (req, res) => {
    try {
        const { id } = req.params;  // Get the product ID from the URL
        const { quantity, type } = req.body;  // Get the quantity and type of stock change (incoming or outgoing)

        // Validate the type (either "incoming" or "outgoing")
        if (type !== 'incoming' && type !== 'outgoing') {
            return res.status(400).json({
                success: false,
                message: 'Invalid stock type. Use "incoming" or "outgoing".',
            });
        }

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Validate quantity (must be a positive number)
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a positive number.',
            });
        }

        // Update the stock based on the type (incoming or outgoing)
        if (type === 'incoming') {
            product.quantity += quantity;  // Increase stock
        } else if (type === 'outgoing') {
            if (product.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Not enough stock available for the outgoing transaction.',
                });
            }
            product.quantity -= quantity;  // Decrease stock
        }

        // Save the updated product
        await product.save();

        res.status(200).json({
            success: true,
            message: `Product stock updated successfully. New stock: ${product.quantity}`,
            data: product,
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            message: "Something went wrong while deleting products",
        });
    }
};


module.exports = {
    addNewProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addProductToStock,
}
