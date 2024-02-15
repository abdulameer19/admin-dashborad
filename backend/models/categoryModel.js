import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String
    // Add more fields as needed
});

export default mongoose.model('Category', categorySchema);
