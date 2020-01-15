var errors = require("../util/errors"),
  jwt = require("jsonwebtoken"),
  constants = require("../util/constants"),
  mongoose = require("mongoose"),
  AppUser = mongoose.model("AppUser"),
  WebUser = mongoose.model("WebUser"),
  decodedUser = null;

/**
 * Check if User Logged
 */
exports.isAuth = function(req, res, next) {
  var authorization = req.headers["authorization"];

  if (!authorization) return errors.tokenError(res);

  var token = authorization.split("Bearer ");
  if (!token[1]) return errors.tokenError(res);

  jwt.verify(token[1], constants.secret, function(err, decoded) {
    if (err) return errors.tokenError(res);

    decodedUser = decoded;
    if (decoded.typeUser == 0) {
      WebUser.findById(decoded.id).exec(function(err, user) {
        if (err) return errors.tokenError(res);
        if (!user) return errors.noPermissionsError(res);

        req.user = user;
        return next();
      });
    } else if (decoded.typeUser == 1) {
      AppUser.findById(decoded.id).exec(function(err, user) {
        if (err) return errors.tokenError(res);
        if (!user) return errors.noPermissionsError(res);

        req.user = user;
        return next();
      });
    } else {
      return errors.noPermissionsError(res);
    }
  });
};

/**
 * Return current User Logged
 */
exports.getMe = function(req, res) {
  return res.status(200).send({
    user: req.user
  });
};

/**
 * Return if user enabled
 */
exports.isEnabled = function(req, res, next) {
  if (req.user.enabled) return next();

  return errors.noPermissionsError(res);
};

/**
 * Detect any change in user data
 */
exports.hasAnyChange = function(req, res, next) {
  if (decodedUser.enabled != req.user.enabled)
    return errors.userChangeError(res);
  if (decodedUser.name != req.user.name) return errors.userChangeError(res);
  if (decodedUser.lastName != req.user.lastName)
    return errors.userChangeError(res);
  if (decodedUser.actorType + "" != req.user.actorType_id + "")
    return errors.userChangeError(res);
  if (decodedUser.office + "" != req.user.office_id + "")
    return errors.userChangeError(res);

  return next();
};

/**
 * Return if user is admin
 */
exports.isAdmin = function(req, res, next) {
  if (req.user.isAdmin) return next();

  return errors.noPermissionsError(res);
};

/**
 * Return if user is SuperUser
 */
exports.isSuperUser = function(req, res, next) {
  if (req.user.isAdmin || req.user.isSuperUser) return next();

  return errors.noPermissionsError(res);
};

/**
 * Return if user is a government
 */
exports.isGovernment = function(req, res, next) {
  if (req.user.isGovernment) return next();

  return errors.noPermissionsError(res);
};

/**
 * Error Body Handling
 */
exports.bodyErrorHandling = function(error, req, res, next) {
  if (error instanceof SyntaxError) {
    return errors.syntaxBodyError(res);
  }
  return next();
};

/**
 * Pre Login Token validation
 */
exports.preLoginToken = function(req, res, next) {
  var authorization = req.headers["authorization"];

  if (!authorization) return errors.tokenError(res);

  var token = authorization.split(" ");
  if (!token[1]) return errors.tokenError(res);

  jwt.verify(token[1], constants.secret, function(err, decoded) {
    if (err) return errors.tokenError(res);

    req.currentUserId = decoded.id;
    return next();
  });
};
