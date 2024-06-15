import base from './base';
const accessToken = localStorage.getItem('accessToken');

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        base.get(`/users/users/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
};
const getMyInfo = () => {
    return new Promise((resolve, reject) => {
        base.get(`/user/my-info`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
};
export const userApi = {
    getUserById,
    getMyInfo,
};
