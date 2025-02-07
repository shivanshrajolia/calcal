import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Create a new user
export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(201).json({ token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, age, sex, height, weight, activityLevel, image } = req.body;

        user.name = name || user.name;
        user.age = age || user.age;
        user.sex = sex || user.sex;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        user.activityLevel = activityLevel || user.activityLevel;
        user.image = image || user.image;

        // Calculate and set calorie target
        const calorieTarget = calculateMaintenanceCalories(user);
        if (user.calorieTarget == 0) {
            user.calorieTarget = Math.round(calorieTarget);
            user.proteinTarget = Math.round((calorieTarget * 0.30) / 4);
            user.carbsTarget = Math.round((calorieTarget * 0.45) / 4);
            user.fatsTarget = Math.round((calorieTarget * 0.25) / 9);
            user.fiberTarget = Math.round((calorieTarget / 1000) * 14);
        }



        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Calculate maintenance calories
const calculateMaintenanceCalories = (user) => {
    if (user.height && user.weight && user.age && user.sex && user.activityLevel) {
        let bmr;
        if (user.sex === 'male') {
            bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
        } else if (user.sex === 'female') {
            bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
        } else {
            bmr = (88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age) +
                   447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age)) / 2;
        }

        const activityMultiplier = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            'very active': 1.9,
        };

        return bmr * activityMultiplier[user.activityLevel];
    }
    return null;
};