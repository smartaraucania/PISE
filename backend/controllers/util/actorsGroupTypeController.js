/**
 * Actors Group REST Controller
 */

var mongoose = require('mongoose'),
    ActorsGroupType = mongoose.model('ActorsGroupType'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');

/**
 * Get all Actors Group
 */
exports.getActorsGroups = function (req, res) {
    ActorsGroupType.find().populate('actorTypes').exec(function (err, actorsGroups) {
        if (err) return errors.bdError(res, err);

        return res.status(200).send({
            response: actorsGroups,
            total: actorsGroups.length
        });
    });
}

/**
 * Add a Actors Group
 */
exports.addActorsGroup = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddActorsGroup(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    var actorsGroup = new ActorsGroupType({
        groupName: req.body.groupName,
        description: req.body.description,
        logoURL: req.body.logoURL,
    });

    actorsGroup.save(function (err, savedActorsGroup) {
        if (err) {
            return errors.bdSave(res, err);
        }
        return res.status(201).send(savedActorsGroup);
    });
}

/**
 * Edit a Actors Group
 */
exports.editActorsGroup = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddActorsGroup(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    ActorsGroupType.findById(req.params.actorsGroupId).exec(function (err, actorsGroup) {
        if (err) return errors.bdError(res, err);

        if(!actorsGroup) return errors.objectNotFoundError(res, 'Grupo de Actores');

        actorsGroup.groupName = req.body.groupName;
        actorsGroup.description = req.body.description;
        actorsGroup.logoURL = req.body.logoURL;
    
        actorsGroup.save(function (err, savedActorsGroup) {
            if (err) {
                return errors.bdSave(res, err);
            }
            return res.status(200).send(savedActorsGroup);
        });
    });
}