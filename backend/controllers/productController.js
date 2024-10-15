import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';
import slugify from 'slugify';


export const createProduct = async (req, res) => {
    try {
        const { name, price, salePrice, sku, description, categories, images } = req.body;
        console.log("Name kia hai",name)

      
        // Convert the product name to a slug for URL-friendly names
        const slug = slugify(name, { lower: true });

        // Check if a product with the same slug already exists to avoid duplicates
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: 'A product with this name already exists' });
        }

        // Create a new product instance with multiple categories and images
        const product = new Product({
            name,
            slug, // Save the slug
            price,
            salePrice,
            sku,
            description,
            categories, // Array of category IDs
            images, // Array of image URLs or image paths
        });

        // Save the product to the database
        await product.save();

        // Return a success message and the created product data
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        // Handle any errors that occur during product creation
        console.error('Product creation failed:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        console.log("object")
        const { name, price, description, category } = req.body;

        // Validate category ID format
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).send('Invalid category ID');
        }

        // Check if category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).send('Category not found');
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {
            name,
            price,
            description,
            category
        }, { new: true });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.send(product);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.send(product);
    } catch (err) {
        res.status(500).send(err);
    }
};
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        res.status(500).send(err);
    }
};

