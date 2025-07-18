const express = require('express');
const Page = require('../models/Page');
const Store = require('../models/Store');
const auth = require('../middleware/auth');

const router = express.Router();

// Create page
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, storeId, showInNavigation } = req.body;

        // Check if user owns the store
        const store = await Store.findOne({
            _id: storeId,
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const page = new Page({
            title,
            content,
            store: storeId,
            showInNavigation
        });

        await page.save();
        res.status(201).json(page);
    } catch (error) {
        console.error('Page creation error:', error);
        res.status(500).json({ message: 'Error creating page' });
    }
});

// Get all pages for a store
router.get('/store/:storeId', async (req, res) => {
    try {
        const pages = await Page.find({
            store: req.params.storeId,
            isActive: true
        }).sort('order');
        res.json(pages);
    } catch (error) {
        console.error('Fetch pages error:', error);
        res.status(500).json({ message: 'Error fetching pages' });
    }
});

// Get single page by slug
router.get('/:storeId/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({
            store: req.params.storeId,
            slug: req.params.slug,
            isActive: true
        });

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        console.error('Fetch page error:', error);
        res.status(500).json({ message: 'Error fetching page' });
    }
});

// Update page
router.put('/:id', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        // Verify store ownership
        const store = await Store.findOne({
            _id: page.store,
            owner: req.user._id
        });

        if (!store) {
            return res.status(403).json({ message: 'Not authorized to update this page' });
        }

        const { title, content, showInNavigation, order } = req.body;
        
        page.title = title;
        page.content = content;
        page.showInNavigation = showInNavigation;
        if (order !== undefined) page.order = order;

        await page.save();
        res.json(page);
    } catch (error) {
        console.error('Update page error:', error);
        res.status(500).json({ message: 'Error updating page' });
    }
});

// Delete page
router.delete('/:id', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        // Verify store ownership
        const store = await Store.findOne({
            _id: page.store,
            owner: req.user._id
        });

        if (!store) {
            return res.status(403).json({ message: 'Not authorized to delete this page' });
        }

        page.isActive = false;
        await page.save();
        res.json({ message: 'Page deleted successfully' });
    } catch (error) {
        console.error('Delete page error:', error);
        res.status(500).json({ message: 'Error deleting page' });
    }
});

module.exports = router; 