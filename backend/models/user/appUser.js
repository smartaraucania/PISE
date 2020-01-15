var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var appUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phone: {
        type: String
    },
    photoURL: {
        type: String
    },
    token: String,
    loginCode: String,
    loginHistory: [{
        date: Date,
        location: String,
        loginCode: String
    }],
    resetCode: {
        type: String
    },
    actorType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActorType',
        required: true
    },
    office_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office',
        required: false
    },
    additionalDetails: {
        type: String
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    },
    isGovernment: {
        type: Boolean,
        required: true,
        default: false
    }
});

appUserSchema.plugin(mongoosePaginate);
/**
 * Pre "SAVE" function
 * Generate HASH Password if password isModified
 */
appUserSchema.pre('save', function (next) {
    var appUser = this;

    // only hash the password if it has been modified (or is new)
    if (!appUser.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(appUser.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            appUser.password = hash;
            next();
        });
    });
});

/**
 * Compare Password check if current has password user equals candidate Password
 */
appUserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

appUserSchema.methods.compareLoginCode = function(candidateLoginCode, cb) {
    bcrypt.compare(candidateLoginCode, this.loginCode, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

mongoose.model('AppUser', appUserSchema);