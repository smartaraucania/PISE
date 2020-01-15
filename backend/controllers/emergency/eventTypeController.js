/**
 * Event Type REST Controller
 */

var mongoose = require('mongoose'),
    ActorType = mongoose.model('ActorType'),
    EventType = mongoose.model('EventType'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');


/**
 * Get all EventTypes public
 */
exports.getEventTypePublic = function (req, res) {
    EventType.find({
        isPublic: true
    }).populate('actorType_id').exec(function (err, eventTypes) {
        if (err) return errors.bdError(res, err);
        return res.status(200).send({
            response: eventTypes,
            total: eventTypes.length
        });
    });
}

/**
 * Get all EventTypes in a Actors Type
 */
exports.getEventTypeByActorsType = function (req, res) {
    var isPublic = false;
    if (req.query.public != null) {
        isPublic = req.query.public == "true" ? true : false;
    } else {
        isPublic = false;
    }
    if (isPublic) {
        ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
            if (err) return errors.bdError(res, err);
            if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

            EventType.find({
                $and: [{
                    $or: [{
                        actorType_id: actorType._id
                    }, {
                        isPublic: isPublic
                    }]
                }, {
                    selectable: true
                }]
            }).populate('actorType_id').exec(function (err, eventTypes) {
                if (err) return errors.bdError(res, err);
                return res.status(200).send({
                    response: eventTypes,
                    total: eventTypes.length
                });
            });
        });
    } else {
        ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
            if (err) return errors.bdError(res, err);
            if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

            EventType.find({
                $and: [{
                    actorType_id: actorType._id
                }, {
                    selectable: true
                }]
            }).populate('actorType_id').exec(function (err, eventTypes) {
                if (err) return errors.bdError(res, err);
                return res.status(200).send({
                    response: eventTypes,
                    total: eventTypes.length
                });
            });
        });
    }
}

/**
 * Add a Public EventType
 */
exports.addPublicEventType = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddEventType(req, true);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    if (!req.user.isAdmin) return errors.noPermissionsError(res);

    var eventType = new EventType({
        name: req.body.name,
        description: req.body.description,
        isPublic: true,
        selectable: req.body.selectable
    });

    eventType.save(function (err, savedEventType) {
        if (err) {
            return errors.bdSave(res, err);
        }

        return res.status(201).send(savedEventType);
    });
}

/**
 * Add a EventType to an ActorType
 */
exports.addEventTypeToActorType = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddEventType(req, false);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    if (!req.user.isAdmin && req.body.actorTypeId != req.user.actorType_id) return errors.noPermissionsError(res);

    ActorType.findById(req.body.actorTypeId).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);
        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

        var eventType = new EventType({
            name: req.body.name,
            description: req.body.description,
            actorType_id: req.body.actorTypeId,
        });

        eventType.save(function (err, savedEventType) {
            if (err) {
                return errors.bdSave(res, err);
            }

            return res.status(201).send(savedEventType);
        });
    });
}

/**
 * Edit a Public Event Type
 */
exports.editPublicEventType = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddEventType(req, false);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    EventType.findById(req.params.eventTypeId).exec(function (err, eventType) {
        if (err) return errors.bdError(res, err);
        if (!eventType) return errors.objectNotFoundError(res, 'Tipo de Evento');

        if (!req.user.isAdmin) return errors.noPermissionsError(res);

        eventType.name = req.body.name;
        eventType.description = req.body.description;

        eventType.save(function (err, savedEventType) {
            if (err) {
                return errors.bdSave(res, err);
            }
            return res.status(200).send(savedEventType);
        });
    });
}

/**
 * Edit a Event Type
 */
exports.editEventType = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddEventType(req, false);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    EventType.findById(req.params.eventTypeId).exec(function (err, eventType) {
        if (err) return errors.bdError(res, err);
        if (!eventType) return errors.objectNotFoundError(res, 'Tipo de Evento');

        if (!req.user.isAdmin && eventType.actorType_id != req.user.actorType_id) return errors.noPermissionsError(res);

        eventType.name = req.body.name;
        eventType.description = req.body.description;

        eventType.save(function (err, savedEventType) {
            if (err) {
                return errors.bdSave(res, err);
            }
            return res.status(200).send(savedEventType);
        });
    });
}