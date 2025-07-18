const express = require('express');
const Banner = require('../models/Banner');
const Store = require('../models/Store');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// Create banner
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, storeId } = req.body;

        // Validate required fields
        if (!title || !storeId) {
            return res.status(400).json({ message: 'Title and store ID are required' });
        }

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Check if user owns the store
        const store = await Store.findOne({
            _id: storeId,
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const banner = new Banner({
            title,
            image: {
                url: req.file.path || req.file.secure_url,
                public_id: req.file.filename || req.file.public_id
            },
            store: storeId
        });

        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        console.error('Banner creation error:', error);
        res.status(500).json({ message: 'Error creating banner' });
    }
});

// Get banners for a store
router.get('/store/:storeId', async (req, res) => {
    try {
        const banners = await Banner.find({ store: req.params.storeId })
            .sort('order');
        res.json(banners);
    } catch (error) {
        console.error('Get banners error:', error);
        res.status(500).json({ message: 'Error fetching banners' });
    }
});

// Update banner
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Verify store ownership
        const store = await Store.findOne({
            _id: banner.store,
            owner: req.user._id
        });

        if (!store) {
            return res.status(403).json({ message: 'Not authorized to update this banner' });
        }

        const { title, order } = req.body;
        
        if (title) {
            banner.title = title;
        }
        
        if (order !== undefined) {
            banner.order = order;
        }

        if (req.file) {
            banner.image = {
                url: req.file.path || req.file.secure_url,
                public_id: req.file.filename || req.file.public_id
            };
        }

        await banner.save();
        res.json(banner);
    } catch (error) {
        console.error('Update banner error:', error);
        res.status(500).json({ message: 'Error updating banner' });
    }
});

// Delete banner
router.delete('/:id', auth, async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Verify store ownership
        const store = await Store.findOne({
            _id: banner.store,
            owner: req.user._id
        });

        if (!store) {
            return res.status(403).json({ message: 'Not authorized to delete this banner' });
        }

        await banner.deleteOne();
        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('Delete banner error:', error);
        res.status(500).json({ message: 'Error deleting banner' });
    }
});

module.exports = router; 