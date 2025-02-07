import mongoose from "mongoose";

const weightdataSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
});

const Weightdata = mongoose.model('Weightdata', weightdataSchema, 'weightdata');

export default Weightdata;