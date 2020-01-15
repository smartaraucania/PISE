export function handleResponse(response) {
    return response.text().then(res => {
        const data = res && JSON.parse(res);
        if (!response.ok) {
            if (localStorage.getItem('token') && response.status === 403) {
                //logout();
                localStorage.removeItem('token');
                location.reload(true);
                const error = data.errors;
                localStorage.setItem('errors', JSON.stringify(error));
                return Promise.reject(error);
            }

            const error = data.errors;
            return Promise.reject(error);

        }

        return data;
    });
}