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
    const {
      name,
      price,
      sku,
      description,
      categories,
      thumbnail,
      images,
      options,
    } = req.body;

    console.log("Raw categories:", categories);

    // Flatten categories and validate them
    const flattenedCategories = Array.isArray(categories)
      ? categories.flat()
      : [categories];
    const validCategories = flattenedCategories.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!validCategories.length) {
      return res
        .status(400)
        .json({ message: "Invalid category IDs provided." });
    }

    // Parse options
    let parsedOptions = [];
    if (options) {
      try {
        parsedOptions = JSON.parse(options);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid JSON format for options." });
      }
    }

    // Create product
    const slug = slugify(name, { lower: true });
    const product = new Product({
      name,
      slug,
      price,
      sku,
      description,
      categories: validCategories,
      thumbnail,
      images,
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
    const { name, price, sku, description, categories, images, options } =
      req.body;

    // Validate categories if provided
    if (
      categories &&
      (!Array.isArray(categories) ||
        categories.some((cat) => !mongoose.Types.ObjectId.isValid(cat)))
    ) {
      return res.status(400).send("Invalid category ID(s)");
    }

    console.log("Id--->", id);

    // Check if the product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // Check if all provided categories exist
    if (categories) {
      const existingCategories = await Category.find({
        _id: { $in: categories },
      });
      if (existingCategories.length !== categories.length) {
        return res.status(404).send("One or more categories not found");
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
      id,
      {
        ...(name && { name }),
        ...(price && { price }),
        ...(sku && { sku }),
        ...(description && { description }),
        ...(categories && { categories }), // Update categories directly if provided
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
export const getProductsByCategorySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    // Find the category by slug
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Find products associated with the category
    const products = await Product.find({ categories: category._id });

    if (products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products by category slug:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getProductsBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    // Find the category by slug
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching products by slug:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  console.log("idddd", id);
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
