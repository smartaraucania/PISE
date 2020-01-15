/**
 * WebUser REST Controller
 */

var mongoose = require('mongoose'),
    WebUser = mongoose.model('WebUser'),
    ActorType = mongoose.model('ActorType'),
    Office = mongoose.model('Office'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors'),
    randomize = require('randomatic'),
    mailservice = require('../../util/mailservice');

/**
 * Get all Web Users
 */
exports.getAllWebUsers = function (req, res) {
    req.query.nPage = req.query.nPage != null ? req.query.nPage : "1";
    WebUser.paginate({}, {
        sort: {
            name: 1
        },
        page: req.query.nPage != "" ? req.query.nPage : "1",
        limit: 20,
        populate: ['actorType_id', 'office_id', 'office_id.region_id', 'office_id.commune_id']
    }, function (err, webUsers) {
        if (err) return errors.bdError(res, err);

        return res.status(200).send({
            response: webUsers.docs,
            total: webUsers.totalDocs,
            page: webUsers.page,
            limit: webUsers.limit,
            pages: webUsers.totalPages,
            hasPrevPage: webUsers.hasPrevPage,
            hasNextPage: webUsers.hasNextPage
        });
    });
}

exports.getWebUsersPerActorType = function (req, res) {
    req.query.nPage = req.query.nPage != null ? req.query.nPage : "1";
    ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);
        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');
        if (!req.user.isAdmin && req.params.actorTypeId != req.user.actorType_id) return errors.noPermissionsError(res);

        if (req.query.office && req.query.office != "") {
            WebUser.paginate({
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
                limit: 20,
                populate: ['actorType_id', 'office_id', 'office_id.region_id', 'office_id.commune_id']
            }, function (err, webUsers) {
                if (err) return errors.bdError(res, err);

                return res.status(200).send({
                    response: webUsers.docs,
                    total: webUsers.totalDocs,
                    page: webUsers.page,
                    limit: webUsers.limit,
                    pages: webUsers.totalPages,
                    hasPrevPage: webUsers.hasPrevPage,
                    hasNextPage: webUsers.hasNextPage
                });
            });
        } else {
            WebUser.paginate({
                actorType_id: actorType._id
            }, {
                sort: {
                    name: 1
                },
                page: req.query.nPage != "" ? req.query.nPage : "1",
                limit: 20,
                populate: ['actorType_id', 'office_id', 'office_id.region_id', 'office_id.commune_id']
            }, function (err, webUsers) {
                if (err) return errors.bdError(res, err);

                return res.status(200).send({
                    response: webUsers.docs,
                    total: webUsers.totalDocs,
                    page: webUsers.page,
                    limit: webUsers.limit,
                    pages: webUsers.totalPages,
                    hasPrevPage: webUsers.hasPrevPage,
                    hasNextPage: webUsers.hasNextPage
                });
            });
        }
    });
}

/**
 * Get all app users with same office vs User logged office
 */
exports.getWebUsersSameOffice = function (req, res) {
    req.query.nPage = req.query.nPage != null ? req.query.nPage : "1";
    Office.findById(req.user.office_id).exec(function (err, office) {
        if (err) return errors.bdError(res, err);
        if (!office) return errors.objectNotFoundError(res, 'Oficina');

        WebUser.paginate({
            office_id: office._id
        }, {
            sort: {
                name: 1
            },
            page: req.query.nPage != "" ? req.query.nPage : "1",
            limit: 20
        }, function (err, webUsers) {
            if (err) return errors.bdError(res, err);

            return res.status(200).send({
                response: webUsers.docs,
                total: webUsers.totalDocs,
                page: webUsers.page,
                limit: webUsers.limit,
                pages: webUsers.totalPages,
                hasPrevPage: webUsers.hasPrevPage,
                hasNextPage: webUsers.hasNextPage
            });
        });
    });
}

exports.addWebUser = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddWebUser(req, true);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });
    //First check if email or phone exists
    WebUser.findOne({
        or: [{
            email: req.body.email
        }, {
            phone: req.body.phone
        }]
    }).exec(function (err, webUserEmail) {
        if (err) return errors.bdError(res, err);
        if (webUserEmail != null) return res.status(409).send({
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

                        var webUser = new WebUser({
                            name: req.body.name,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            phone: req.body.phone,
                            photoURL: req.body.photoURL,
                            actorType_id: req.body.actorType_id,
                            office_id: office._id,
                            isSuperUser: req.body.isSuperUser,
                            additionalDetails: req.body.additionalDetails,
                            password: password,
                            isGovernment: req.body.isGovernment,
                        });

                        webUser.save(function (err, savedWebUser) {
                            if (err) {
                                return errors.bdSave(res, err);
                            }

                            return mailservice.accountCreatedBySuperUser(webUser, password, true, res);
                        });
                    })
                } else {
                    var webUser = new WebUser({
                        name: req.body.name,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phone,
                        photoURL: req.body.photoURL,
                        actorType_id: req.body.actorType_id,
                        office_id: req.body.office_id,
                        isSuperUser: req.body.isSuperUser,
                        additionalDetails: req.body.additionalDetails,
                        isGovernment: req.body.isGovernment,
                        password: password
                    });

                    webUser.save(function (err, savedWebUser) {
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

                    var webUser = new WebUser({
                        name: req.body.name,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phone,
                        photoURL: req.body.photoURL,
                        actorType_id: req.user.actorType_id,
                        office_id: office._id,
                        isSuperUser: req.body.isSuperUser,
                        additionalDetails: req.body.additionalDetails,
                        password: password
                    });

                    webUser.save(function (err, savedWebUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return mailservice.accountCreatedBySuperUser(webUser, password, true, res);
                    });
                })
            } else {
                var webUser = new WebUser({
                    name: req.body.name,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    photoURL: req.body.photoURL,
                    actorType_id: req.user.actorType_id,
                    office_id: req.body.office_id,
                    isSuperUser: req.body.isSuperUser,
                    additionalDetails: req.body.additionalDetails,
                    password: password
                });

                webUser.save(function (err, savedWebUser) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }

                    return mailservice.accountCreatedBySuperUser(webUser, password, true, res);
                });
            }
        }
    })
}

exports.editWebUser = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddWebUser(req, false);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });
    //First check if email or phone exists
    WebUser.findById(req.params.webUserId).exec(function (err, webUser) {
        if (err) return errors.bdError(res, err);
        if (!webUser) return errors.objectNotFoundError(res, 'Usuario Web');

        if (req.user.isAdmin) {
            ActorType.findById(req.body.actorType_id).exec(function (err, actorType) {
                if (err) return errors.bdError(res, err);
                if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

                if (req.body.office_id) {
                    Office.findById(req.body.office_id).exec(function (err, office) {
                        if (err) return errors.bdError(res, err);
                        if (!office) return errors.objectNotFoundError(res, 'Oficina');

                        webUser.name = req.body.name;
                        webUser.lastName = req.body.lastName;
                        webUser.email = req.body.email;
                        webUser.phone = req.body.phone != null ? req.body.phone : webUser.phone;
                        webUser.photoURL = req.body.photoURL != null ? req.body.photoURL : webUser.photoURL;
                        webUser.actorType_id = req.body.actorType_id != null ? req.body.actorType_id : webUser.actorType_id;
                        webUser.office_id = office._id;
                        webUser.isSuperUser = req.body.isSuperUser != null ? req.body.isSuperUser : webUser.isSuperUser;
                        webUser.additionalDetails = req.body.additionalDetails != null ? req.body.additionalDetails : webUser.additionalDetails;
                        webUser.isGovernment = req.body.isGovernment != null ? req.body.isGovernment : webUser.isGovernment;

                        webUser.save(function (err, savedWebUser) {
                            if (err) {
                                return errors.bdSave(res, err);
                            }

                            return res.status(201).send(savedWebUser);
                        });
                    })
                } else {
                    webUser.name = req.body.name;
                    webUser.lastName = req.body.lastName;
                    webUser.email = req.body.email;
                    webUser.phone = req.body.phone != null ? req.body.phone : webUser.phone;
                    webUser.photoURL = req.body.photoURL != null ? req.body.photoURL : webUser.photoURL;
                    webUser.actorType_id = req.body.actorType_id != null ? req.body.actorType_id : webUser.actorType_id;
                    webUser.isSuperUser = req.body.isSuperUser != null ? req.body.isSuperUser : webUser.isSuperUser;
                    webUser.additionalDetails = req.body.additionalDetails != null ? req.body.additionalDetails : webUser.additionalDetails;
                    webUser.isGovernment = req.body.isGovernment != null ? req.body.isGovernment : webUser.isGovernment;
                    webUser.office_id = req.body.office_id != null ? req.body.office_id : webUser.office_id;


                    webUser.save(function (err, savedWebUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return res.status(201).send(savedWebUser);
                    });
                }
            });
        } else {

            if (req.user.actorType_id != webUser.actorType_id) return errors.noPermissionsError(res);

            if (req.body.office_id) {
                Office.findById(req.body.office_id).exec(function (err, office) {
                    if (err) return errors.bdError(res, err);
                    if (!office) return errors.objectNotFoundError(res, 'Oficina');

                    webUser.name = req.body.name;
                    webUser.lastName = req.body.lastName;
                    webUser.email = req.body.email;
                    webUser.phone = req.body.phone;
                    webUser.photoURL = req.body.photoURL;
                    webUser.actorType_id = req.user.actorType_id;
                    webUser.office_id = req.body.office_id;
                    webUser.isSuperUser = req.body.isSuperUser;
                    webUser.additionalDetails = req.body.additionalDetails;
                    webUser.password = req.body.password;

                    webUser.save(function (err, savedWebUser) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }

                        return res.status(201).send(savedWebUser);
                    });
                })
            } else {
                webUser.name = req.body.name;
                webUser.lastName = req.body.lastName;
                webUser.email = req.body.email;
                webUser.phone = req.body.phone;
                webUser.photoURL = req.body.photoURL;
                webUser.actorType_id = req.user.actorType_id;
                webUser.office_id = req.body.office_id;
                webUser.isSuperUser = req.body.isSuperUser;
                webUser.additionalDetails = req.body.additionalDetails;
                webUser.password = req.body.password;

                webUser.save(function (err, savedWebUser) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }

                    return res.status(201).send(savedWebUser);
                });
            }
        }
    })
}

exports.enableWebUser = function (req, res) {
    WebUser.findById(req.params.webUserId).exec(function (err, webUser) {
        if (err) return errors.bdError(res, err);
        if (!webUser) return errors.objectNotFoundError(res, 'Usuario Web');

        if (req.user.actorType_id != webUser.actorType_id) return errors.noPermissionsError(res);

        if (webUser.enabled) return res.status(409).send({
            errors: [{
                "error": "El usuario ya esta habilitado"
            }]
        });

        webUser.save(function (err, savedWebUser) {
            if (err) {
                return errors.bdSave(res, err);
            }

            return res.status(200).send(savedWebUser);
        });

    });
}

exports.disableWebUser = function (req, res) {
    WebUser.findById(req.params.webUserId).exec(function (err, webUser) {
        if (err) return errors.bdError(res, err);
        if (!webUser) return errors.objectNotFoundError(res, 'Usuario Web');

        if (req.user.actorType_id != webUser.actorType_id) return errors.noPermissionsError(res);

        if (!webUser.enabled) return res.status(409).send({
            errors: [{
                "error": "El usuario ya esta deshabilitado"
            }]
        });

        webUser.enabled = false;

        webUser.save(function (err, savedWebUser) {
            if (err) {
                return errors.bdSave(res, err);
            }

            return res.status(200).send(savedWebUser);
        });
    });
}