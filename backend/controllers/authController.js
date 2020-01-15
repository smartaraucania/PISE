/**
 * AppUser REST Controller
 */

var mongoose = require('mongoose'),
    AppUser = mongoose.model('AppUser'),
    WebUser = mongoose.model('WebUser'),
    validations = require('../util/validations'),
    errors = require('../util/errors'),
    constants = require('../util/constants'),
    jwt = require('jsonwebtoken'),
    randomize = require('randomatic'),
    mailservice = require('../util/mailservice'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

//WEB USER

exports.loginWebUser = function (req, res) {
    //Checkear el body
    let bodyErrors = validations.checkBodyLogin(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    //Find User by email
    WebUser.findOne({
        email: new RegExp(`^${req.body.email}$`, 'i')
    }).select("+password").exec(function (err, webUser) {
        if (err) return errors.bdError(res, err);
        if (!webUser) return res.status(404).send({
            errors: [{
                error: "No existe usuario con ese email"
            }]
        });

        if (!webUser.enabled) return res.status(403).send({
            errors: [{
                error: "Usuario no habilitado"
            }]
        });

        webUser.comparePassword(req.body.password, async function (err, isMatch) {
            if (err) return errors.bdError(res, err);

            if (!isMatch) return errors.passwordNotMatch(res);

            if (isMatch) {
                var codeNewLogin = randomize('0', 6);

                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) return next(err);

                    // hash the password using our new salt
                    bcrypt.hash(codeNewLogin, salt, function (err, hash) {
                        if (err) return next(err);

                        // override the cleartext password with the hashed one
                        webUser.loginCode = hash;
                        webUser.token = null;

                        webUser.save(function (err, savedWebUser) {
                            if (err) {
                                return errors.bdSave(res, err);
                            }

                            var tokenData = {
                                id: webUser._id,
                            }

                            var token = jwt.sign(tokenData, constants.secret, {
                                expiresIn: '15m'
                            });

                            return mailservice.codeNewLogin(webUser, {
                                device: req.body.locationData,
                                date: new Date(),
                                loginCode: codeNewLogin
                            }, token, res);
                        });
                    });
                });
            }
        })
    });
}

exports.confirmLoginWebUser = function (req, res) {
    //Checkear el body
    let bodyErrors = validations.checkBodyConfirmLogin(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    //Find User by email
    WebUser.findById(req.currentUserId).exec(function (err, webUser) {
        if (err) return errors.bdError(res, err);
        if (!webUser) return res.status(404).send({
            errors: [{
                error: "No existe usuario con ese email"
            }]
        });

        if (!webUser.enabled) return res.status(403).send({
            errors: [{
                error: "Usuario no habilitado"
            }]
        });

        if (!webUser.loginCode) return res.status(403).send({
            errors: [{
                error: "Primero intente entrar al sistema con sus credenciales!"
            }]
        });

        webUser.compareLoginCode(req.body.code, function (err, isMatch) {
            if (err) return errors.bdError(res, err);

            if (!isMatch) return errors.loginCodeNotMatch(res);

            if (isMatch) {

                var tokenData = {
                    typeUser: 0,
                    id: webUser._id,
                    name: webUser.name,
                    lastName: webUser.lastName,
                    permissions: [webUser.isAdmin, webUser.isSuperUser, webUser.isGovernment],
                    enabled: webUser.enabled,
                    actorType: webUser.actorType_id,
                    office: webUser.office_id
                }

                var token = null;

                if (req.body.remember) {
                    var token = jwt.sign(tokenData, constants.secret);
                } else {
                    var token = jwt.sign(tokenData, constants.secret, {
                        expiresIn: '1d'
                    });
                }

                webUser.token = token;
                webUser.loginHistory.push({
                    date: new Date(),
                    location: req.body.locationData,
                });
                webUser.loginCode = null;

                webUser.save(function (err, savedWebUser) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }

                    return res.status(200).send({
                        "token": token
                    });
                });
            }
        })
    });
}

exports.logoutWebUser = function (req, res){
    //Find User
    WebUser.findById(req.user._id).exec(function (err, webUser) {
        if (err) return errors.bdError(res, err);
        if (!webUser) return res.status(200).send({
            errors: [{
                error: "No existe usuario con ese email"
            }]
        });

        webUser.token = null;

        webUser.save(function (err, savedWebUser) {
            if (err) {
                return errors.bdSave(res, err);
            }

            return res.status(200).send({
                "success": true
            });
        });
            
    });
}

exports.forgotPasswordWebUser = function (req, res) {

}

exports.confirmChangePasswordWebUser = function (req, res) {

}

//APP USER

exports.loginAppUser = function (req, res) {
    //Checkear el body
    let bodyErrors = validations.checkBodyLogin(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    //Find User by email
    AppUser.findOne({
        email: new RegExp(`^${req.body.email}$`, 'i')
    }).select("+password").exec(function (err, appUser) {
        if (err) return errors.bdError(res, err);
        if (!appUser) return res.status(404).send({
            errors: [{
                error: "No existe usuario con ese email"
            }]
        });

        if (!appUser.enabled) return res.status(403).send({
            errors: [{
                error: "Usuario no habilitado"
            }]
        });

        appUser.comparePassword(req.body.password, async function (err, isMatch) {
            if (err) return errors.bdError(res, err);

            if (!isMatch) return errors.passwordNotMatch(res);

            if (isMatch) {
                var codeNewLogin = randomize('0', 6);

                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) return next(err);

                    // hash the password using our new salt
                    bcrypt.hash(codeNewLogin, salt, function (err, hash) {
                        if (err) return next(err);

                        // override the cleartext password with the hashed one
                        appUser.loginCode = hash;

                        appUser.save(function (err, savedAppUser) {
                            if (err) {
                                return errors.bdSave(res, err);
                            }

                            mailservice.codeNewLogin(appUser, {
                                device: req.headers['user-agent'],
                                date: new Date(),
                                loginCode: codeNewLogin
                            });

                            var tokenData = {
                                id: appUser._id,
                            }

                            var token = jwt.sign(tokenData, constants.secret, {
                                expiresIn: '1h'
                            });

                            return res.status(200).send({
                                "token": token
                            });
                        });
                    });
                });
            }
        })
    });
}

exports.confirmLoginAppUser = function (req, res) {
    //Checkear el body
    let bodyErrors = validations.checkBodyConfirmLogin(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    //Find User by email
    AppUser.findById(req.currentUserId).exec(function (err, appUser) {
        if (err) return errors.bdError(res, err);
        if (!appUser) return res.status(404).send({
            errors: [{
                error: "No existe usuario con ese email"
            }]
        });

        if (!appUser.enabled) return res.status(403).send({
            errors: [{
                error: "Usuario no habilitado"
            }]
        });

        if (!appUser.loginCode) return res.status(403).send({
            errors: [{
                error: "Primero intente entrar al sistema con sus credenciales!"
            }]
        });

        appUser.compareLoginCode(req.body.code, function (err, isMatch) {
            if (err) return errors.bdError(res, err);

            if (!isMatch) return errors.loginCodeNotMatch(res);

            if (isMatch) {

                var tokenData = {
                    typeUser: 1,
                    id: appUser._id,
                    name: appUser.name,
                    lastName: appUser.lastName,
                    enabled: appUser.enabled,
                    actorType: appUser.actorType_id,
                    office: appUser.office_id
                }

                var token = null;

                if (req.body.remember) {
                    var token = jwt.sign(tokenData, constants.secret);
                } else {
                    var token = jwt.sign(tokenData, constants.secret, {
                        expiresIn: '1d'
                    });
                }

                appUser.token = token;
                appUser.loginHistory.push({
                    date: new Date(),
                    location: req.headers['user-agent'],
                });
                appUser.loginCode = null;

                appUser.save(function (err, savedAppUser) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }

                    return res.status(200).send({
                        "token": token
                    });
                });
            }
        })
    });
}

exports.logoutAppUser = function (req, res){
    //Find User
    AppUser.findById(req.user._id).exec(function (err, appUser) {
        if (err) return errors.bdError(res, err);
        if (!appUser) return res.status(200).send({
            errors: [{
                error: "No existe usuario con ese email"
            }]
        });

        appUser.token = null;

        appUser.save(function (err, savedAppUser) {
            if (err) {
                return errors.bdSave(res, err);
            }

            return res.status(200).send({
                "success": true
            });
        });
            
    });
}

exports.forgotPasswordAppUser = function (req, res) {

}

exports.confirmChangePasswordAppUser = function (req, res) {

}