import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';
import multer from 'multer';

import slugify from 'slugify';


const storage = multer.memoryStorage(); // Use memoryStorage for simplicity, or you can set diskStorage
const upload = multer({ storage });

// Use multer as middleware for the specific route that handles file uploads
export const createProduct = async (req, res) => {
    try {
      // Extract fields and files from the request body
      const { name, price, salePrice, sku, description, category } = req.body;
      const images = req.files || []; // Default to an empty array if no files are uploaded
  
      console.log("Name:", name);
      console.log("Uploaded images:", images);
  
      // Convert the product name to a slug
      const slug = slugify(name, { lower: true });
  
      // Create the product with form data and uploaded images
      const product = new Product({
        name,
        slug,
        price,
        salePrice,
        sku,
        description,
        categories: [category], // Assuming category is a single value
        images: images.map(file => file.originalname), // Handling file saving logic
      });
  
      await product.save();
  
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal server error' });
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

