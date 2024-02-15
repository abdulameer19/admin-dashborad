import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
    // Add more fields as needed
});

export default mongoose.model('Product', productSchema);
