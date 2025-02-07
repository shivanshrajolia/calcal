import Weightdata from '../models/weightdata.js';

// Add weight
export const addWeight = async (req, res) => {
    try {
        const { date, user_id, weight } = req.body;

        const weightData = new Weightdata({
            date,
            user_id,
            weight
        });

        await weightData.save();
        res.status(201).json(weightData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// List weight
export const listWeight = async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const weightData = await Weightdata.find({ user_id });

        res.status(200).json(weightData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update weight
export const updateWeight = async (req, res) => {
    try {
        const weightData = await Weightdata.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!weightData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(weightData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete weight
export const deleteWeight = async (req, res) => {
    try {
        const { id } = req.params;

        const weightData = await Weightdata.findByIdAndDelete(id);
        if (!weightData) {
            return res.status(404).json({ message: 'Weight data not found' });
        }
        res.status(200).json({ message: 'Weight data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
