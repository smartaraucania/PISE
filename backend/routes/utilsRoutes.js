/**
 * Utils Routes
 */

var express = require('express'),
    utilsRouter = express.Router(),
    //Controllers
    countryController = require('../controllers/util/countryController'),
    regionController = require('../controllers/util/regionController'),
    communeController = require('../controllers/util/communeController'),
    actorsGroupTypeController = require('../controllers/util/actorsGroupTypeController'),
    actorTypeController = require('../controllers/util/actorTypeController'),
    officeController = require('../controllers/util/officeController'),
    emergencyTypeController = require('../controllers/emergency/emergencyTypeController'),
    eventTypeController = require('../controllers/emergency/eventTypeController'),
    middlewares = require('../middlewares');
    
    utilsRouter
    //Country
    .get('/countries', countryController.getCountries)
    //Region
    .get('/country/:countryId/regions', regionController.getRegionsInCountry)   
    //Commune
    .get('/region/:regionId/communes', communeController.getCommunesInRegion)   
    //ActorsGroupType
    .get('/actorsgroups', actorsGroupTypeController.getActorsGroups)   
    //ActorType
    .get('/actorsgroups/:actorsGroupId/actorTypes', actorTypeController.getActorTypesByActorsGroup)   
    //Office
    .get('/actortype/:actorTypeId/offices', officeController.getOfficesByOneActorType)   
    .get('/offices', officeController.getOfficesInRegionAndCommune)
    .post('/actortype/:actorTypeId/office', middlewares.isSuperUser, officeController.addOfficeToActorType)
    .put('/actortype/:actorTypeId/office/:officeId', middlewares.isSuperUser, officeController.editOffice)
    //EmergencyType
    .get('/emergencytypes/:actorTypeId', emergencyTypeController.getEmergencyTypeByActorsType)   
    .post('/emergencytype', middlewares.isSuperUser, emergencyTypeController.addEmergencyTypeToActorType)
    .put('/emergencytype/:emergencyTypeId', middlewares.isSuperUser, emergencyTypeController.editEmergencyType)
    //EventType
    .get('/actortype/:actorTypeId/eventstype', eventTypeController.getEventTypeByActorsType)
    .post('/eventtype', middlewares.isSuperUser, eventTypeController.addEventTypeToActorType)
    .put('/eventtype/:eventTypeId', middlewares.isSuperUser, eventTypeController.editEventType);

module.exports = utilsRouter;