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
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');

export default User;