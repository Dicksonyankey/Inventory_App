const Product = require("../models/product");
const { validateProductInput } = require("../utils/validator")

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
    try{

        const {productName, category, quantity, supplierId, expiryDate } = req.body;

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


    } catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            message: 'Something went wrong'
        })
    }
};
const getAllProducts = async (req, res) => {
    try{
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

        if(products.length > 0){
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

    } catch(err){
        res.status(400).json({
            success: false,
            message: 'Something went wrong while fetching products',
        })
    }
}

const updateProduct = async (req, res) => {

};

const deleteProduct = async (req, res) => {

};

const addProductToStock = async (req, res) => {

};


module.exports = {
    addNewProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addProductToStock,
}
