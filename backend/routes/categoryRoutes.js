import express from 'express';
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,getCategoryBySlug } from '../controllers/categoryController.js';

const router = express.Router();

// Create a new category
router.post('/creates', createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get a category by ID
router.get('/:id', getCategoryById);

// Update a category by ID
router.put('/:id', updateCategory);

router.get('/:slug', getCategoryBySlug);

// Delete a category by ID
router.delete('/:id', deleteCategory);

export default router;
