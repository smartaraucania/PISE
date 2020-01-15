import {AsyncStorage} from 'react-native';

export function handleResponse(response) {
    return response.text().then(async res => {
        const data = res && JSON.parse(res);
        if (!response.ok) {
            if (await AsyncStorage.getItem('token') && response.status === 403) {
                //logout();
                await AsyncStorage.removeItem('token');
                location.reload(true);
                const error = data.errors;
                await AsyncStorage.setItem('errors', JSON.stringify(error));
                return Promise.reject(error);
            }

            const error = data.errors;
            return Promise.reject(error);

        }

        return data;
    });
}