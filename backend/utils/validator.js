const validator = require('validator');  // Import validator library

// Validate if the provided string is a valid email format
const isValidEmail = (email) => {
    if (!email || !validator.isEmail(email)) {
        return "Invalid email format";
    }
    return null;
};

// Validate if the password is strong (min 8 characters, at least one number and one special character)
const isValidPassword = (password) => {
    if (!password || password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must be at least 8 characters long and contain at least one number and one special character";
    }
    return null;
};

// Validate if a product name is provided and is non-empty
const isValidProductName = (productName) => {
    if (!productName || productName.trim().length === 0) {
        return "Product name cannot be empty";
    }
    return null;
};

// Validate if price is a positive number
const isValidPrice = (price) => {
    if (isNaN(price) || price <= 0) {
        return "Price must be a positive number";
    }
    return null;
};

// Validate if the quantity is a positive integer
const isValidQuantity = (quantity) => {
    if (isNaN(quantity) || quantity < 0 || !Number.isInteger(Number(quantity))) {
        return "Quantity must be a non-negative integer";
    }
    return null;
};

// Validate if a date is in the correct format (YYYY-MM-DD)
const isValidDate = (date) => {
    if (!date || !validator.isDate(date)) {
        return "Invalid date format. Use YYYY-MM-DD";
    }
    return null;
};

// Validate if a category is provided (non-empty)
const isValidCategory = (category) => {
    if (!category || category.trim().length === 0) {
        return "Category cannot be empty";
    }
    return null;
};

// Validate if a given ID exists in the database (just a placeholder, assume you have a DB check)
const isValidId = (id) => {
    if (!id || id.length !== 24) {
        return "Invalid ID format";
    }
    return null;
};

// Utility function to validate all input fields for product creation
const validateProductInput = (product) => {
    const { productName, price, quantity, category, expiryDate } = product;

    // Check if all required fields are valid
    const errors = [];
    const productNameError = isValidProductName(productName);
    if (productNameError) errors.push(productNameError);

    const priceError = isValidPrice(price);
    if (priceError) errors.push(priceError);

    const quantityError = isValidQuantity(quantity);
    if (quantityError) errors.push(quantityError);

    const categoryError = isValidCategory(category);
    if (categoryError) errors.push(categoryError);

    const expiryDateError = isValidDate(expiryDate);
    if (expiryDateError) errors.push(expiryDateError);

    if (errors.length > 0) {
        return errors;
    }

    return null;
};

// Export the validation functions for use in routes/controllers
module.exports = {
    isValidEmail,
    isValidPassword,
    isValidProductName,
    isValidPrice,
    isValidQuantity,
    isValidDate,
    isValidCategory,
    isValidId,
    validateProductInput
};
