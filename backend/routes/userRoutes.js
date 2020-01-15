/**
 * User Routes
 */

var express = require('express'),
    userRoutes = express.Router(),
    //Controllers
    appUserController = require('../controllers/user/appUserController'),
    webUserController = require('../controllers/user/webUserController'),
    multer = require('multer');

userRoutes
    //WebUser
    .get('/webusers', webUserController.getWebUsersSameOffice)
    .get('/webusers/:actorTypeId', webUserController.getWebUsersPerActorType)
    .post('/webuser', webUserController.addWebUser)
    .put('/webuser/:webUserId', webUserController.editWebUser)
    .get('/webuser/:webUserId/enable', webUserController.editWebUser)
    .get('/webuser/:webUserId/disable', webUserController.disableWebUser)
    //AppUser
    .get('/appusers', appUserController.getAppUsersSameOffice)
    .get('/appusers/:actorTypeId', appUserController.getAppUsersPerActorType)
    .post('/appuser', appUserController.addAppUser)
    .put('/appuser/:appUserId', multer({ dest:'temp/', limits: { fieldSize: 8*1024*1024}}).single('photo'), appUserController.editAppUser)
    .get('/appuser/:appUserId/enable', appUserController.enableAppUser)
    .get('/appuser/:appUserId/disable', appUserController.disableAppUser);

module.exports = userRoutes;