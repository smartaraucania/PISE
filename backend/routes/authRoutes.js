/**
 * Auth Routes
 */

var express = require('express'),
    authRouter = express.Router(),
    //Controllers
    authController = require('../controllers/authController'),
    middlewares = require('../middlewares');

authRouter
    //Login
    .post('/webuser', authController.loginWebUser)
    .post('/appuser', authController.loginAppUser)
    //Confirm Login
    .post('/webuser/confirm', middlewares.preLoginToken, authController.confirmLoginWebUser)
    .post('/appuser/confirm', middlewares.preLoginToken, authController.confirmLoginAppUser)
    //Forgot
    .post('/webuser/forgot', authController.forgotPasswordWebUser)
    .post('/appuser/forgot', authController.forgotPasswordAppUser)
    //Confirm Change Password
    .post('/webuser/forgot/new', middlewares.preLoginToken, authController.confirmChangePasswordWebUser)
    .post('/appuser/forgot/new', middlewares.preLoginToken, authController.confirmChangePasswordAppUser)
    //Logout
    .post('/webuser/logout', middlewares.isAuth, authController.logoutWebUser)
    .post('/appuser/logout', middlewares.isAuth, authController.logoutAppUser)
    .get('/me', middlewares.isAuth, middlewares.getMe);

module.exports = authRouter;