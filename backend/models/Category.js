const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    icon: {
        type: String,
        required: true,
        default: 'CategoryIcon' // Default Material-UI icon name
    },
    iconColor: {
        type: String,
        default: '#FF6B00' // Default orange color
    },
    slug: {
        type: String,
        
    }
}, {
    timestamps: true
});

// Generate slug before saving
categorySchema.pre('save', function(next) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    next();
});

// Compound index for unique category names within a store
categorySchema.index({ store: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema); 