var mongoose = require("mongoose");

var regionSchema = new mongoose.Schema({
    extra: {
        type: String,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
});

mongoose.model('Region', regionSchema);