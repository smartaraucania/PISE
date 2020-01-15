/**
 * Admin Routes
 */

var express = require('express'),
    adminRouter = express.Router(),
    //Controllers
    countryController = require('../controllers/util/countryController'),
    regionController = require('../controllers/util/regionController'),
    communeController = require('../controllers/util/communeController'),
    actorsGroupTypeController = require('../controllers/util/actorsGroupTypeController'),
    actorTypeController = require('../controllers/util/actorTypeController'),
    eventTypeController = require('../controllers/emergency/eventTypeController'),
    appUserController = require('../controllers/user/appUserController'),
    webUserController = require('../controllers/user/webUserController'),
    multer = require('multer');

    adminRouter
    //Country
    .post('/country', countryController.addCountry)
    .put('/country/:countryId',countryController.editCountry)
    //Region
    .post('/country/:countryId/region', regionController.addRegionToCountry)
    .put('/region/:regionId', regionController.editRegion)
    //Commune
    .post('/region/:regionId/commune', communeController.addCommuneToRegion)
    .put('/commune/:communeId',communeController.editCommune)
    //ActorsGroupType
    .post('/actorsgroup', actorsGroupTypeController.addActorsGroup)
    .put('/actorsgroup/:actorsGroupId', actorsGroupTypeController.editActorsGroup)
    //ActorType
    .post('/actorsgroups/:actorsGroupId/actorType', actorTypeController.addActorTypeToActorsGroup)
    .put('/actortype/:actorTypeId', multer({ dest:'temp/', limits: { fieldSize: 8*1024*1024}}).single('logo'), actorTypeController.editActorType)
    //EventType
    .get('/eventtype/public', eventTypeController.getEventTypePublic)
    .post('/eventtype', eventTypeController.addPublicEventType)
    .put('/eventtype/:eventTypeId', eventTypeController.editPublicEventType)
    //WebUser
    .get('/webusers', webUserController.getAllWebUsers)
    //AppUser
    .get('/appusers', appUserController.getAllAppUsers);

module.exports = adminRouter;