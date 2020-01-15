var mongoose = require("mongoose");

var countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
});

mongoose.model('Country', countrySchema);