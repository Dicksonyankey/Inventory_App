const mongoose = require('mongoose');


const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo:{
        type: String,
        required: true,
    },
    productSupplied:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ]
}, {timestamps: true});


module.exports = mongoose.model('Supplier', supplierSchema);