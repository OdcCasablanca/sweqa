const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo: {
        type: String
    },
    theme: {
        primaryColor: {
            type: String,
            default: '#FF6B00'
        },
        secondaryColor: {
            type: String,
            default: '#000000'
        }
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    stripeAccountId: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create URL-friendly slug from store name
storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    
    // Convert store name to slug format
    this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphen
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
    
    next();
});

module.exports = mongoose.model('Store', storeSchema); 