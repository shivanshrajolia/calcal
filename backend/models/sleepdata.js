import mongoose from "mongoose";

const sleepdataSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    sleep: {
        type: TimeRanges,
        required: true
    }
});

const Sleepdata = mongoose.model('Sleepdata', sleepdataSchema, 'sleepdata');

export default Sleepdata;