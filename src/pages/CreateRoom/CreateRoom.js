import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CreateRoom.module.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const cx = classNames.bind(styles);

function CreateRoom() {
    let { id } = useParams();

    const [roomCode, setRoomCode] = useState('');
    const data = {
        quizId: id,
    };
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            axios
                .post(`https://quiz-lab-server.onrender.com/api/rooms`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    console.log(res.data.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, []);

    return <div className={cx('wrapper')}></div>;
}

export default CreateRoom;
