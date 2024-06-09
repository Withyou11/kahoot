import base from './base';
const accessToken = localStorage.getItem('accessToken');

const update_user_rank = (roomId) => {
    return new Promise((resolve, reject) => {
        base.patch(
            `rooms/update-user-rank/${roomId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
};
const answer_question = (input) => {
    const { roomCode, questionId, optionId, timer } = input;
    return new Promise((resolve, reject) => {
        base.post(
            'rooms/answer-question',
            { roomCode, questionId, optionId, timer },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
};

export const roomApi = {
    update_user_rank,
    answer_question,
};
