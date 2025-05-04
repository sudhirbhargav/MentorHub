const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    },
    startTime: {
        type: String, // e.g., "10:00"
        required: true,
    },
    endTime: {
        type: String, // e.g., "11:00"
        required: true,
    },
}, { timestamps: true });

const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;