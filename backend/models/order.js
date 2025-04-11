const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
        unique: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    salePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    orderDate:{
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipping', 'Delivered', 'Canceled'],

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);