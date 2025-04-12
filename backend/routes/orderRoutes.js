const express = require('express');

const {placeOder, getOrderById, getOrdersByStatus} = require("../controllers/orderController")

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { validateOrder } = require('../utils/orderValidator');

const router = express.Router();

// All routes related to the Orders

router.post('/order-product',authMiddleware, placeOder);
router.get('/order/:id', authMiddleware, adminMiddleware, getOrderById);
router.get('/orders', authMiddleware, adminMiddleware, getOrdersByStatus);


module.exports = router;