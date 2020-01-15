var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');

var officeSchema = new mongoose.Schema({
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
    commune_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commune',
        required: false
    },
    actorType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
        required: true
    }
});

officeSchema.plugin(mongoosePaginate);
mongoose.model('Office', officeSchema);