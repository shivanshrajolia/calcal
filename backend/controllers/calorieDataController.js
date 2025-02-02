import Caloriedata from '../models/caloriedata.js';

// Add breakfast data
export const addBreakfast = async (req, res) => {
    try {
        const { date, user_id, food_id, quantity, unit, calories } = req.body;

        const calorieData = new Caloriedata({
            date,
            user_id,
            meal_type: 'Breakfast',
            food_id,
            quantity,
            unit,
            calories
        });

        await calorieData.save();
        res.status(201).json(calorieData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add morning snacks data
export const addMorningSnacks = async (req, res) => {
    try {
        const { date, user_id, food_id, quantity, unit, calories } = req.body;

        const calorieData = new Caloriedata({
            date,
            user_id,
            meal_type: 'Morning Snacks',
            food_id,
            quantity,
            unit,
            calories
        });

        await calorieData.save();
        res.status(201).json(calorieData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add lunch data
export const addLunch = async (req, res) => {
    try {
        const { date, user_id, food_id, quantity, unit, calories } = req.body;

        const calorieData = new Caloriedata({
            date,
            user_id,
            meal_type: 'Lunch',
            food_id,
            quantity,
            unit,
            calories
        });

        await calorieData.save();
        res.status(201).json(calorieData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add evening snacks data
export const addEveningSnacks = async (req, res) => {
    try {
        const { date, user_id, food_id, quantity, unit, calories } = req.body;

        const calorieData = new Caloriedata({
            date,
            user_id,
            meal_type: 'Evening Snacks',
            food_id,
            quantity,
            unit,
            calories
        });

        await calorieData.save();
        res.status(201).json(calorieData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add dinner data
export const addDinner = async (req, res) => {
    try {
        const { date, user_id, food_id, quantity, unit, calories } = req.body;

        const calorieData = new Caloriedata({
            date,
            user_id,
            meal_type: 'Dinner',
            food_id,
            quantity,
            unit,
            calories
        });

        await calorieData.save();
        res.status(201).json(calorieData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Remove calorie data
export const removeCalorieData = async (req, res) => {
    try {
        const { id } = req.params;

        const calorieData = await Caloriedata.findByIdAndDelete(id);
        if (!calorieData) {
            return res.status(404).json({ message: 'Calorie data not found' });
        }
        res.status(200).json({ message: 'Calorie data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get calorie data by user ID and date
export const getCalorieDataByUserAndDate = async (req, res) => {
    try {
        const { user_id, date } = req.query;
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const calorieData = await Caloriedata.find({
            user_id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        const groupedData = {
            breakfast: [],
            morningSnacks: [],
            lunch: [],
            eveningSnacks: [],
            dinner: []
        };

        calorieData.forEach(data => {
            groupedData[data.meal_type.toLowerCase().replace(' ', '')].push(data);
        });

        res.status(200).json(groupedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get sum of calories by user ID and date
export const getCalorieSumByUserAndDate = async (req, res) => {
    try {
        const { user_id, date } = req.query;
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const calorieData = await Caloriedata.aggregate([
            {
                $match: {
                    user_id,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCalories: { $sum: "$calories" }
                }
            }
        ]);

        const totalCalories = calorieData.length > 0 ? calorieData[0].totalCalories : 0;
        res.status(200).json({ totalCalories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

