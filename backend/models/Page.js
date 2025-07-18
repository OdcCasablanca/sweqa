const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    showInNavigation: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create URL-friendly slug from page title
pageSchema.pre('save', function(next) {
    if (!this.isModified('title')) {
        return next();
    }
    
    this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
    
    next();
});

module.exports = mongoose.model('Page', pageSchema); 