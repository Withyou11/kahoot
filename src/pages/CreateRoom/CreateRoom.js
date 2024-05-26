import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CreateRoom.module.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HomepageHeader from '~/pages/Home/HomepageHeader/HomepageHeader';
import Loading from '~/components/Loading/Loading';
import Participant from '~/components/Participant/Participant';
import { io } from 'socket.io-client';

const cx = classNames.bind(styles);

function CreateRoom() {
    let { id } = useParams();
    const socket = io('https://quiz-lab-server.onrender.com');

    const [roomCode, setRoomCode] = useState('aCsjwOac');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [participants, setParticipants] = useState([]);
    const data = {
        quizId: id,
    };

    const handlePlayNow = () => {
        // Socket
        socket.emit('startQuiz', ({ roomCode }) => {
            // Navigate here
        });
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
                        console.log(res.data);
                        setFirstName(res?.data?.firstName);
                        setLastName(res?.data?.lastName);
                        setProfilePic(res?.data?.profilePicture);
                        setLoading1(false);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });

            axios
                .post(`https://quiz-lab-server.onrender.com/api/rooms`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    console.log(res.data.data);
                    setRoomCode(res.data.data.code);
                    setLoading2(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (roomCode) {
            socket.on('newUserConnected', (user) => {
                console.log(user);
                const newUser = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
                setParticipants((prev) => [...prev, newUser]);
            });
        }
    }, []);

    return (
        <div className={cx('wrapper')}>
            {loading1 ||
                (loading2 && (
                    <div className={cx('loading-container')}>
                        <Loading />
                    </div>
                ))}

            {!loading1 && !loading2 && (
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
