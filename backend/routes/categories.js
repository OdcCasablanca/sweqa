const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Create category
router.post('/', auth, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Category creation error:', error);
        res.status(500).json({ message: 'Error creating category' });
    }
});

// Get all categories for a specific store
router.get('/store/:storeId', async (req, res) => {
    try {
        const categories = await Category.find({ store: req.params.storeId })
            .sort('name');
        res.json(categories);
    } catch (error) {
        console.error('Fetch store categories error:', error);
        res.status(500).json({ message: 'Error fetching store categories' });
    }
});

// Get all categories (global)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('store', 'name')
            .sort('name');
        res.json(categories);
    } catch (error) {
        console.error('Fetch categories error:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// Get single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('store', 'name');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Fetch category error:', error);
        res.status(500).json({ message: 'Error fetching category' });
    }
});

// Update category
router.put('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Error updating category' });
    }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
});

module.exports = router; 