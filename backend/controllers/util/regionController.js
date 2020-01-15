/**
 * Region REST Controller
 */

var mongoose = require('mongoose'),
    Region = mongoose.model('Region'),
    Country = mongoose.model('Country'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');

/**
 * Get all regions in a country
 */
exports.getRegionsInCountry = function (req, res) {
    Country.findById(req.params.countryId).exec(function(err, country){
        if (err) return errors.bdError(res, err);
        if (!country) return errors.objectNotFoundError(res, 'País');

        Region.find({country_id: req.params.countryId}).exec(function (err, regions) {
            if (err) return errors.bdError(res, err);
    
            return res.status(200).send({
                response: regions,
                total: regions.length
            });
        }); 
    });
}

/**
 * Add Region to a country
 */
exports.addRegionToCountry = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyAddRegion(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    Country.findById(req.params.countryId).exec(function(err, country){
        if (err) return errors.bdError(res, err);
        if (!country) return errors.objectNotFoundError(res, 'País');

        var region = new Region({
            extra: req.body.extra,
            name: req.body.name,
            country_id: country._id
        });
    
        region.save(function (err, savedRegion) {
            if (err) {
                return errors.bdSave(res, err); 
            
            }
            return res.status(201).send(savedRegion);
        });
    });  
}

/**
 * Edit Region
 */
exports.editRegion = function (req, res) {
    //Checkear el body
    let bodyErrors = validations.checkBodyAddRegion(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    Region.findById(req.params.regionId).exec(function (err, region) {
        if (err) return errors.bdError(res, err);
        if (!region) return errors.objectNotFoundError(res, 'Región');

        region.name = req.body.name;
        region.extra = req.body.extra;

        region.save(function (err, savedRegion) {
            if (err) {
                return errors.bdSave(res, err); 
            }
            return res.status(200).send(savedRegion);
        });
    });
}