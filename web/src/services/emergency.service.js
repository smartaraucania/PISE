import {
    handleResponse
} from './helpers';

var constants = require('../constants');

export const emergencyService = {
    getAllByUserLogged,
    getAllByActorType,
    addEmergency,
    getById,
    addEventToEmergency,
    askForHelpToOtherService,
    notifyRoadToEmergency,
    setEmergencyFinalized,
    getCantActiveEmergencies,
    getCantEmergenciesInCurrentMonth
};

const apiUrl = constants.host+':'+constants.backend_port;

function getAllByUserLogged(nPage, finalized) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies?nPage='+nPage+'&finalized='+finalized, requestOptions)
        .then(handleResponse);
}

function getAllByActorType(nPage, actorType) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies/byactor?nPage='+nPage+'&actortype='+actorType, requestOptions)
        .then(handleResponse);
}

function addEmergency(emergency) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(emergency)
    };

    return fetch(apiUrl + '/emergency', requestOptions)
        .then(handleResponse);
}

function addEventToEmergency(emergencyId, event) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(event)
    };

    return fetch(apiUrl + '/emergency/'+emergencyId+'/event', requestOptions)
        .then(handleResponse);
}

function getById(id, eventsPage) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergency/'+id+'?eventspage='+eventsPage, requestOptions)
        .then(handleResponse);
}

function notifyRoadToEmergency(emergency_id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies/'+emergency_id+'/roadto', requestOptions)
        .then(handleResponse);
}

function setEmergencyFinalized(emergency_id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies/'+emergency_id+'/finalized', requestOptions)
        .then(handleResponse);
}

function askForHelpToOtherService(emergency_id, askforhelp) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(askforhelp)
    };

    return fetch(apiUrl + '/emergencies/'+emergency_id+'/askforhelp', requestOptions)
        .then(handleResponse);
}

function getCantActiveEmergencies() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies/actives', requestOptions)
        .then(handleResponse);
}

function getCantEmergenciesInCurrentMonth() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies/month', requestOptions)
        .then(handleResponse);
}


