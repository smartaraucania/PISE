/**
 * Clase Validaciones de body-params-query
 */
var validator = require('validator');

module.exports = {
    //Name
    checkBodyName: function (req) {
        let error = [];
        if (req.body.name == null || req.body.name == "") error.push({
            "error": "Falta el nombre"
        });
        return error;
    },
    //Region
    checkBodyAddRegion: function (req) {
        let error = [];
        if (req.body.name == null || req.body.name == "") error.push({
            "error": "Falta el nombre"
        });
        if (req.body.name != null) {
            if (typeof req.body.name != "string")
                error.push({
                    "error": "El atributo name debe ser TEXTO"
                });
        }
        if (req.body.extra != null) {
            if (typeof req.body.extra != "string")
                error.push({
                    "error": "El atributo extra debe ser TEXTO"
                });
        }
        return error;
    },
    //ActorsGroup
    checkBodyAddActorsGroup: function (req) {
        let error = [];
        if (req.body.groupName == null || req.body.groupName == "") error.push({
            "error": "Falta el nombre del grupo"
        });
        if (req.body.groupName != null) {
            if (typeof req.body.groupName != "string")
                error.push({
                    "error": "El atributo groupName debe ser TEXTO"
                });
        }
        if (req.body.description != null) {
            if (typeof req.body.description != "string")
                error.push({
                    "error": "El atributo description debe ser TEXTO"
                });
        }
        if (req.body.logoURL != null) {
            if (typeof req.body.logoURL != "string")
                error.push({
                    "error": "El atributo logoURL debe ser TEXTO"
                });
        }
        return error;
    },
    //ActorType
    checkBodyAddActorType: function (req) {
        let error = [];
        if (req.body.name == null || req.body.name == "" || req.body.name == 'null') error.push({
            "error": "Falta el nombre"
        });
        if (req.body.name != null) {
            if (typeof req.body.name != "string")
                error.push({
                    "error": "El atributo name debe ser TEXTO"
                });
        }
        return error;
    },
    //Office
    checkBodyAddOffice: function (req) {
        let error = [];
        if (req.body.name == null || req.body.name == "") error.push({
            "error": "Falta el nombre"
        });
        if (req.body.region_id == null || req.body.region_id == "") error.push({
            "error": "Falta el ID de la Región"
        });
        if (req.body.name != null) {
            if (typeof req.body.name != "string")
                error.push({
                    "error": "El atributo name debe ser TEXTO"
                });
        }
        if (req.body.region_id != null) {
            if (typeof req.body.region_id != "string")
                error.push({
                    "error": "El atributo region_id debe ser TEXTO"
                });
        }
        return error;
    },
    //WebUser
    checkBodyAddWebUser: function (req, creating) {
        let error = [];
        //Name
        if (req.body.name == null || req.body.name == "") {
            error.push({
                "error": "Falta el nombre"
            });
        } else {
            if (typeof req.body.name != "string")
                error.push({
                    "error": "El atributo name debe ser TEXTO"
                });
        }
        //lastName
        if (req.body.lastName == null || req.body.lastName == "") {
            error.push({
                "error": "Falta el lastName"
            });
        } else {
            if (typeof req.body.lastName != "string")
                error.push({
                    "error": "El atributo lastName debe ser TEXTO"
                });
        }
        //Email
        if (req.body.email == null || req.body.email == "") {
            error.push({
                "error": "Falta el email"
            });
        } else {
            if (!validator.isEmail(req.body.email + "") || typeof req.body.email != "string") {
                error.push({
                    "error": "El email no es válido"
                });
            }
        }
        //actorType_id
        if (req.user.isAdmin) {
            if (req.body.actorType_id == null || req.body.actorType_id == "") {
                error.push({
                    "error": "Falta el actorType_id"
                });
            } else {
                if (typeof req.body.actorType_id != "string") {
                    error.push({
                        "error": "El actorType_id no es válido"
                    });
                }
            }
        }
        return error;
    },

    checkBodyAddEventType: function (req, isPublic) {
        let error = [];
        //Name
        if (req.body.name == null || req.body.name == "") {
            error.push({
                "error": "Falta el nombre"
            });
        } else {
            if (typeof req.body.name != "string")
                error.push({
                    "error": "El atributo name debe ser TEXTO"
                });
        }
        //description
        if (req.body.description != null && req.body.description != "") {
            if (typeof req.body.description != "string")
                error.push({
                    "error": "El atributo description debe ser TEXTO"
                });
        }
        if (!isPublic) {
            //actorType_id
            if (req.body.actorTypeId == null || req.body.actorTypeId == "") {
                error.push({
                    "error": "Falta el actorTypeId"
                });
            } else {
                if (typeof req.body.actorTypeId != "string")
                    error.push({
                        "error": "El atributo actorTypeId debe ser TEXTO"
                    });
            }
        }
        return error;
    },

    checkBodyAddEmergencyType: function (req) {
        let error = [];
        //Name
        if (req.body.name == null || req.body.name == "") {
            error.push({
                "error": "Falta el nombre"
            });
        } else {
            if (typeof req.body.name != "string")
                error.push({
                    "error": "El atributo name debe ser TEXTO"
                });
        }
        //description
        if (req.body.description != null && req.body.description != "") {
            if (typeof req.body.description != "string")
                error.push({
                    "error": "El atributo description debe ser TEXTO"
                });
        }
        //actorType_id
        if (req.body.actorType_id == null || req.body.actorType_id == "") {
            error.push({
                "error": "Falta el actorType_id"
            });
        } else {
            if (typeof req.body.actorType_id != "string")
                error.push({
                    "error": "El atributo actorType_id debe ser TEXTO"
                });
        }
        return error;
    },

    checkBodyAddEmergency: function (req) {
        let error = [];
        //EmergencyType_Id
        if (req.body.emergencyType_id == null || req.body.emergencyType_id == "") {
            error.push({
                "error": "Falta el Tipo De Emergencia"
            });
        } else {
            if (typeof req.body.emergencyType_id != "string")
                error.push({
                    "error": "El atributo emergencyType_id debe ser TEXTO"
                });
        }
        
        //Address
        if (req.body.address == null || req.body.address == "") {
            error.push({
                "error": "Falta la Dirección"
            });
        } else {
            if (typeof req.body.address != "string")
                error.push({
                    "error": "El atributo address debe ser TEXTO"
                });
        }
        //Date
        if (req.body.address == null || req.body.address == "") {
            error.push({
                "error": "Falta la Fecha"
            });
        } else {
            if (typeof req.body.address != "string")
                error.push({
                    "error": "El atributo date debe ser TEXTO"
                });
        }
        //Details
        if (req.body.details != null && req.body.details != "") {
            if (typeof req.body.details != "string")
                error.push({
                    "error": "El atributo details debe ser TEXTO"
                });
        }
        //location
        if (req.body.location != null && req.body.location != {}) {
            if (typeof req.body.location != "object")
                error.push({
                    "error": "El atributo location debe ser UN OBJETO"
                });
        } else {
            if (req.body.lat == null || req.body.lat == "") {
                error.push({
                    "error": "Falta la latitud"
                });
            } else {
                if (typeof req.body.lat != "number")
                    error.push({
                        "error": "El atributo lat debe ser un NUMERO"
                    });
            }
            if (req.body.lng == null || req.body.lng == "") {
                error.push({
                    "error": "Falta la longitud"
                });
            } else {
                if (typeof req.body.lng != "number")
                    error.push({
                        "error": "El atributo date debe ser un NUMERO"
                    });
            }
        }
        //initialReport
        if (req.body.initialReport != null && req.body.initialReport != {}) {
            if (typeof req.body.initialReport != "object")
                error.push({
                    "error": "El atributo initialReport debe ser UN OBJETO"
                });
            if (req.body.initialReport.text != null && req.body.initialReport.text != "") {
                if (typeof req.body.initialReport.text != "string")
                    error.push({
                        "error": "El atributo text debe ser un STRING"
                    });
            }
            if (req.body.initialReport.photosURL != null && req.body.initialReport.photosURL != []) {
                if (!Array.isArray(req.body.initialReport.photosURL))
                    error.push({
                        "error": "El atributo photosURL debe ser un ARRAY"
                    });
            }
            
        }
        return error;
    },

    checkBodyAddEmergencyEvent: function (req) {
        let error = [];
        //eventType_id
        if (req.body.eventType_id == null || req.body.eventType_id == "") {
            error.push({
                "error": "Falta el eventType_id"
            });
        } else {
            if (typeof req.body.eventType_id != "string")
                error.push({
                    "error": "El atributo eventType_id debe ser TEXTO"
                });
        }

        //Description
        if (req.body.description != null && req.body.description != "") {
            if (typeof req.body.description != "string")
                error.push({
                    "error": "El atributo description debe ser TEXTO"
                });
        }
        //Details
        if (req.body.to_actorType_id != null && req.body.to_actorType_id != "") {
            if (typeof req.body.to_actorType_id != "string")
                error.push({
                    "error": "El atributo to_actorType_id debe ser TEXTO"
                });
        }
        return error;
    },

    //Login
    checkBodyLogin: function (req) {
        let error = [];
        //Email
        if (req.body.email == null || req.body.email == "") {
            error.push({
                "error": "Falta el email"
            });
        } else {
            if (!validator.isEmail(req.body.email + "") || typeof req.body.email != "string") {
                error.push({
                    "error": "El email no es válido"
                });
            }
        }
        //Password
        if (req.body.password == null || req.body.password == "") {
            error.push({
                "error": "Falta la password"
            });
        } else {
            if (req.body.password != null && req.body.password != "") {
                if (typeof req.body.password != "string")
                    error.push({
                        "error": "El atributo password debe ser TEXTO"
                    });
            }
        }
        return error;
    },
    //Confirm Login
    checkBodyConfirmLogin: function (req) {
        let error = [];
        //Code
        if (req.body.code == null || req.body.code == "") {
            error.push({
                "error": "Falta el code"
            });
        } else {
            if (req.body.code != null && req.body.code != "") {
                if (typeof req.body.code != "string")
                    error.push({
                        "error": "El atributo code debe ser TEXTO"
                    });
            }
        }
        //Remember
        if (req.body.remember == null) {
            error.push({
                "error": "Falta el remember"
            });
        } else {
            if (req.body.remember != null && req.body.remember != "") {
                if (typeof req.body.remember != "boolean")
                    error.push({
                        "error": "El atributo remember debe ser BOLEANO"
                    });
            }
        }
        return error;
    },
}