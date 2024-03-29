import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        // Check if the category ID is provided and valid (optional)
        if (!category) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        // Check if the category ID exists in the database (optional)
        // const existingCategory = await Category.findById(category);
        // if (!existingCategory) {
        //     return res.status(404).json({ message: 'Category not found' });
        // }

        // Create a new product instance
        const product = new Product({
            name,
            price,
            description,
            category
        });

        // Save the product to the database
        await product.save();

        // Return a success message and the created product data
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        // Handle any errors that occur during product creation
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

