import {
    handleResponse
} from './helpers';

var constants = require('../constants');

export const userService = {
    getWebUsers,
    getAppUsers,
    addWebUser,
    addAppUser,
    editWebUser,
    editAppUser,
    getWebUsersByAdmin
};

const apiUrl = constants.host+':'+constants.backend_port;

function getWebUsers() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        
    };

    return fetch(apiUrl + '/users/webusers', requestOptions)
        .then(handleResponse);
}

function getAppUsers(actorType) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        
    };

    return fetch(apiUrl + '/users/appusers/'+actorType, requestOptions)
        .then(handleResponse);
}

function addWebUser(webUser) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            webUser
        )
    };

    return fetch(apiUrl + '/users/webuser', requestOptions)
        .then(handleResponse);
}

function addAppUser(appUser) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            appUser
        )
    };

    return fetch(apiUrl + '/users/appuser', requestOptions)
        .then(handleResponse);
}

function editWebUser(webUser) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            webUser
        )
    };

    return fetch(apiUrl + '/users/webuser/'+webUser._id, requestOptions)
        .then(handleResponse);
}

function editAppUser(appUser) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            appUser
        )
    };

    return fetch(apiUrl + '/users/appuser/'+appUser._id, requestOptions)
        .then(handleResponse);
}

function getWebUsersByAdmin() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        
    };

    return fetch(apiUrl + '/admin/webusers', requestOptions)
        .then(handleResponse);
}


