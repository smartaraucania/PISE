var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');

var emergencyEventSchema = new mongoose.Schema({
    emergency_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency',
        required: true
    },
    eventType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventType',
        required: true
    },
    user: {
        type: String,
    },
    by_actorType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
        required: true
    },
    to_actorType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

emergencyEventSchema.plugin(mongoosePaginate);
mongoose.model('EmergencyEvent', emergencyEventSchema);