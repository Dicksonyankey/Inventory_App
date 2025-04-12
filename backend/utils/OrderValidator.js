// validators/orderValidator.js
const { body, validationResult } = require('express-validator');

const validateOrder = [
    // Validate productId is required and is a valid ObjectId
    body('productId').isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),

    // Validate quantity is required and is a positive integer
    body('quantity')
        .isInt({ gt: 0 })
        .withMessage('Quantity must be a positive integer'),

    // Validate userId is required and is a valid MongoDB ObjectId
    body('userId').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),

    // Validate status is required and is one of the valid options
    body('status')
        .isIn(['pending', 'shipped', 'completed', 'cancelled'])
        .withMessage('Status must be one of the following: pending, shipped, completed, cancelled'),

    // Handle validation results and send errors if there are any
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    },
];

module.exports = { validateOrder };
