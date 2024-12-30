import express from "express";
import multer from "multer";
import {
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  getProductsBySlug,
  getAllProducts,
  getProductsByCategorySlug
} from "../controllers/productController.js";

const router = express.Router();
const storage = multer.memoryStorage(); // Store in memory, or you can specify diskStorage if saving to disk
const upload = multer({ storage: storage }).array("images", 10); // Limit to 10 images, adjust as needed
// Create a new product
router.post("/create", upload, createProduct);

// Update a product by ID
router.put("/update/:id", upload, updateProduct);
router.get("/:id", getProductById);

router.get('/get-product/:slug', getProductsByCategorySlug);
router.get('/slug-product/:slug', getProductsBySlug);


// Delete a product by ID
router.delete("/:id", deleteProduct);

router.get("/", getAllProducts);

export default router;
