const express = require('express');
const {
    addNewProduct,
    getAllProducts,
    updateProduct,
    addProductToStock,
    deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


const router = express.Router();


// All routes related to the authentication and authorization

router.post('/create-product', authMiddleware, adminMiddleware, addNewProduct);
router.get('/fetch-products', authMiddleware,getAllProducts);
router.post('/update-product/:id', authMiddleware, adminMiddleware, updateProduct);
router.post('/delete-product/:id', authMiddleware, adminMiddleware, deleteProduct);
router.post('/stock-product', authMiddleware, adminMiddleware, addProductToStock);

module.exports = router;