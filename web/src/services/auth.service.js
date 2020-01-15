import {
    handleResponse
} from './helpers';

var constants = require('../constants');

export const authService = {
    login,
    logout,
    confirmLogin
};

const apiUrl = constants.host+':'+constants.backend_port;

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

    return fetch(apiUrl + '/auth/webuser', requestOptions)
        .then(handleResponse)
        .then(async res => {
            // login successful if there's a jwt token in the response
            if (res.token) {
                // store token confirm login
                localStorage.setItem('unconfirmedToken', res.token);
            }

            return res;
        });
}

function confirmLogin(code, remember, locationData) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('unconfirmedToken')
        },
        body: JSON.stringify({
            code,
            remember,
            locationData
        })
    };

    return fetch(apiUrl + '/auth/webuser/confirm', requestOptions)
        .then(handleResponse)
        .then(async res => {
            // login successful if there's a jwt token in the response
            if (res.token) {
                localStorage.removeItem('unconfirmedToken');
                // store token
                localStorage.setItem('token', res.token);
            }

            return res;
        });
}

function logout() {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    };

    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');

    return fetch(apiUrl + '/auth/webuser', requestOptions).then(handleResponse);
}


