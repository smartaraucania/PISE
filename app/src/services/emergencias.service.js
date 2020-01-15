import {
    handleResponse
} from './helpers';

import {AsyncStorage} from 'react-native';

var constants = require('../constants');

export const emergencyService = {
    getAllByUserLogged,
    getById,
    addEventToEmergency,
    notifyRoadToEmergency,
    getCantActiveEmergencies,
    notifyArrived,
    editInitialReport
};

const apiUrl = 'http://'+constants.host+':'+constants.port;

async function getAllByUserLogged(nPage, finalized) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies?nPage='+nPage+'&finalized='+finalized, requestOptions)
        .then(handleResponse);
}

async function addEventToEmergency(emergencyId, event) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        },
        body: JSON.stringify(event)
    };

    return fetch(apiUrl + '/emergency/'+emergencyId+'/event', requestOptions)
        .then(handleResponse);
}

async function getById(id, eventsPage) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergency/'+id+'?eventspage='+eventsPage, requestOptions)
        .then(handleResponse);
}

async function notifyRoadToEmergency(emergency_id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies/'+emergency_id+'/roadto', requestOptions)
        .then(handleResponse);
}

async function askForHelpToOtherService(emergency_id, askforhelp) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        },
        body: JSON.stringify(askforhelp)
    };

    return fetch(apiUrl + '/emergencies/'+emergency_id+'/askforhelp', requestOptions)
        .then(handleResponse);
}

async function getCantActiveEmergencies() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/emergencies/actives', requestOptions)
        .then(handleResponse);
}

async function notifyArrived(emergency_id, location) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        },
        body: JSON.stringify(location)
    };

    return fetch(apiUrl + '/emergencies/'+emergency_id+'/arrived', requestOptions)
        .then(handleResponse);
}

async function editInitialReport(emergencyId, report) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        },
        body: report
    };

    return fetch(apiUrl + '/emergency/'+emergencyId+'/initialreport', requestOptions)
        .then(handleResponse);
}


