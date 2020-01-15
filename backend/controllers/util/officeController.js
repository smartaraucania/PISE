/**
 * Actors Type REST Controller
 */

var mongoose = require('mongoose'),
    ActorType = mongoose.model('ActorType'),
    Office = mongoose.model('Office'),
    Commune = mongoose.model('Commune'),
    Region = mongoose.model('Region'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');

/**
 * Get all offices by a actor type
 */
exports.getOfficesByOneActorType = function (req, res) {
    ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);
        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');
        if (req.query.region) {
            Office.find({
                $and: [{
                    actorType_id: actorType._id
                }, {
                    region_id: req.query.region
                }]
            }).populate('region_id region_id.country_id commune_id').exec(function (err, offices) {
                if (err) return errors.bdError(res, err);
                return res.status(200).send({
                    response: offices,
                    total: offices.length
                });
            });
        } else if (req.query.commune) {
            Office.find({
                $and: [{
                    actorType_id: actorType._id
                }, {
                    commune_id: req.query.commune
                }]
            }).populate('region_id region_id.country_id commune_id').exec(function (err, offices) {
                if (err) return errors.bdError(res, err);
                return res.status(200).send({
                    response: offices,
                    total: offices.length
                });
            });
        } else {
            Office.find({
                actorType_id: actorType._id
            }).populate('region_id region_id.country_id commune_id').exec(function (err, offices) {
                if (err) return errors.bdError(res, err);
                return res.status(200).send({
                    response: offices,
                    total: offices.length
                });
            });
        }
    });
}

/**
 * Get all offices in a region and commune (or not)
 */
exports.getOfficesInRegionAndCommune = function (req, res) {
    if (!req.query.region && !req.query.commune) {
        return errors.syntaxBodyError(res);
    }
    if (req.query.region && req.query.commune) {
        Office.find({
            $and: [{
                commune_id: req.query.commune
            }, {
                region_id: req.query.region
            }]

        }).populate('region_id region_id.country_id commune_id').exec(function (err, offices) {
            if (err) return errors.bdError(res, err);
            return res.status(200).send({
                response: offices,
                total: offices.length
            });
        });
    } else if (req.query.region) {
        Office.find({
            region_id: req.query.region
        }).populate('region_id region_id.country_id commune_id').exec(function (err, offices) {
            if (err) return errors.bdError(res, err);
            return res.status(200).send({
                response: offices,
                total: offices.length
            });
        });
    } else if (req.query.commune) {
        Office.find({
            commune_id: req.query.commune
        }).populate('region_id region_id.country_id commune_id').exec(function (err, offices) {
            if (err) return errors.bdError(res, err);
            return res.status(200).send({
                response: offices,
                total: offices.length
            });
        });
    }


}

/**
 * Add a office to a actor type
 */
exports.addOfficeToActorType = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddOffice(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    ActorType.findById(req.params.actorTypeId).exec(function (err, actorType) {
        if (err) return errors.bdError(res, err);
        if (!actorType) return errors.objectNotFoundError(res, 'Tipo de Actor');

        Region.findById(req.body.region_id).exec(function (err, region) {
            if (err) return errors.bdError(res, err);
            if (!region) return errors.objectNotFoundError(res, 'Región');

            if (req.body.commune_id) {
                Commune.findById(req.body.commune_id).exec(function (err, commune) {
                    if (err) return errors.bdError(res, err);
                    if (!commune) return errors.objectNotFoundError(res, 'Comuna');

                    var office = new Office({
                        name: req.body.name,
                        region_id: req.body.region_id,
                        commune_id: req.body.commune_id,
                        actorType_id: req.params.actorTypeId
                    });

                    office.save(function (err, savedOffice) {
                        if (err) {
                            return errors.bdSave(res, err);
                        }
                        return res.status(201).send(savedOffice);
                    });
                });
            } else {
                var office = new Office({
                    name: req.body.name,
                    region_id: req.body.region_id,
                    actorType_id: req.params.actorTypeId
                });

                office.save(function (err, savedOffice) {
                    if (err) {
                        return errors.bdSave(res, err);
                    }
                    return res.status(201).send(savedOffice);
                });
            }
        });
    });
}

/**
 * Edit a Office
 */
exports.editOffice = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddOffice(req);
    if (bodyErrors.length > 0) return res.status(400).send({
        errors: bodyErrors
    });

    Office.findById(req.params.officeId).exec(function (err, office) {
        if (err) return errors.bdError(res, err);

        if (!office) return errors.objectNotFoundError(res, 'Oficina');

        office.name = req.body.name;
        office.commune_id = req.body.commune_id;

        office.save(function (err, savedOffice) {
            if (err) {
                return errors.bdSave(res, err);
            }
            return res.status(200).send(savedOffice);
        });
    });
}