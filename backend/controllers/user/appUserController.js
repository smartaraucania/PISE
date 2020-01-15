/**
 * AppUser REST Controller
 */

var mongoose = require('mongoose'),
    AppUser = mongoose.model('AppUser'),
    ActorType = mongoose.model('ActorType'),
    Office = mongoose.model('Office'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors'),
    randomize = require('randomatic'),
    mailservice = require('../../util/mailservice'),
    uploadFile = require('../../util/fileUpload');

/**
 * Get all App Users
 */
exports.getAllAppUsers = function (req, res) {
    req.query.nPage = req.query.nPage != null ? req.query.nPage : "1";
    AppUser.paginate({}, {
        sort: {
            name: 1
        },
        page: req.query.nPage != "" ? req.query.nPage : "1",
        limit: 20
    }, function (err, appUsers) {
        if (err) return errors.bdError(res, err);

        return res.status(200).send({
            response: appUsers.docs,
            total: appUsers.totalDocs,
            page: appUsers.page,
            limit: appUsers.limit,
            pages: appUsers.totalPages,
            hasPrevPage: appUsers.hasPrevPage,
            hasNextPage: appUsers.hasNextPage
        });
    });
}

exports.getAppUsersPerActorType = function (req, res) {
    req.query.nPage = req.query.nPage != null ? req.query.nPage : "1";
    ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);
        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');
        if (!req.user.isAdmin && req.params.actorTypeId != req.user.actorType_id) return errors.noPermissionsError(res);

        if (req.query.office && req.query.office != "") {
            AppUser.paginate({
                and: [{
                    actorType_id: actorType._id
                }, {
                    office_id: req.query.office
                }]
            }, {
                sort: {
                    name: 1
                },
                page: req.query.nPage != "" ? req.query.nPage : "1",
                limit: 20
            }, function (err, appUsers) {
                if (err) return errors.bdError(res, err);

                return res.status(200).send({
                    response: appUsers.docs,
                    total: appUsers.totalDocs,
                    page: appUsers.page,
                    limit: appUsers.limit,
                    pages: appUsers.totalPages,
                    hasPrevPage: appUsers.hasPrevPage,
                    hasNextPage: appUsers.hasNextPage
                });
            });
        } else {
            AppUser.paginate({
                actorType_id: actorType._id
            }, {
                sort: {
                    name: 1
                },
                page: req.query.nPage != "" ? req.query.nPage : "1",
                limit: 20
            }, function (err, appUsers) {
                if (err) return errors.bdError(res, err);

                return res.status(200).send({
                    response: appUsers.docs,
                    total: appUsers.totalDocs,
                    page: appUsers.page,
                    limit: appUsers.limit,
                    pages: appUsers.totalPages,
                    hasPrevPage: appUsers.hasPrevPage,
                    hasNextPage: appUsers.hasNextPage
                });
            });
        }
    });
}

/**
 * Get all app users with same office vs User logged office
 */
exports.getAppUsersSameOffice = function (req, res) {
    req.query.nPage = req.query.nPage != null ? req.query.nPage : "1";
    Office.findById(req.user.office_id).exec(function (err, office) {
        if (err) return errors.bdError(res, err);
        if (!office) return errors.objectNotFoundError(res, 'Oficina');

        AppUser.paginate({
            office_id: office._id
        }, {
            sort: {
                name: 1
            },
            page: req.query.nPage != "" ? req.query.nPage : "1",
            limit: 20
        }, function (err, appUsers) {
            if (err) return errors.bdError(res, err);

            return res.status(200).send({
                response: appUsers.docs,
                total: appUsers.totalDocs,
                page: appUsers.page,
                limit: appUsers.limit,
                pages: appUsers.totalPages,
                hasPrevPage: appUsers.hasPrevPage,
                hasNextPage: appUsers.hasNextPage
            });
        });
    });
}

exports.addAppUser = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddWebUser(req, true);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });
    //First check if email or phone exists
    AppUser.findOne({
        or: [{
            email: req.body.email
        }, {
            phone: req.body.phone
        }]
    }).exec(function (err, appUserEmail) {
        if (err) return errors.bdError(res, err);
        if (appUserEmail != null) return res.status(409).send({
            errors: [{
                "error": "Ya existe un usuario con ese EMAIL o TELÉFONO"
            }]
        });

        var password = randomize('0', 6);

        if (req.user.isAdmin) {
            ActorType.findById(req.body.actorType_id).exec(function (err, actorType) {
                if (err) return errors.bdError(res, err);
                if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

                if (req.body.office_id) {
                    Office.findById(req.body.office_id).exec(function (err, office) {
                        if (err) return errors.bdError(res, err);
                        if (!office) return errors.objectNotFoundError(res, 'Oficina');

                        var appUser = new AppUser({
                            name: req.body.name,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            phone: req.body.phone,
                            actorType_id: req.body.actorType_id,
                            office_id: office._id,
                            isSuperUser: req.body.isSuperUser,
                            additionalDetails: req.body.additionalDetails,
                            password: password
                        });

                        appUser.save(function (err, savedAppUser) {
                            if (err) {
                                return errors.bdSave(res, err);
                            }

                            return mailservice.accountCreatedBySuperUser(webUser, password, true, res);
                        });
                    })
                } else {
                    var appUser = new AppUser({
                        name: req.body.name,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phone,
                        actorType_id: req.body.actorType_id,
                        office_id: req.body.office_id,
                        isSuperUser: req.body.isSuperUser,
                        additionalDetails: req.body.additionalDetails,
                        password: password
                    });

                    appUser.save(function (err, savedAppUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return mailservice.accountCreatedBySuperUser(webUser, password, true, res);
                    });
                }
            });
        } else {
            if (req.body.office_id) {
                Office.findById(req.body.office_id).exec(function (err, office) {
                    if (err) return errors.bdError(res, err);
                    if (!office) return errors.objectNotFoundError(res, 'Oficina');

                    var appUser = new AppUser({
                        name: req.body.name,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phone,
                        actorType_id: req.user.actorType_id,
                        office_id: office._id,
                        isSuperUser: req.body.isSuperUser,
                        additionalDetails: req.body.additionalDetails,
                        password: password
                    });

                    appUser.save(function (err, savedAppUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return mailservice.accountCreatedBySuperUser(webUser, password, true, res);
                    });
                })
            } else {
                var appUser = new AppUser({
                    name: req.body.name,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    actorType_id: req.user.actorType_id,
                    office_id: req.body.office_id,
                    isSuperUser: req.body.isSuperUser,
                    additionalDetails: req.body.additionalDetails,
                    password: password
                });

                appUser.save(function (err, savedAppUser) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }

                    mailservice.accountCreatedBySuperUser(appUser, password, false);

                    return res.status(201).send(savedAppUser);
                });
            }
        }
    })
}

exports.editAppUser = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddAppUser(req, false);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });
    //First check if email or phone exists
    AppUser.findById(req.params.appUserId).exec(function (err, appUser) {
        if (err) return errors.bdError(res, err);
        if (!appUser) return errors.objectNotFoundError(res, 'Usuario App');

        if (req.user.isAdmin) {
            ActorType.findById(req.body.actorType_id).exec(function (err, actorType) {
                if (err) return errors.bdError(res, err);
                if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

                if (req.body.office_id) {
                    Office.findById(req.body.office_id).exec(function (err, office) {
                        if (err) return errors.bdError(res, err);
                        if (!office) return errors.objectNotFoundError(res, 'Oficina');

                        appUser.name = req.body.name;
                        appUser.lastName = req.body.lastName;
                        appUser.email = req.body.email;
                        appUser.phone = req.body.phone;
                        appUser.photoURL = req.body.photoURL;
                        appUser.actorType_id = req.body.actorType_id;
                        appUser.office_id = office._id;
                        appUser.isSuperUser = req.body.isSuperUser;
                        appUser.additionalDetails = req.body.additionalDetails;

                        appUser.save(function (err, savedAppUser) {
                            if (err) {
                                return errors.bdSave(res, err);
                            }

                            return res.status(201).send(savedAppUser);
                        });
                    })
                } else {
                    appUser.name = req.body.name;
                    appUser.lastName = req.body.lastName;
                    appUser.email = req.body.email;
                    appUser.phone = req.body.phone;
                    appUser.photoURL = req.body.photoURL;
                    appUser.actorType_id = req.body.actorType_id;
                    appUser.office_id = req.body.office_id;
                    appUser.isSuperUser = req.body.isSuperUser;
                    appUser.additionalDetails = req.body.additionalDetails;

                    appUser.save(function (err, savedAppUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return res.status(201).send(savedAppUser);
                    });
                }
            });
        } else {

            if (req.user.actorType_id != appUser.actorType_id) return errors.noPermissionsError(res);

            if (req.body.office_id) {
                Office.findById(req.body.office_id).exec(function (err, office) {
                    if (err) return errors.bdError(res, err);
                    if (!office) return errors.objectNotFoundError(res, 'Oficina');

                    appUser.name = req.body.name;
                    appUser.lastName = req.body.lastName;
                    appUser.email = req.body.email;
                    appUser.phone = req.body.phone;
                    appUser.photoURL = req.body.photoURL;
                    appUser.actorType_id = req.user.actorType_id;
                    appUser.office_id = req.body.office_id;
                    appUser.isSuperUser = req.body.isSuperUser;
                    appUser.additionalDetails = req.body.additionalDetails;
                    appUser.password = req.body.password;

                    appUser.save(function (err, savedAppUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return res.status(201).send(savedAppUser);
                    });
                })
            } else {
                if(req.file){
                    uploadFile.upload(req, res).then(function(url){
                        appUser.name = req.body.name;
                        appUser.lastName = req.body.lastName;
                        appUser.email = req.body.email;
                        appUser.phone = req.body.phone;
                        appUser.photoURL = url;
                        appUser.actorType_id = req.user.actorType_id;
                        appUser.office_id = req.body.office_id;
                        appUser.isSuperUser = req.body.isSuperUser;
                        appUser.additionalDetails = req.body.additionalDetails;
                        appUser.password = req.body.password;

                        appUser.save(function (err, savedAppUser) {
                            if (err) {
                                return errors.bdSave(res, err);
                            }

                            return res.status(201).send(savedAppUser);
                        });
                    })
                    .catch(function(err){
                        return res.status(500).send({
                            errors: [{
                                "error": "Error al subir la foto"
                            }]
                        }); 
                    })
                } else {

                    appUser.name = req.body.name;
                    appUser.lastName = req.body.lastName;
                    appUser.email = req.body.email;
                    appUser.phone = req.body.phone;
                    appUser.photoURL = req.body.photoURL;
                    appUser.actorType_id = req.user.actorType_id;
                    appUser.office_id = req.body.office_id;
                    appUser.isSuperUser = req.body.isSuperUser;
                    appUser.additionalDetails = req.body.additionalDetails;
                    appUser.password = req.body.password;

                    appUser.save(function (err, savedAppUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return res.status(201).send(savedAppUser);
                    });
                }
            }
        }
    })
}

exports.enableAppUser = function (req, res) {
    AppUser.findById(req.params.appUserId).exec(function (err, appUser) {
        if (err) return errors.bdError(res, err);
        if (!appUser) return errors.objectNotFoundError(res, 'Usuario App');

        if (req.user.actorType_id != appUser.actorType_id) return errors.noPermissionsError(res);

        if (appUser.enabled) return res.status(409).send({
            errors: [{
                "error": "El usuario ya esta habilitado"
            }]
        });

        appUser.save(function (err, savedAppUser) {
            if (err) {
                return errors.bdSave(res, err);
            }

            return res.status(200).send(savedAppUser);
        });

    });
}

exports.disableAppUser = function (req, res) {
    AppUser.findById(req.params.appUserId).exec(function (err, appUser) {
        if (err) return errors.bdError(res, err);
        if (!appUser) return errors.objectNotFoundError(res, 'Usuario App');

        if (req.user.actorType_id != appUser.actorType_id) return errors.noPermissionsError(res);

        if (appUser.enabled) return res.status(409).send({
            errors: [{
                "error": "El usuario ya esta deshabilitado"
            }]
        });

        appUser.enabled = false;

        appUser.save(function (err, savedAppUser) {
            if (err) {
                return errors.bdSave(res, err);
            }

            return res.status(200).send(savedAppUser);
        });
    });
}