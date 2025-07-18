const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: ''
        },
        isMain: {
            type: Boolean,
            default: false
        },
        sizes: [{
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
        }]
    }],
    colors: [{
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    stripeProductId: {
        type: String
    },
    stripePriceId: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 