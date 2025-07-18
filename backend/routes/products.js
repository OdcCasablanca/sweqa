const express = require('express');
const Product = require('../models/Product');
const Store = require('../models/Store');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const path = require('path');
const mongoose = require('mongoose');

const router = express.Router();

// Initialize the Cloud Vision client
const client = new vision.ImageAnnotatorClient({
    keyFilename: path.join(__dirname, '..', 'vision-api-key.json')
});

// Create a product with images
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, category, stock, storeId } = req.body;

        // Validate stock is a valid number
        const stockNumber = Number(stock);
        if (isNaN(stockNumber) || stockNumber < 0) {
            return res.status(400).json({ message: 'Stock must be a valid non-negative number.' });
        }

        // Validate category is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'Invalid category ID.' });
        }
        const categoryExists = await require('../models/Category').findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Selected category does not exist.' });
        }
        const categoryId = new mongoose.Types.ObjectId(category);

        // Check if user owns the store
        const store = await Store.findOne({
            _id: storeId,
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Process uploaded images and their metadata
        const images = req.files.map((file, index) => {
            const metadata = req.body[`imageMetadata${index}`]
                ? JSON.parse(req.body[`imageMetadata${index}`])
                : { color: '', sizes: [], isMain: false };
            return {
                url: file.path,
                public_id: file.filename || file.public_id, // Cloudinary returns public_id
                color: metadata.color || '',
                sizes: metadata.sizes || [],
                isMain: metadata.isMain || false
            };
        });

        const product = new Product({
            name,
            description,
            price: Number(price),
            category: categoryId,
            stock: stockNumber,
            store: store._id,
            images
        });

        await product.save();

        // Add product to store's products array
        store.products.push(product._id);
        await store.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// Get all products for a store
router.get('/store/:storeId', async (req, res) => {
    try {
        const products = await Product.find({
            store: req.params.storeId,
            isActive: true
        }).populate('category');
        res.json(products);
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        }).populate('category');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Fetch product error:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Update product
router.put('/:id', auth, upload.array('images'), async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            colors,
            sizes,
            existingImages
        } = req.body;

        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify store ownership
        const store = await Store.findOne({
            _id: product.store,
            owner: req.user._id
        });

        if (!store) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        // Update basic fields
        product.name = name;
        product.description = description;
        product.price = Number(price);
        product.category = category;
        product.stock = Number(stock);
        product.colors = JSON.parse(colors || '[]');
        product.sizes = JSON.parse(sizes || '[]');

        // Handle images
        let updatedImages = [];

        // Add existing images that are kept
        if (existingImages) {
            updatedImages = JSON.parse(existingImages).map(img => ({
                url: img.url,
                public_id: img.public_id,
                color: img.color,
                isMain: img.isMain,
                sizes: img.sizes || []
            }));
        }

        // Add newly uploaded images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => {
                const metadata = req.body[`imageMetadata${index}`] 
                    ? JSON.parse(req.body[`imageMetadata${index}`])
                    : { color: '', isMain: false, sizes: [] };

                return {
                    url: file.path,
                    public_id: file.filename,
                    color: metadata.color || '',
                    isMain: metadata.isMain || false,
                    sizes: metadata.sizes || []
                };
            });

            updatedImages = [...updatedImages, ...newImages];
        }

        // Ensure at least one image is marked as main
        if (!updatedImages.some(img => img.isMain)) {
            updatedImages[0].isMain = true;
        }

        product.images = updatedImages;

        await product.save();
        
        const updatedProduct = await Product.findById(product._id).populate('category');
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete product (soft delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify store ownership
        const store = await Store.findOne({
            _id: product.store,
            owner: req.user._id
        });

        if (!store) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        // Soft delete by setting isActive to false
        product.isActive = false;
        await product.save();

        // Remove product from store's products array
        store.products = store.products.filter(id => id.toString() !== product._id.toString());
        await store.save();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Analyze image and suggest product details
router.post('/analyze-image', auth, async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'No image provided' });
        }

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(image, 'base64');

        // Perform multiple detection types
        const [
            labelDetection,
            objectDetection,
            webDetection
        ] = await Promise.all([
            client.labelDetection(imageBuffer),
            client.objectLocalization(imageBuffer),
            client.webDetection(imageBuffer)
        ]);

        // Process results to generate suggestions
        const labels = labelDetection[0].labelAnnotations || [];
        const objects = objectDetection[0].localizedObjectAnnotations || [];
        const webEntities = webDetection[0].webEntities || [];

        // Combine results to generate a product name and description
        const mainObject = objects[0]?.name || '';
        const relevantLabels = labels
            .filter(label => label.score > 0.8)
            .map(label => label.description);
        const relevantWebEntities = webEntities
            .filter(entity => entity.score > 0.8)
            .map(entity => entity.description);

        // Generate product name
        let productName = mainObject;
        if (relevantWebEntities[0] && relevantWebEntities[0] !== mainObject) {
            productName = relevantWebEntities[0];
        }

        // Capitalize first letter of each word
        productName = productName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        // Generate description
        const descriptionParts = [
            mainObject,
            ...relevantLabels.slice(0, 3),
            ...relevantWebEntities.slice(1, 3)
        ].filter(Boolean);

        const description = `${productName} featuring ${descriptionParts
            .filter(part => part.toLowerCase() !== productName.toLowerCase())
            .slice(0, 3)
            .join(', ')}.`;

        res.json({
            suggestions: {
                name: productName,
                description: description,
                confidence: objects[0]?.score || labels[0]?.score || 0
            }
        });
    } catch (error) {
        console.error('Error analyzing image:', error);
        res.status(500).json({ message: 'Error analyzing image' });
    }
});

module.exports = router; 