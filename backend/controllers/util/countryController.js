/**
 * Country REST Controller
 */

var mongoose = require('mongoose'),
    Country = mongoose.model('Country'),
    validations = require('../../util/validations'),
    errors = require('../../util/errors');

/**
 * Get all countries
 */
exports.getCountries = function (req, res) {
    Country.find().exec(function (err, countries) {
        if (err) return errors.bdError(res, err);

        return res.status(200).send({
            response: countries,
            total: countries.length
        });
    });
}

/**
 * Add Country
 */
exports.addCountry = function (req, res) {
    //Check Body
    let bodyErrors = validations.checkBodyName(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    var country = new Country({
        name: req.body.name,
    });

    country.save(function (err, savedCountry) {
        if (err) {
            return errors.bdSave(res, err); 
        
        }
        return res.status(201).send(savedCountry);
    });
}

/**
 * Edit Country
 */
exports.editCountry = function (req, res) {
    //Checkear el body
    let bodyErrors = validations.checkBodyName(req);
    if (bodyErrors.length > 0) return res.status(400).send({errors: bodyErrors});

    Country.findById(req.params.countryId).exec(function (err, country) {
        if (err) return errors.bdError(res, err);
        if (!country) return errors.objectNotFoundError(res, 'País');

        country.name = req.body.name;
    
        country.save(function (err, savedCountry) {
            if (err) {
                return errors.bdSave(res, err); 
            }
            return res.status(200).send(savedCountry);
        });
    });  
}