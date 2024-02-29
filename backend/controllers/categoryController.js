import Category from '../models/categoryModel.js';

export const createCategory = async (req, res) => {
    try {

        console.log("object")
        const product = new Category({
            name: req.body.name,

            description: req.body.description,
        });
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
};



export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send({ message: 'Failed to fetch categories' });
    }
};


export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.send(category);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.send(category);
    } catch (err) {
        res.status(400).send(err);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.send(category);
    } catch (err) {
        res.status(500).send(err);
    }
};
