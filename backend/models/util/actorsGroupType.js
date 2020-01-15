var mongoose = require("mongoose");

var actorsGroupTypeSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String
    },
    logoURL: {
        type: String
    },
    actorTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
        required: true
    }],
});


mongoose.model('ActorsGroupType', actorsGroupTypeSchema);
