import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
      slug: {
        type: String,
        required: true,
    },
    parentCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Reference to multiple parent categories
        }
    ],
    subcategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Reference to subcategories
        }
    ]
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
