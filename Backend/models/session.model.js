const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timeSlot: {
        dayOfWeek: String,
        startTime: String,
        endTime: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'completed'],
        default: 'pending',
    },
    notes: String,
    videoLink: String, // mock URL
    feedback: {
        mentorRating: Number,
        mentorComments: String,
        menteeRating: Number,
        menteeComments: String,
    },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;