var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');

var emergencySchema = new mongoose.Schema({
    emergencyType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmergencyType',
        required: true
    },
    actorType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
        required: true
    },
    othersActorsTypesConfirm_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
    }],
    othersActorsTypesRequest_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
    }],
    requestAppUsers_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppUser',
    }],
    confirmAppUsers_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppUser',
    }],
    arrivedAppUsers_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppUser',
    }],
    details: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        },
        date: Date
    },
    date: {
        type: Date,
        required: true
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmergencyEvent'
    }],
    lastEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmergencyEvent'
    },
    initialReport: {
        text: {
            type: String
        },
        photosURL: [{
            type: String
        }],
        lastAppUser_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AppUser'
        },
        lastWebUser_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WebUser'
        },
        date: Date
    },
    finalized: {
        type: Boolean,
        required: false,
        default: false
    }
});

emergencySchema.plugin(mongoosePaginate);
mongoose.model('Emergency', emergencySchema);