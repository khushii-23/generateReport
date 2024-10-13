const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: [true, 'Event name is required']
    },
    eventDate: {
        type: String,
        required: [true, 'Event date is required']
    },
    eventVenue: {
        type: String,
        required: [true, 'Event venue is required']
    },
    eventDescription: {
        type: String,
        required: [true, 'Event description is required']
    },
    eventImage: { 
        type: String,
        required: [false, 'Event image is required'] // Corrected field name
    }
});

module.exports = mongoose.model('Report', reportSchema);

