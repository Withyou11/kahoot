import base from './base';
const accessToken = localStorage.getItem('accessToken');

const getQuestion = (page, quizId) => {
    return new Promise((resolve, reject) => {
        base.get(`/quizzes/get-questions/${quizId}?page=${page}&take=1`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
};

export const questionApi = {
    getQuestion,
};
