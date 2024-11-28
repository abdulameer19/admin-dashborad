import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";
import multer from "multer";

import slugify from "slugify";

const storage = multer.memoryStorage(); // Use memoryStorage for simplicity, or you can set diskStorage
const upload = multer({ storage });

// Use multer as middleware for the specific route that handles file uploads
export const createProduct = async (req, res) => {
  try {
    // Extract fields and files from the request body
    const { name, price, sku, description, category, images, options } =
      req.body;

    console.log("Name:", name);
    console.log("Uploaded images:", images);

    if (!name || !price || !sku || !description || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert the product name to a slug
    const slug = slugify(name, { lower: true });

    // Parse options safely
    let parsedOptions = [];
    if (options) {
      try {
        parsedOptions = JSON.parse(options);
      } catch (parseError) {
        console.error("Error parsing options:", parseError);
        return res
          .status(400)
          .json({ message: "Invalid JSON format for options." });
      }
    }

    // Create the product
    const product = new Product({
      name,
      slug,
      price,
      sku,
      description,
      categories: [category],
      images: images, // Directly save the URLs array here
      options: parsedOptions,
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, sku, description, category, images, options } =
      req.body;

    // Validate category ID format
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).send("Invalid category ID");
    }

    // Check if category exists if provided
    if (id) {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).send("Product not found");
      }
    }
    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).send("Category not found");
      }
    }

    // Parse options if provided
    let parsedOptions = [];
    if (options) {
      try {
        parsedOptions = JSON.parse(options); // Assumes `options` is sent as a JSON string in the request body
      } catch (err) {
        return res.status(400).send("Invalid options format");
      }
    }

    // Handle images update
    let updatedImages = undefined; // undefined means images won't be updated
    if (images) {
      if (!Array.isArray(images)) {
        return res.status(400).send("Images must be an array");
      }
      updatedImages = images; // Replace images with the new array provided
    }

    // Find and update the product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(price && { price }),
        ...(description && { description }),
        ...(category && { categories: [category] }), // Update the category if provided
        ...(parsedOptions.length > 0 && { options: parsedOptions }), // Update options if provided
        ...(updatedImages && { images: updatedImages }), // Update images if provided
      },
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Internal server error");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.send(product);
  } catch (err) {
    res.status(500).send(err);
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "categories",
      select: "name", // Fetch only the category name
    });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product ID format" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching product", error: err });
  }
};
