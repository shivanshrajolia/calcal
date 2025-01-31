import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Food = mongoose.model('Food', foodSchema, 'foods');

export default Food;