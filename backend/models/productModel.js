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
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    images: [{
        type: String,
        required: true,
    }],
    // Add more fields as needed
});

export default mongoose.model('Product', productSchema);
