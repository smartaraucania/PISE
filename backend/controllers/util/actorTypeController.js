/**
 * Actors Type REST Controller
 */

var mongoose = require('mongoose'),
    ActorType = mongoose.model('ActorType'),
    ActorsGroupType = mongoose.model('ActorsGroupType'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors'),
    uploadFile = require('../../util/fileUpload');

/**
 * Get all Actor Types in a Actors Group
 */
exports.getActorTypesByActorsGroup = function (req, res) {
    ActorsGroupType.findById(req.params.actorsGroupId).exec(function (err, actorsGroup) {
        if (err) return errors.bdError(res, err);
        if (!actorsGroup) return errors.objectNotFoundError(res, 'Grupo de Actores');

        ActorType.find({
            _id: actorsGroup.actorTypes
        }).exec(function (err, actorTypes) {
            if (err) return errors.bdError(res, err);
            return res.status(200).send({
                response: actorTypes,
                total: actorTypes.length
            });
        });
    });
}

/**
 * Add a Actor Type to an Actor group
 */
exports.addActorTypeToActorsGroup = function (req, res) {
    //Check Body
    ActorsGroupType.findById(req.params.actorsGroupId).exec(function (err, actorsGroup) {
        if (err) return errors.bdError(res, err);
        if (!actorsGroup) return errors.objectNotFoundError(res, 'Grupo de Actores');

        const uploadLogo = uploadFile.single('logo');
        uploadLogo(req, res, function (err) {
            if (err) {
                return res.status(422).send({
                    errors: [{
                        error: err.message
                    }]
                });
            }

            let bodyErrors = validations.checkBodyAddActorType(req);
            if (bodyErrors.length > 0) return res.status(400).send({
                errors: bodyErrors
            });

            var actorType = new ActorType({
                name: req.body.name,
                logoURL: req.file ? req.file.url : null,
            });

            actorType.save(function (err, savedActorType) {
                if (err) {
                    return errors.bdSave(res, err);
                }
                actorsGroup.actorTypes.push(savedActorType._id);
                actorsGroup.save(function (err, savedActorsGroup) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    return res.status(201).send(savedActorType);
                });
            });
        });
    });
}

/**
 * Edit a Actor Type
 */
exports.editActorType = function (req, res) {
    ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);

        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

        let bodyErrors = validations.checkBodyAddActorType(req);
        if (bodyErrors.length > 0) return res.status(400).send({
            errors: bodyErrors
        });

        if(req.file){
            uploadFile.upload(req, res).then(function(url){

                actorType.name = req.body.name;
                actorType.logoURL = url;

                actorType.save(function (err, savedActorType) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    return res.status(200).send(savedActorType);
                });
            })
            .catch(function(err){
                return res.status(500).send({
                    errors: [{
                        "error": "Error al subir el logo"
                    }]
                }); 
            })
        } else {
            actorType.name = req.body.name;

            actorType.save(function (err, savedActorType) {
                if (err) {
                    return errors.bdSave(res, err);
                }
                return res.status(200).send(savedActorType);
            });
        }  
    });
}