import Food from '../models/food.js';

// Create a new food item
export const createFood = async (req, res) => {
    try {
        const { name, calories, protein, carbs, fats, fiber, weight, image } = req.body;

        const food = new Food({
            name,
            calories,
            protein,
            carbs,
            fats,
            fiber,
            weight,
            image
        });

        await food.save();
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all food items
export const getFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a food item by ID
export const getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a food item by ID
export const updateFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a food item by ID
export const deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json({ message: 'Food deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};