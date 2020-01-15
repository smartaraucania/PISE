var mongoose = require("mongoose");

var emergencyTypeSchema = new mongoose.Schema({
    actorType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
        required: true
    },
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String
    },

});

mongoose.model('EmergencyType', emergencyTypeSchema);