import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Base price of the product
      required: true,
    },
    sku: {
      type: String, // SKU field to track stock keeping unit
      required: true,
      unique: true, // SKU should be unique for each product
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds (references to Category model)
      ref: "Category",
      required: true, // Ensures at least one category is provided
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    options: [
      {
        name: { type: String, required: true }, // Name of the option (e.g., "Polish", "Gift Wrap")
        isPaid: { type: Boolean, required: true }, // Indicates if the option is paid or free
        additionalCost: { type: Number, default: 0 }, // Cost if the option is paid
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Method to calculate total price based on selected options
productSchema.methods.calculateTotalPrice = function (selectedOptions = []) {
  let totalPrice = this.basePrice;
  selectedOptions.forEach((optionName) => {
    const selectedOption = this.options.find((opt) => opt.name === optionName);
    if (selectedOption && selectedOption.isPaid) {
      totalPrice += selectedOption.additionalCost;
    }
  });
  return totalPrice;
};

export default mongoose.model("Product", productSchema);
