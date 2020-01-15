/**
 * Emergency Type REST Controller
 */

var mongoose = require('mongoose'),
    EventType = mongoose.model('EventType'),
    EmergencyEvent = mongoose.model('EmergencyEvent'),
    Emergency = mongoose.model('Emergency'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');


/**
 * Get all EmergencyEvents from same actortype of login user
 */
exports.getEmergencyEventsByActorsType = function (req, res) {
    EmergencyEvent.paginate({
        by_actorType_id: req.user.actorType_id
    }, {
        sort: {
            date: -1
        },
        page: req.query.nPage != "" ? req.query.nPage : "1",
        limit: 20
    }, function (err, emergencyEvents) {
        if (err) return errors.bdError(res, err);
        return res.status(200).send({
            response: emergencyEvents.docs,
            total: emergencyEvents.totalDocs,
            page: emergencyEvents.page,
            limit: emergencyEvents.limit,
            pages: emergencyEvents.totalPages,
            hasPrevPage: emergencyEvents.hasPrevPage,
            hasNextPage: emergencyEvents.hasNextPage
        });
    });
}

/**
 * Get all EmergencyEvents from Emergency
 */
exports.getEmergencyEventsByEmergency = function (req, res) {
    Emergency.findById(req.params.emergencyId).exec(function (err, emergency) {
        if (err) return errors.bdError(res, err);
        if (!emergency) return errors.objectNotFoundError(res, 'Emergencia');

        EmergencyEvent.paginate({
            emergency_id: emergency._id
        }, {
            sort: {
                date: -1
            },
            page: req.query.nPage != "" ? req.query.nPage : "1",
            limit: 20
        }, function (err, emergencyEvents) {
            if (err) return errors.bdError(res, err);
            return res.status(200).send({
                response: emergencyEvents.docs,
                total: emergencyEvents.totalDocs,
                page: emergencyEvents.page,
                limit: emergencyEvents.limit,
                pages: emergencyEvents.totalPages,
                hasPrevPage: emergencyEvents.hasPrevPage,
                hasNextPage: emergencyEvents.hasNextPage
            });
        });
    })
}

/**
 * Add a EmergencyEvent to Emergency
 */
exports.addEmergencyEventToEmergency = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddEmergencyEvent(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    Emergency.findById(req.params.emergencyId).exec(function (err, emergency) {
        if (err) return errors.bdError(res, err);
        if (!emergency) return errors.objectNotFoundError(res, 'Emergencia');

        if (emergency.finalized) return res.status(400).send({
            errors: [{
                error: "Emergencia ya finalizada!"
            }]
        });

        EventType.findById(req.body.eventType_id).exec(function (err, eventType) {
            if (err) return errors.bdError(res, err);
            if (!eventType) return errors.objectNotFoundError(res, 'Tipo de Evento');

            if (eventType.name.toLowerCase() == "pedir ayuda a otro servicio") {
                if (!req.body.to_actorType_id) return errors.objectNotFoundError(res, 'Tipo de Actor');
            }

            var emergencyEvent = new EmergencyEvent({
                emergency_id: req.body.emergency_id,
                eventType_id: eventType._id,
                by_actorType_id: req.body.by_actorType_id,
                to_actorType_id: req.body.to_actorType_id,
                description: req.body.description,
                date: req.body.date,
                user: req.body.user
            });

            emergencyEvent.save(function (err, savedEmergencyEvent) {
                if (err) {
                    return errors.bdSave(res, err);
                }
                emergency.events.push(savedEmergencyEvent._id);
                emergency.lastEvent = savedEmergencyEvent._id;
                emergency.save(function (err, savedEmergencyEvent) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    global.io.emit('newEvent', savedEmergencyEvent);
                    return res.status(201).send(savedEmergencyEvent);
                });
            });
        })
    })
}

/**
 * Dejar emergencia como finalizada
 */
exports.setEmergencyFinalized = function (req, res) {
    Emergency.findById(req.params.emergencyId).populate({
        path: 'events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id',
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'events'
        },
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'lastEvent'
        }
    }).exec(function (err, emergency) {
        if (err) return errors.bdError(res, err);
        if (!emergency) return errors.objectNotFoundError(res, 'Emergencia');

        if (emergency.actorType_id._id != req.user.actorType_id+"") {
            return res.status(400).send({
                errors: [{
                    error: "Emergencia no fue creada por este tipo de actor!"
                }]
            });
        }

        if (emergency.finalized) {
            return res.status(400).send({
                errors: [{
                    error: "Emergencia ya finalizada"
                }]
            });
        }

        emergency.finalized = true;

        EventType.findOne({
            name: 'emergencia finalizada'
        }).exec(function (err, event) {
            if (err) return errors.bdError(res, err);
            if (!event) return errors.objectNotFoundError(res, 'Evento');

            var emergencyEvent = new EmergencyEvent({
                emergency_id: emergency._id,
                eventType_id: event._id,
                by_actorType_id: req.user.actorType_id,
                user: req.user.name + " " + req.user.lastName
            });

            emergencyEvent.save(function (err, savedEmergencyEvent) {
                if (err) {
                    return errors.bdSave(res, err);
                }
                emergency.events.push(savedEmergencyEvent._id);
                emergency.lastEvent = savedEmergencyEvent._id;
                emergency.save(function (err, savedEmergencyEvent) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    return res.status(200).send(savedEmergencyEvent);
                });
            });
        });
    });
}

/**
 * Notificar el ir a la emergencia
 */
exports.notifyRoadToEmergency = function (req, res) {
    Emergency.findById(req.params.emergencyId).populate({
        path: 'events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id',
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'events'
        },
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'lastEvent'
        }
    }).exec(function (err, emergency) {
        if (err) return errors.bdError(res, err);
        if (!emergency) return errors.objectNotFoundError(res, 'Emergencia');


        if(req.user.typeUser == 0){
            if (emergency.othersActorsTypesConfirm_id.indexOf(req.user.actorType_id) != -1) {
                return res.status(400).send({
                    errors: [{
                        error: "Ya se notificó en camino por este Tipo de actor"
                    }]
                });
            }
        } else {
            if (emergency.confirmAppUsers_id.indexOf(req.user._id) != -1) {
                return res.status(400).send({
                    errors: [{
                        error: "Ya se notificó en camino por este Usuario"
                    }]
                });
            }
        }

        EventType.findOne({
            name: 'en camino al lugar'
        }).exec(function (err, event) {
            if (err) return errors.bdError(res, err);
            if (!event) return errors.objectNotFoundError(res, 'Evento');

            var emergencyEvent = new EmergencyEvent({
                emergency_id: emergency._id,
                eventType_id: event._id,
                by_actorType_id: req.user.actorType_id,
                user: req.user.name + " " + req.user.lastName
            });

            emergencyEvent.save(function (err, savedEmergencyEvent) {
                if (err) {
                    return errors.bdSave(res, err);
                }
                emergency.events.push(savedEmergencyEvent._id);
                if(req.user.typeUser == 0){
                    emergency.othersActorsTypesConfirm_id.push(req.user.actorType_id);
                } else {
                    emergency.confirmAppUsers_id.push(req.user._id);
                }
                emergency.lastEvent = savedEmergencyEvent._id;
                emergency.save(function (err, savedEmergencyEvent) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    if(req.user.typeUser == 0){
                        global.io.emit('notifyroadto', {from: emergencyEvent.user, to: emergency.actorType_id});
                    }
                    return res.status(201).send(savedEmergencyEvent);
                });
            });
        });
    });
}

/**
 * Pedir ayuda a otro servicio de emergencia
 */
exports.askForHelpToOtherService = function (req, res) {
    Emergency.findById(req.params.emergencyId).populate({
        path: 'events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id',
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'events'
        },
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'lastEvent'
        }
    }).exec(function (err, emergency) {
        if (err) return errors.bdError(res, err);
        if (!emergency) return errors.objectNotFoundError(res, 'Emergencia');

        if (req.user.actorType_id == req.body.actorType_id) return res.status(400).send({
            errors: [{
                error: "Tipo de actor emisor es el mismo que el receptor!"
            }]
        });

        if (emergency.actorType_id == req.body.actorType_id) return res.status(400).send({
            errors: [{
                error: "Tipo de actor es el creador de la emergencia"
            }]
        });

        if (emergency.othersActorsTypesRequest_id.indexOf(req.body.actorType_id) != -1) {
            return res.status(400).send({
                errors: [{
                    error: "Tipo de actor ya solicitado en esta emergencia"
                }]
            });
        }
        

        EventType.findOne({
            name: 'pedir ayuda a otro servicio'
        }).exec(function (err, event) {
            if (err) return errors.bdError(res, err);
            if (!event) return errors.objectNotFoundError(res, 'Evento');

            var emergencyEvent = new EmergencyEvent({
                emergency_id: emergency._id,
                eventType_id: event._id,
                by_actorType_id: req.user.actorType_id,
                to_actorType_id: req.body.actorType_id,
                description: req.body.description,
                user: req.user.name + " " + req.user.lastName
            });

            emergencyEvent.save(function (err, savedEmergencyEvent) {
                if (err) {
                    return errors.bdSave(res, err);
                }
                emergency.events.push(savedEmergencyEvent._id);
                emergency.othersActorsTypesRequest_id.push(req.body.actorType_id);
                emergency.lastEvent = savedEmergencyEvent._id;
                emergency.save(function (err, savedEmergencyEvent) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    global.io.emit('askforhelp', {to: req.body.actorType_id, from: emergencyEvent.user});
                    return res.status(201).send(savedEmergencyEvent);
                });
            });
        });
    });
}

/**
 * Se llego a emergencia
 */
exports.notifyArrived = function (req, res) {
    console.log(req.body);
    Emergency.findById(req.params.emergencyId).populate({
        path: 'events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id',
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'events'
        },
        populate: {
            path: 'eventType_id by_actorType_id to_actorType_id',
            populate: 'lastEvent'
        }
    }).exec(function (err, emergency) {
        if (err) return errors.bdError(res, err);
        if (!emergency) return errors.objectNotFoundError(res, 'Emergencia');

        if (emergency.actorType_id._id != req.user.actorType_id+"") {
            if (emergency.othersActorsTypesConfirm_id.indexOf(req.user.actorType_id) == -1) {
                return res.status(400).send({
                    errors: [{
                        error: "Tipo de actor no esta asociado a esta emergencia"
                    }]
                });
            }
        }

        if(emergency.arrivedAppUsers_id.indexOf(req.user._id) != -1){
            return res.status(400).send({
                errors: [{
                    error: "Usuario ya confirmo su llegada"
                }]
            });
        }

        if(req.body.lat){
            if (!emergency.location.date) {
                emergency.location.lat = req.body.lat;
                emergency.location.lng = req.body.lng;
                emergency.location.date = new Date();
            } 
        }

        EventType.findOne({
            name: 'se llego al lugar'
        }).exec(function (err, event) {
            if (err) return errors.bdError(res, err);
            if (!event) return errors.objectNotFoundError(res, 'Evento');

            var emergencyEvent = new EmergencyEvent({
                emergency_id: emergency._id,
                eventType_id: event._id,
                by_actorType_id: req.user.actorType_id,
                user: req.user.name + " " + req.user.lastName
            });

            emergencyEvent.save(function (err, savedEmergencyEvent) {
                if (err) {
                    return errors.bdSave(res, err);
                }
                emergency.events.push(savedEmergencyEvent._id);
                emergency.arrivedAppUsers_id.push(req.user._id);
                emergency.lastEvent = savedEmergencyEvent._id;
                emergency.save(function (err, savedEmergencyEvent) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    return res.status(200).send(savedEmergencyEvent);
                });
            });
        });
    });
}