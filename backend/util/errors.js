var constants = require('./constants');

module.exports = {
    bdError: function (res, err) {
        if (constants.env == "development") {
            return res.status(500).send({
                errors: [{
                    error: "Ha ocurrido un problema al procesar esta solicitud. ERROR: " + err
                }]
            });
        }
        return res.status(500).send({
            errors: [{
                error: "Ha ocurrido un problema al procesar esta solicitud"
            }]
        });
    },

    bdSave: function (res, err) {
        if (err.code == 11000) {
            var field = err.message.split("index:")[1];
            field = field.split(" dup key")[0];
            field = field.substring(0, field.lastIndexOf("_"));
            return res.status(500).send({
                errors: [{
                    error: "Ha ocurrido un problema, el campo"+field+" ya existe"
                }]
            });
        }
        return this.bdError(res, err);
    },

    syntaxBodyError: function (res) {
        return res.status(400).send({
            errors: [{
                error: "Tu petición tiene un error de sintaxis o esta vacía"
            }]
        });
    },

    noPermissionsError: function (res) {
        return res.status(403).send({
            errors: [{
                error: "No tiene los permisos necesarios"
            }]
        });
    },

    objectNotFoundError: function (res, objectDescription) {
        return res.status(404).send({
            errors: [{
                error: "No existe " + objectDescription + " con esa ID"
            }]
        });
    },

    arrayNotFoundError: function (res, objectDescription) {
        return res.status(404).send({
            errors: [{
                error: "No existen " + objectDescription
            }]
        });
    },

    passwordNotMatch: function (res) {
        return res.status(403).send({
            errors: [{
                error: "La contraseña no corresponde"
            }]
        });
    },

    loginCodeNotMatch: function (res) {
        return res.status(403).send({
            errors: [{
                error: "El código no corresponde"
            }]
        });
    },

    tokenError: function (res) {
        return res.status(403).send({
            errors: [{
                error: "Error de autenticación"
            }]
        });
    },

    userChangeError: function (res) {
        return res.status(403).send({
            errors: [{
                error: "El administrador ha realizado cambios en tu usuario. Por favor ingresa nuevamente."
            }]
        });
    }

}