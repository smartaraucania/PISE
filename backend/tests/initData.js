/**
 * FOR TESTING O DATA INICIAL
 */
var mongoose = require('mongoose');

var Country = mongoose.model('Country');
var Region = mongoose.model('Region');
var Commune = mongoose.model('Commune');
var ActorsGroupType = mongoose.model('ActorsGroupType');
var ActorType = mongoose.model('ActorType');

var EventType = mongoose.model('EventType');

var constants = require('../util/constants');

exports.createInitData = function () {
    //Country Chile -> Araucania -> (Temuco, Padre las casas, Lautaro)
    Country.create({
        name: "Chile"
    }, function (error, success) {
        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
        if (success) {
            Region.create({
                "name": "La Araucania",
                "country_id": success._id,
                "extra": "IX"
            }, function (error, successR) {
                if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                if (successR) {
                    Commune.create({
                        "name": "Temuco",
                        "region_id": successR._id
                    }, function (error, successC) {
                        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                    });
                    Commune.create({
                        "name": "Padre las casas",
                        "region_id": successR._id
                    }, function (error, successC) {
                        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                    });
                    Commune.create({
                        "name": "Lautaro",
                        "region_id": successR._id
                    }, function (error, successC) {
                        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                    })
                }
            })
        }
    });

    ActorsGroupType.create({
        groupName: "Servicios de Emergencia"
    }, function (error, success) {
        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
        if (success) {
            ActorType.create({
                name: "Ambulancia"
            }, function (error, successA) {
                if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                if (successA) {
                    success.actorTypes.push(successA._id);
                    success.save().then(res => {
                        ActorType.create({
                            name: "Bomberos"
                        }, function (error, successB) {
                            if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                            if (successB) {
                                success.actorTypes.push(successB._id);
                                success.save().then(res => {
                                    ActorType.create({
                                        name: "Carabineros"
                                    }, function (error, successC) {
                                        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                                        if (successC) {
                                            success.actorTypes.push(successC._id);
                                            success.save().catch(err => console.log("Error: " + err));
                                        }
                                    });
                                }).catch(err => console.log("Error: " + err));
                            }
                        });
                    }).catch(err => console.log("Error: " + err));
                }
            });
        }
    });

    ActorsGroupType.create({
        groupName: "Servicios Básicos",
        description: "Grupo de servicios básicos ciudadanos"
    }, function (error, success) {
        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
        if (success) {
            ActorType.create({
                name: "Electricidad"
            }, function (error, successA) {
                if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                if (successA) {
                    success.actorTypes.push(successA._id);
                    success.save().then(res => {
                        ActorType.create({
                            name: "Agua"
                        }, function (error, successB) {
                            if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                            if (successB) {
                                success.actorTypes.push(successB._id);
                                success.save().then(res => {
                                    ActorType.create({
                                        name: "GAS"
                                    }, function (error, successC) {
                                        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                                        if (successC) {
                                            success.actorTypes.push(successC._id);
                                            success.save().catch(err => console.log("Error: " + err));
                                        }
                                    });
                                }).catch(err => console.log("Error: " + err));
                            }
                        })
                    }).catch(err => console.log("Error: " + err));
                }
            })
        }
    });

    ActorsGroupType.create({
        groupName: "Gubernamentales",
        description: "Entidades gubernamentales"
    }, function (error, success) {
        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
        if (success) {
            ActorType.create({
                name: "Municipalidad"
            }, function (error, successA) {
                if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                if (successA) {
                    success.actorTypes.push(successA._id);
                    success.save().then(res => {
                        ActorType.create({
                            name: "ONEMI"
                        }, function (error, successB) {
                            if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                            if (successB) {
                                success.actorTypes.push(successB._id);
                                success.save().then(res => {
                                    ActorType.create({
                                        name: "Gobierno Regional"
                                    }, function (error, successC) {
                                        if (error && error.code != 11000 && constants.env == "development") return console.log(error);
                                        if (successC) {
                                            success.actorTypes.push(successC._id);
                                            success.save().catch(err => console.log("Error: " + err));
                                        }
                                    });
                                }).catch(err => console.log("Error: " + err));
                            }
                        });
                    }).catch(err => console.log("Error: " + err));
                }
            });
        }
    });

    //Crear eventos públicos necesarios
    EventType.create({
        isPublic: true,
        name: 'en camino al lugar',
        description: 'Usar para avisar que va en camino',
        selectable: false
    }, function (error){
        if (error && error.code != 11000 && constants.env == "development") console.log(error);
    });
    EventType.create({
        isPublic: true,
        name: 'reporte inicial actualizado',
        description: '',
        selectable: false
    }, function (error){
        if (error && error.code != 11000 && constants.env == "development") console.log(error);
    });
    EventType.create({
        isPublic: true,
        name: 'pedir ayuda a otro servicio',
        description: 'Evento se utiliza al pedir ayuda a otro servicio de emergencia (diferente al del actor que pide ayuda)',
        selectable: false
    }, function (error){
        if (error && error.code != 11000 && constants.env == "development") console.log(error);
    });
    EventType.create({
        isPublic: true,
        name: 'pedir refuerzos',
        description: 'Evento se utiliza al pedir refuerzos del mismo servicio de emergencia',
        selectable: true
    }, function (error){
        if (error && error.code != 11000 && constants.env == "development") console.log(error);
    });
    EventType.create({
        isPublic: true,
        name: 'notificar a la población',
        description: 'Evento se utiliza al notificar a la población de esta emergencia',
        selectable: true
    }, function (error){
        if (error && error.code != 11000 && constants.env == "development") console.log(error);
    });
    EventType.create({
        isPublic: true,
        name: 'se llego al lugar',
        description: 'Evento se utiliza al llegar al lugar de la emergencia',
        selectable: false
    }, function (error){
        if (error && error.code != 11000 && constants.env == "development") console.log(error);
    });
}