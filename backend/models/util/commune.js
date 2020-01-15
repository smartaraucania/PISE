var mongoose = require("mongoose");

var communeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    region_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
});

mongoose.model('Commune', communeSchema);