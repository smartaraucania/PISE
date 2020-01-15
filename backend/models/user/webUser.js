var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

var webUserSchema = new mongoose.Schema({
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
  loginHistory: [
    {
      date: Date,
      location: String
    }
  ],
  resetCode: {
    type: String
  },
  token: String,
  loginCode: String,
  actorType_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActorType"
  },
  office_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office",
    required: false
  },
  isSuperUser: {
    type: Boolean,
    required: true,
    default: false
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
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
});

webUserSchema.plugin(mongoosePaginate);
/**
 * Pre "SAVE" function
 * Generate HASH Password if password isModified
 */
webUserSchema.pre("save", function(next) {
  var webUser = this;

  // only hash the password if it has been modified (or is new)
  if (!webUser.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(webUser.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      webUser.password = hash;
      next();
    });
  });
});

/**
 * Compare Password check if current has password user equals candidate Password
 */
webUserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Compare Password check if current has password user equals candidate Password
 */
webUserSchema.methods.compareLoginCode = function(candidateLoginCode, cb) {
  bcrypt.compare(candidateLoginCode, this.loginCode, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var webUserModel = mongoose.model("WebUser", webUserSchema);

webUserModel.create(
  {
    name: "PISE",
    lastName: "ADMIN",
    email: "j.silva12@ufromail.cl",
    password: "123456",
    isAdmin: true
  },
  function(err, user) {
      
  }
);
