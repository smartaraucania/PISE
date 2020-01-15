/**
 * Emergency Routes
 */

var express = require('express'),
    emergencyRoutes = express.Router(),
    middlewares = require('../middlewares/index')
    //Controllers
    emergencyEventController = require('../controllers/emergency/emergencyEventController'),
    emergencyController = require('../controllers/emergency/emergencyController'),
    multer = require('multer');

    emergencyRoutes
    //EmergencyEvent
    .get('/events', emergencyEventController.getEmergencyEventsByActorsType)
    .get('/emergency/:emergencyId/events', emergencyEventController.getEmergencyEventsByEmergency)
    .post('/emergency/:emergencyId/event', emergencyEventController.addEmergencyEventToEmergency)
    //Emergency
    .get('/emergencies', emergencyController.getAllEmergenciesByUserLogged)
    .get('/emergencies/actives', emergencyController.getCantActiveEmergencies)
    .get('/emergencies/month', emergencyController.getCantEmergenciesInCurrentMonth)
    .get('/emergencies/byactor', middlewares.isGovernment, emergencyController.getAllEmergenciesByActorType)
    .post('/emergency', emergencyController.addEmergency)
    .get('/emergency/:emergencyId', emergencyController.getEmergency)
    .put('/emergency/:emergencyId', emergencyController.editEmergency)
    //StaticEvents
    .put('/emergencies/:emergencyId/initialreport', multer({ dest:'temp/', limits: { fieldSize: 8*1024*1024}}).single('photo'), emergencyController.editInitialReport)
    .post('/emergencies/:emergencyId/arrived', emergencyEventController.notifyArrived)
    .get('/emergencies/:emergencyId/finalized', emergencyEventController.setEmergencyFinalized)
    .post('/emergencies/:emergencyId/askforhelp', emergencyEventController.askForHelpToOtherService)
    .get('/emergencies/:emergencyId/roadto', emergencyEventController.notifyRoadToEmergency);

module.exports = emergencyRoutes;