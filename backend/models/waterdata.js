import mongoose from "mongoose";

const waterdataSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    water: {
        type: Number,
        required: true
    }
});

const Waterdata = mongoose.model('Waterdata', waterdataSchema, 'waterdata');

export default Waterdata;