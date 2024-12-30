import Category from '../models/categoryModel.js';
import slugify from 'slugify';
// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, description, parentCategories } = req.body;
        
        let parentCategoryIds = [];

        // Generate slug from the category name
        const slug = slugify(name, { lower: true, strict: true }); // Converts to lowercase and removes special characters

        // Check if parentCategories is provided and not empty
        if (parentCategories && parentCategories.length > 0) {
            parentCategoryIds = await Promise.all(
                parentCategories.map(async (cat) => {
                    if (cat === 'Uncategorized') {
                        // Handle 'Uncategorized' (you can look it up by name or set as null/empty)
                        const uncategorizedCategory = await Category.findOne({ name: 'Uncategorized' });
                        return uncategorizedCategory ? uncategorizedCategory._id : null;
                    }
                    return cat;  // This should be an ObjectId string
                })
            );

            // Filter out any null values
            parentCategoryIds = parentCategoryIds.filter((catId) => catId !== null);
        }

        // Prevent a category from being its own parent
        if (parentCategoryIds.includes(req.params.id)) {
            return res.status(400).send({ message: 'Category cannot be its own parent.' });
        }

        // Create a new category without parentCategories if not selected
        const category = new Category({
            name,
            description,
            slug,  // Include the generated slug in the category model
            parentCategories: parentCategoryIds.length > 0 ? parentCategoryIds : [],  // Optional: empty array if none selected
        });

        await category.save();

        // If there are parent categories, update their subcategories array
        if (parentCategoryIds.length > 0) {
            await Category.updateMany(
                { _id: { $in: parentCategoryIds } },
                { $push: { subcategories: category._id } }
            );
        }

        res.status(201).send(category);
    } catch (err) {
        res.status(400).send({ message: 'Error creating category', error: err });
    }
};


// Get all categories (with parent and subcategory relationships populated)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategories', 'name slug') // Populate parent category details
      .populate('subcategories', 'name slug')   // Populate subcategory details
      .lean();

    // Map categories by ID for easy lookup
    const categoryMap = categories.reduce((acc, category) => {
      acc[category._id] = { ...category, children: [] }; // Add a `children` array for hierarchy
      return acc;
    }, {});

    const rootCategories = [];

    // Organize categories into a hierarchy
    categories.forEach((category) => {
      if (category.parentCategories.length === 0) {
        // No parent means this is a root category
        rootCategories.push(categoryMap[category._id]);
      } else {
        // Add this category to its parent's `children` array
        category.parentCategories.forEach((parentId) => {
          if (categoryMap[parentId]) {
            categoryMap[parentId].children.push(categoryMap[category._id]);
          }
        });
      }
    });

    res.status(200).json(rootCategories); // Return hierarchical categories
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
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
        const { name, description,slug, parentCategories } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Update the category fields
        category.name = name || category.name;
        category.description = description || category.description;
        category.slug = slug || category.slug;

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

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Query the Category model by `slug`
    const category = await Category.findOne({ slug })
      .populate('parentCategories', 'name') // Populate parent categories
      .populate('subcategories', 'name');   // Populate subcategories

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error("Error fetching category by slug:", err);
    res.status(500).json({ message: 'Internal server error' });
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
