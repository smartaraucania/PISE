import {
    handleResponse
} from './helpers';

var constants = require('../constants');

export const utilsService = {
    //Country-Region-Commune
    getCountries,
    getRegionsInCountry,
    getCommunesInRegion,
    //EmergencyType
    getEmergencyTypesByActorType,
    addEmergencyType,
    //EventType
    getEventTypesPublic,
    getEventTypeByActorsType,
    addPublicEventType,
    addEventTypeToActorType,
    //ActorType
    getActorsGroups,
    addActorsGroup,
    editActorsGroup,
    getActorTypesByActorsGroup,
    addActorTypeToActorsGroup,
    editActorType,
    getOfficesByActorType,
    getOfficesInRegionAndCommune,
    addOfficeToActorType
};

const apiUrl = constants.host + ':'+constants.backend_port;

function getCountries() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/countries', requestOptions)
        .then(handleResponse);
}

function getRegionsInCountry(country_id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/country/' + country_id + '/regions', requestOptions)
        .then(handleResponse);
}

function getCommunesInRegion(region_id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/region/' + region_id + '/communes', requestOptions)
        .then(handleResponse);
}

function getEmergencyTypesByActorType(actorType) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/emergencytypes/' + actorType, requestOptions)
        .then(handleResponse);
}

function getEventTypeByActorsType(actorType_id, getPublic) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/actortype/'+actorType_id+'/eventstype?public='+getPublic, requestOptions)
        .then(handleResponse);
}

function getEventTypesPublic() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/admin/eventtype/public', requestOptions)
        .then(handleResponse);
}

function addPublicEventType(eventType) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            eventType
        )
    };
    return fetch(apiUrl + '/admin/eventtype', requestOptions)
        .then(handleResponse);
}

function addEventTypeToActorType(eventType) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            eventType
        )
    };
    return fetch(apiUrl + '/utils/eventtype', requestOptions)
        .then(handleResponse);
}

function addEmergencyType(emergencyType) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            emergencyType
        )
    };
    return fetch(apiUrl + '/utils/emergencytype', requestOptions)
        .then(handleResponse);
}

function getActorsGroups() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/actorsgroups', requestOptions)
        .then(handleResponse);
}

function addActorsGroup(actorsGroup) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            actorsGroup
        )
    };
    return fetch(apiUrl + '/admin/actorsgroup', requestOptions)
        .then(handleResponse);
}

function editActorsGroup(actorsGroup) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(
            actorsGroup
        )
    };
    return fetch(apiUrl + '/admin/actorsgroup/' + actorsGroup._id, requestOptions)
        .then(handleResponse);
}

function getActorTypesByActorsGroup(actorsGroup_id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/actorsgroups/' + actorsGroup_id + '/actorTypes', requestOptions)
        .then(handleResponse);
}

function addActorTypeToActorsGroup(actorsGroup_id, actorType) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: actorType

    };
    return fetch(apiUrl + '/admin/actorsgroups/' + actorsGroup_id + '/actorType', requestOptions)
        .then(handleResponse);
}

function editActorType(id, actorType) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: actorType

    };
    return fetch(apiUrl + '/admin/actortype/' + id, requestOptions)
        .then(handleResponse);
}

function getOfficesByActorType(actorsType_id, region, commune) {
    const region_id = region ? region : '';
    const commune_id = commune ? commune : '';

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/actortype/' + actorsType_id + '/offices?region=' + region_id + '&commune=' + commune_id, requestOptions)
        .then(handleResponse);
}

function getOfficesInRegionAndCommune(region, commune) {
    const region_id = region ? region : '';
    const commune_id = commune ? commune : '';

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return fetch(apiUrl + '/utils/offices?region=' + region_id + '&commune=' + commune_id, requestOptions)
        .then(handleResponse);
}

function addOfficeToActorType(office) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(office)

    };
    return fetch(apiUrl + '/utils/actortype/' + office.actorType_id + '/office', requestOptions)
        .then(handleResponse);
}