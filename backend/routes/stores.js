const express = require('express');
const Store = require('../models/Store');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a store
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, logo } = req.body;

        // Check for existing store with the same name
        const existingStore = await Store.findOne({ name: name.trim() });
        if (existingStore) {
            return res.status(400).json({ message: 'Store name must be unique.' });
        }

        const store = new Store({
            name,
            description,
            logo,
            owner: req.user._id,
        });

        await store.save();

        // Add store to user's stores array
        req.user.stores.push(store._id);
        await req.user.save();

        res.status(201).json(store);
    } catch (error) {
        console.error('Store creation error:', error);
        res.status(500).json({ message: 'Error creating store' });
    }
});

// Get all stores for current user
router.get('/my-stores', auth, async (req, res) => {
    try {
        const stores = await Store.find({ owner: req.user._id });
        res.json(stores);
    } catch (error) {
        console.error('Fetch stores error:', error);
        res.status(500).json({ message: 'Error fetching stores' });
    }
});

// Get store by ID (for admin panel)
router.get('/id/:id', auth, async (req, res) => {
    try {
        const store = await Store.findOne({
            _id: req.params.id,
            owner: req.user._id
        }).populate('products');
        
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.json(store);
    } catch (error) {
        console.error('Fetch store by ID error:', error);
        res.status(500).json({ message: 'Error fetching store' });
    }
});

// Get store by slug (public access)
router.get('/slug/:slug', async (req, res) => {
    try {
        const store = await Store.findOne({ 
            slug: req.params.slug,
            isActive: true 
        }).populate('products');
        
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.json(store);
    } catch (error) {
        console.error('Fetch store by slug error:', error);
        res.status(500).json({ message: 'Error fetching store' });
    }
});

// Update store
router.put('/:id', auth, async (req, res) => {
    try {
        const store = await Store.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            store[key] = updates[key];
        });

        await store.save();
        res.json(store);
    } catch (error) {
        console.error('Update store error:', error);
        res.status(500).json({ message: 'Error updating store' });
    }
});

// Delete store
router.delete('/:id', auth, async (req, res) => {
    try {
        const store = await Store.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Remove store from user's stores array
        req.user.stores = req.user.stores.filter(
            storeId => storeId.toString() !== req.params.id
        );
        await req.user.save();

        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        console.error('Delete store error:', error);
        res.status(500).json({ message: 'Error deleting store' });
    }
});

module.exports = router; 