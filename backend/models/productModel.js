import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
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
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,  // Sale price field, can be optional if no sale is active
        default: null, // Default to null if there is no sale price
    },
    sku: {
        type: String,  // SKU field to track stock keeping unit
        required: true,
        unique: true,  // SKU should be unique for each product
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds (references to Category model)
        ref: 'Category',
        required: true,  // Ensures at least one category is provided
      },
    images: [{
        type: String,
        required: true,
    }],
    // Add more fields as needed
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt timestamps
});

export default mongoose.model('Product', productSchema);
