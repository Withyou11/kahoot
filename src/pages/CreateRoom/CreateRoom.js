import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CreateRoom.module.scss';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HomepageHeader from '~/pages/Home/HomepageHeader/HomepageHeader';
import Loading from '~/components/Loading/Loading';
import Participant from '~/components/Participant/Participant';
import { io } from 'socket.io-client';
import { questionApi } from '~/api/questions';

const cx = classNames.bind(styles);

function CreateRoom() {
    let { id } = useParams();
    const socket = io('https://quiz-lab-server.onrender.com', {
        transports: ['websocket'],
    });

    const [roomCode, setRoomCode] = useState();
    const [roomId, setRoomId] = useState();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const navigator = useNavigate();

    const [loading, setLoading] = useState(false);
    const [participants, setParticipants] = useState([]);
    const data = {
        quizId: id,
    };

    const handlePlayNow = () => {
        questionApi
            .getQuestion(1, id)
            .then((res) => {
                let tempData = {
                    question: res.data.data.data[0],
                    totalCount: res.data.data.meta.totalCount,
                };
                // dispatch(initialQuestion(tempData));
                // setLoading(false);
                socket.emit('startQuiz', { roomCode: roomCode, totalQuestion: tempData.totalCount });
                navigator(`/questions/${roomCode}/${roomId}/${id}`);
            })
            .catch((error) => {
                console.log(error);
                // setLoading(false);
            });
        // Socket
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            axios
                .get(`https://quiz-lab-server.onrender.com/api/users/my-info`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    const resStatus = res?.status;
                    if (resStatus === 200) {
                        setFirstName(res?.data?.firstName);
                        setLastName(res?.data?.lastName);
                        setProfilePic(res?.data?.profilePicture);
                        axios
                            .post(`https://quiz-lab-server.onrender.com/api/rooms`, data, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            })
                            .then((response) => {
                                setRoomCode(response?.data.data.code);
                                setRoomId(response?.data.data.id);
                                console.log('create room ', response?.data.data);
                                socket.emit('userConnected', {
                                    userId: res?.data?.id,
                                    roomCode: response?.data.data.code,
                                });

                                setLoading(false);
                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, []);

    useEffect(() => {
        socket.on('newUserConnected', (user) => {
            console.log(user);
            const newUser = {
                firstName: user?.user?.firstName,
                lastName: user?.user?.lastName,
            };
            setParticipants((prev) => [...prev, newUser]);
        });
    }, []);

    return (
        <div className={cx('wrapper')}>
            {loading && (
                <div className={cx('loading-container')}>
                    <Loading />
                </div>
            )}

            {!loading && (
                <div className={cx('container')}>
                    <HomepageHeader
                        firstName={firstName}
                        lastName={lastName}
                        profilePic={profilePic}
                        isSignedIn={true}
                    />
                    <div className={cx('code-wrapper')}>
                        <div className={cx('code-content')}>
                            <p className={cx('code-title')}>{roomCode}</p>
                            <p className={cx('code-desc')}>Enter this code to join</p>
                        </div>
                    </div>
                    <div className={cx('participant-info')}>
                        <p className={cx('participant-title')}>Participants: {participants.length}</p>
                    </div>
                    <div className={cx('participant-wrapper')}>
                        {participants.map((participant, index) => (
                            <div key={index}>
                                <Participant participant={participant} />
                            </div>
                        ))}
                    </div>
                    <div className={cx('action')}>
                        <button className={cx('action__btn', 'action__btn-save')} onClick={handlePlayNow}>
                            Play now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateRoom;
