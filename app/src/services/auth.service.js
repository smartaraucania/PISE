import {
    handleResponse
} from './helpers';

import {AsyncStorage} from 'react-native';

var constants = require('../constants');

export const authService = {
    login,
    logout,
    confirmLogin,
    me
};

const apiUrl = 'http://'+constants.host+':'+constants.port;

function login(email, password, locationData) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            locationData
        })
    };

    return fetch(apiUrl + '/auth/appuser', requestOptions)
        .then(handleResponse)
        .then(async res => {
            // login successful if there's a jwt token in the response
            if (res.token) {
                // store token confirm login
                await AsyncStorage.setItem('unconfirmedToken', res.token);
            }

            return res;
        });
}

async function confirmLogin(code, remember, locationData) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('unconfirmedToken')
        },
        body: JSON.stringify({
            code,
            remember,
            locationData
        })
    };

    return fetch(apiUrl + '/auth/appuser/confirm', requestOptions)
        .then(handleResponse)
        .then(async res => {
            // login successful if there's a jwt token in the response
            if (res.token) {
                await AsyncStorage.removeItem('unconfirmedToken');
                // store token
                await AsyncStorage.setItem('token', res.token);
            }

            return res;
        });
}

async function logout() {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    };

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('loggedUser');

    return fetch(apiUrl + '/auth/appuser/logout', requestOptions).then(handleResponse);
}

async function me() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
        }
    };

    return fetch(apiUrl + '/auth/me', requestOptions)
        .then(handleResponse);
}
