var mongoose = require("mongoose");

var actorTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    logoURL: {
        type: String
    }
});

mongoose.model('ActorType', actorTypeSchema);