import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import HomepageHeader from './HomepageHeader/HomepageHeader';

import homepage_pic from '~/assets/img/homepage_pic.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '~/components/Modal';

import axios from 'axios';
import Loading from '~/components/Loading/Loading';

import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { initialSocket } from '~/redux/socketSlide';
import { initialUserInfo } from '~/redux/userSlide';

const cx = classNames.bind(styles);
function Homepage() {
    const navigate = useNavigate();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [questionId, setQuestionId] = useState();
    const dispatch = useDispatch();
    const [roomCode, setRoomCode] = useState('');

    const socket = io('https://quiz-lab-server.onrender.com', {
        transports: ['websocket'],
    });

    const navigateToGamePage = async () => {
        if (isSignedIn) {
            if (!roomCode) {
                alert('Room code cannot be empty!');
            }

            try {
                const accessToken = localStorage.getItem('accessToken');

                const res = await axios.post(
                    `https://quiz-lab-server.onrender.com/api/rooms/join-room`,
                    {
                        roomCode,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );

                if (res?.status === 201) {
                    socket.emit('userConnected', { userId, roomCode });
                    const roomCodeHolder = roomCode;
                    setShowModal(true);
                    dispatch(initialSocket(socket));
                    socket.on('startQuiz', ({ roomCode, totalQuestion }) => {
                        console.log('room code after', roomCode);
                        setShowModal(false);
                        navigate(`/user-play/${roomCodeHolder}`, { state: { totalQuestion: totalQuestion } });
                    });
                }
            } catch (error) {
                alert('Room code is not correct!');
            }
        } else {
            navigate('/sign-in');
        }
    };

    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsSignedIn(true);

            axios
                .get(`https://quiz-lab-server.onrender.com/api/users/my-info `, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    const resStatus = res?.status;
                    if (resStatus === 200) {
                        setUserId(res?.data?.id);
                        setFirstName(res?.data?.firstName);
                        setLastName(res?.data?.lastName);
                        setProfilePic(res?.data?.profilePicture);
                        dispatch(initialUserInfo(res?.data));
                        setIsLoading(false);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleChangeRoomCode = (e) => {
        const currentRoomCode = e.target.value;

        setRoomCode(currentRoomCode);
    };

    // useEffect(() => {
    //     socket.on('newUserConnected', (user) => {
    //         console.log(user);
    //         const newUser = {
    //             firstName: user?.user?.firstName,
    //             lastName: user?.user?.lastName,
    //         };
    //         setParticipants((prev) => [...prev, newUser]);
    //     });
    // }, []);

    const handlePressKey = async (e) => {
        if (e.key === 'Enter') {
            await navigateToGamePage();
        }
    };

    return (
        <>
            <div className={cx('wrapper')}>
                {isLoading && (
                    <div className={cx('loading-container')}>
                        <Loading />
                    </div>
                )}
                {!isLoading && (
                    <div>
                        <HomepageHeader
                            firstName={firstName}
                            lastName={lastName}
                            profilePic={profilePic}
                            isSignedIn={isSignedIn}
                        />
                        <div className={cx('content')}>
                            <div className={cx('img-and-slogan')}>
                                <img src={homepage_pic} alt="Homepage picture" className={cx('homepage_pic')} />
                                <div className={cx('homepage_slogan')}>
                                    {isSignedIn && firstName ? `Welcome back, ${firstName}!` : `Let's play`}
                                </div>
                                <div className={cx('homepage_text')}>
                                    Do you feel confident? Here, you'll challenge one of the most difficult questions
                                </div>
                            </div>
                            <div className={cx('joining-room')}>
                                {isSignedIn && (
                                    <div className={cx('custom-input__wrapper')}>
                                        <input
                                            type="text"
                                            placeholder="Enter room code"
                                            className={cx('custom-input')}
                                            value={roomCode}
                                            onChange={(e) => handleChangeRoomCode(e)}
                                            onKeyDown={handlePressKey}
                                        />
                                        <button title="Create new quiz" className={cx('create-quiz-button')}>
                                            <FontAwesomeIcon
                                                className={cx('plus-icon')}
                                                onClick={() => navigate('create-quiz')}
                                                icon={faPlus}
                                            />
                                        </button>
                                    </div>
                                )}

                                <div className={cx('custom-input__wrapper')}>
                                    <button onClick={navigateToGamePage} className={cx('custom-input__button')}>
                                        {isSignedIn ? 'Join to the game' : 'Get started for free'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showModal && (
                // Render your modal component here
                <Modal>
                    <h2>Coming soon....</h2>
                    <p>Pleased waiting for second</p>
                </Modal>
            )}
        </>
    );
}

export default Homepage;
