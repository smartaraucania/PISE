/**
 * Commune REST Controller
 */

var mongoose = require('mongoose'),
    Commune = mongoose.model('Commune'),
    Region = mongoose.model('Region'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');

/**
 * Get all communes in a region
 */
exports.getCommunesInRegion = function (req, res) {
    Region.findById(req.params.regionId).exec(function(err, region){
        if (err) return errors.bdError(res, err);
        if (!region) return errors.objectNotFoundError(res, 'Región');

        Commune.find({region_id: req.params.regionId}).exec(function (err, communes) {
            if (err) return errors.bdError(res, err);
    
            return res.status(200).send({
                response: communes,
                total: communes.length
            });
        }); 
    });
}

/**
 * Add Commune to a region
 */
exports.addCommuneToRegion= function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddRegion(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    Region.findById(req.params.regionId).exec(function(err, region){
        if (err) return errors.bdError(res, err);
        if (!region) return errors.objectNotFoundError(res, 'Región');

        var commune = new Commune({
            extra: req.body.extra,
            name: req.body.name,
            region_id: region._id
        });
    
        commune.save(function (err, savedCommune) {
            if (err) {
                return errors.bdSave(res, err); 
            }
            return res.status(201).send(savedCommune);
        });
    });  
}

/**
 * Edit Commune
 */
exports.editCommune = function (req, res) {
    //Checkear el body
    let bodyErrors = validations.checkBodyAddRegion(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    Commune.findById(req.params.communeId).exec(function (err, commune) {
        if (err) return errors.bdError(res, err);
        if (!commune) return errors.objectNotFoundError(res, 'Comuna');

        commune.name = req.body.name;
        commune.extra = req.body.extra;

        commune.save(function (err, savedCommune) {
            if (err) {
                return errors.bdSave(res, err); 
            }
            return res.status(200).send(savedCommune);
        });
    });
}