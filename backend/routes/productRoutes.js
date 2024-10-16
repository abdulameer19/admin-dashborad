import express from 'express';
import multer from 'multer'
import { createProduct, updateProduct, deleteProduct, getAllProducts } from '../controllers/productController.js';

const router = express.Router();
const storage = multer.memoryStorage(); // Store in memory, or you can specify diskStorage if saving to disk
const upload = multer({ storage: storage }).array('images', 10); // Limit to 10 images, adjust as needed
// Create a new product
router.post('/create',upload, createProduct);

// Update a product by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);
router.get('/', getAllProducts);

export default router;
