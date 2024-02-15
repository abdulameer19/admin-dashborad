import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

export const createProduct = async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.body.category });
        if (!category) {
            return res.status(404).send('Category not found');
        }
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: category._id
        });
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.body.category });
        if (!category) {
            return res.status(404).send('Category not found');
        }
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: category._id
        }, { new: true });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.send(product);
    } catch (err) {
        res.status(400).send(err);
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

