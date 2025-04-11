const Product = require("../models/product");
const { validateProductInput } = require("../utils/validator");

// POST /products: Create new products.
//
// GET /products: Get list of all products with pagination.
//     GET /products/:id: Get a single product by its ID.
//     PUT /products/:id: Update product details.
//     DELETE /products/:id: Delete a product.
//     POST /products/:id/stock: Update stock levels based on incoming or outgoing transactions.

const addNewProduct = async (req, res) => {
  try {
    const { productName, category, quantity, supplierId, expiryDate } =
      req.body;

    // validator the users input
    const errors = validateProductInput(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    // Create the product

    const product = await Product({
      productName,
      category,
      quantity,
      supplierId,
      expiryDate,
    });

    // save the product
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
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
        message: "Products Fetched Successfully",
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
      message: "Something went wrong while fetching products",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Get the product id
    const { id } = req.params;
    const { productName, category, quantity, supplierId, expiryDate } =
      req.body;

    // Get the id of the user that is trying to update the product

    const userId = req.userInfo.userID;

    // Find the product you want to update
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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
    const {id} = req.params;

    const userId = req.userInfo.userID;

    const product = await Product.findByIdAndDelete(id);

    // Check if the product you trying to delete exists
    if(!product){
      return res.status(400).json({
        success: false ,
        message: "Product you are trying to delete can not found"
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
    await Product.findByIdAndDelete(id);

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
  
};

module.exports = {
  addNewProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProductToStock,
};
