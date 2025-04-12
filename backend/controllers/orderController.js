const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require("mongoose");


// Function to generate a random order number
const generateRandomOrderNumber = async () => {
    let orderNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999

    // Check if the order number already exists in the database
    const existingOrder = await Order.findOne({ orderNumber });

    // If the order number already exists, generate a new one
    if (existingOrder) {
        return generateRandomOrderNumber(); // Recursive call until a unique number is found
    }

    return orderNumber;
};


const placeOder = async (req, res) => {
    try{
        const { productId, userId, quantity, type, orderNumber} = req.body;

        // Check if currentProductId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        // Find the product by ID
        const product = await Product.findById(productId);

        // Check if the product you are ordering exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Calculate the new stock based on the type
        if (type === 'outgoing') {
            if (product.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available",
                });
            }
            // Decrease the stock for outgoing orders
            product.quantity -= quantity;
        }

        // Save the updated product
        await product.save();

        // Create a new order
        const newOrder = new Order({
            orderNumber: Math.floor(1000 + Math.random() * 9000),
            productId,
            quantity,
            userId,
            status: 'Pending',
            totalPrice: product.price * quantity,
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully and stock updated",
            data: newOrder,
        });

    } catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            status: 'error',
            message: "Something went wrong while placing your order",
        })
    }
}

const getOrderById = async (req, res) => {}

const getOrdersByStatus = async (req, res) => {}


module.exports = {
    placeOder,
    getOrderById,
    getOrdersByStatus,
}