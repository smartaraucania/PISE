var mongoose = require("mongoose");

var eventTypeSchema = new mongoose.Schema({
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    },
    actorType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
        required: false
    },
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String
    },
    selectable: {
        type: Boolean,
        required: true,
        default: false
    },
});

mongoose.model('EventType', eventTypeSchema);