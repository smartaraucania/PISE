/**
 * Emergency Type REST Controller
 */

var mongoose = require('mongoose'),
    ActorType = mongoose.model('ActorType'),
    EmergencyType = mongoose.model('EmergencyType'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');

/**
 * Get all Actor Types in a Actors Group
 */
exports.getEmergencyTypeByActorsType = function (req, res) {
    ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);
        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

        EmergencyType.find({
            actorType_id: actorType._id
        }).populate('actorType_id').exec(function (err, emergencyTypes) {
            if (err) return errors.bdError(res, err);
            return res.status(200).send({
                response: emergencyTypes,
                total: emergencyTypes.length
            });
        });
    });
}

/**
 * Add a EmergencyType to an ActorType
 */
exports.addEmergencyTypeToActorType = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddEmergencyType(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    if (!req.user.isAdmin && req.body.actorType_id != req.user.actorType_id) return errors.noPermissionsError(res);

    ActorType.findById(req.body.actorType_id).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);
        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

        var emergencyType = new EmergencyType({
            name: req.body.name,
            description: req.body.description,
            actorType_id: req.body.actorType_id
        });

        emergencyType.save(function (err, savedEmergencyType) {
            if (err) {
                return errors.bdSave(res, err);
            }
            
            return res.status(201).send(savedEmergencyType);
        });
    });
}

/**
 * Edit a EmergencyType
 */
exports.editEmergencyType = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddEmergencyType(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    EmergencyType.findById(req.params.emergencyTypeId).exec(function (err, emergencyType) {
        if (err) return errors.bdError(res, err);
        if (!emergencyType) return errors.objectNotFoundError(res, 'Tipo de Evento');

        if (!req.user.isAdmin && emergencyType.actorType_id != req.user.actorType_id) return errors.noPermissionsError(res);

        emergencyType.name = req.body.name;
        emergencyType.description = req.body.description;

        emergencyType.save(function (err, savedEmergencyType) {
            if (err) {
                return errors.bdSave(res, err);
            }
            return res.status(200).send(savedEmergencyType);
        });
    });
}