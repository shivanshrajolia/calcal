import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    sex: {
        type: String,
        required: false,
        enum: ['male', 'female', 'other']
    },
    height: {
        type: Number,
        required: false
    },
    weight: {
        type: Number,
        required: false
    },
    activityLevel: {
        type: String,
        required: false,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very active']
    },
    image: {
        type: String
    },
    calorieTarget: {
        type: Number,
        default: 0,
        required: false
    },
    proteinTarget: {
        type: Number,
        required: false
    },
    carbsTarget: {
        type: Number,
        required: false
    },
    fatsTarget: {
        type: Number,
        required: false
    },
    fiberTarget: {
        type: Number,
        required: false
    },
    weightTarget:{
        type: Number,
        required: false
    },
    loseWtTarget:{
        type: Number,
        required: false,
        enum:['0.25kg/week', '0.5kg/week', '0.75kg/week', '1kg/week']
    },
    gainWtTarget:{
        type: Number,
        required: false,
        enum:['0.25kg/week', '0.5kg/week', '0.75kg/week', '1kg/week']
    },
    waterTarget: {
        type: Number,
        default: 10
    },
    sleepTarget: {
        type: Number,
        default: 7
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');

export default User;