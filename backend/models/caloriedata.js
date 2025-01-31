import mongoose from 'mongoose';

const caloriedataSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    meal_type: {
        type: String,
        required: true,
        enum: ['Breakfast','Morning Snacks', 'Lunch', 'Evening Snacks', 'Dinner']
    },
    food_id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: ['g', 'serving']
    },
    calories: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Caloriedata = mongoose.model('Caloriedata', caloriedataSchema, 'caloriedata');

export default Caloriedata;