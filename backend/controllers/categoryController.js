import Category from '../models/categoryModel.js';

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, description, parentCategories } = req.body;

        // Create a new category
        const category = new Category({
            name,
            description,
            parentCategories,  // Array of parent categories (optional)
        });

        await category.save();

        // If there are parent categories, update their subcategories array
        if (parentCategories && parentCategories.length > 0) {
            await Category.updateMany(
                { _id: { $in: parentCategories } },
                { $push: { subcategories: category._id } }
            );
        }

        res.status(201).send(category);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all categories (with parent and subcategory relationships populated)
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('parentCategories', 'name') // Populate parent categories
            .populate('subcategories', 'name');   // Populate subcategories
        res.send(categories);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send({ message: 'Failed to fetch categories' });
    }
};

// Get a category by ID (with parent and subcategory relationships populated)
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parentCategories', 'name') // Populate parent categories
            .populate('subcategories', 'name');   // Populate subcategories

        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.send(category);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a category (including handling parent categories and subcategories)
export const updateCategory = async (req, res) => {
    try {
        const { name, description, parentCategories } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Update the category fields
        category.name = name || category.name;
        category.description = description || category.description;
        category.parentCategories = parentCategories || category.parentCategories;

        await category.save();

        // Update subcategory references in parent categories
        if (parentCategories && parentCategories.length > 0) {
            // Remove the category from old parent subcategories
            await Category.updateMany(
                { subcategories: category._id },
                { $pull: { subcategories: category._id } }
            );

            // Add the category to the new parent subcategories
            await Category.updateMany(
                { _id: { $in: parentCategories } },
                { $push: { subcategories: category._id } }
            );
        }

        res.send(category);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a category (and remove references from parent categories)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Remove the category from its parent categories' subcategories
        if (category.parentCategories && category.parentCategories.length > 0) {
            await Category.updateMany(
                { _id: { $in: category.parentCategories } },
                { $pull: { subcategories: category._id } }
            );
        }

        res.send(category);
    } catch (err) {
        res.status(500).send(err);
    }
};
