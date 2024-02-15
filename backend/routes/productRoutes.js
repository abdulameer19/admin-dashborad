import express from 'express';
import { createProduct, updateProduct, deleteProduct, getAllProducts } from '../controllers/productController.js';

const router = express.Router();

// Create a new product
router.post('/', createProduct);

// Update a product by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);
router.get('/', getAllProducts);

export default router;
